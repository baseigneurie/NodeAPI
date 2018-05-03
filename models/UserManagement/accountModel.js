const orc = require('../../data/oracle');
const ldap = require('../../data/ldap');
const qry = require('../../data/queries');
const helper = require('../../helpers/helpers');

// Get User info using user ID.
function getAccountData(args) {
    return new Promise((resolve, reject) => {
        let params = {
            id: args.num,
            fname: args.first,
            lname: args.last,
            bdate: helper.formatBday(args.bdate),
            tpid: args.username,
            pin: orc.STR_OUT,
            sectq: orc.STR_OUT,
            id_out: orc.STR_OUT,
            tpid_out: orc.STR_OUT,
            return_val: orc.STR_OUT,
            err_msg: orc.STR_OUT,
         };
         
         orc.dir_proc(qry.getSearchData, params).then((data) => {
            let msg = checkResults(data.outBinds);
            if (msg) throw new Error(msg);

            resolve(data.outBinds);
        }).catch((err) => {
            reject(err);
        });;
    });
}

function insertFirstLogin(args) {
    return new Promise((resolve, reject) => {
        let params = {
            fname: args.name.first,
            lname: args.name.last,
            bdate: helper.formatBday(args.bdate),
            id: args.num,
            squestion: args.question.q,
            sanswer: args.question.a,
            pin: args.sis,
            tpid: orc.STR_OUT,
            id_out: orc.STR_OUT,
            return_val: orc.STR_OUT,
            err_msg: orc.STR_OUT
        }

        orc.dir_proc(qry.insertFirstLogin, params).then((data) => {
            let msg = checkResults(data.outBinds);
            if (msg) throw new Error(msg);

            let resp = {
                return_val: '0',
                username: data.outBinds.tpid,
                uid: data.outBinds.id_out
            }
            resolve(resp);
        }).catch((err) => {
            reject(err);
        });
    });
}

function verifyUnknownPwd(args) {
    return new Promise((resolve, reject) => {
        let params = {
            tpid: args.tpid,
            squestion: args.squestion,
            sanswer: args.sanswer,
            return_val: orc.STR_OUT,
            err_msg: orc.STR_OUT
        }

        orc.dir_proc(qry.verifyUnknownPass, params).then((data) => {
            let msg = checkResults(data.outBinds);
            if (msg) throw new Error(msg);

            resolve(data.outBinds);
        }).catch((err) => {
            reject(err);
        });
    });
}

/* AD Functions start */
/* ---- */
function findADUser(body) {
    return new Promise((resolve, reject) => {
        ldap.findUser(body.username).then((data) => {
            resolve(data);
        }).catch((err) => {
            ldap.logADError(body, err.message, 'accountModel.findUser');
            reject(err);
        });
    });
}

function resetPassword(body) {
    return new Promise((resolve, reject) => {
        ldap.userExists(body.username).then((result) => {
            if (!result) throw new Error('Unable to find user: ' + body.username);
            return ldap.authenticate(body.username, body.newpass);
        }).then((result) => {
            if (result) throw new Error('Cannot use your current password');
            let params = {
                tpid: body.username,
                squestion: body.q,
                sanswer: body.a
            };
            return verifyUnknownPwd(params);
        }).then((result) => {
            if (!result) throw new Error('Unable to validate user: ' + body.username);
            if (result.return_val === '1') throw new Error(result.err_msg);

            return ldap.updatePassword(body.username, body.newpass);
        }).then((result) => {
            if (!result) throw new Error('Unable to update password for user: ' + body.username);
            
            resolve(result);
        }).catch((err) => {
            ldap.logADError(body, err.message, 'accountModel.resetPassword');
            reject(err);
        });
    });
}

function setupPassword(body) {
    return new Promise((resolve, reject) => {
        ldap.updatePassword(body.username, body.pass).then((result) => {
            if (!result.success) throw new Error('Unable to find user: ' + body.username);

            resolve(result.success);
        }).catch((err) => {
            ldap.logADError(body, err.message, 'accountModel.setupPassword');
            reject(err);
        });
    });
}

function checkResults(resp) {
    if (resp.return_val !== '0') {
        return resp.err_msg;
    } else {
        return '';
    }
}

module.exports = {
    getAccountData: getAccountData,
    insertFirstLogin: insertFirstLogin,
    findADUser: findADUser,
    resetPassword: resetPassword,
    setupPassword: setupPassword
}