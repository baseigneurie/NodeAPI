const chai = require('chai');
const expect = require('chai').expect;
const model = require('../models/CourseSearch/termModel.js');

const orc = require('../data/oracle');

describe('Term Model', () => {
    describe('getTerms', () => {

        // Get locations
        it('Passing', (done) => {
            model.getTerms().then((result) => {
                expect(result).to.be.an('array');
                expect(result[0]).to.be.an('object');
                data = result;
            });
            done();
        });

        // Failed retrieval
        it('Failed', (done) => {
            let temp = orc.select;
            orc.select = () => { throw new Error('asdfasdfasdf') };

            model.getTerms().then((result) => {
            }).catch((err) => {
                expect(err).to.be.an('error');
                orc.select = temp;
            });
            done();
        });
    });
});