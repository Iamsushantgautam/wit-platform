const asyncHandler = require('express-async-handler');
const Profile = require('../models/Profile');
const { nanoid } = require('nanoid');

// @desc    Get customization data (theme + layout)
// @route   GET /api/profiles/customize
// @access  Private
const getCustomization = asyncHandler(async (req, res) => {
    let profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
        // Create default profile with default sections
        profile = new Profile({
            user: req.user._id,
            name: req.user.username,
            theme: {
                primaryColor: '#2563eb',
                accentColor: '#8b5cf6',
                fontFamily: 'Inter',
                darkMode: false
            },
            layout: {
                sections: [
                    {
                        id: nanoid(10),
                        type: 'hero',
                        title: 'Hero Section',
                        content: {
                            heading: `Hi, I'm ${req.user.username}`,
                            subheading: 'Welcome to my profile',
                            ctaText: 'Get in touch',
                            ctaLink: '#contact'
                        },
                        isVisible: true,
                        order: 0
                    },
                    {
                        id: nanoid(10),
                        type: 'about',
                        title: 'About Me',
                        content: {
                            text: 'Add your bio here...'
                        },
                        isVisible: true,
                        order: 1
                    }
                ],
                menuVisible: true,
                menuItems: []
            }
        });
        await profile.save();
    }

    res.json({
        theme: profile.theme,
        layout: profile.layout,
        isDraft: profile.isDraft,
        publishedAt: profile.publishedAt,
        lastSavedAt: profile.lastSavedAt
    });
});

// @desc    Update theme settings
// @route   POST /api/profiles/customize/theme
// @access  Private
const updateTheme = asyncHandler(async (req, res) => {
    const { primaryColor, accentColor, fontFamily, darkMode } = req.body;

    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
        res.status(404);
        throw new Error('Profile not found');
    }

    // Update theme
    if (primaryColor) profile.theme.primaryColor = primaryColor;
    if (accentColor) profile.theme.accentColor = accentColor;
    if (fontFamily) profile.theme.fontFamily = fontFamily;
    if (darkMode !== undefined) profile.theme.darkMode = darkMode;

    profile.isDraft = true;
    profile.lastSavedAt = new Date();
    await profile.save();

    res.json({
        theme: profile.theme,
        lastSavedAt: profile.lastSavedAt
    });
});

// @desc    Add a new section
// @route   POST /api/profiles/customize/sections/add
// @access  Private
const addSection = asyncHandler(async (req, res) => {
    const { type, title, content } = req.body;

    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
        res.status(404);
        throw new Error('Profile not found');
    }

    const newSection = {
        id: nanoid(10),
        type,
        title: title || `${type.charAt(0).toUpperCase()}${type.slice(1)} Section`,
        content: content || {},
        isVisible: true,
        order: profile.layout.sections.length
    };

    profile.layout.sections.push(newSection);
    profile.isDraft = true;
    profile.lastSavedAt = new Date();
    await profile.save();

    res.json({
        section: newSection,
        sections: profile.layout.sections,
        lastSavedAt: profile.lastSavedAt
    });
});

// @desc    Update a section
// @route   PUT /api/profiles/customize/sections/:sectionId
// @access  Private
const updateSection = asyncHandler(async (req, res) => {
    const { sectionId } = req.params;
    const { title, content, isVisible } = req.body;

    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
        res.status(404);
        throw new Error('Profile not found');
    }

    const section = profile.layout.sections.find(s => s.id === sectionId);
    if (!section) {
        res.status(404);
        throw new Error('Section not found');
    }

    if (title !== undefined) section.title = title;
    if (content !== undefined) section.content = content;
    if (isVisible !== undefined) section.isVisible = isVisible;

    profile.isDraft = true;
    profile.lastSavedAt = new Date();
    await profile.save();

    res.json({
        section,
        sections: profile.layout.sections,
        lastSavedAt: profile.lastSavedAt
    });
});

// @desc    Delete a section
// @route   DELETE /api/profiles/customize/sections/:sectionId
// @access  Private
const deleteSection = asyncHandler(async (req, res) => {
    const { sectionId } = req.params;

    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
        res.status(404);
        throw new Error('Profile not found');
    }

    profile.layout.sections = profile.layout.sections.filter(s => s.id !== sectionId);
    profile.isDraft = true;
    profile.lastSavedAt = new Date();
    await profile.save();

    res.json({
        sections: profile.layout.sections,
        lastSavedAt: profile.lastSavedAt
    });
});

// @desc    Reorder sections
// @route   POST /api/profiles/customize/sections/reorder
// @access  Private
const reorderSections = asyncHandler(async (req, res) => {
    const { sectionIds } = req.body;

    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
        res.status(404);
        throw new Error('Profile not found');
    }

    // Reorder based on the provided array
    const reorderedSections = [];
    sectionIds.forEach((id, index) => {
        const section = profile.layout.sections.find(s => s.id === id);
        if (section) {
            section.order = index;
            reorderedSections.push(section);
        }
    });

    profile.layout.sections = reorderedSections;
    profile.isDraft = true;
    profile.lastSavedAt = new Date();
    await profile.save();

    res.json({
        sections: profile.layout.sections,
        lastSavedAt: profile.lastSavedAt
    });
});

// @desc    Update menu settings
// @route   POST /api/profiles/customize/menu
// @access  Private
const updateMenu = asyncHandler(async (req, res) => {
    const { menuVisible, menuItems } = req.body;

    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
        res.status(404);
        throw new Error('Profile not found');
    }

    if (menuVisible !== undefined) profile.layout.menuVisible = menuVisible;
    if (menuItems) profile.layout.menuItems = menuItems;

    profile.isDraft = true;
    profile.lastSavedAt = new Date();
    await profile.save();

    res.json({
        menu: {
            menuVisible: profile.layout.menuVisible,
            menuItems: profile.layout.menuItems
        },
        lastSavedAt: profile.lastSavedAt
    });
});

// @desc    Publish profile (make it live)
// @route   POST /api/profiles/customize/publish
// @access  Private
const publishProfile = asyncHandler(async (req, res) => {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
        res.status(404);
        throw new Error('Profile not found');
    }

    profile.isDraft = false;
    profile.publishedAt = new Date();
    profile.lastSavedAt = new Date();
    await profile.save();

    res.json({
        message: 'Profile published successfully',
        publishedAt: profile.publishedAt,
        isDraft: profile.isDraft
    });
});

// @desc    Get section templates
// @route   GET /api/profiles/customize/templates
// @access  Private
const getSectionTemplates = asyncHandler(async (req, res) => {
    const templates = [
        {
            type: 'hero',
            name: 'Hero Section',
            description: 'Main header with title, subtitle, and CTA button',
            icon: 'Star',
            defaultContent: {
                heading: 'Welcome to my profile',
                subheading: 'I create amazing content',
                ctaText: 'Get Started',
                ctaLink: '#contact',
                backgroundImage: ''
            }
        },
        {
            type: 'about',
            name: 'About Me',
            description: 'Tell your story with rich text',
            icon: 'User',
            defaultContent: {
                text: 'Write about yourself...'
            }
        },
        {
            type: 'links',
            name: 'Important Links',
            description: 'Showcase your important links',
            icon: 'Link',
            defaultContent: {
                links: []
            }
        },
        {
            type: 'gallery',
            name: 'Gallery',
            description: 'Image gallery or portfolio',
            icon: 'Image',
            defaultContent: {
                images: []
            }
        },
        {
            type: 'testimonials',
            name: 'Testimonials',
            description: 'Show social proof',
            icon: 'MessageSquare',
            defaultContent: {
                testimonials: []
            }
        },
        {
            type: 'contact',
            name: 'Contact',
            description: 'Contact information and social links',
            icon: 'Mail',
            defaultContent: {
                email: '',
                phone: '',
                socials: []
            }
        },
        {
            type: 'offers',
            name: 'Offers & Banners',
            description: 'Display your offers and promotions',
            icon: 'Gift',
            defaultContent: {
                offers: []
            }
        }
    ];

    res.json(templates);
});

module.exports = {
    getCustomization,
    updateTheme,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    updateMenu,
    publishProfile,
    getSectionTemplates
};
