const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true 
    },
    originalContent: {
        type: String,
        required: true
    },
    articleUrl: {
        type: String,
        required: true
    },
    publishedDate: {
        type: String
    },
    // Phase 2 Fields 
    updatedContent: {
        type: String,
        default: null
    },
    referenceLinks: [String],
    status: {
        type: String,
        enum: ['pending', 'processed'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Article', ArticleSchema);