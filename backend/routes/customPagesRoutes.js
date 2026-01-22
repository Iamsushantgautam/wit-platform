const express = require('express');
const router = express.Router();
const {
    getPages,
    addPage,
    updatePage,
    deletePage,
    getMenu,
    updateMenu
} = require('../controllers/customPagesController');
const { protect } = require('../middleware/authMiddleware');

// Menu routes (must be before :pageId routes)
router.get('/menu', protect, getMenu);
router.post('/menu', protect, updateMenu);

// Pages routes
router.get('/', protect, getPages);
router.post('/', protect, addPage);
router.put('/:pageId', protect, updatePage);
router.delete('/:pageId', protect, deletePage);

module.exports = router;
