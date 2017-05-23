var fs = require('fs');
var map = require('./contacts');
var contactMap = map.contacts;
var updatedContactMap = Object.assign({}, contactMap);
var updatedFileName = './newContacts.json';
var init = false;

module.exports = {
    findCustomerInfo: function (db, tin, done) {
        db.find(tin, done);
    },

    updateCustomerInfo: function (info, done) {
        db.update(info.tin, info, done);
    }
};
