const helper = require('../helpers/helpers');
const qry = require('./queries');
const orc = require('./oracle');
const AD = require('ad');

const config = {
    url: 'XXXXXXXXXXXXXXXXXXXX',
    user: process.env.AD_USER,
    pass: process.env.AD_PASS
}

function FindUser(username) {
    return new Promise((resolve, reject) => {
        let ldap = new AD(config).cache(false);
        if (!username) {
            reject(new Error('No username provided'));
            return;
        }

        ldap.user(username).get().then(user => {
            if (Object.keys(user).length === 0) {
                throw new Error('User: ' + username + ' could not be found.');
                return;
            }
            resolve(user);
        }).catch((err) => {
            reject(err);
        });
	});
}

function UserExists(username) {
    return new Promise((resolve, reject) => {
        let ldap = new AD(config).cache(false);
        if (!username) {
            reject(new Error('No username provided'));
            return;
        }

        ldap.user(username).get().then(user => {
            resolve(Object.keys(user).length > 0);
        }).catch((err) => {
            reject(err);
        });
	});
}

function PassAuthenticate(username, pass) {
    return new Promise((resolve, reject) => {
        let ldap = new AD(config).cache(false);

        let fail_msg = '';
        if (!username) {
            fail_msg = 'No username provided';
        } else if (!pass) {
            fail_msg = 'No password provided';
        }
        if (fail_msg) {
            reject(new Error(fail_msg));
            return;
        }
        

        ldap.user(username).authenticate(pass).then(res => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        });
	});
}

function UpdatePassword(username, pass) {
    return new Promise((resolve, reject) => {
        let ldap = new AD(config).cache(false);
        ldap.user(username).password(pass).then(res => {
            console.log('here you go');
            resolve(res);
        }).catch((err) => {
            reject(err);
        });
	});
}

function IsMember(username, group) {
    return new Promise((resolve, reject) => {
        let ldap = new AD(config).cache(false);
        ldap.user(username).isMemberOf(group).then(res => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        });
	});
}

/* LOG AD ERRORS */
function logADError(body, err, proc) {
    let params = {
        rec_type: null,
        proc: (proc) ? proc : null,
        id: null,
        fname: null,
        lname: null,
        bdate: null,
        tpid: (body.username) ? body.username : null,
        pin: null,
        sectq: (body.q) ? body.q : null,
        secta: (body.a) ? body.a : null,
        retval: '101',
        err_msg: err,
        success: orc.STR_OUT,
        success_msg: orc.STR_OUT,
    };

    orc.dir_proc(qry.logADError, params).then((resp) => {
        if (resp.outBinds.success === '0') {
            let e = data.outBinds.success_msg;

            let str = '\nTIMESTAMP: ' + helper.getTimestamp();
            str += '\nERROR: ' + e + '\n=====================';
            helper.writeToFile('api_log_errors.txt', str);
        }
    }).catch((err) => {
        let str = '\nTIMESTAMP: ' + helper.getTimestamp();
        str += '\nERROR: ' + e + '\n=====================';
        helper.writeToFile('api_log_errors.txt', str);
    });
}

module.exports = {
    findUser: FindUser,
    userExists: UserExists,
    authenticate: PassAuthenticate,
    updatePassword: UpdatePassword,
    isMember: IsMember,
    logADError: logADError
}