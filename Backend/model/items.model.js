const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let ItemSchema = new Schema({
    itemName: { type: String, maxlength: 40, required: true },
    description: {type: String, maxlength: 400, default:"" },
    category: { type: String, maxlength: 40, required: true },
    price: { type: String, required: true },
    image: [{type: String, required: false }],
    createdOn: { type: Date, default: Date.now, required: true },
    averageRating: { type: String, default: "0", required: true},
    totalRatings: { type: Number, default: 0, required: true},
    status: { type: Boolean, default:true, required: true }
});

module.exports = mongoose.model('Items', ItemSchema);