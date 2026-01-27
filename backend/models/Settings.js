const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema({
    // General Platform Settings
    siteName: {
        type: String,
        default: 'WitHub'
    },
    siteLogo: {
        type: String,
        default: ''
    },
    siteFavicon: {
        type: String,
        default: ''
    },
    publicProfileLogoSource: {
        type: String,
        enum: ['site_logo', 'site_favicon', 'custom_logo'],
        default: 'site_logo'
    },
    customPublicLogo: {
        type: String, // Special logo just for public profiles if 'custom_logo' is selected
        default: ''
    },
    // Feature flags for controlling user access to features
    features: {
        userToolsEnabled: {
            type: Boolean,
            default: true
        },
        userPromptsEnabled: {
            type: Boolean,
            default: true
        },
        userOffersEnabled: {
            type: Boolean,
            default: true
        },
        userLinksEnabled: {
            type: Boolean,
            default: true
        },
        userUpdatesEnabled: {
            type: Boolean,
            default: true
        },
        userNavigationEnabled: {
            type: Boolean,
            default: true
        },
        userBottomNavEnabled: {
            type: Boolean,
            default: true
        },
        userHeroButtonsEnabled: {
            type: Boolean,
            default: true
        },
        userPublicBranding: {
            type: Boolean,
            default: true
        },
        globalLibraryEnabled: {
            type: Boolean,
            default: true
        },
        globalLibraryPublicEnabled: {
            type: Boolean,
            default: true
        }
    },
    // Singleton pattern: only one settings document
    singleton: {
        type: String,
        default: 'settings',
        unique: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
