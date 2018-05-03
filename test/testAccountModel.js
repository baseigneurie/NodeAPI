const chai = require('chai');
const expect = require('chai').expect;
const model = require('../models/UserManagement/accountModel.js');
const orc = require('../data/oracle');

describe('Account Model', () => {
    describe('getAccountData', () => {
        let data = {};
        let reqBody = {
            'username': 'msmith180', 
            'first': 'Molly', 
            'last': 'Smith', 
            'bdate': '1982-03-03',
            'num': '@00454872'
          };

        // Get user account
        it('Passing', (done) => {
            model.getAccountData(reqBody).then((result) => {
                expect(result).to.be.an('object');
                data = result;
                done();
            });
        });

        // User account object
        it('Account Object', () => {
            expect(data).to.have.property('pin').and.to.be.a('string');
            expect(data).to.have.property('sectq').and.to.be.a('string');
            expect(data).to.have.property('id_out').and.to.be.a('string');
            expect(data).to.have.property('tpid_out').and.to.be.a('string');
            expect(data).to.have.property('return_val').and.to.be.a('string');
            expect(data).to.have.property('err_msg').and.to.be.a('string');
        });

        // Failed retrieval
        it('Failed', (done) => {
            let temp = orc.dir_proc;
            orc.dir_proc = () => { throw new Error('asdfasdfasdf') };

            model.getAccountData(reqBody).then((result) => {
            }).catch((err) => {
                expect(err).to.be.an('error');
                orc.dir_proc = temp;
            });
            done();
        });
    });

    describe('insertFirstLogin', () => {
        let data = {};
        let reqBody = {
            'name':{'first':'Molly','last':'Smith'},
            'bdate':'1982-03-03',
            'num':'@00454872',
            'question':{'q':'What is my favorite pets name?','a':'Fluffy'},
            'sis':'password1',
            'pass':{'current':'','new':'Password01!'}
          }

        // Get user account
        it('Passing', (done) => {
            model.insertFirstLogin(reqBody).then((result) => {
                expect(result).to.be.an('object');
                data = result;
                done();
            });
        });

        // Successful Returned object
        it('Account Creation Response Object', () => {
            expect(data).to.have.property('return_val').and.to.be.a('string');
            expect(data).to.have.property('username').and.to.be.a('string');
            expect(data).to.have.property('uid').and.to.be.a('string');
        });

        // Failed retrieval
        it('Failed', (done) => {
            let temp = orc.dir_proc;
            orc.dir_proc = () => { throw new Error('asdfasdfasdf') };

            model.insertFirstLogin(reqBody).then((result) => {
            }).catch((err) => {
                expect(err).to.be.an('error');
                orc.dir_proc = temp;
            });
            done();
        });
    });

    describe('findADUser', () => {
        let data = {};
        let reqBody = { username: 'msmith180' }

        // Get user account
        it('Passing', (done) => {
            model.findADUser(reqBody).then((result) => {
                expect(result).to.be.an('object');
                data = result;
                done();
            });
        });

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
        it('On Fail', (done) => {
            reqBody.username = '';

            model.findADUser(reqBody).then((result) => {
            }).catch((err) => {
                expect(err).to.be.an('error');
            });
            done();
        });
    });

    describe('resetPassword', () => {
        let data = {};
            
        // Random number for PW to avoid duplicate error when testing
        let n = new Date().getMinutes();
        let reqBody = {
            username: 'msmith180',
            newpass: 'Password11!',
            q: 'What is my favorite pets name?',
            a: 'Fluffy'
        }

        // POST User account info
        it('On Success', (done) => {
            model.resetPassword(reqBody).then((result) => {
                expect(result).to.be.an('object');
                data = result;
            });
            done();
        });

        it('On Current Password Failure', (done) => {
            model.resetPassword(reqBody).then((result) => {
            }).catch((err) => {
                expect(err).to.be.an('error');
            });
            done();
        }).timeout(30000);

        it('On Username Failure', (done) => {
            let temp = reqBody.username;
            reqBody.username = '';
            model.resetPassword(reqBody).then((result) => {
            }).catch((err) => {
                expect(err).to.be.an('error');
                reqBody.username = temp;
            });
            done();
        }).timeout(30000);

        it('On Update Failure', (done) => {
            reqBody.a = '';
            model.resetPassword(reqBody).then((result) => {
            }).catch((err) => {
                expect(err).to.be.an('error');
                reqBody.a = 'Fluffy';
            });
            done();
        });


    });


});