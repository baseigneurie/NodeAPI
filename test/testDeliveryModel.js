const chai = require('chai');
const expect = require('chai').expect;
const model = require('../models/CourseSearch/deliveryModel.js');

const orc = require('../data/oracle');

describe('Delivery Model', () => {
    describe('getDelivery', () => {

        // Get delivery methods
        it('Passing', (done) => {
            model.getDelivery().then((result) => {
                expect(result).to.be.a('array');
                expect(result[0]).to.be.an('string');
                data = result;
                done();
            });
        }).timeout(30000);

        // Fail the retrieval
        it('Failed', () => {
            let temp = orc.proc;
            orc.proc = () => { throw new Error('asdfasdfasdf') };
            
            model.getDelivery().then((result) => {
            }).catch((err) => {
                expect(err).to.be.an('error');
                orc.proc = temp;
            });
        });

    });
});