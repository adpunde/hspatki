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

    find: function (prop, value, done) {
        if (prop !== 'tin' && prop !== 'pan' && prop !== 'stn')
            return done(new Error('Invalid property supplied: ' + prop));

        var query = {};
        query[prop] = value;

        // Returns array of items
        customers.find(query, function (err, data) {
            if (err)
                    return done(err);
            if (data.length === 0)
                return done(new Error(prop + ' not found'));
            if (data.length > 1)
                return done(new Error('Multiple entries with same ' + prop));
            done(null, data[0]);
        });
    },

    add: function (info, done) {
        if (!info.tin && !info.pan && !info.stn)
            return done(new Error('No TIN/PAN/STN specified'));

        // User provided tin/pan/stn should be unique
        var result;
        async.series([
            function (next) {
                if (!info.tin)
                    return next();
                self.find('tin', info.tin, function (err, data) {
                    if (err)
                        return next(err);
                    if (data)
                        return next(new Error('TIN already present'));
                    next();
                });
            },
            function (next) {
                // If TIN is validated, no need to validate PAN
                if (info.tin || !info.pan)
                    return next();
                self.find('pan', info.pan, function (err, data) {
                    if (err)
                        return next(err);
                    if (data)
                        return next(new Error(
                            'PAN already present. Use TIN as ID.'));
                    next();
                });
            },
            function (next) {
                // If TIN or PAN is validated, no need to validate STN
                if (info.tin || info.pan || !info.pan)
                    return next();
                self.find('stn', info.stn, function (err, data) {
                    if (err)
                        return next(err);
                    if (data)
                        return next(new Error(
                            'STN already present. Use TIN as ID.'));
                    next();
                });
            },
            function (next) {
                console.log('Adding customer: ', info);
                customers.create(info, function (err, data) {
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

    update: function (info, done) {
        if (!info.tin && !info.pan && !info.stn)
            return done(new Error('No TIN/PAN/STN specified'));

        var old;
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
            }
        ], function (err) {
            if (err)
                return done(err);
            done(null, info);
        });

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
