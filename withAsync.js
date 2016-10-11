'use strict';

/* global require*/
/* global process, console*/
/* jshint node: true, quotmark: false */
var config = require('./config.json');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var keypress = require('keypress');
keypress(process.stdin);
var fs = require('fs');
var urlHelper = require('./helpers/urlHelper');
var urlsToVisit = [config.baseUrl];
var urlsVisited = [];
var stopFetch = false;

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
                callback();
            } else {
                if (error.message.code === 'ETIMEDOUT') {
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
async.whilst(
    function () {
        return urlHelper.isUrlToVisitEmpty(urlsToVisit);
    },
    function (callback) {
        var length = urlsToVisit.length;
        async.eachLimit(urlsToVisit, 5, function (url, callback) {
            if (!stopFetch) {
                scrape(url, callback);
                console.log("To Visit: " + urlsToVisit.length + " ------- " + "Visited: " + urlsVisited.length + ". Press enter to stop.");
            } else {
                callback(new Error('PROCESS_STOPPED'));
            }
        }, function (err) {
            if (err) {
                callback(err);
            } else {
                urlsToVisit.splice(0, length);
                callback();
            }
        });
    },
    function (err) {
        if (err) {
            if (err.message === 'PROCESS_STOPPED') {
                createCSV();
            } else {
                console.log(err);
                process.exit(1);
            }
        } else {
            createCSV();
        }

    }
);

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