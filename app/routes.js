var path = require('path');
var url = require('url');
var fs = require('fs');
var async = require('async');

// var fooditem = require('./models/fooditem');
// var categories = require('./models/categories');
// var menuItems = require('./models/menuItems');

module.exports = function (app) {
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
