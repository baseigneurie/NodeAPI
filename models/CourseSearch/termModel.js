const orc = require('../../data/oracle');
const qry = require('../../data/queries');

function loadTermModel(data) {
    let terms = [];
    if (data.rows && data.rows.length > 0) {
        for (let r of data.rows) {
            let model = {
                TermCode: r[0],
                TermName: r[1],
                Default: r[2],
				Like: r[3],
				NotLike: r[4]
            };
            terms.push(model);
        }
    }
    return terms;
}

function getTerms() {
    return new Promise((resolve, reject) => {
        orc.select(qry.getTerms).then((data) => {
            if (!data) throw new Error('The query returned no results: Terms');
            let terms = loadTermModel(data);
            resolve(terms);
        }).catch((err) => {
			reject(err)
		});
    });
}

module.exports = {
    getTerms: getTerms
}
