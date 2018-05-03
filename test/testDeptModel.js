const chai = require('chai');
const expect = require('chai').expect;
const model = require('../models/CourseSearch/deptModel.js');

const orc = require('../data/oracle');

describe('Department Model', () => {
    describe('getActiveDepts', () => {

        // Get departments
        it('Passing', (done) => {
            model.getActiveDepts('20192').then((result) => {
                expect(result).to.be.a('array');
                expect(result[0]).to.be.an('object');
                data = result;
                done();
            });
        }).timeout(30000);

        // Fail the retrieval
        it('Failed', () => {
            let temp = orc.proc;
            orc.proc = () => { throw new Error('asdfasdfasdf') };

            model.getActiveDepts('2019289').then((result) => {
            }).catch((err) => {
                expect(err).to.be.an('error');
            });
            
            orc.proc = temp;
        });

    });
});