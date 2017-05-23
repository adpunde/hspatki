var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var async = require('async');
var path = require('path');

var routes = require('./routes');
var db = require('./data/dbFile');
var app;
var server;

var conf = {
    port: 4000,
    hostip: '10.0.0.100',
    dbfile: path.resolve(__dirname + '/data/contacts.json'),
    staticDir: 'public'
};

async.series([
    function (next) {
        // Initialize database
        db.init(conf.dbfile, function (err) {
            if (err) {
                console.log('Error opening file: ' + conf.dbFile);
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
        routes.setRoutes(app, db);
        next();
    },
    function (next) {
        var serverStatus = function () {
            console.log('Server running: ', server.address());
        };

        // start the server
        if (process.env.port)
            server = app.listen(process.env.port, serverStatus);
        else
            server = app.listen(conf.port, conf.hostip, serverStatus);

        // TODO Error handling
        next();
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
        db.disconnect();
        process.exit();
    });
});
