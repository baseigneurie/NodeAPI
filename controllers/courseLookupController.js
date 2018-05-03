const course_model = require('../models/CourseSearch/courseModel');
const error = require('../models/Error/error');

module.exports = (app) => {
    app.get('/course/lookup', (req, res) => {
        course_model.getLookup().then((data) => {
            res.json(data);
        }).catch((err) => {
            let e = error.createError('Failed Request', err.message);
            res.status(500).json(e);
        });
    });

    app.get('/course/lookup/:term', (req, res) => {
        let term = req.params.term;
        course_model.getDeptsProgs(term).then((data) => {
            res.json(data);
        }).catch((err) => {
            let e = error.createError('Failed Request', err.message);
            res.status(500).json(e);
        });
    });

    app.post('/course/search', (req, res) => {
        let lkp = req.body;
        course_model.getResults(lkp).then((data) => {
            res.json(data);
        }).catch((err) => {
            let e = error.createError('Failed Request', err.message);
            res.status(500).json(e);
        });
    });

    app.post('/course/details', (req, res) => {
        let lkp = req.body;
        course_model.getDetails(lkp).then((data) => {
            res.json(data);
        }).catch((err) => {
            let e = error.createError('Failed Request', err.message);
            res.status(500).json(e);
        });
    });
}
