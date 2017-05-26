var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var placeSchema = new Schema({
    name: { type: String },
    address: { type: String },
    state: { type: String },
    pincode: { type: String }
});

var goodSchema = new Schema({
    name: { type: String },
    hsn: { type: String },
});

var serviceSchema = new Schema({
    name: { type: String },
    sac: { type: String },
});

var customerSchema = new Schema({
    tin: { type: String },
    pan: { type: String },
    stn: { type: String },
    scheme: { type: String },
    gstin: { type: String },
    arn: { type: String },
    name: { type: String },
    address: { type: String },
    state: { type: String },
    pincode: { type: String },
    personName: { type: String },
    designation: { type: String },
    mobile: { type: String },
    email: { type: String },
    goods: [goodSchema],
    services: [serviceSchema],
    places: [placeSchema]
}, {
    timestamps: true
});

var Customers = mongoose.model('customers', customerSchema, 'customers');

module.exports = Customers;
