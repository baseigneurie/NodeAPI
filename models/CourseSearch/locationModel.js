function loadLocations(data) {
    let locs = [];
    if (data.rows && data.rows.length > 0) {
        for (let r of data.rows) {
            let model = {
                CampCode: r[0],
                CampDesc: r[1],
                DICDCode: r[2]
            };
            locs.push(model);
        }
    }
    return locs;
}

function getLocations(orc, qry) {
    return new Promise((resolve, reject) => {
        orc.select(qry.getLocs, (err, data) => {
            if (err) reject(err);
            let locs = loadLocations(data);
            resolve(locs);
        });
    });

}

module.exports = {
    get: getLocations
}
