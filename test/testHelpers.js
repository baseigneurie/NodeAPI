const chai = require('chai');
const expect = require('chai').expect;
const hlp = require('../helpers/helpers');
const nlck = require('../helpers/nullcheck');

describe('Helper Functions', () => {
    describe('Helper File', () => {

        // Get string date
        it('formatBday pass', () => {
            let str = '1983-08-19';
            let res = hlp.formatBday(str);

            expect(res).to.be.a('string').and.to.equal('08191983');
        });

        it('formatBday fail', () => {
            let str = '';
            let res = hlp.formatBday(str);

            expect(res).to.be.a('string').and.to.equal('NaN');
        });

        // Get formatted date
        it('formatMatchDate pass', () => {
            let str = '1983-08-19';
            let res = hlp.formatMatchDate(str);

            expect(res).to.be.a('string').and.to.equal('08/19/1983');
        });

        it('formatMatchDate fail', () => {
            let str = '';
            let res = hlp.formatMatchDate(str);

            expect(res).to.be.a('string').and.to.equal('undefined/undefined/');
        });

        // Get current date formatted
        it('getCurrentDate pass', () => {
            let d = new Date(Date.now());
            let test = d.getMonth() + '/' + d.getDay() + '/' + d.getFullYear();
            let res = hlp.getCurrentDate();

            expect(res).to.be.a('string').and.to.equal(test);
        });

        // Get current time formatted
        it('getCurrentTime pass', () => {
            let d = new Date(Date.now());
            let test = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
            let res = hlp.getCurrentTime();

            expect(res).to.be.a('string').and.to.equal(test);
        });

        // Get full timestamp
        it('getTimestamp pass', () => {
            let d = new Date(Date.now());
            let testDate = d.getMonth() + '/' + d.getDay() + '/' + d.getFullYear();
            let testTime = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
            let res = hlp.getTimestamp();

            expect(res).to.be.a('string').and.to.equal(testDate + '-' + testTime);
        });
    });

    describe('Nullcheck File', () => {

        // Get string date
        it('nullCheckRow pass', () => {
            let test = [null, null, null];
            let res = nlck.nullCheckRow(test);

            expect(res).to.be.a('array');
            expect(res[0]).to.be.a('string').and.to.equal('');
            expect(res[1]).to.be.a('string').and.to.equal('');
            expect(res[2]).to.be.a('string').and.to.equal('');
        });

        // Check to see if null or blank
        it('nullOrBlank pass', () => {
            let test = null;
            let res = nlck.nullOrBlank(test);

            expect(res).to.be.a('boolean').and.to.equal(true);

            test = '';
            res = nlck.nullOrBlank(test);
            expect(res).to.be.a('boolean').and.to.equal(true);

            test = undefined;
            res = nlck.nullOrBlank(test);
            expect(res).to.be.a('boolean').and.to.equal(true);

            test = 'testing';
            res = nlck.nullOrBlank(test);
            expect(res).to.be.a('boolean').and.to.equal(false);
        });
    });


});