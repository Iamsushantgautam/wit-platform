const asyncHandler = require('express-async-handler');
const Profile = require('../models/Profile');

// @desc    Get all updates for current user
// @route   GET /api/profiles/updates
// @access  Private
const getUpdates = asyncHandler(async (req, res) => {
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
        res.status(404);
        throw new Error('Profile not found');
    }

    res.json(profile.updates || []);
});

// @desc    Add new update
// @route   POST /api/profiles/updates
// @access  Private
const addUpdate = asyncHandler(async (req, res) => {
    const { emoji, title, text, thumbnail, image, link } = req.body;

    if (!title || !text) {
        res.status(400);
        throw new Error('Please provide title and text');
    }

    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
        res.status(404);
        throw new Error('Profile not found');
    }

    const newUpdate = {
        emoji: emoji || '🎉',
        title,
        text,
        thumbnail: thumbnail || '',
        image: image || '',
        link: link || '',
        createdAt: new Date()
    };

    profile.updates.unshift(newUpdate); // Add to beginning
    await profile.save();

    res.status(201).json(profile.updates);
});

// @desc    Update an existing update
// @route   PUT /api/profiles/updates/:updateId
// @access  Private
const updateUpdate = asyncHandler(async (req, res) => {
    const { updateId } = req.params;
    const { emoji, title, text, thumbnail, image, link } = req.body;

    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
        res.status(404);
        throw new Error('Profile not found');
    }

    const update = profile.updates.id(updateId);

    if (!update) {
        res.status(404);
        throw new Error('Update not found');
    }

    if (emoji !== undefined) update.emoji = emoji;
    if (title !== undefined) update.title = title;
    if (text !== undefined) update.text = text;
    if (thumbnail !== undefined) update.thumbnail = thumbnail;
    if (image !== undefined) update.image = image;
    if (link !== undefined) update.link = link;

    await profile.save();

    res.json(profile.updates);
});

// @desc    Delete an update
// @route   DELETE /api/profiles/updates/:updateId
// @access  Private
const deleteUpdate = asyncHandler(async (req, res) => {
    const { updateId } = req.params;

    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
        res.status(404);
        throw new Error('Profile not found');
    }

    profile.updates.pull(updateId);
    await profile.save();

    res.json({ message: 'Update deleted successfully', updates: profile.updates });
});

module.exports = {
    getUpdates,
    addUpdate,
    updateUpdate,
    deleteUpdate
};
