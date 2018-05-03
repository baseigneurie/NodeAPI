const orc = require('../../data/oracle');
const qry = require('../../data/queries');

function loadDeptModel(data) {
    let depts = [];
    if (data && data.length > 0) {
        for (let r of data) {
            let model = {
                DeptCode: r[0],
                DeptDescription: r[1]
            };
            depts.push(model);
        }
    }
    return depts;
}

function getActiveDepts(term) {
    return new Promise((resolve, reject) => {
        let params = { term: term };
        orc.proc(qry.getActiveDepartments, params).then((data) => {
            if (!data) throw new Error('No results returned from query: Departments');
            let depts = loadDeptModel(data);
            resolve(depts);
        }).catch((err) => {
            reject(err);
        });
    });
}

module.exports = {
    getActiveDepts: getActiveDepts
}
