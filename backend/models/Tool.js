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
        required: false // Changed to false to allow Icon instead
    },
    icon: {
        type: String,
        required: false
    },
    url: {
        type: String,
        required: [true, 'Please add a tool URL']
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    type: {
        type: String,
        enum: ['tool', 'prompt'],
        default: 'tool'
    },
    prompt: {
        type: String,
        default: ''
    },
    promptDescription: {
        type: String,
        default: 'Image Generation Prompt'
    },
    platform: {
        type: String,
        default: 'Generic'
    },
    tags: {
        type: [String],
        default: []
    },
    isEnabled: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Tool', toolSchema);
