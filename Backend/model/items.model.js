const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let ItemSchema = new Schema({
    itemName: { type: String, maxlength: 40, required: true },
    category: { type: String, maxlength: 40, required: true },
    price: { type: Number, required: true },
    createdOn: { type: Date, default: Date.now, required: true },
    status: { type: Boolean, default:true, required: true }
});

module.exports = mongoose.model('Items', ItemSchema);