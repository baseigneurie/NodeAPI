const chai = require('chai');
const expect = require('chai').expect;
const model = require('../models/UserManagement/questionsModel.js');

const orc = require('../data/oracle');

describe('Questions Model', () => {
    describe('getSecretQuestions', () => {

        // Get locations
        it('Passing', (done) => {
            model.getSecretQuestions().then((result) => {
                expect(result).to.be.an('array');
                expect(result[0]).to.be.an('object');
                data = result;
                done();
            });
        });

        // Failed retrieval
        it('Failed', (done) => {
            let temp = orc.proc;
            orc.proc = () => { throw new Error('asdfasdfasdf') };

            model.getSecretQuestions().then((result) => {
            }).catch((err) => {
                expect(err).to.be.an('error');
                orc.proc = temp;
                done();
            });
        });

    });
});