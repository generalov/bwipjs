/* jshint node:true */
'use strict';

var _ = require('lodash');
var ISBNGroups = require('./isbn-groups.json');

var hyphenate = function hyphenate(ISBNString) {
    var parsed = parse(ISBNString),
        hyphenatedISBN = [
        parsed.ean,
        parsed.group,
        parsed.publisher,
        parsed.title,
        parsed.checkDigit
    ].join('-');

    return hyphenatedISBN;
};

var parse = function parse(ISBNString) {
    var isbn = ISBNString.replace(/[^\d]/g,''),
        eanPlusAgency,
        ean,
        agency,
        group,
        publisherPlusTitle,
        publisher,
        title,
        checkDigit;

    if (isbn.length !== 13) {
        throw new Error('ISBN length must be 13 chars');
    }

    eanPlusAgency = getEANPlusAgency(isbn);

    if (eanPlusAgency === null) {
        throw new Error('Can\'t find agency');
    }

    ean = eanPlusAgency.ean;
    group = eanPlusAgency.group;

    agency = ISBNGroups[ean+group].agency;

    publisherPlusTitle = getPublisherAndTitle(ean, group, isbn);

    if (eanPlusAgency === null) {
        throw new Error('Can\'t find allowed range');
    }

    publisher = publisherPlusTitle.publisher;
    title = publisherPlusTitle.title;

    checkDigit = isbn[12];

    var returnObject = {
        agency: agency,
        ean: ean,
        group: group,
        publisher: publisher,
        title: title,
        checkDigit: checkDigit
    };

    return returnObject;
};

var getEANPlusAgency = function getEANPlusAgency(isbn) {
    var group;
    for (group in ISBNGroups) {
      if (isbn.match('^' + group + '(.+)')) {
        return {
            ean: group.substring(0,3),
            group: group.substring(3)
        };
      }
    }
    return null;
};

var getPublisherAndTitle = function getPublisherAndTitle(ean, group, isbn) {
    var restOfISBN = isbn.substring(ean.length+group.length, 12),
        key = restOfISBN.substring(0,restOfISBN.length-2),
        rules = ISBNGroups[ean+group].rules,
        rule,
        publisher,
        title,
        i, m;

    for (i = 0, m = rules.length; i<m; i+=1) {
        rule = rules[i];
        if (rule.start >= key && key <= rule.end) {
            publisher = restOfISBN.substring(0, rule.length-1);
            title = restOfISBN.substring(publisher.length);
            return {
                publisher: publisher,
                title: title
            };
        }
    }
    return null;
};

var calculateCheckDigit = function calculateCheckDigit(ISBNString) {
    var isbn = ISBNString.replace(/.$/,'0').replace(/[^\d]/g, ''),
        sum = 0,
        checkDigit,
        i;
    if (isbn.match(/^\d{9}[\dX]?$/)) {
      sum = 0;
      for (i = 0; i < 9; i += 1) {
        sum += (10 - i) * isbn.charAt(i);
      }
      sum = (11 - sum % 11) % 11;
      return sum === 10 ? 'X' : String(sum);

    } else if (isbn.match(/(?:978|979)\d{9}[\dX]?/)) {
      sum = 0;
      for (i = 0; i < 12; i += 2) {
        sum += Number(isbn.charAt(i)) + 3 * isbn.charAt(i + 1);
      }
      return String((10 - sum % 10) % 10);
    }
    return null;
};

var check = function check(ISBNString) {
    var hyphenated = hyphenate(ISBNString);
    return calculateCheckDigit(hyphenated) === hyphenated.charAt(hyphenated.length - 1);
};

var validate = function(ISBNString) {
    var isValid = false;
    try {
        check(ISBNString);
        isValid = true;
    } catch  (err) {
        console.log(err);
       isValid = false;
    }
    return isValid;
}

module.exports.validate = validate;
module.exports.parse = parse;
module.exports.check = check;
module.exports.hyphenate = hyphenate;
module.exports.calculateCheckDigit = calculateCheckDigit;
