const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, (req, res, next) => {
    upload.single('image')(req, res, function (err) {
        if (err) {
            console.error('Upload Error:', err);
            return res.status(400).json({ message: err.message || 'Image upload failed' });
        }
        // Everything went fine.
        if (req.file && req.file.path) {
            res.json(req.file.path);
        } else {
            res.status(400);
            throw new Error('Image upload failed');
        }
    });
});

module.exports = router;
