function loadTermModel(data) {
    let terms = [];

    if (data.rows && data.rows.length > 0) {
        for (let r of data.rows) {
            let model = {
                TermCode: r[0],
                TermName: r[1],
                Default: r[2]
            };
            terms.push(model);
        }
    }
    return terms;
}

function getTerms(orc, qry) {
    return new Promise((resolve, reject) => {
        orc.select(qry.getTerms, (err, data) => {
            if (err) reject(err);
            let terms = loadTermModel(data);
            resolve(terms);
        });
    });

}

module.exports = {
    get: getTerms
}
