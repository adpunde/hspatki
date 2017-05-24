var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var customerSchema = new Schema({
    tin: { type: String, required: true, unique: true },
    dealerName: { type: String },
    pan: { type: String },
    gstin: { type: String },
    arn: { type: String },
    personName: { type: String },
    landline1: { type: String },
    landline2: { type: String },
    mobile1: { type: String },
    mobile2: { type: String },
    email1: { type: String },
    email2: { type: String },
    address: { type: String },
}, {
    timestamps: true
});

var Customers = mongoose.model('customers', customerSchema, 'customers');

module.exports = Customers;
