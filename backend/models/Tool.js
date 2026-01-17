const mongoose = require('mongoose');

const toolSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a tool name'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    logo: {
        type: String,
        required: [true, 'Please add a tool logo']
    },
    url: {
        type: String,
        required: [true, 'Please add a tool URL']
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    isEnabled: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Tool', toolSchema);
