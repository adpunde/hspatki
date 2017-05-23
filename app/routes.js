var customerInfo = require('./models/customerInfo');
var adminInfo = require('./models/adminInfo');
var mime = require('mime');
var fs = require('fs');

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
            customerInfo.updateCustomerInfo(db, info, function (err, data) {
                if (err)
                    return res.status(404).send(err.message);
                res.json(data);
            });
        });

        app.post('/api/adminLogin', function (req, res) {
            var data = req.body;
            if (adminInfo.validateAdmin(data)) {
                return res.json(data.username);
            }
            res.status(404).send(new Error('Invalid credentials'));
        });

        app.get('/api/admin/download', function (req, res) {
            // customerInfo.getAllCustomerInfo(db, function (err, data) {
            //     if (err)
            //         return res.status(404).send(err.message);
            //     res.json(data);
            // });
            var fileName = db.getFileName();
            // console.log('Sending file: ', fileName);
            // var mimetype = mime.lookup(fileName);
            // console.log('mimetype: ', mimetype);
            // res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
            // res.setHeader('Content-type', mimetype);
            // var fileStream = fs.createReadStream(fileName);
            // fileStream.pipe(res);
            res.download(fileName);
        });
    }
};
