const mongoose = require('mongoose');

const promptSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a prompt title'],
        unique: true
    },
    prompt: {
        type: String,
        required: [true, 'Please add the prompt text']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    image: {
        type: String,
        required: [true, 'Please add an example image']
    },
    platform: {
        type: String,
        default: 'Generic'
    },
    tags: {
        type: [String],
        default: []
    },
    category: {
        type: String,
        default: 'AI Image'
    },
    isEnabled: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Prompt', promptSchema);
