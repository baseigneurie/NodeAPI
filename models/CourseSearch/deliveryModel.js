const orc = require('../../data/oracle');
const qry = require('../../data/queries');

function loadDelivery(data) {
    let delv = [];
    if (data && data.length > 0) {
        for (let r of data) {
            delv.push(r[0]);
        }
    }

	if (delv.length > 0) {
		delv.sort();
	}

    return delv;
}

function getDelivery() {
    return new Promise((resolve, reject) => {
        orc.proc(qry.getDelivery, {}).then((data) => {
            if (!data) throw new Error('No results returned from query: Delivery Methods');
            let delvTypes = loadDelivery(data);
            resolve(delvTypes);
        }).catch((err) => {
            reject(err);
        });
    });
}

module.exports = {
    getDelivery: getDelivery
}
