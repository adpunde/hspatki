module.exports = {
    findCustomerInfo: function (db, tin, done) {
        db.find(tin, done);
    },

    updateCustomerInfo: function (db, info, done) {
        db.update(info.tin, info, done);
    },

    getAllCustomerInfo: function (db, done) {
        db.get(done);
    }
};
