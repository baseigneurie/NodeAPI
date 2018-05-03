const fs = require('fs');

function formatBday(date) {
    let dateArray = date.split('-');
    let dateString = dateArray[1] + dateArray[2] + dateArray[0];
    return dateString;
}

function formatMatchDate(date) {
    let dateArray = date.split('-');
    let dateString = dateArray[1] + '/' + dateArray[2] + '/' + dateArray[0];
    return dateString;
}

function getCurrentDate() {
    let d = new Date(Date.now()); 
    return d.getMonth() + '/' + d.getDay() + '/' + d.getFullYear();
}

function getCurrentTime() {
    let d = new Date(Date.now()); 
    return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
}

function getTimestamp() {
    let d = getCurrentDate();
    let t = getCurrentTime();
    return d + '-' + t;
}

function writeToFile(path, data) {
    try {
        fs.appendFile(path, data, (err) => {
            if (err) throw err;
        });
    } catch(e) {
        console.log(e);
    }
}

module.exports = {
    formatBday: formatBday,
    formatMatchDate: formatMatchDate,
    getCurrentDate: getCurrentDate,
    getCurrentTime: getCurrentTime,
    getTimestamp: getTimestamp,
    writeToFile: writeToFile
}