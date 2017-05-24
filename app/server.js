var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var async = require('async');
var path = require('path');

var routes = require('./routes');
var customerDB = require('./customerDB');
var adminDB = require('./adminDB');
var contacts = require('./data/contacts.js');
var favicon = require('express-favicon');

var app;
var server;

var conf = {
    port: 4000,
    hostip: '10.0.0.100',
    dbfile: path.resolve(__dirname + '/data/contacts.json'),
    staticDir: 'public',
    mongodbUrl: 'mongodb://hspatki:hspatki@ds151451.mlab.com:51451/hspatki'
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
        app.use(favicon('favicon.ico'));
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
    },
    function (next) {
        // Load initial contacts to database
        async.forEachOfSeries(contacts, function (value, key, done) {
            customerDB.add(key, value, function (err, data) {
                // if (err)
                //     console.log('Error adding ' + key + ': ' + err.message);
                // else
                //     console.log('Added successfully ' + key);
                done();
            }, function (err) {
                next();
            });
        });
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
