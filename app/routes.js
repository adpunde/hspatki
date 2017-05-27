var async = require('async');

module.exports = {
    setRoutes: function (app, customerDB, adminDB) {
        app.post('/api/admin/import', function (req, res) {
            var array = req.body;
            var dupArray = [];

            async.series([
                function (next) {
                    // Check duplicates within array
                    array.forEach( function (info) {
                        if (info.tin && dupArray.indexOf(info.tin) !== -1)
                            return next(new Error("Multiple rows with same TIN"));
                        dupArray.push(info.tin);
                    });

                    dupArray = [];
                    array.forEach( function (info) {
                        if (!info.tin && info.pan && dupArray.indexOf(info.pan) !== -1)
                            return next(new Error("Multiple rows with no TIN, same PAN"));
                        dupArray.push(info.pan);
                    });

                    dupArray = [];
                    array.forEach( function (info) {
                        if (!info.tin && !info.pan && dupArray.indexOf(info.stn) !== -1)
                            return next(new Error("Multiple rows with no TIN, no PAN, same STN"));
                        dupArray.push(info.stn);
                    });

                    next();
                },
                function (next) {
                    // Check if ID already present in database
                    async.forEachOfSeries(array, function (key, info, done) {
                        customerDB.find(info, function (err, data, prop) {
                            if (err)
                                return done(err);
                            if (data.length !== 0)
                                return done(new Error('Data with ' + prop + ':' + info[prop] + 'already present'));
                            done();
                        });
                    }, function (err) {
                        if (err)
                            return next(err);
                        next();
                    });
                },
                function (next) {
                    // Insert elements into database
                    async.forEachOfSeries(array, function (key, info, done) {
                        customerDB.add(info, function (err, data) {
                            if (err)
                                return done(err);
                            done();
                        });
                    }, function (err) {
                        if (err)
                            return next(err);
                        next();
                    });
                }
            ], function (err) {
                if (err)
                    return res.status(404).send(error.message);
                res.json({"import": true});
            });
        });

        app.get('/api/customers/get', function (req, res) {
            console.log('GET customer info');
            var info = req.query;
            customerDB.find(info, function (err, data, prop) {
                if (err)
                    return res.status(404).send(err.message);
                if (data.length == 0)
                    return res.status(404)
                        .send(new Error(prop + ':' + info[prop] + 'not found'));
                if (data.length > 1)
                    return res.status(404)
                        .send(new Error('Multiple entries with same ' + prop));
                res.json(data[0]);
            });
        });

        app.post('/api/customers/add', function (req, res) {
            console.log('POST add customer info');
            var info = req.body;
            customerDB.add(info, function (err, data) {
                if (err) {
                    return res.status(404).send(err.message);
                }
                res.json({'add': true});
            });
        });

        app.post('/api/customers/update', function (req, res) {
            console.log('POST update customer info');
            var info = req.body;
            customerDB.update(info, function (err, data) {
                if (err) {
                    return res.status(404).send(err.message);
                }
                res.json({'update': true});
            });
        });

        app.post('/api/admin/login', function (req, res) {
            var data = req.body;
            if (adminDB.validateAdmin(data)) {
                return res.json(data.username);
            }
            res.status(404).send('Invalid credentials');
        });

        app.get('/api/admin/download', function (req, res) {
            console.log('GET download customer info');
            customerDB.get(function (err, data) {
                if (err)
                    return res.status(404).send(err.message);

                var array = [];
                for (var i = 0; i < data.length; i++) {
                    array.push(data[i]);
                }

                var str = JSON.stringify(array, null, 4);
                res.setHeader('Content-disposition', 'attachment; filename=contacts.json');
                res.setHeader('Content-type', 'application/json');
                res.end(str);
            });
        });

        // Stream a file as an attachment
        // var fileName = db.getFileName();
        // res.download(fileName);
    }
};
