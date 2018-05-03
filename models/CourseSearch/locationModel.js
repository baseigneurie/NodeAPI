const orc = require('../../data/oracle');
const qry = require('../../data/queries');

function loadLocations(data) {
    let locs = [];

    if (data && data.length > 0) {
        for (let r of data) {
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

function getLocations() {
    return new Promise((resolve, reject) => {
        orc.proc(qry.getLocs, {}).then((data) => {
            if (!data) throw new Error('No results returned from query: Locations');
            let locs = loadLocations(data);
            resolve(locs);
        }).catch((err) => {
            reject(err);
        });
    });
}

module.exports = {
    getLocations: getLocations
}
