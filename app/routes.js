module.exports = {
    setRoutes: function (app, customerDB, adminDB) {
        app.get('/api/customers', function (req, res) {
            console.log('GET customer info');
            customerDB.find(req.query.prop, req.query.value, function (err, data) {
                if (err) {
                    return res.status(404).send(err.message);
                }
                res.json(data);
            });
        });

        app.post('/api/customers/add', function (req, res) {
            console.log('POST add customer info');
            var info = req.body;
            customerDB.add(info, function (err, data) {
                if (err) {
                    return res.status(404).send(err.message);
                }
                res.json(data.tin);
            });
        });

        app.post('/api/customers/update', function (req, res) {
            console.log('POST update customer info');
            var info = req.body;
            customerDB.update(info, function (err, data) {
                if (err) {
                    return res.status(404).send(err.message);
                }
                res.json(data.tin);
            });
        });

        app.post('/api/adminLogin', function (req, res) {
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
