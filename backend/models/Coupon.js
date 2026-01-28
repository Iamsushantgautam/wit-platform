const mongoose = require('mongoose');

const couponSchema = mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    type: {
        type: String,
        enum: ['free_pro', 'coin_discount', 'coin_off', 'free_coin', 'coin_combo'],
        required: true
    },
    value: {
        type: Number, // Percentage for discount, Amount for flat off, etc.
        required: true
    },
    bonusValue: {
        type: Number, // For free coins in combination with discount
        default: 0
    },
    planDurationUnit: {
        type: String,
        enum: ['month', 'year'],
        default: 'month'
    },
    planDurationValue: {
        type: Number,
        default: 1
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usageLimit: {
        type: Number,
        default: 1 // How many times it can be used total
    },
    usedCount: {
        type: Number,
        default: 0
    },
    expiryDate: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Coupon', couponSchema);
