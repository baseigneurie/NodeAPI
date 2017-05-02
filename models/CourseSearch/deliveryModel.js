function loadDelivery(data) {
    let delv = [];
    if (data.rows && data.rows.length > 0) {
        for (let r of data.rows) {
            delv.push(r[0]);
        }
    }
    return delv;
}

function getDelivery(orc, qry) {
    return new Promise((resolve, reject) => {
        orc.select(qry.getDelivery, (err, data) => {
            if (err) reject(err);
            let delvTypes = loadDelivery(data);
            resolve(delvTypes);
        });
    });

}

module.exports = {
    get: getDelivery
}
