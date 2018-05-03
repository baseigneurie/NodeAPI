const ldap = require('../../data/ldap');

const adminGroup = 'XXXXXXXXXXXXX';

// Authenticate user and verify IS ADMIN
function verifyLogin(args) {
    return new Promise((resolve, reject) => {
        ldap.authenticate(args.user, args.pass).then((resp) => {
            if (!resp) {
                throw new Error('Unable to authenticate username/password');
            }
            return ldap.isMember(args.user, adminGroup);
        }).then((data) => {
            if (!data) {
                throw new Error('User account is not authorized');
            }
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
}

module.exports = {
    verifyLogin: verifyLogin
}