
var courseModel = require('../models/CourseSearch/courseModel');
var error = require('../models/Error/error');

var Course = courseModel.schema;
var obj = courseModel.model;

module.exports = (app) => {

    app.get('/course/lookup', (req, res) => {
        courseModel.getLookup((err, lookup) => {
            if (err) {
                res.json(error.sendError("Data Error", err.message, -1));
            }

            res.json(lookup);
        });
    });

    app.get('/course/lookup/:term', (req, res) => {
        var term = req.params.term;
        courseModel.getDeptsProgs(term, (err, results) => {
            if (err) {
                res.json(error.sendError("Data Error", err.message, -1));
                return;
            }

            if (results.length === 0) {
                res.json(error.sendError("Empty Results", "No results were found for this query. Please check it and try it again.", 0));
                return;
            }

            res.json(results);
        });
    });

    app.post('/course/search', (req, res) => {
        let lkp = req.body;
        courseModel.getResults(lkp, (err, results) => {
            if (err) {
                res.json(error.sendError("Data Error", err.message, -1));
                return;
            }

            if (results.length === 0) {
                res.json(error.sendError("Empty Results", "No results were found for this query. Please check it and try it again.", 0));
                return;
            }

            res.json(results);
        });
    });

    app.post('/course/details', (req, res) => {
        let lkp = req.body;
        courseModel.getDetails(lkp, (err, results) => {
            if (err) {
                res.json(error.sendError("Data Error", err.message, -1));
                return;
            }

            if (results.length === 0) {
                res.json(error.sendError("Empty Results", "No details were found. Please check and try again.", 0));
                return;
            }

            res.json(results);
        });
    });
}
