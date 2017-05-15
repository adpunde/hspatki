var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');

var app = express();

//var db = require('./config/db');
//var conf = require('./config/conf');

// Connect to mongodb using mongoose ODM
//db.connect({ autoRetry: true });

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files
app.use(express.static('public'));

app.set('port', (process.env.PORT || 4000));

// routes
require('./app/routes')(app);

// start the server
var server = app.listen(app.get('port'), function () {
    console.log('Server running');
});

// process.on('SIGINT', function () {
//     console.log('Stoppping the server');
//     server.close();
//     //db.disconnect();
//     process.exit();
// });

// export app
module.exports = app;
