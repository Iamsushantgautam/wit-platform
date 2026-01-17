const express = require('express');
const router = express.Router();
const {
    getTools,
    getAdminTools,
    createTool,
    updateTool,
    deleteTool
} = require('../controllers/toolController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getTools);
router.get('/admin', protect, admin, getAdminTools);
router.post('/', protect, admin, createTool);
router.put('/:id', protect, admin, updateTool);
router.delete('/:id', protect, admin, deleteTool);

module.exports = router;
