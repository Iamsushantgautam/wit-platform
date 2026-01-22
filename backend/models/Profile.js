const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    bio: {
        type: String,
        maxLength: [500, 'Bio cannot be more than 500 characters']
    },
    image: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        default: 'General'
    },
    importantLinks: [{
        title: String,
        url: String
    }],
    banners: [{
        title: String,
        imageUrl: String,
        link: String,
        caption: String,
        promoCode: String,
        tags: [String],
        isVisible: {
            type: Boolean,
            default: true
        }
    }],
    heroOffer: {
        title: { type: String, default: '5-in-1 AI Viral Offer Pack' },
        subtitle: { type: String, default: 'Get 20% Off This Weekend Only!' },
        badge: { type: String, default: 'Limited Time Offer' },
        ctaText: { type: String, default: 'GRAB OFFER' },
        ctaLink: { type: String, default: '#' },
        backgroundColor: { type: String, default: '#1f2937' },
        isVisible: { type: Boolean, default: true }
    },
    socialLinks: {
        instagram: String,
        youtube: String,
        telegram: String,
        x: String,
        twitter: String,
        facebook: String,
        whatsapp: String,
        linkedin: String,
        github: String,
        discord: String
    },
    customSocials: [{
        label: String,
        url: String,
        icon: String // Could be emoji or Lucide icon name
    }],
    customItems: [{
        title: String,
        description: String,
        url: String,
        image: String, // Logo or preview
        type: {
            type: String,
            enum: ['tool', 'prompt'],
            default: 'tool'
        },
        prompt: String, // For prompt cards
        tags: [String],
        category: String
    }],
    activeTools: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tool'
    }],
    favoritesPrompts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tool'
    }],
    // Custom Pages
    customPages: [{
        slug: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            default: ''
        },
        icon: {
            type: String,
            default: 'FileText'
        },
        isVisible: {
            type: Boolean,
            default: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    // Custom Menu
    customMenu: [{
        label: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            default: 'Menu'
        },
        target: {
            type: String,
            required: true
        },
        isVisible: {
            type: Boolean,
            default: true
        },
        order: {
            type: Number,
            default: 0
        }
    }],
    // Updates/Announcements
    updates: [{
        emoji: {
            type: String,
            default: '🎉'
        },
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        thumbnail: String,
        image: String, // Uploaded image URL
        link: String, // Call-to-action link
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    // Customization fields
    theme: {
        primaryColor: {
            type: String,
            default: '#2563eb',
            validate: {
                validator: (v) => /^#[0-9A-Fa-f]{6}$/.test(v),
                message: 'Invalid hex color'
            }
        },
        accentColor: {
            type: String,
            default: '#8b5cf6',
            validate: {
                validator: (v) => /^#[0-9A-Fa-f]{6}$/.test(v),
                message: 'Invalid hex color'
            }
        },
        fontFamily: {
            type: String,
            default: 'Inter',
            enum: ['Inter', 'Roboto', 'Poppins', 'Montserrat', 'Open Sans', 'Lato']
        },
        darkMode: {
            type: Boolean,
            default: false
        }
    },
    layout: {
        sections: [{
            id: String,
            type: {
                type: String,
                enum: ['hero', 'about', 'links', 'gallery', 'testimonials', 'contact', 'custom', 'offers'],
                required: true
            },
            title: String,
            content: mongoose.Schema.Types.Mixed,
            isVisible: {
                type: Boolean,
                default: true
            },
            order: {
                type: Number,
                default: 0
            }
        }],
        menuVisible: {
            type: Boolean,
            default: true
        },
        menuItems: [{
            label: String,
            sectionId: String,
            icon: String
        }]
    },
    isDraft: {
        type: Boolean,
        default: false
    },
    publishedAt: Date,
    lastSavedAt: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);
