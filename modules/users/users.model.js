const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    userId: { type: String },
    name: { type: String },
    password: { type: String },
    age: { type: String },
    address: { type: String },
    phone: { type: String },
    role: { type: String },
    createdAt: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Users', schema);