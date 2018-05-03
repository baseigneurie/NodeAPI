const chai = require('chai');
const expect = require('chai').expect;
const db = require('../data/oracle');
const qry = require('../data/queries');

describe('Oracle DB functions', () => {
    describe('select', () => {

        // Successful attempt
        it('On Success', (done) => {
            db.select(qry.getTerms).then((res) => {
                expect(res).to.be.an('object');
                done();
            });
        });

        // Successful attempt
        it('On Fail', (done) => {
            db.select('').then((res) => {
            }).catch((err) => {
                expect(err).to.be.an('error');
            });
            done();
        });

    });

    let reqBody = {
        'username': 'msmith180', 
        'first': 'Molly', 
        'last': 'Smith', 
        'bdate': '1982-03-03',
        'num': '@00454872'
      };

    describe('proc', () => {
        let params = { term: '20192' };

        // Successful attempt
        it('On Success', (done) => {
            db.proc(qry.getActiveDepartments, params).then((res) => {
                expect(res).to.be.an('array');
            });
            done();
        });

        // Failed attempt
        it('On Fail', (done) => {
            db.proc(qry.getActiveDepartments, {}).then((res) => {
            }).catch((err) => {
                expect(err).to.be.an('error');
            });
            done();
        });
    });

    describe('dir_proc', () => {
        let params = {
            id: '@00454872',
            fname: 'Molly',
            lname: 'Smith', 
            bdate: '03031982',
            tpid: 'msmith180',
            pin: db.STR_OUT,
            sectq: db.STR_OUT,
            id_out: db.STR_OUT,
            tpid_out: db.STR_OUT,
            return_val: db.STR_OUT,
            err_msg: db.STR_OUT,
         };

        // Successful attempt
        it('On Success', (done) => {
            db.dir_proc(qry.getSearchData, params).then((res) => {
                expect(res).to.be.an('object');
            });
            done();
        });

        // Failed attempt
        it('On Fail', (done) => {
            db.dir_proc(qry.getSearchData, {}).then((res) => {
            }).catch((err) => {
                expect(err).to.be.an('error');
            });
            done();
        });
    });
});