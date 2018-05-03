let express = require('express');
let app = express();
let lookupController = require('./controllers/courseLookupController');
let userMgmtController = require('./controllers/UserManagementController');
let error = require('./models/Error/error');
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Load Controllers
lookupController(app);
userMgmtController(app);


// TODO Figure out redirct/reuslt for no specified endpoint
app.get('*', (req, res) => {
    res.status(404).json(error.createError("No endpoint", "Could not find your destination", 404));
});

app.listen(3000);
console.log('Now listening to port 3000');

// For unit testing
module.exports = app;