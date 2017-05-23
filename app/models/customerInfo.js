var fs = require('fs');
var map = require('./contacts');
var contactMap = map.contacts;
var updatedContactMap = Object.assign({}, contactMap);
var updatedFileName = './newContacts.json';

exports.find = function (tin, next) {
    if (tin && contactMap[tin]) {
        next(null, contactMap[tin]);
    } else {
        next(new Error('TIN not found'));
    }
};

exports.update = function (info, next) {
    var tin = info.tin;

    updatedContactMap[tin] = info;
    try {
        fs.writeFileSync(updatedFileName,
            JSON.stringify(updatedContactMap, null, 4));
        return next(null, tin);
    } catch (error) {
        console.log('Error writing file ' + updatedFileName + ':', error);
        return next(error);
    }
};
