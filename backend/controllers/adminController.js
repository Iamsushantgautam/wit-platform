const Settings = require('../models/Settings');

// @desc    Get platform settings
// @route   GET /api/admin/settings
// @access  Admin only
// Feature defaults to ensure backward compatibility
const defaultFeatures = {
    userToolsEnabled: true,
    userPromptsEnabled: true,
    userOffersEnabled: true,
    userLinksEnabled: true,
    userUpdatesEnabled: true,
    userNavigationEnabled: true,
    userBottomNavEnabled: true,
    userHeroButtonsEnabled: true,
    userPublicBranding: true,
    globalLibraryEnabled: true,
    globalLibraryPublicEnabled: true
};

// @desc    Get platform settings
// @route   GET /api/admin/settings
// @access  Admin only
// @desc    Get platform settings
// @route   GET /api/admin/settings
// @access  Admin only
// @desc    Get platform settings
// @route   GET /api/admin/settings
// @access  Admin only
// @desc    Get platform settings
// @route   GET /api/admin/settings
// @access  Admin only
exports.getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne({ singleton: 'settings' });

        // Create default settings if none exist
        if (!settings) {
            settings = await Settings.create({
                singleton: 'settings',
                features: defaultFeatures,
                siteName: 'WitHub',
                siteLogo: '',
                siteFavicon: '',
                publicProfileLogoSource: 'site_logo',
                customPublicLogo: ''
            });
        }

        // Merge with defaults to ensure all keys are present for the frontend
        const mergedFeatures = { ...defaultFeatures, ...(settings.features || {}) };

        // Return structured response
        res.json({
            ...settings.toObject(),
            features: mergedFeatures
        });
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ message: 'Failed to fetch settings' });
    }
};

// @desc    Update platform settings
// @route   PUT /api/admin/settings
// @access  Admin only
exports.updateSettings = async (req, res) => {
    try {
        const { features, siteName, siteLogo, siteFavicon, publicProfileLogoSource, customPublicLogo } = req.body;

        let settings = await Settings.findOne({ singleton: 'settings' });

        if (!settings) {
            settings = await Settings.create({
                singleton: 'settings',
                features,
                siteName: siteName || 'WitHub',
                siteLogo: siteLogo || '',
                siteFavicon: siteFavicon || '',
                publicProfileLogoSource: publicProfileLogoSource || 'site_logo',
                customPublicLogo: customPublicLogo || ''
            });
        } else {
            const mergedFeatures = {
                ...defaultFeatures,
                ...(settings.features || {}),
                ...features
            };

            settings.features = mergedFeatures;
            if (siteName !== undefined) settings.siteName = siteName;
            if (siteLogo !== undefined) settings.siteLogo = siteLogo;
            if (siteFavicon !== undefined) settings.siteFavicon = siteFavicon;
            if (publicProfileLogoSource !== undefined) settings.publicProfileLogoSource = publicProfileLogoSource;
            if (customPublicLogo !== undefined) settings.customPublicLogo = customPublicLogo;

            await settings.save();
        }

        res.json({ message: 'Settings updated successfully', settings });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ message: 'Failed to update settings' });
    }
};

// @desc    Get public feature flags (for frontend to check)
// @route   GET /api/admin/features
// @access  Public
exports.getFeatureFlags = async (req, res) => {
    try {
        let settings = await Settings.findOne({ singleton: 'settings' });

        if (!settings) {
            settings = await Settings.create({
                singleton: 'settings',
                features: defaultFeatures,
                siteName: 'WitHub',
                siteLogo: '',
                siteFavicon: '',
                publicProfileLogoSource: 'site_logo',
                customPublicLogo: ''
            });
        }

        const mergedFeatures = {
            ...defaultFeatures,
            ...(settings.features || {})
        };

        res.json({
            features: mergedFeatures,
            siteName: settings.siteName,
            siteLogo: settings.siteLogo,
            siteFavicon: settings.siteFavicon,
            publicProfileLogoSource: settings.publicProfileLogoSource || 'site_logo',
            customPublicLogo: settings.customPublicLogo || ''
        });
    } catch (error) {
        console.error('Error fetching feature flags:', error);
        res.status(500).json({ message: 'Failed to fetch feature flags' });
    }
};
