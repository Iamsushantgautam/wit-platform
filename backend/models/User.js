const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please add a username'],
        unique: true,
        trim: true,
        minLength: [3, 'Username must be at least 3 characters']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minLength: [6, 'Password must be at least 6 characters']
    },
    role: {
        type: String,
        enum: ['user', 'master_admin'],
        default: 'user'
    },
    plan: {
        type: String,
        enum: ['free', 'pro', 'premium'],
        default: 'free'
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    coins: {
        type: Number,
        default: 0
    },
    planExpiryDate: {
        type: Date
    },
    unlockedOffers: [{
        type: Object
    }],
    unlockedPrompts: [{
        type: Object
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
