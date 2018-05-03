const account_model = require('../models/UserManagement/accountModel');
const questions_model = require('../models/UserManagement/questionsModel');
const admin_model = require('../models/UserManagement/adminModel');
const error = require('../models/Error/error');

module.exports = (app) => {
    // Return Secret Questions for forms
    app.get('/user/questions', (req, res) => {
        questions_model.getSecretQuestions().then((data) => {
            res.json(data)
        }).catch((err) => {
            let e = error.createError('Request Error', err.message);
            res.status(500).json(e);
        });
    });

    // Retrieve user ID/Username
    app.post('/user/account/lookup', (req, res) => {
        account_model.getAccountData(req.body).then((data) => {
            res.json(data);
        }).catch((err) => {
            let e = error.createError('Lookup Error', err.message);
            res.status(500).json(e);
        });
    });

    // Create new account
    app.post('/user/account/create', (req, res) => {
        let body = req.body;
        let resp = {};

        account_model.insertFirstLogin(req.body).then((data) => {
            if (!data.username) throw new Error(`Couldn't verify user`);
            
            resp = data;
            return account_model.setupPassword({ username: data.username, pass: body.pass.new });
        }).then((result) => {
            if (!result) throw new Error(`Couldn't update Active Directory password`);

            res.json(resp);
        }).catch((err) => {
            let e = error.createError('Setup Error', err.message);
            res.status(500).json(e);
        });
    });

    //Find AD user
    app.post('/user/ad_find', (req, res) => {
        let body = req.body;
        account_model.findADUser(body).then((data) => {
            res.json(data);
        }).catch((err) => {
            let e = error.createError('Active Directory Error', err.message);
            res.status(500).json(e);
        });
    });

    //Reset AD Password
    app.post('/user/pass/reset', (req, res) => {
        let body = req.body;
        account_model.resetPassword(body).then((data) => {
            res.json(data);
        }).catch((err) => {
            let e = error.createError('Active Directory Error', err.message);
            res.status(500).json(e);
        });
    });

    //***********/
    // ADMIN Options

    // ADMIN verify login
    app.post('/admin/login', (req, res) => {
        let body = req.body;
        if (!body.user || !body.pass) {
            res.status(500).json(error.createError('Input Error', 'Invalid Credentials Provided'));
            return;
        }
        admin_model.verifyLogin(body).then((resp) => {
            res.json(resp);
        }).catch((err) => {
            res.status(500).json(err);
        });
    });

}
