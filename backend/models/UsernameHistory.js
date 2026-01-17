const mongoose = require('mongoose');

const usernameHistorySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    oldUsername: {
        type: String,
        required: true,
        index: true
    },
    newUsername: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('UsernameHistory', usernameHistorySchema);
