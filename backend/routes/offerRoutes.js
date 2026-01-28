const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Offer = require('../models/Offer');
const { protect } = require('../middleware/authMiddleware');

// Check admin helper
const isAdmin = (req) => {
    return req.user && req.user.role === 'master_admin';
}

// @desc    Get all active offers (Public)
// @route   GET /api/offers
// @access  Public
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Get all active offers (Public)
// @route   GET /api/offers
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
    // Return active offers sorted by created date
    const offers = await Offer.find({ isActive: true }).sort({ createdAt: -1 });

    // Check for user token manually to see if unlocked
    let user = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            user = await User.findById(decoded.id).select('unlockedOffers');
        } catch (error) {
            // Invalid token, treat as guest
        }
    }

    // Mask code if necessary
    const processedOffers = offers.map(offer => {
        const offerObj = offer.toObject();
        if (offer.isPaid) {
            const isUnlocked = user && user.unlockedOffers && user.unlockedOffers.some(id => id.toString() === offer._id.toString());
            if (!isUnlocked) {
                offerObj.code = "LOCKED";
                offerObj.isLocked = true; // Flag for frontend
            }
        }
        return offerObj;
    });

    res.json(processedOffers);
}));

// @desc    Get all offers (Admin)
// @route   GET /api/offers/admin
// @access  Private/Admin
router.get('/admin', protect, asyncHandler(async (req, res) => {
    if (!isAdmin(req)) {
        res.status(401);
        throw new Error('Not authorized as admin');
    }
    const offers = await Offer.find({}).sort({ createdAt: -1 });
    res.json(offers);
}));

// @desc    Create offer
// @route   POST /api/offers
// @access  Private/Admin
router.post('/', protect, asyncHandler(async (req, res) => {
    if (!isAdmin(req)) {
        res.status(401);
        throw new Error('Not authorized as admin');
    }

    const offer = await Offer.create(req.body);
    res.status(201).json(offer);
}));

// @desc    Update offer
// @route   PUT /api/offers/:id
// @access  Private/Admin
router.put('/:id', protect, asyncHandler(async (req, res) => {
    if (!isAdmin(req)) {
        res.status(401);
        throw new Error('Not authorized as admin');
    }

    const offer = await Offer.findById(req.params.id);
    if (!offer) {
        res.status(404);
        throw new Error('Offer not found');
    }

    const updatedOffer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedOffer);
}));

// @desc    Delete offer
// @route   DELETE /api/offers/:id
// @access  Private/Admin
router.delete('/:id', protect, asyncHandler(async (req, res) => {
    if (!isAdmin(req)) {
        res.status(401);
        throw new Error('Not authorized as admin');
    }

    const offer = await Offer.findById(req.params.id);
    if (!offer) {
        res.status(404);
        throw new Error('Offer not found');
    }

    await offer.deleteOne();
    res.json({ id: req.params.id });
}));

module.exports = router;
