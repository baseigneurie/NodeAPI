const chai = require('chai');
const expect = require('chai').expect;
const error = require('../Models/Error/error');

describe('Error model Functions', () => {
    describe('Error File', () => {

        it('Create error', () => {
            let res = error.createError('title', 'message');

            expect(res).to.be.an('object');
            expect(res).to.have.property('title').and.to.be.a('string');
            expect(res).to.have.property('message').and.to.be.a('string');
            expect(res).to.have.property('errCode').and.to.be.a('number');    
        });

    });
});

