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
        link: String
    }],
    activeTools: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tool'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);
