
function nullCheckRow(row) {
    let n = 0;
    for (let r of row) {
        if (!r) {
            row[n] = '';
        }
        n++;
    }

    return row;
}

function nullOrBlank(s) {
    if (s === null || s === '') {
        return true;
    }

    return false;
}



module.exports = {
    nullCheckRow: nullCheckRow,
    nullOrBlank: nullOrBlank
}
