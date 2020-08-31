const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    userId: { 
        type: String
    },
    fullname: { 
        type: String,
        required: true
    },
    username: { 
        type: String,
        required: true
    },
    password: { 
        type: String,
        required: true
    },
    age: { 
        type: Number,
        required: true
    },
    address: { 
        type: String,
        required: true
    },
    phone: { 
        type: String,
        required: true
    },
    email: { 
        type: String,
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Users', schema);