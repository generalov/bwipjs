'use strict';
var bwipjs = require('./node-bwipjs2');
var isbn = require('./isbn');
var url = require('url');


var ZEROGIF_BASE64 = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

module.exports.isbnPNG = function isbnPNG(req, res) {
    var queryObject = url.parse(req.url, true).query;
    var isbnStr = queryObject.isbn;
    try {
        isbnStr = isbn.hyphenate(isbnStr);  
        var args = {
            bcid: 'isbn',
            text: isbnStr,
            includetext: true,
            guardwhitespace: true
        }, png;
        png = bwipjs(args);
        res.writeHead(200, { 'Content-Type':'image/png' });
        res.end(png, 'binary');
    } catch (e) {
        res.writeHead(400, { 'Content-Type':'image/gif' });
        res.end(new Buffer(ZEROGIF_BASE64, 'base64').toString('binary'));
    }
};

