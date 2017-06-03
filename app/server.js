var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var async = require('async');
var path = require('path');
var http = require('http');
var https = require('https');
var fs = require('fs');

var routes = require('./routes');
var customerDB = require('./customerDB');
var adminDB = require('./adminDB');

var app;
var server;
var key;
var cert;

var conf = {
    port: 4000,
    hostip: '10.0.0.100',
    staticDir: 'public',
    mongodbUrl: 'mongodb://hspatki:hspatki@ds151451.mlab.com:51451/hspatki',
    //mongodbUrl: 'mongodb://localhost:27017/hspatki'
    https: true,
    httpsPath: __dirname + '/ssl',
    heroku: process.env.PORT ? true : false
};

async.series([
    function (next) {
        if (!conf.https || conf.heroku)
            return next();
        fs.readFile(conf.httpsPath + '/key.pem', function (err, data) {
            if (err)
                return next(err);
            key = data;
            next();
        });
    },
    function (next) {
        if (!conf.https || conf.heroku)
            return next();
        fs.readFile(conf.httpsPath + '/cert.pem', function (err, data) {
            if (err)
                return next(err);
            cert = data;
            next();
        });
    },
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
        if (conf.heroku) {
            server = app.listen(process.env.PORT, serverStatus);
        }
        else if (!conf.https) {
            server = app.listen(conf.port, conf.hostip, serverStatus);
        }
        else {
            server = https.createServer({"key": key, "cert": cert}, app)
                .listen(conf.port, conf.hostip, serverStatus);
        }

        // TODO Error handling
    }
], function (err) {
    if (err) {
        console.log('Exiting server on error: ', err.message);
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
