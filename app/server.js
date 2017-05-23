var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var conf = require('./config/conf');

var server;

var app = express();

//var db = require('./config/db');
// Connect to mongodb using mongoose ODM
//db.connect({ autoRetry: true });

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files
app.use(express.static('public'));

// routes
require('./routes')(app);

// start the server
if (process.env.port)
    server = app.listen(process.env.port, serverStatus);
else
    server = app.listen(conf.port, conf.hostip, serverStatus);

function serverStatus() {
    console.log('Server running: ', server.address());
};

process.on('SIGINT', function () {
    console.log('Stopping the server');
    server.close();
    //db.disconnect();
    process.exit();
});
