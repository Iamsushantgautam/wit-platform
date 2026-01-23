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
router.get('/', asyncHandler(async (req, res) => {
    // Return active offers sorted by created date
    const offers = await Offer.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(offers);
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
