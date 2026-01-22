const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Dynamic folder structure based on context
        const context = req.query.context || req.body.context;
        const itemName = req.query.itemName || req.body.itemName;
        const username = req.user ? req.user.username : 'guest';

        // Tool images: withub/tool/[toolName]
        if (context === 'tool') {
            const folderName = itemName || 'misc';
            return {
                folder: `withub/tool/${folderName}`,
                allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp', 'svg'],
            };
        }

        // Prompt images: withub/prompt/[promptName]
        if (context === 'prompt') {
            const folderName = itemName || 'misc';
            return {
                folder: `withub/prompt/${folderName}`,
                allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
            };
        }

        // User avatar: withub/user/[username]/avatar
        if (context === 'avatar') {
            return {
                folder: `withub/user/${username}/avatar`,
                allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
                transformation: [{ width: 500, height: 500, crop: 'fill', gravity: 'face' }]
            };
        }

        // User screenshots: withub/user/[username]/screenshots
        if (context === 'screenshots') {
            return {
                folder: `withub/user/${username}/screenshots`,
                allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
            };
        }

        // User general uploads: withub/user/[username]/uploads
        if (context === 'uploads') {
            return {
                folder: `withub/user/${username}/uploads`,
                allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp', 'pdf'],
            };
        }

        // Default fallback
        return {
            folder: 'withub_uploads',
            allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
            transformation: [{ width: 500, height: 500, crop: 'limit' }]
        };
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
