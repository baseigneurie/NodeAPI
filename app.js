var express = require('express');
var app = express();
var lookupController = require('./controllers/courseLookupController');
var error = require('./models/Error/error');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Load Controllers
lookupController(app);


// TODO Figure out redirct/reuslt for no specified endpoint
app.get('/', (req, res) => {
    res.json(error.sendError("No endpoint", "Could not find your destination", 404));
});

app.listen(3000);
console.log('Now listening to port 3000');
