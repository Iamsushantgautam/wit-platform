const asyncHandler = require('express-async-handler');
const Profile = require('../models/Profile');

// @desc    Get all custom pages for current user
// @route   GET /api/profiles/pages
// @access  Private
const getPages = asyncHandler(async (req, res) => {
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
        res.status(404);
        throw new Error('Profile not found');
    }

    res.json(profile.customPages || []);
});

// @desc    Add new custom page
// @route   POST /api/profiles/pages
// @access  Private
const addPage = asyncHandler(async (req, res) => {
    const { title, content, icon } = req.body;

    if (!title) {
        res.status(400);
        throw new Error('Please provide a title');
    }

    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
        res.status(404);
        throw new Error('Profile not found');
    }

    // Create URL-friendly slug from title
    const slug = title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

    // Check if slug already exists
    const slugExists = profile.customPages.some(page => page.slug === slug);
    if (slugExists) {
        res.status(400);
        throw new Error('A page with this title already exists');
    }

    const newPage = {
        slug,
        title,
        content: content || '',
        icon: icon || 'FileText',
        isVisible: true,
        createdAt: new Date()
    };

    profile.customPages.push(newPage);
    await profile.save();

    res.status(201).json(profile.customPages);
});

// @desc    Update a custom page
// @route   PUT /api/profiles/pages/:pageId
// @access  Private
const updatePage = asyncHandler(async (req, res) => {
    const { pageId } = req.params;
    const { title, content, icon, isVisible } = req.body;

    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
        res.status(404);
        throw new Error('Profile not found');
    }

    const page = profile.customPages.id(pageId);

    if (!page) {
        res.status(404);
        throw new Error('Page not found');
    }

    if (title !== undefined) {
        page.title = title;
        // Update slug if title changed
        page.slug = title.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
    if (content !== undefined) page.content = content;
    if (icon !== undefined) page.icon = icon;
    if (isVisible !== undefined) page.isVisible = isVisible;

    await profile.save();

    res.json(profile.customPages);
});

// @desc    Delete a custom page
// @route   DELETE /api/profiles/pages/:pageId
// @access  Private
const deletePage = asyncHandler(async (req, res) => {
    const { pageId } = req.params;

    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
        res.status(404);
        throw new Error('Profile not found');
    }

    profile.customPages.pull(pageId);
    await profile.save();

    res.json({ message: 'Page deleted successfully', pages: profile.customPages });
});

// @desc    Get custom menu
// @route   GET /api/profiles/menu
// @access  Private
const getMenu = asyncHandler(async (req, res) => {
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
        res.status(404);
        throw new Error('Profile not found');
    }

    res.json(profile.customMenu || []);
});

// @desc    Update custom menu
// @route   POST /api/profiles/menu
// @access  Private
const updateMenu = asyncHandler(async (req, res) => {
    const { menuItems } = req.body;

    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
        res.status(404);
        throw new Error('Profile not found');
    }

    profile.customMenu = menuItems;
    await profile.save();

    res.json(profile.customMenu);
});

module.exports = {
    getPages,
    addPage,
    updatePage,
    deletePage,
    getMenu,
    updateMenu
};
