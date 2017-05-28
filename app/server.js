var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var async = require('async');
var path = require('path');
var http = require('http');

var routes = require('./routes');
var customerDB = require('./customerDB');
var adminDB = require('./adminDB');

var app;
var server;

var conf = {
    port: 4000,
    hostip: '10.0.0.100',
    //dbfile: path.resolve(__dirname + '/data/contacts.json'),
    staticDir: 'public',
    mongodbUrl: 'mongodb://hspatki:hspatki@ds151451.mlab.com:51451/hspatki'
    // mongodbUrl: 'mongodb://localhost:27017/hspatki'
};

async.series([
    function (next) {
        // Initialize database
        customerDB.init(conf, function (err) {
            if (err) {
                console.log(err.message);
                return next(err);
            }
            next();
        });
    },
    function (next) {
        app = express();
        // parse application/json
        app.use(bodyParser.json());
        // parse application/x-www-form-urlencoded
        app.use(bodyParser.urlencoded({ extended: true }));
        // serve static files
        app.use(express.static(conf.staticDir));
        next();
    },
    function (next) {
        // routes
        routes.setRoutes(app, customerDB, adminDB);
        next();
    },
    function (next) {
        var serverStatus = function () {
            console.log('Server running: ', server.address());
            next();
        };

        // start the server
        if (process.env.PORT)
            server = app.listen(process.env.PORT, serverStatus);
        else
            server = app.listen(conf.port, conf.hostip, serverStatus);

        // TODO Error handling
    }
], function (err) {
    if (err) {
        console.log('Exiting server on error');
        process.exit();
        return;
    }

    process.on('SIGINT', function () {
        console.log('Stopping the server');
        server.close();
        customerDB.disconnect();
        process.exit();
    });
});
