var customerInfo = require('./models/customerInfo');

module.exports = {
    setRoutes: function (app, db) {
        app.get('/api/customers', function (req, res) {
            var tin = req.query.tin;
            customerInfo.findCustomerInfo(db, tin, function (err, data) {
                if (err)
                    return res.status(404).send(err.message);
                res.json(data);
            });
        });

        app.post('/api/customers/update', function (req, res) {
            var info = req.body;
            customerInfo.update(db, info, function (err, data) {
                if (err)
                    return res.status(404).send(err.message);
                res.json(data);
            });
        });
    }
};
