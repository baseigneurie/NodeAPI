const term_model = require('./termModel');
const dept_model = require('./deptModel');
const prog_model = require('./progModel');
const loc_model = require('./locationModel');
const delv_model = require('./deliveryModel');
const search_model = require('./searchModel');
const details_model = require('./detailsModel');

const lookup = {
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

function getLookup() {
    return new Promise((resolve, reject) => {
        let t = "";
        term_model.getTerms().then((data) => {
            lookup.term.allTerms = data;

            if (lookup.term.selected && lookup.term.selected.TermCode) {
                t = lookup.term.selected.TermCode;
            } else if (lookup.term.allTerms.length > 0) {
                lookup.term.allTerms.forEach((term) => {
                    if (term.Default === 'Y') t = term.TermCode;
                })
            } else {
                throw new Error('No term provided for programs');
            }
            return dept_model.getActiveDepts(t);
        }).then((data) => {
            lookup.department.allDepartments = data;
            return prog_model.getProgs(t);
        }).then((data) => {
            lookup.program.allPrograms = data;
            return loc_model.getLocations();
        }).then((data) => {
            lookup.location.allLocations = data;
            return delv_model.getDelivery();
        }).then((data) => {
            lookup.delivery.allMethods = data;
            resolve(lookup);
        }).catch((err) => {
            reject(err);
        });
    });
}

function getResults(lkp) {
    return new Promise((resolve, reject) => {
        if (lkp.term.selected) {
            let term = lkp.term.selected;
            lkp.trmlike = !term.Like ? '' : term.Like;
            lkp.trmnotlike = !term.NotLike ? '' : term.NotLike;

            search_model.getResults(lkp).then((results) => {
                resolve(results);
            }).catch((err) => {
                reject(err);
            });
        } else {
            search_model.getResultsByCourse(lkp).then((results) => {
                resolve(results);
            }).catch((err) => {
                reject(err);
            });
        }
    });
}

function getDeptsProgs(term) {
    let data = {
        depts: [],
        progs: []
    };
    return new Promise((resolve, reject) => {
        dept_model.getActiveDepts(term).then((results) => {
            data.depts = results;
            return prog_model.getProgs(term);
        }).then((results) => {
            data.progs = results;
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
}

function getDetails(lkp) {
    return new Promise((resolve, reject) => {
        details_model.getCourseDetails(lkp).then((results) => {
            resolve(results);
        }).catch((err) => {
            reject(err);
        });
    });
}

module.exports = {
    getLookup: getLookup,
    getResults: getResults,
    getDeptsProgs: getDeptsProgs,
    getDetails: getDetails
}
