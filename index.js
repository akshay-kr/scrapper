'use strict';

/* global require*/
/* global process, Buffer, console*/
/* jshint node: true, quotmark: false */
var express = require('express');
var config = require('./config.json');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var cache = require('memory-cache');

function scrape() {
    var url = 'https://medium.com';
    request(url, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var count = 0;
            $('a').each(function () {
                count++;
                console.log($(this).attr('href'));
            });
            console.log(count);
        }
    });
}
scrape();