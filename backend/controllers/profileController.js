const asyncHandler = require('express-async-handler');
const Profile = require('../models/Profile');
const User = require('../models/User');
const UsernameHistory = require('../models/UsernameHistory');
const Tool = require('../models/Tool');

// @desc    Get current user profile
// @route   GET /api/profiles/me
// @access  Private
const getMyProfile = asyncHandler(async (req, res) => {
    const profile = await Profile.findOne({ user: req.user._id })
        .populate('user', 'username email')
        .populate('favoritesPrompts');
    if (!profile) {
        res.status(404);
        throw new Error('Profile not found');
    }
    res.json(profile);
});

// @desc    Create or Update user profile
// @route   POST /api/profiles
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
    const { name, bio, image, category, importantLinks, banners, activeTools, socialLinks, customItems, customSocials, favoritesPrompts, heroOffer, heroButtons, navigationSettings, publicPromptsDisplay } = req.body;

    const profileFields = {
        user: req.user._id,
        name,
        bio,
        image,
        category,
        importantLinks,
        banners,
        activeTools,
        socialLinks,
        customItems,
        customSocials,
        favoritesPrompts,
        heroOffer,
        heroButtons,
        navigationSettings,
        publicPromptsDisplay
    };

    let profile = await Profile.findOne({ user: req.user._id });

    if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate(
            { user: req.user._id },
            { $set: profileFields },
            { new: true }
        );
        res.json(profile);
    } else {
        // Create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
    }
});

// @desc    Get profile by username (Public)
// @route   GET /api/profiles/u/:username
// @access  Public
const getProfileByUsername = asyncHandler(async (req, res) => {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
        // Check history for redirect
        const history = await UsernameHistory.findOne({ oldUsername: req.params.username }).sort({ createdAt: -1 });
        if (history) {
            return res.status(301).json({ redirect: history.newUsername });
        }
        res.status(404);
        throw new Error('User not found');
    }

    const profile = await Profile.findOne({ user: user._id })
        .populate('user', 'username email')
        .populate('activeTools')
        .populate('favoritesPrompts'); // Populate tools details

    if (!profile) {
        res.status(404);
        throw new Error('Profile not found');
    }

    res.json(profile);
});

// @desc    Get all public profiles
// @route   GET /api/profiles
// @access  Public
const getAllPublicProfiles = asyncHandler(async (req, res) => {
    const profiles = await Profile.find({})
        .populate('user', 'username email')
        .select('user name bio image category') // Select only necessary fields
        .limit(20); // Limit for performance
    res.json(profiles);
});

// @desc    Toggle a prompt tool in favoritesPrompts
// @route   POST /api/profiles/favorites/prompt
// @access  Private
const toggleFavoritePrompt = asyncHandler(async (req, res) => {
    const { toolId } = req.body;
    if (!toolId) {
        res.status(400);
        throw new Error('toolId is required');
    }

    const tool = await Tool.findById(toolId);
    if (!tool || tool.type !== 'prompt') {
        res.status(404);
        throw new Error('Prompt not found');
    }

    let profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
        profile = new Profile({
            user: req.user._id,
            name: req.user.username,
            favoritesPrompts: []
        });
    }

    const exists = profile.favoritesPrompts.some(id => id.toString() === toolId);

    if (exists) {
        profile.favoritesPrompts = profile.favoritesPrompts.filter(id => id.toString() !== toolId);
    } else {
        profile.favoritesPrompts.push(toolId);
    }

    await profile.save();

    const populated = await Profile.findById(profile._id)
        .populate('favoritesPrompts')
        .populate('user', 'username email');

    res.json(populated);
});

module.exports = {
    getMyProfile,
    updateProfile,
    getProfileByUsername,
    getAllPublicProfiles,
    toggleFavoritePrompt
};
