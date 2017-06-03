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

    uniqueTin: function (info, done) {
        // No two entries can have same TIN
        customers.find({'tin': info.tin}, function (err, data) {
            if (err)
                return done(err);
            if (data.length != 0)
                return done(new Error('TIN already present'));
            done(null, data);
        });
    },

    uniquePan: function (info, done) {
        // If there are multiple entries with same PAN
        // both must have TIN present
        customers.find({'pan': info.pan}, function (err, data) {
            if (err)
                return done(err);
            if (data.length > 0) {
                if (!data[0].tin || !info.tin)
                    return done(new Error('PAN already present'));
            }
            done(null, data);
        });
    },

    uniqueStn: function (info, done) {
        // If there are multiple entries with same STN
        // both must have TIN present
        customers.find({'stn': info.stn}, function (err, data) {
            if (err)
                return done(err);
            if (data.length > 0) {
                if (!data[0].tin || !info.tin)
                    return done(new Error('STN already present'));
            }
            done(null, data);
        });
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

    validateAdd: function (info, done) {
        async.series([
            function (next) {
                self.uniqueID(info, function (err, prop, value) {
                    if (err)
                        return next(err);
                    next();
                });
            },
            function (next) {
                if (!info.tin)
                    return next();
                self.uniqueTin(info, function (err, data) {
                    if (err)
                        return next(err);
                    next();
                });
            },
            function (next) {
                if (!info.pan)
                    return next();
                self.uniquePan(info, function (err, data) {
                    if (err)
                        return next(err);
                    next();
                });
            },
            function (next) {
                if (!info.stn)
                    return next();
                self.uniqueStn(info, function (err, data) {
                    if (err)
                        return next(err);
                    next();
                });
            }
        ], function (err) {
            if (err)
                return done(err);
            done();
        });
    },

    add: function (info, done) {
        self.uniqueID(info, function (err, prop, value) {
            if (err)
                return done(err);

            var query = {};
            query[prop] = value;
            console.log('Adding customer: ' + prop +':' + value);

            customers.create(info, function (err, data) {
                if (err)
                    return done(err);
                console.log('ID: ', data._id);
                done(null, data);
            });
        });
    },

    update: function (info, done) {
        var old;
        var result;
        var newProp;

        // Fetch old object. Check that the new IDs added are unique.
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
                // TIN is not updated or not present
                if (old.tin || !info.tin)
                    return next();
                // TIN is newly added.
                self.uniqueTin(info, function (err, data) {
                    if (err)
                        return next(err);
                    next();
                });
            },
            function (next) {
                // PAN is not updated or not present
                if (old.pan || !info.pan)
                    return next();
                // PAN is newly added.
                self.uniquePan(info, function (err, data) {
                    if (err)
                        return next(err);
                    next();
                });
            },
            function (next) {
                // STN is not updated or not present
                if (old.stn || !info.stn)
                    return next();
                // STN is newly added
                self.uniqueStn(info, function (err, data) {
                    if (err)
                        return next(err);
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
