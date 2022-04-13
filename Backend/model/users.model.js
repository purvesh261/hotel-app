const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, maxlength: 200, required: true},
    admin: {type: Boolean, required: true},
    createdOn: {type: Date, default: Date.now, required: true},
});

module.exports = mongoose.model('User', userSchema);