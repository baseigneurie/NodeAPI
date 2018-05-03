const chai = require('chai');
const expect = require('chai').expect;
const model = require('../models/CourseSearch/locationModel.js');

const orc = require('../data/oracle');

describe('Location Model', () => {
    describe('getLocations', () => {

        // Get locations
        it('Passing', (done) => {
            model.getLocations().then((result) => {
                expect(result).to.be.an('array');
                expect(result[0]).to.be.an('object');
                data = result;
                done();
            });
        }).timeout(30000);

        // Failed retrieval
        it('Failed', () => {
            let temp = orc.proc;
            orc.proc = () => { throw new Error('asdfasdfasdf') };

            model.getLocations().then((result) => {
            }).catch((err) => {
                expect(err).to.be.an('error');
            });

            orc.proc = temp;
        });

    });
});