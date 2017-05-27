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
        var old;
        var result;
        var newProp;

        async.series([
            function (next) {
                self.uniqueID(info, function (err, prop, value) {
                    if (err)
                        return next(err);
                    newProp = prop;
                    next();
                });
            },
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
                if (old[newProp]) {
                    if (old[newProp] !== info[newProp])
                        return next(new Error("Same DB ID but different customer ID"));
                    return next();
                }

                var query = {};
                query[newProp] = info[newProp];
                customers.findOne(query, function (err, data) {
                    if (err)
                        return next(err);
                    if (data)
                        return next(new Error("Another entry with same " + newProp + " already present !"));
                    next();
                });
            },
            function (next) {
                customers.findByIdAndUpdate(info._id, {$set: info}, {new: true})
                .exec(function (err, data) {
                    if (err)
                        return next(err);
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
