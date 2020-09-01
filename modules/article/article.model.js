const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    articleId: { 
        type: String
    },
    title: { 
        type: String,
        required: true
    },
    description: { 
        type: String,
        required: true
    },
    image: { 
        type: String,
        required: true
    },
    tag: { 
        type: Array,
        required: true
    },
    slug: { 
        type: String,
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updateAt: { 
        type: Date, 
        default: Date.now 
    }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Article', schema);