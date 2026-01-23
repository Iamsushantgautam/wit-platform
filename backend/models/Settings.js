const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema({
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
