const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Coupon = require('../models/Coupon');
const asyncHandler = require('express-async-handler');

// @desc    Process a checkout (Plan upgrade or Coin purchase)
// @route   POST /api/transactions/checkout
// @access  Private
const processCheckout = asyncHandler(async (req, res) => {
    const { itemId, itemType, couponCode } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    let amountToPay = 0;
    let coinsToAdd = 0;
    let newPlan = user.plan;
    let description = '';
    let couponUsed = null;

    // Pricing logic
    if (itemType === 'plan_upgrade') {
        // Simple pricing for demo
        amountToPay = itemId === 'pro' ? 19 : (itemId === 'premium' ? 49 : 0);
        newPlan = itemId;
        description = `Upgrade to ${itemId} plan`;
    } else if (itemType === 'add_coins') {
        // e.g., $1 = 100 coins
        coinsToAdd = parseInt(itemId) || 0;
        amountToPay = coinsToAdd / 100;
        description = `Purchase ${coinsToAdd} coins`;
    }

    let bonusCoins = 0;

    // Apply Coupon logic
    if (couponCode) {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
        if (coupon) {
            // Check expiry and limits
            if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
                res.status(400);
                throw new Error('Coupon has expired');
            }
            // Check if user already used this coupon
            const alreadyUsed = await Transaction.findOne({ user: req.user._id, couponUsed: coupon._id });
            if (alreadyUsed) {
                res.status(400);
                throw new Error('You have already used this coupon code');
            }

            if (coupon.usedCount >= coupon.usageLimit) {
                res.status(400);
                throw new Error('Coupon usage limit reached');
            }

            couponUsed = coupon._id;

            if (coupon.type === 'free_pro') {
                if (itemType !== 'plan_upgrade' || itemId !== 'pro') {
                    res.status(400);
                    throw new Error('This coupon is only valid for Pro Plan upgrade');
                }
                amountToPay = 0;

                // Calculate Expiry Date
                const duration = coupon.planDurationValue || 1;
                const unit = coupon.planDurationUnit || 'month';
                const expiry = new Date();

                if (unit === 'year') {
                    expiry.setFullYear(expiry.getFullYear() + duration);
                } else {
                    expiry.setMonth(expiry.getMonth() + duration);
                }

                user.planExpiryDate = expiry;
                description = `Free Pro Plan for ${duration} ${unit}${duration > 1 ? 's' : ''}`;
            } else if (coupon.type === 'coin_discount' && itemType === 'add_coins') {
                amountToPay = amountToPay * (1 - coupon.value / 100);
            } else if (coupon.type === 'coin_off' && itemType === 'add_coins') {
                amountToPay = Math.max(0, amountToPay - coupon.value);
            } else if (coupon.type === 'free_coin' && itemType === 'add_coins') {
                bonusCoins = coupon.value;
            } else if (coupon.type === 'coin_combo' && itemType === 'add_coins') {
                amountToPay = amountToPay * (1 - coupon.value / 100);
                bonusCoins = coupon.bonusValue;
            }

            coupon.usedCount += 1;
            if (coupon.usedCount >= coupon.usageLimit) coupon.isActive = false;
            await coupon.save();
        } else {
            res.status(404);
            throw new Error('Invalid coupon code');
        }
    }

    // Update user coins/plan
    if (itemType === 'plan_upgrade') {
        user.plan = newPlan;
    } else if (itemType === 'add_coins') {
        user.coins += coinsToAdd;
    }

    // Add bonus coins if any
    if (bonusCoins > 0) {
        user.coins += bonusCoins;
    }

    await user.save();

    // Generate Order ID
    const orderId = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create main transaction
    const transaction = await Transaction.create({
        user: user._id,
        type: itemType,
        amount: amountToPay,
        coins: coinsToAdd,
        description,
        couponUsed,
        orderId,
        status: 'completed'
    });

    // Create bonus transaction if any
    if (bonusCoins > 0) {
        const bonusOrderId = `BRD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        await Transaction.create({
            user: user._id,
            type: 'reward',
            amount: 0,
            coins: bonusCoins,
            description: `Bonus coins from coupon: ${couponCode}`,
            orderId: bonusOrderId,
            status: 'completed'
        });
    }

    res.status(201).json({
        message: 'Checkout successful',
        transaction,
        user: {
            plan: user.plan,
            coins: user.coins,
            planExpiryDate: user.planExpiryDate
        }
    });
});

// @desc    Get user transactions
// @route   GET /api/transactions/my
// @access  Private
const getMyTransactions = asyncHandler(async (req, res) => {
    const transactions = await Transaction.find({ user: req.user._id }).sort('-createdAt').populate('couponUsed', 'code type');
    res.json(transactions);
});

// @desc    Get all transactions (Admin)
// @route   GET /api/transactions/admin
// @access  Private/Admin
const getAllTransactions = asyncHandler(async (req, res) => {
    const transactions = await Transaction.find({}).sort('-createdAt').populate('user', 'username email').populate('couponUsed', 'code type');
    res.json(transactions);
});

// @desc    Get transactions for a specific user (Admin)
// @route   GET /api/transactions/admin/user/:id
// @access  Private/Admin
const getUserTransactionsAdmin = asyncHandler(async (req, res) => {
    const transactions = await Transaction.find({ user: req.params.id }).sort('-createdAt').populate('user', 'username email').populate('couponUsed', 'code type');
    res.json(transactions);
});

// @desc    Delete transaction and revert coins (Admin)
// @route   DELETE /api/transactions/admin/:id
// @access  Private/Admin
const deleteTransactionAdmin = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);
    const { revert = false } = req.query;

    if (!transaction) {
        res.status(404);
        throw new Error('Transaction not found');
    }

    if (revert === 'true') {
        const user = await User.findById(transaction.user);
        if (user) {
            // Reversal logic:
            // If coins were ADDED (positive coins in transaction), we SUBTRACT them now.
            // If coins were REMOVED (negative or withdrawal), we ADD them back.
            // In our system, 'add_coins', 'purchase', 'reward' are additions.
            // 'withdrawal' might be a subtraction.

            if (transaction.coins !== 0) {
                user.coins -= transaction.coins;
                await user.save();
            }
        }
    }

    await transaction.deleteOne();
    res.json({ message: 'Transaction deleted successfully' });
});

module.exports = {
    processCheckout,
    getMyTransactions,
    getAllTransactions,
    getUserTransactionsAdmin,
    deleteTransactionAdmin
};
