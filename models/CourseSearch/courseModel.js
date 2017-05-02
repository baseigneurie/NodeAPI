var mongoose = require('mongoose');
var termModel = require('./termModel');
var deptModel = require('./deptModel');
var progModel = require('./progModel');
var locModel = require('./locationModel');
var delvModel = require('./deliveryModel');
var searchModel = require('./searchModel');
var detailsModel = require('./detailsModel');

var orc = require('../../data/oracle');
var qry = require('../../data/queries');

var lookup = {
    ID: "",
    term: {
        selected: null,
        allTerms: []
    },
    department: {
        selected: null,
        allDepartments: []
    },
    program: {
        selected: null,
        allPrograms: []
    },
    courseNumber: {
        subject: null,
        course: null,
        section: null
    },
    title: null,
    location: {
        selected: null,
        allLocations: []
    },
    delivery: {
        selected: null,
        allMethods: []
    },
    trmlike: null,
    trmnotlike: null,
    searchResults: []
};

function getLookup(callback) {
    var t = ""

    termModel.get(orc, qry).then((data) => {
        lookup.term.allTerms = data;

        if (lookup.term.selected && lookup.term.selected.TermCode) {
            t = lookup.term.selected.TermCode;
        } else if (lookup.term.allTerms.length > 0) {
            lookup.term.allTerms.forEach((term) => {
                if (term.Default === 'Y') t = term.TermCode;
            })
        } else {
            callback("No term provided for programs", null);
        }

        return deptModel.getActiveDepts(orc, qry, t);
    }).then((data) => {
        lookup.department.allDepartments = data;
        return progModel.get(orc, qry, t);
    }).then((data) => {
        lookup.program.allPrograms = data;
        return locModel.get(orc, qry);
    }).then((data) => {
        lookup.location.allLocations = data;
        return delvModel.get(orc, qry);
    }).then((data) => {
        lookup.delivery.allMethods = data;
        callback(null, lookup);
    }, (error) => {
        console.log(error);
        callback(error, null);
    });
}

function getResults(lkp, callback) {
    lkp.trmnotlike = 11;

    searchModel.getResults(orc, lkp, qry).then((results) => {
        callback(null, results);
    }, function(err) {
        callback(err, null);
    });
}

function getDeptsProgs(term, callback) {
    var data = {
        depts: [],
        progs: []
    };
    deptModel.getActiveDepts(orc, qry, term).then((results) => {
        data.depts = results;
        return progModel.get(orc, qry, term);
    }).then((results) => {
        data.progs = results;
        callback(null, data);
    }, function(err) {
        callback(err, null);
    });
}

function getDetails(lkp, callback) {
    detailsModel.getCourseDetails(orc, qry, lkp).then((results) => {
        callback(null, results);
    }).catch((err) => {
        callback(err, null);
    });
}

module.exports = {
    getLookup: getLookup,
    getResults: getResults,
    getDeptsProgs: getDeptsProgs,
    getDetails: getDetails
}
