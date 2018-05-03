const chai = require('chai');
const expect = require('chai').expect;
const ldap = require('../data/ldap.js');

describe('LDAP AD functions', () => {
    describe('FindUser', () => {
        let data = {};

        // Successful attempt
        it('On Success', (done) => {
            ldap.findUser('msmith180').then((res) => {
                expect(res).to.be.an('object');
                data = res;
                done();
            });
        });

        // Returned AD user object
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

        // Failed Request - no username
        it('No username', (done) => {
            ldap.findUser('').then((result) => {
            }).catch((err) => {
                expect(err).to.be.an('error');
            });
            done();
        });

        // Failed Request - invalid username
        it('Bad Username', (done) => {
            ldap.findUser('asdfasdfas').then((result) => {
            }).catch((err) => {
                expect(err).to.be.an('error');
            });
            done();
        });
    });

    describe('UserExists', () => {
        // Successful attempt
        it('On Success', (done) => {
            ldap.userExists('msmith180').then((res) => {
                expect(res).to.equal(true);
            });
            done();
        });

        // Failed Request - no username
        it('No username', (done) => {
            ldap.userExists('').then((result) => {
            }).catch((err) => {
                expect(err).to.be.an('error');
            });
            done();
        });
    });

    describe('UpdatePassword', () => {
        // Successful attempt
        it('On Success', (done) => {
            ldap.updatePassword('msmith180', 'Password99!').then((res) => {
                expect(res).to.be.an('object');
            });
            done();
        });

        // Failed Request - no username
        it('No password', (done) => {
            ldap.updatePassword('msmith180', '').then((result) => {
            }).catch((err) => {
                expect(err).to.be.an('object');
            });
            done();
        });
    });

    describe('PassAuthenticate', () => {
        // Successful attempt
        it('On Success', (done) => {
            ldap.authenticate('msmith180', 'Password99!').then((result) => {
                expect(result).to.equal(true);
            });
            done();
        });

        // Failed Request - no username
        it('No password', (done) => {
            ldap.authenticate('msmith180', '').then((result) => {
            }).catch((err) => {
                expect(err).to.be.an('error');
            });
            done();
        });
    });

});