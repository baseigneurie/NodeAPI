
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

function getProgs(orc, qry, term) {
    return new Promise((resolve, reject) => {
        let params = {
            p1: term
        };
        orc.proc(qry.getProgs, params, (err, data) => {
            if (err) reject(err);
            let progs = loadProgModel(data);
            resolve(progs);
        });
    });

}

module.exports = {
    get: getProgs
}
