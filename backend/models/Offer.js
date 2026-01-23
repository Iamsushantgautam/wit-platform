const mongoose = require('mongoose');

const offerSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    code: {
        type: String,
        required: false, // Not all offers need a code (might be a direct link deal)
    },
    discount: {
        type: String,
        required: false,
    },
    expires: {
        type: String, // Storing as string for flexibility ("Dec 31" or "Limited Time")
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    link: {
        type: String,
        required: false,
    },
    tag: {
        type: String,
        default: 'Deal'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    clicks: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Offer', offerSchema);
