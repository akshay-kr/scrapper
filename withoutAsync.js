'use strict';

/* global require*/
/* global process, console*/
/* jshint node: true, quotmark: false */
var config = require('./config.json');
var request = require('request');
var cheerio = require('cheerio');
var keypress = require('keypress');
keypress(process.stdin);
var fs = require('fs');
var urlHelper = require('./helpers/urlHelper');
var urlsToVisit = [config.baseUrl];
var urlsVisited = [];
var stopFetch = false;
var throttleLimit = 5;
var running = 0;

function scrape(url, callback) {
    if (url && !urlHelper.checkUrlVisited(url, urlsVisited)) {
        request(url, function (error, response, html) {
            if (!error) {
                var $ = cheerio.load(html);
                $('a').each(function () {
                    var newUrl = $(this).attr('href');
                    if (!urlHelper.checkUrlVisited(newUrl, urlsVisited) && !urlHelper.checkUrlToVisit(newUrl, urlsToVisit)) {
                        if (urlHelper.verifyDomain(newUrl)) {
                            urlsToVisit.push(newUrl);
                        } else {
                            urlsVisited.push(newUrl);
                        }
                    }
                });
                urlsVisited.push(url);
                console.log("To Visit: " + urlsToVisit.length + " ------- " + "Visited: " + urlsVisited.length + ". Press enter to stop.");
                callback();
            } else {
                if (error.code === 'ETIMEDOUT') {
                    console.log("Connection timedout for: " + url);
                    callback();
                } else if (error.message.match(/Invalid URI/g)) {
                    console.log("Invalid url: " + url);
                    callback();
                } else {
                    callback(error);
                }
            }
        });
    } else {
        callback();
    }
}

function start(error) {
    if (!error) {
        while (running < throttleLimit && urlsToVisit.length > 0) {
            var url = urlsToVisit.shift();
            scrape(url, next);
            console.log("To Visit: " + urlsToVisit.length + " ------- " + "Visited: " + urlsVisited.length + ". Press enter to stop.");
            running++;
        }
    } else if (error.message === 'PROCESS_STOPPED') {
        createCSV();
    } else {
        console.log(error);
        process.exit(1);
    }
}

var next = function (error) {
    running--;
    if (stopFetch) {
        error = new Error('PROCESS_STOPPED');
    }
    if (!error) {
        if (urlsToVisit.length > 0) {
            start();
        } else {
            createCSV();
        }
    } else {
        start(error);
    }
};

start();


function createCSV() {
    console.log("Creating CSV......");
    var links = urlsVisited.join(',');
    fs.writeFile(config.csvFilePath, links, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("CSV created successfully.");
            process.exit(1);
        }
    });
}

process.stdin.on('keypress', function (ch, key) {
    if (key) {
        if (key.name === 'return') {
            stopFetch = true;
        } else if (key.ctrl && key.name === 'c') {
            process.exit(1);
        }
    }
});
process.stdin.setRawMode(true);