const chai = require('chai');
const expect = require('chai').expect;
const model = require('../models/CourseSearch/detailsModel.js');

const orc = require('../data/oracle');

describe('Details Model', () => {
    describe('getCourseDetails', () => {

        // Get course details
        it('Passing', (done) => {
            let reqBody = {
                crn: '11736',
                term: '201911'
            };
            model.getCourseDetails(reqBody).then((result) => {
                expect(result).to.be.an('object');
                data = result;
                done();
            });
        }).timeout(30000);

        // Fail retrieval
        it('Failed', () => {
            let temp = orc.proc;
            orc.proc = () => { throw new Error('asdfasdfasdf') };

            model.getCourseDetails().then((result) => {
            }).catch((err) => {
                expect(err).to.be.an('error');
            });

            orc.proc = temp;
        });

    });
});