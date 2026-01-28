const Coupon = require('../models/Coupon');
const Transaction = require('../models/Transaction');
const asyncHandler = require('express-async-handler');

// @desc    Generate a new coupon (Admin only)
// @route   POST /api/coupons
// @access  Private/Admin
const generateCoupon = asyncHandler(async (req, res) => {
    const { code, type, value, bonusValue, planDurationUnit, planDurationValue, usageLimit, expiryDate } = req.body;

    const couponExists = await Coupon.findOne({ code });

    if (couponExists) {
        res.status(400);
        throw new Error('Coupon code already exists');
    }

    const coupon = await Coupon.create({
        code: code.toUpperCase(),
        type,
        value,
        bonusValue: bonusValue || 0,
        planDurationUnit: planDurationUnit || 'month',
        planDurationValue: planDurationValue || 1,
        usageLimit: usageLimit || 1,
        expiryDate
    });

    res.status(201).json(coupon);
});

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = asyncHandler(async (req, res) => {
    const { code } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
        res.status(404);
        throw new Error('Invalid or inactive coupon code');
    }

    // Check if user already used this coupon
    const alreadyUsed = await Transaction.findOne({ user: req.user._id, couponUsed: coupon._id });
    if (alreadyUsed) {
        res.status(400);
        throw new Error('You have already used this coupon code');
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
        coupon.isActive = false;
        await coupon.save();
        res.status(400);
        throw new Error('Coupon has expired');
    }

    if (coupon.usedCount >= coupon.usageLimit) {
        coupon.isActive = false;
        await coupon.save();
        res.status(400);
        throw new Error('Coupon usage limit reached');
    }

    res.json(coupon);
});

// @desc    Get all coupons (Admin only)
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find({}).sort('-createdAt');
    res.json(coupons);
});

// @desc    Delete a coupon (Admin only)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
        await coupon.deleteOne();
        res.json({ message: 'Coupon removed' });
    } else {
        res.status(404);
        throw new Error('Coupon not found');
    }
});

// @desc    Update a coupon (Admin only)
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
        coupon.code = (req.body.code || coupon.code).toUpperCase();
        coupon.type = req.body.type || coupon.type;
        coupon.value = req.body.value || coupon.value;
        coupon.bonusValue = req.body.bonusValue !== undefined ? req.body.bonusValue : coupon.bonusValue;
        coupon.planDurationUnit = req.body.planDurationUnit || coupon.planDurationUnit;
        coupon.planDurationValue = req.body.planDurationValue !== undefined ? req.body.planDurationValue : coupon.planDurationValue;
        coupon.usageLimit = req.body.usageLimit || coupon.usageLimit;
        coupon.expiryDate = req.body.expiryDate || coupon.expiryDate;
        coupon.isActive = req.body.isActive !== undefined ? req.body.isActive : coupon.isActive;

        const updatedCoupon = await coupon.save();
        res.json(updatedCoupon);
    } else {
        res.status(404);
        throw new Error('Coupon not found');
    }
});

module.exports = {
    generateCoupon,
    validateCoupon,
    getCoupons,
    deleteCoupon,
    updateCoupon
};
