var mongoose = require('mongoose');
var customers = require('./models/customers');
var conn;

module.exports = {
    init: function (conf, done) {
        mongoose.connect(conf.mongodbUrl);
        conn = mongoose.connection;
        conn.once('open', function () {
            console.log('Connected to mongodb');
            done();
        });
        conn.on('error', function (err) {
            console.log('Mongoose connection error: ' + err);
        });
    },

    disconnect: function () {
        conn.close();
    },

    find: function (tin, done) {
        customers.find({"tin": tin}, function (err, data) {
            if (err)
                return done(err);
            if (data.length == 0)
                return done(new Error('TIN not found'));
            if (data.length > 1)
                return done(new Error('Multiple entries with same TIN'));
            done(null, data[0]);
        });
    },

    add: function (tin, info, done) {
        console.log('Adding customer TIN: ', tin);
        customers.findOne({"tin": tin}, function (err, result) {
            if (err)
                return done(err);
            if (result)
                return done(new Error('TIN already present'));

            customers.create(info, function (err, data) {
                if (err)
                    return done(err);
                done(null, data);
            });
        });
    },

    update: function (tin, info, done) {
        customers.findOne({"tin": tin}, function (err, result) {
            if (err)
                return done(err);
            if (!result)
                return done(new Error('TIN not found'));

            var id = result._id;
            customers.findByIdAndUpdate(id, { $set: info }, { new: true })
            .exec(function (err, data) {
                if (err)
                    return done(err);
                done(null, data);
            });
        });
    },

    get: function (done) {
        customers.find({}, function (err, data) {
            if (err)
                return done(err);
            done(null, data);
        });
    }
};
