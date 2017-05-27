var mongoose = require('mongoose');
var customers = require('./models/customers');
var async = require('async');
var conn;

var self = module.exports = {
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

    uniqueID: function (info, done) {
        if (info.tin)
            return done(null, 'tin', info.tin);
        if (info.pan)
            return done(null, 'pan', info.pan);
        if (info.stn)
            return done(null, 'stn', info.stn);
        done(new Error('No TIN/PAN/STN specified'));
    },

    find: function (info, done) {
        self.uniqueID(info, function (err, prop, value) {
            if (err)
                return done(err);

            var query = {};
            query[prop] = value;
            customers.find(query, function (err, data) {
                if (err)
                    return done(err);
                done(null, data, prop);
            });
        });
    },

    add: function (info, done) {
        self.uniqueID(info, function (err, prop, value) {
            if (err)
                return done(err);

            var query = {};
            query[prop] = value;
            console.log('Adding customer: ', query);

            customers.create(info, function (err, data) {
                if (err)
                    return next(err);
                done();
            });
        });
    },

    update: function (info, done) {
        if (!info.tin && !info.pan && !info.stn)
            return done(new Error('No TIN/PAN/STN specified'));

        var old;
        var result;
        async.series([
            function (next) {
                // Fetch older object from the database
                console.log('ID: ', info._id);
                customers.findById(info._id, function (err, data) {
                    if (err)
                        return next(err);
                    old = data;
                    next();
                });
            },
            function (next) {
                if (!info.tin)
                    return next();
                if (old.tin && old.tin === info.tin)
                    return next();
                // TIN newly added to the info
                customers.findOne({"tin": info.tin}, function (err, data) {
                    if (err)
                        return next(err);
                    if (data)
                        return next(new Error("TIN already present !"));
                    next();
                });
            },
            function (next) {
                if (info.tin || !info.pan)
                    return next();
                if (old.pan && old.pan === info.pan)
                    return next();
                // PAN newly added to the info
                customers.findOne({"pan": info.pan}, function (err, data) {
                    if (err)
                        return next(err);
                    if (data)
                        return next(new Error("PAN already present !"));
                    next();
                });
            },
            function (next) {
                if (info.tin || info.pan)
                    return next();
                // info.stn must exist
                if (!info.stn || !old.stn || old.stn !== info.stn)
                    return next(new Error('TIN/PAN/STN not defined'));
                next();
            },
            function (next) {
                customers.findByIdAndUpdate(info._id, { $set: info }, { new: true })
                .exec(function (err, data) {
                    if (err)
                        return done(err);
                    result = data;
                    next();
                });
            }
        ], function (err) {
            if (err)
                return done(err);
            done(null, result);
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
