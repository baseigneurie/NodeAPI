const chai = require('chai');
const expect = require('chai').expect;
const app = require('../app.js');

chai.use(require('chai-http'));

describe('Main server endpoint /', () => {
    before(() => {
    });

    after(() => {
    })

    // GET root error
    it('should return 404', () => {
        return chai.request(app)
            .get('/')
            .then((res) => {
                expect(res).to.have.status(404);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.message).to.be.an('string');
                expect(res.body.title).to.be.an('string');
                expect(res.body.errCode).to.be.an('number');
                expect(res.body.errCode).to.equal(404);
            });
    })
})