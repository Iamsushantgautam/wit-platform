const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, (req, res, next) => {
    console.log('Upload request received. Context:', req.query.context);
    console.log('User:', req.user?.username);

    upload.single('image')(req, res, function (err) {
        if (err) {
            console.error('Multer/Cloudinary Upload Error:', err);
            console.error('Error message:', err.message);
            console.error('Error stack:', err.stack);
            return res.status(400).json({
                message: err.message || 'Image upload failed',
                error: err.toString()
            });
        }

        console.log('Upload successful. File:', req.file);

        // Everything went fine.
        if (req.file && req.file.path) {
            console.log('Returning file path:', req.file.path);
            res.json(req.file.path);
        } else {
            console.error('Upload completed but no file path exists');
            res.status(400).json({ message: 'Image upload failed - no file path' });
        }
    });
});

module.exports = router;
