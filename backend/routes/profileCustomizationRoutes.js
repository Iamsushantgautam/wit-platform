const express = require('express');
const router = express.Router();
const {
    getCustomization,
    updateTheme,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    updateMenu,
    publishProfile,
    getSectionTemplates
} = require('../controllers/profileCustomizationController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.get('/', protect, getCustomization);
router.post('/theme', protect, updateTheme);
router.get('/templates', protect, getSectionTemplates);
router.post('/sections/add', protect, addSection);
router.put('/sections/:sectionId', protect, updateSection);
router.delete('/sections/:sectionId', protect, deleteSection);
router.post('/sections/reorder', protect, reorderSections);
router.post('/menu', protect, updateMenu);
router.post('/publish', protect, publishProfile);

module.exports = router;
