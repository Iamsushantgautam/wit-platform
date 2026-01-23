const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const { getSettings, updateSettings, getFeatureFlags } = require('../controllers/adminController');

// Public route to get feature flags
router.get('/features', getFeatureFlags);

// Protected admin routes
router.get('/settings', adminAuth, getSettings);
router.put('/settings', adminAuth, updateSettings);

module.exports = router;
