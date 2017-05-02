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

function getActiveDepts(orc, qry, term) {
    var params = { term: term };

    return new Promise((resolve, reject) => {
        orc.proc(qry.getActiveDepartments, params, (err, data) => {
            if (err) reject(err);
            if (!data) {
                var e = new Error('No results returned from query.');
                reject(e);
            }

            let depts = loadDeptModel(data);
            resolve(depts);
        });
    });

}

module.exports = {
    getActiveDepts: getActiveDepts
}
