const orc = require('../../data/oracle');
const qry = require('../../data/queries');

// Returns the secret questions for lookup forms.
function getSecretQuestions() {
    return new Promise((resolve, reject) => {
        let results = [];
        let params = {
            ret: orc.PTR,
            return_val: orc.STR_OUT,
            err_msg: orc.STR_OUT
        };

        orc.proc(qry.getSecretQuestions, params).then((data) => {
            if (!data) throw new Error('No results were found.');

            data.forEach((row) => {
                let question = {
                    q: row[0],
                    id: row[1]
                }
                results.push(question);
            });
            resolve(results);
        }).catch((err) => {
            reject(err);
        });
    });
}

module.exports = {
    getSecretQuestions: getSecretQuestions
}