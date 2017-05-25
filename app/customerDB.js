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
        //console.log(customers.collection.name);
    },

    disconnect: function () {
        conn.close();
    },

    find: function (prop, value, done) {
        if (prop !== 'tin' && prop !== 'pan' && prop !== 'stn')
            return done(new Error('Invalid property supplied: ' + prop));

        var query = {};
        query[prop] = value;

        customers.find(query, function (err, data) {
            if (err)
                return done(err);
            if (data.length == 0)
                return done(new Error(prop + ' not found'));
            if (data.length > 1)
                return done(new Error('Multiple entries with same ' + prop));
            done(null, data[0]);
        });
    },

    add: function (info, done) {
        if (!info.tin && !info.pan && !info.stn)
            return done(new Error('No TIN/PAN/STN specified'));

        console.log('Adding customer: ', info);
        customers.findOne({"tin": info.tin}, function (err, result) {
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

    update: function (info, done) {
        if (!info.tin && !info.pan && !info.stn)
            return done(new Error('No TIN/PAN/STN specified'));

        customers.findOne({"tin": info.tin}, function (err, result) {
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
    },

    clean: function (done) {
        conn.collection(customers.collection.name).drop(function (err) {
            return done(err);
        });
    }
};
