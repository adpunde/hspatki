var fs = require('fs');
var fileName;
var map;

module.exports = {
    init: function (dbFile, done) {
        fileName = dbFile;
        fs.readFile(fileName, 'utf-8', function (err, data) {
            if (err)
                return done(err);
            map = JSON.parse(data);
            done();
        });
    },
    disconnect: function () {
        map = {};
    },
    find: function (key, done) {
        if (!key || !map[key]) {
            return done(new Error('Invalid key specified'))
        }
        done(null, map[key]);
    },
    update: function (key, value, done) {
        if (!key || !map[key]) {
            return done(new Error('Invalid key specified'))
        }

        map[key] = value;
        try {
            fs.writeFileSync(fileName, JSON.stringify(map, null, 4));
            return done(null, key);
        } catch (error) {
            console.log('Error writing file ' + fileName + ': ', error);
            return done(error);
        }
    }
};
