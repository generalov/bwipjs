/* jshint node:true */
'use strict';

var http = require('http');
var Promise = require('bluebird');
var xmldoc = require('xmldoc');
var fs = require('fs');
var path = require('path');

var ISBNGroupsURL = "http://www.isbn-international.org/agency?rmxml=1";
var ISBNGroups = {};

http.get(ISBNGroupsURL, function(response) {
    var xmlString = '';
    if (response.statusCode !== 200) {
        throw new Error('Got non 200 response code');
    }
    response.on('err', function(err) {
        throw(err);
    });
    response.on('data', function(data) {
        xmlString += data;
    });
    response.on('end', function() {
        parseISBNGroups(xmlString);
    });

});

function parseISBNGroups(xmlString) {
    var xml = new xmldoc.XmlDocument(xmlString);
    convert(xml.childNamed('RegistrationGroups'));
}
function convert(groups) {
    groups.eachChild(function (group) {
        var prefix = group.childNamed('Prefix').val.replace('-',''),
            agency = group.childNamed('Agency').val,
            rules =  group.childNamed('Rules').children.map(function (rule) {
                var range = rule.childNamed('Range').val.split('-'),
                    start = range[0],
                    end = range[1],
                    length = rule.childNamed('Length').val;

                return {
                    start: start,
                    end: end,
                    length: length
                };
            });

        ISBNGroups[prefix] = {
            agency: agency,
            rules: rules
        }; 
    });
    fs.writeFileSync(path.resolve('../isbn-groups.json'), JSON.stringify(ISBNGroups, null, 2));
}
