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
        const context = req.query.context || req.body.context;
        const itemName = req.query.itemName || req.body.itemName;

        // Ensure username is safe for folder paths (remove special chars if needed)
        const username = req.user ? req.user.username.replace(/[^a-zA-Z0-9_-]/g, '') : 'guest';

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

        return {
            folder: folder,
            allowed_formats: allowed_formats,
            public_id: (req, file) => {
                // Optional: keep original name or generate unique
                const name = file.originalname.split('.')[0];
                return `${name}-${Date.now()}`;
            }
        };
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
