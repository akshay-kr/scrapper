/*jshint node:true, sub:true*/
'use strict';
var config = require('../config.json');

function isUrlToVisitEmpty(urlsToVisit) {
    if (urlsToVisit.length > 0) {
        return true;
    } else {
        return false;
    }
}

function checkUrlVisited(url, urlsVisited) {
    if (urlsVisited.indexOf(url) > -1) {
        return true;
    } else {
        return false;
    }
}

function checkUrlToVisit(url, urlsToVisit) {
    if (urlsToVisit.indexOf(url) > -1) {
        return true;
    } else {
        return false;
    }
}

function verifyDomain(url) {
    var domain = url.replace('http://', '').replace('https://', '').split(/[/?#]/)[0];
    if (domain === config.domainName) {
        return true;
    } else {
        return false;
    }
}
exports = module.exports = {
    isUrlToVisitEmpty: isUrlToVisitEmpty,
    checkUrlVisited: checkUrlVisited,
    checkUrlToVisit: checkUrlToVisit,
    verifyDomain: verifyDomain
};