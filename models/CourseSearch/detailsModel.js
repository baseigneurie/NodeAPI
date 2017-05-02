
function getCourseDetails(orc, qry, params) {
    return new Promise((resolve, reject) => {
        try {
            orc.proc(qry.getCourseDetails, params, (err, data) => {
                if (err) reject(err);
                if (!data) {
                    var e = new Error("The query returned no results. Please try again.");
                    reject(e);
                }

                let results = parseResults(data);
                resolve(results);
            });
        } catch(err) {
            reject(err);
        }
    });
}

function parseResults(data) {
    try {
        var fees = [];
        if (data.length > 0) {
            data.forEach((item) => {
                var fee = {
                    label: item[15],
                    amount: item[16]
                };
                fees.push(fee);
            });
        }

        var res = data[0];
        var details = {};

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
        details.Fees = fees;
		details.CoReqs = res[17];
		details.PreReqs = res[18];
		details.MajorRest = res[19];
		details.ProgRest = res[20];

        return details;
    } catch(err) {
        return err;
    }
}


module.exports = {
    getCourseDetails: getCourseDetails
}
