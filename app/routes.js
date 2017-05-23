var path = require('path');
var url = require('url');
var fs = require('fs');
var async = require('async');

var customerInfo = require('./models/customerInfo');

// var fooditem = require('./models/fooditem');
// var categories = require('./models/categories');
// var menuItems = require('./models/menuItems');

module.exports = function (app) {
    app.get('/api/customers', function (req, res) {
        customerInfo.find(req.query.tin, function (err, data) {
            if (err)
                return res.status(404).send(err.message);
            res.json(data);
        });
    });

    app.post('/api/customers/update', function (req, res) {
        var info = req.body;
        customerInfo.update(info, function (err, data) {
            if (err)
                return res.status(404).send(err.message);
            res.json(data);
        });
    });
        //res.json(obj);

    //     fooditem.find(function (err, items) {
    //         if (err)
    //             return res.send(err);
    //         res.json(items);
    //     });
    // API GET route
    // app.get('/api/items', function (req, res) {
    //     fooditem.find(function (err, items) {
    //         if (err)
    //             return res.send(err);
    //         res.json(items);
    //     });
    // });
    // // API POST route
    // app.post('/api/additem', function(req, res) {
    //     fooditem.add(req.body.name, req.body.category, function (err, item) {
    //         if (err)
    //             return res.send(err);
    //         res.writeHead(200, {'Content-Type': 'text/html'});
    //         res.end('ID: ' + item._id);
    //     });
    // });
};
