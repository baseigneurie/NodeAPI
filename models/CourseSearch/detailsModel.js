const orc = require('../../data/oracle');
const qry = require('../../data/queries');

function getCourseDetails(params) {
    return new Promise((resolve, reject) => {
            orc.proc(qry.getCourseDetails, params).then((data) => {
                if (!data) throw new Error('The query returned no results. Please try again.');
                resolve(parseResults(data));
            }).catch((err) => {
                reject(err);
            });
    });
}

function parseResults(data) {
    try {
        let availTerms = [];
        if (data.length > 0) {
            data.forEach((item) => {
                let term = {
                    code: item[19],
                    desc: item[20]
                };
                availTerms.push(term);
            });
        }

		if (availTerms.length > 0) {
			availTerms.sort((a, b) => {
				let descA = a.desc.toUpperCase(); // ignore upper and lowercase
				let descB = b.desc.toUpperCase(); // ignore upper and lowercase
				if (descA < descB) {
				  return -1;
				}
				if (descA > descB) {
				  return 1;
				}
				return 0;
			});
		}

        let res = data[0];
        let details = {};

        details.Title = res[0];
        details.Code = res[1];
        details.CrsNumber = res[2];
        details.SeqNumber = res[3];
        details.Term = res[4];
        details.Levels = res[5];
        details.Campus = res[6];
        details.SchedType = res[7];
        details.Delivery = res[8];
        details.CrHours = res[9];
        details.Description = res[10];
        details.Capacity = res[11];
        details.SeatsTaken = res[12];
        details.SeatsRemaining = res[13];
		details.CoReqs = res[14];
		details.PreReqs = res[15];
		details.MajorRest = res[16];
		details.ProgRest = res[17];
		details.NotProgRest = res[18];
		details.AvailTerms = availTerms;

        return details;
    } catch(err) {
        return err;
    }
}


module.exports = {
    getCourseDetails: getCourseDetails
}
