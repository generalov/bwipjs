/* jshint node:true */
'use strict';

var expect = require('chai').expect;
var isbn = require('../index.js');

describe.only('ISBN lib', function() {

    describe('Interface', function() {

        it('Expect to have method "parse"', function () {
            expect(isbn).to.respondTo('parse');
        });

        it('Expect to have method "hyphenate"', function () {
            expect(isbn).to.respondTo('hyphenate');
        });

        it('Expect to have method "calculateCheckDigit"', function () {
            expect(isbn).to.respondTo('calculateCheckDigit');
        });

        it('Expect to have method "check"', function () {
            expect(isbn).to.respondTo('check');
        });

        it('Expect to have method "validate"', function () {
            expect(isbn).to.respondTo('validate');
        });

        it('Expect parse to conform JSON interface', function () {
            var parsed = isbn.parse('978-5-17-050198-4');
            expect(parsed).to.be.an('object');
            expect(parsed).to.have.property('agency');
            expect(parsed).to.have.property('ean');
            expect(parsed).to.have.property('group');
            expect(parsed).to.have.property('publisher');
            expect(parsed).to.have.property('title');
            expect(parsed).to.have.property('checkDigit');
        });

    });
    describe('Validating ISBN', function () {
        it('Invalid ISBN', function () {
            var num = '111';
            expect(isbn.validate(num)).to.be.equal(false);
        });
        it('Valid ISBN', function () {
            var num = '978-5-17-050198-4';
            expect(isbn.validate(num)).to.be.equal(true);
        });
    });

    describe('Parsing ISBN', function() {
        it('978-5-17-050198-4', function() {
            var parsed = isbn.parse('978-5-17-050198-4');
            expect(parsed.agency).to.be.equal('Russian Federation and former USSR');
            expect(parsed.ean).to.be.equal('978');
            expect(parsed.group).to.be.equal('5');
            expect(parsed.publisher).to.be.equal('17');
            expect(parsed.title).to.be.equal('050198');
            expect(parsed.checkDigit).to.be.equal('4');
        });
        it('9788535902775', function() {
            var parsed = isbn.parse('9788535902775');
            expect(parsed.agency).to.be.equal('Brazil');
            expect(parsed.ean).to.be.equal('978');
            expect(parsed.group).to.be.equal('85');
            expect(parsed.publisher).to.be.equal('3590');
            expect(parsed.title).to.be.equal('277');
            expect(parsed.checkDigit).to.be.equal('5');
        });
        it('978-0-671-62964-6', function () {
            var parsed = isbn.parse('978-0-671-62964-6');
            expect(parsed.agency).to.be.equal('English language');
            expect(parsed.ean).to.be.equal('978');
            expect(parsed.group).to.be.equal('0');
            expect(parsed.publisher).to.be.equal('671');
            expect(parsed.title).to.be.equal('62964');
            expect(parsed.checkDigit).to.be.equal('6');
        });
        it('978-89-91126-04-9', function () {
            var parsed = isbn.parse('978-89-91126-04-9');
            expect(parsed.agency).to.be.equal('Korea, Republic');
            expect(parsed.ean).to.be.equal('978');
            expect(parsed.group).to.be.equal('89');
            expect(parsed.publisher).to.be.equal('91126');
            expect(parsed.title).to.be.equal('04');
            expect(parsed.checkDigit).to.be.equal('9');
        });
        it('9700000000000 (Invalid)', function () {
            var fn = function () {
                isbn.parse('9700000000000');
            };
            expect(fn).to.throw('Can\'t find agency');
        });
        it('978-X-XXXXXXXXXXX (Invalid)', function () {
            var fn = function () {
                isbn.parse('978-X-XXXXXXXXXXX');
            };
            expect(fn).to.throw('ISBN length must be 13 chars');
        });
    });

    describe('Hyphenating ISBN', function() {
        it('978-0-06-088244-0', function () {
            var src = '978-0-06-088244-0',
                hyp = isbn.hyphenate(src);

            expect(hyp).to.be.equal('978-0-06-088244-0');
        });
    });

    describe('Calculating check digit ISBN', function() {
        it('978-0-306-40615-?', function () {
            var src = '978-0-306-40615-?',
                expected = '7',
                checkDigit = isbn.calculateCheckDigit(src);
            expect(checkDigit).to.be.equal(expected);
        });
        it('9780671746063', function () {
            var src = '978067174606?',
                checkDigit = isbn.calculateCheckDigit(src);
            expect(checkDigit).to.be.equal('3');
        });
        it('8535902775', function () {
            var src = '853590277?',
                checkDigit = isbn.calculateCheckDigit(src);
            expect(checkDigit).to.be.equal('5');
        });

    });

    describe('Checking isbn', function() {
        it('Valid 978-0-306-40615-7', function () {
            var src = '978-0-306-40615-7';
            expect(isbn.check(src)).to.be.equal(true);
        });
        it('Invalid 9780671746064', function () {
            var src = '9780671746064';
            expect(isbn.check(src)).to.be.equal(false);
        });
    });

});

