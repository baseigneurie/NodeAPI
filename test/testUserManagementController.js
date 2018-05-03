const chai = require('chai');
const expect = require('chai').expect;
const app = require('../app.js');
const orc = require('../data/oracle');

chai.use(require('chai-http'));

describe('User Management Controller', () => {
    describe('Endpoint Tests', () => {
        describe('/user/questions', () => {
            let data = {};

            // GET Secret Questions list
            it('On Success', () => {
                return chai.request(app)
                    .get('/user/questions')
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        expect(res).to.be.json;
                        expect(res.body).to.be.an('array');

                        // Store in var for future testing
                        data = res.body;
                    });
            });

            // Secret Question object
            it('Questions List Object', () => {
                expect(data[0]).to.be.an('object');
                expect(data[0]).to.have.property('q').and.to.be.a('string');
                expect(data[0]).to.have.property('id').and.to.be.a('string');
            });

            // Fail the retrieval
            it('On Fail', () => {
                let temp = orc.proc;
                orc.proc = () => { throw new Error('asdfasdfasdf') };
                
                return chai.request(app)
                .get('/user/questions')
                .then((res) => {
                    expect(res.status).to.equal(500);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('object');
                });

                orc.proc = temp;
            });
        });

        describe('/user/account/lookup', () => {
            let data = {};
            let reqBody = {
                'username': 'msmith180', 
                'first': 'Molly', 
                'last': 'Smith', 
                'bdate': '1982-03-03',
                'num': '@00454872'
              };

            // POST User account info
            it('On Success', () => {
                return chai.request(app)
                    .post('/user/account/lookup')
                    .send(reqBody)
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        expect(res).to.be.json;
                        expect(res.body).to.be.an('object');

                        // Store in var for future testing
                        data = res.body;
                    });
            }).timeout(30000);

            // User account object
            it('Account Object', () => {
                expect(data).to.have.property('pin').and.to.be.a('string');
                expect(data).to.have.property('sectq').and.to.be.a('string');
                expect(data).to.have.property('id_out').and.to.be.a('string');
                expect(data).to.have.property('tpid_out').and.to.be.a('string');
                expect(data).to.have.property('return_val').and.to.be.a('string');
                expect(data).to.have.property('err_msg').and.to.be.a('string');
            });

            // Failed Request
            it('On Fail', () => {
                reqBody.num = '';
                return chai.request(app)
                    .post('/user/account/lookup')
                    .send(reqBody)
                    .then((res) => {
                        expect(res.status).to.equal(500);
                        expect(res).to.be.json;
                        expect(res.body).to.be.an('object');

                        expect(res.body).to.have.property('message').and.to.be.a('string');
                        expect(res.body).to.have.property('title').and.to.be.a('string');
                        expect(res.body).to.have.property('errCode').and.to.be.a('number');
                    });
            }).timeout(30000);
        });

        // POST account creation
        describe('/user/account/create', () => {
            let data = {};
            let reqBody = {
                'name':{'first':'Molly','last':'Smith'},
                'bdate':'1982-03-03',
                'num':'@00454872',
                'question':{'q':'What is my favorite pets name?','a':'Fluffy'},
                'sis':'password1',
                'pass':{'current':'','new':'Password01!'}
              }

            // POST User account info
            it('On Success', () => {
                return chai.request(app)
                    .post('/user/account/create')
                    .send(reqBody)
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        expect(res).to.be.json;
                        expect(res.body).to.be.an('object');

                        // Store in var for future testing
                        data = res.body;
                    });
            }).timeout(30000);

            // Successful Returned object
            it('Account Creation Response Object', () => {
                expect(data).to.have.property('return_val').and.to.be.a('string');
                expect(data).to.have.property('username').and.to.be.a('string');
                expect(data).to.have.property('uid').and.to.be.a('string');
            });

            // Failed Request
            it('On Fail', () => {
                reqBody.num = '';
                return chai.request(app)
                    .post('/user/account/create')
                    .send(reqBody)
                    .then((res) => {
                        expect(res.status).to.equal(500);
                        expect(res).to.be.json;
                        expect(res.body).to.be.an('object');

                        expect(res.body).to.have.property('message').and.to.be.a('string');
                        expect(res.body).to.have.property('title').and.to.be.a('string');
                        expect(res.body).to.have.property('errCode').and.to.be.a('number');
                    });
            }).timeout(30000);
        });

        // POST account creation
        describe('/user/ad_find', () => {
            let data = {};
            let reqBody = { username: 'msmith180' }

            // POST User account info
            it('On Success', () => {
                return chai.request(app)
                    .post('/user/ad_find')
                    .send(reqBody)
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        expect(res).to.be.json;
                        expect(res.body).to.be.an('object');

                        // Store in var for future testing
                        data = res.body;
                    });
            }).timeout(30000);

            // Successful Returned object
            it('AD User Object', () => {
                expect(data).to.have.property('dn').and.to.be.a('string');
                expect(data).to.have.property('userPrincipalName').and.to.be.a('string');
                expect(data).to.have.property('sAMAccountName').and.to.be.a('string');
                expect(data).to.have.property('mail').and.to.be.a('string');
                expect(data).to.have.property('lockoutTime').and.to.be.a('string');
                expect(data).to.have.property('whenCreated').and.to.be.a('string');
                expect(data).to.have.property('pwdLastSet').and.to.be.a('string');
                expect(data).to.have.property('userAccountControl').and.to.be.a('string');
                expect(data).to.have.property('employeeID').and.to.be.a('string');
                expect(data).to.have.property('sn').and.to.be.a('string');
                expect(data).to.have.property('givenName').and.to.be.a('string');
                expect(data).to.have.property('cn').and.to.be.a('string');
                expect(data).to.have.property('displayName').and.to.be.a('string');
                expect(data).to.have.property('description').and.to.be.a('string');
                expect(data).to.have.property('groups').and.to.be.an('array');
            });

            // AD Groups object
            it('AD Groups Array Object', () => {
                expect(data.groups[0]).to.have.property('dn').and.to.be.a('string');
                expect(data.groups[0]).to.have.property('cn').and.to.be.a('string');
                expect(data.groups[0]).to.have.property('groupType').and.to.be.a('string');
            });

            // Failed Request
            it('On Fail', () => {
                reqBody.username = 'msmith1805';
                return chai.request(app)
                    .post('/user/ad_find')
                    .send(reqBody)
                    .then((res) => {
                        expect(res.status).to.equal(500);
                        expect(res).to.be.json;
                        expect(res.body).to.be.an('object');

                        expect(res.body).to.have.property('message').and.to.be.a('string');
                        expect(res.body).to.have.property('title').and.to.be.a('string');
                        expect(res.body).to.have.property('errCode').and.to.be.a('number');
                    });
            }).timeout(30000);
        });

        // POST Password Reset
        describe('/user/pass/reset', () => {
            let data = {};
            
            // Random number for PW to avoid duplicate error when testing
            let n = new Date().getMinutes();
            let reqBody = {
                username: 'msmith180',
                newpass: 'Password' + n + '!',
                q: 'What is my favorite pets name?',
                a: 'Fluffy'
            }

            // POST User account info
            it('On Success', () => {
                return chai.request(app)
                    .post('/user/pass/reset')
                    .send(reqBody)
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        expect(res).to.be.json;
                        expect(res.body).to.be.an('object');

                        // Store in var for future testing
                        data = res.body;

                        expect(data).to.have.property('success').and.to.equal(true);
                    });
            }).timeout(30000);

            // Failed Request
            it('On Fail', () => {
                reqBody.username = '';
                return chai.request(app)
                    .post('/user/pass/reset')
                    .send(reqBody)
                    .then((res) => {
                        expect(res.status).to.equal(500);
                        expect(res).to.be.json;
                        expect(res.body).to.be.an('object');

                        expect(res.body).to.have.property('message').and.to.be.a('string');
                        expect(res.body).to.have.property('title').and.to.be.a('string');
                        expect(res.body).to.have.property('errCode').and.to.be.a('number');
                    });
            }).timeout(30000);
        });


    });
});