const express = require('express');
const router = express.Router();
const {
    getMyProfile,
    updateProfile,
    getProfileByUsername,
    getAllPublicProfiles
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, getMyProfile);
router.post('/', protect, updateProfile);
router.get('/u/:username', getProfileByUsername);
router.get('/', getAllPublicProfiles);

module.exports = router;
