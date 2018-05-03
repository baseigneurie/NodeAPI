const orc = require('../../data/oracle');
const qry = require('../../data/queries');

function loadProgModel(data) {
    let progs = [];

    if (data.length > 0) {
        for (let r of data) {
            let model = {
                ProgCode: r[1],
                ProgName: r[2],
            }
            progs.push(model);
        }
    }
    return progs;
}

function getProgs(term) {
    return new Promise((resolve, reject) => {
        let params = {
            p1: term
        };
        orc.proc(qry.getProgs, params).then((data) => {
            if (!data) throw new Error('No results returned from query: Programs');
            let progs = loadProgModel(data);
            resolve(progs);
        }).catch((err) => {
            reject(err);
        });
    });
}

module.exports = {
    getProgs: getProgs
}
