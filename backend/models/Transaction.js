const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['purchase', 'transfer', 'withdrawal', 'reward', 'plan_upgrade', 'add_coins'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    coins: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: 'Rs.'
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'completed'
    },
    description: {
        type: String
    },
    couponUsed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon'
    },
    orderId: {
        type: String,
        unique: true,
        sparse: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
