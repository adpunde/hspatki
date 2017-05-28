var async = require('async');

module.exports = {
    setRoutes: function (app, customerDB, adminDB) {
        app.get('/api/customers/get', function (req, res) {
            console.log('GET customer info');
            var info = req.query;
            customerDB.find(info, function (err, data, prop) {
                if (err)
                    return res.status(500).send(err.message);
                if (data.length === 0)
                    return res.status(500).send(prop + ':' + info[prop] + ' not found');
                if (data.length > 1)
                    return res.status(500).send('Multiple entries with same ' + prop);
                res.json(data[0]);
            });
        });

        app.post('/api/customers/add', function (req, res) {
            console.log('POST add customer info');
            var info = req.body;
            customerDB.add(info, function (err, data) {
                if (err) {
                    return res.status(500).send(err.message);
                }
                res.json({'add': true});
            });
        });

        app.post('/api/customers/update', function (req, res) {
            console.log('POST update customer info');
            var info = req.body;
            customerDB.update(info, function (err, data) {
                if (err) {
                    return res.status(500).send(err.message);
                }
                res.json({'update': true});
            });
        });

        app.post('/api/admin/login', function (req, res) {
            var data = req.body;
            if (adminDB.validateAdmin(data)) {
                return res.json({'login': 'true'});
            }
            res.status(401).send('Invalid credentials');
        });

        app.get('/api/admin/download', function (req, res) {
            console.log('GET download customer info');
            customerDB.get(function (err, data) {
                if (err)
                    return res.status(500).send(err.message);

                var str = JSON.stringify(data);
                res.setHeader('Content-disposition', 'attachment; filename=contacts.json');
                res.setHeader('Content-type', 'application/json');
                res.end(str);
            });
        });

        app.post('/api/admin/delete', function (req, res) {
            console.log('DELETE customer info');
            customerDB.clean(function (err) {
                if (err)
                    return res.status(500).send(err.message);
                res.json({'delete': true});
            });
        });

        // Stream a file as an attachment
        // var fileName = db.getFileName();
        // res.download(fileName);
        app.post('/api/admin/import', function (req, res) {
            var array = req.body;
            var dupArray = [];

            async.series([
                function (next) {
                    // Check duplicates within array
                    var i, info;
                    for (i = 0; i < array.length; i++) {
                        info = array[i];
                        if (info.tin && dupArray.indexOf(info.tin) !== -1)
                            return next(new Error("Multiple rows with same TIN: " + info.tin));
                        dupArray.push(info.tin);
                    }

                    dupArray = [];
                    for (i = 0; i < array.length; i++) {
                        info = array[i];
                        if (!info.tin && info.pan && dupArray.indexOf(info.pan) !== -1)
                            return next(new Error("Multiple rows with no TIN, same PAN"));
                        dupArray.push(info.pan);
                    }

                    dupArray = [];
                    for (i = 0; i < array.length; i++) {
                        info = array[i];
                        if (!info.tin && !info.pan && dupArray.indexOf(info.stn) !== -1)
                            return next(new Error("Multiple rows with no TIN, no PAN, same STN"));
                        dupArray.push(info.stn);
                    }

                    next();
                },
                function (next) {
                    // Check if ID already present in database
                    async.forEachOfSeries(array, function (info, key, done) {
                        console.log(key, info);
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
                    async.forEachOfSeries(array, function (info, key, done) {
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
                    return res.status(500).send(err.message);
                res.json({"import": true});
            });
        });
    }
}
