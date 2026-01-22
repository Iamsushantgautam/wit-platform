const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Verify configuration
console.log('Cloudinary Config:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? '✓ Set' : '✗ Missing',
    api_key: process.env.CLOUDINARY_API_KEY ? '✓ Set' : '✗ Missing',
    api_secret: process.env.CLOUDINARY_API_SECRET ? '✓ Set' : '✗ Missing'
});

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('⚠️  WARNING: Cloudinary credentials are missing! Uploads will fail.');
}

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        console.log('CloudinaryStorage params function called');
        console.log('File:', file);
        console.log('User:', req.user);

        const context = req.query.context || req.body.context;
        const itemName = req.query.itemName || req.body.itemName;

        console.log('Context:', context);
        console.log('ItemName:', itemName);

        // Ensure username is safe for folder paths (remove special chars if needed)
        const username = req.user?.username ? req.user.username.replace(/[^a-zA-Z0-9_-]/g, '') : 'guest';
        console.log('Username for folder:', username);

        let folder = 'withub/misc';

        // Global/Admin Uploads
        if (context === 'tool') {
            folder = itemName ? `withub/tool_img/${itemName}` : `withub/tool_img`;
        } else if (context === 'prompt') {
            folder = itemName ? `withub/prompt_img/${itemName}` : `withub/prompt_img`;
        }

        // User Specific Uploads
        else if (context === 'avatar') {
            folder = `withub/users/${username}/profile_img`;
        } else if (context === 'uploads') {
            // Used for Dashboard Banners/Offers
            folder = `withub/users/${username}/user_offer_img`;
        } else if (context === 'updates') {
            folder = `withub/users/${username}/user_update_img`;
        } else if (context === 'user_tool') {
            folder = `withub/users/${username}/user_tool_img`;
        } else if (context === 'user_prompt') {
            folder = `withub/users/${username}/user_prompt`;
        } else {
            // Default for user if authenticated, else generic
            if (req.user) {
                folder = `withub/users/${username}/misc`;
            }
        }

        // Define Allowed Formats based on context if strictness is needed
        // For now, allow common image formats
        const allowed_formats = ['jpg', 'png', 'jpeg', 'gif', 'webp', 'svg'];

        // Specific transformation for avatars to ensure consistency
        if (context === 'avatar') {
            return {
                folder: folder,
                allowed_formats: allowed_formats,
                transformation: [{ width: 500, height: 500, crop: 'fill', gravity: 'face' }]
            };
        }

        // Generate unique public_id (sanitize filename)
        const name = file.originalname.split('.')[0].trim().replace(/\s+/g, '_');
        const publicId = `${name}-${Date.now()}`;

        console.log('Returning Cloudinary params:', { folder, allowed_formats, public_id: publicId });

        return {
            folder: folder,
            allowed_formats: allowed_formats,
            public_id: publicId
        };
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
