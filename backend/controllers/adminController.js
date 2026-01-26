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
exports.getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne({ singleton: 'settings' });

        // Create default settings if none exist
        if (!settings) {
            settings = await Settings.create({
                singleton: 'settings',
                features: defaultFeatures
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
        const { features } = req.body;

        let settings = await Settings.findOne({ singleton: 'settings' });

        if (!settings) {
            settings = await Settings.create({
                singleton: 'settings',
                features
            });
        } else {
            // Merge existing, new, and defaults to ensure integrity
            const mergedFeatures = {
                ...defaultFeatures,
                ...(settings.features || {}),
                ...features
            };

            settings.features = mergedFeatures;
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
                features: defaultFeatures
            });
        }

        // Return just the merged features object
        const mergedFeatures = {
            ...defaultFeatures,
            ...(settings.features || {})
        };

        res.json(mergedFeatures);
    } catch (error) {
        console.error('Error fetching feature flags:', error);
        res.status(500).json({ message: 'Failed to fetch feature flags' });
    }
};
