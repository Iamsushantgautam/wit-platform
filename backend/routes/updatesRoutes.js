const express = require('express');
const router = express.Router();
const {
    getUpdates,
    addUpdate,
    updateUpdate,
    deleteUpdate
} = require('../controllers/updatesController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getUpdates);
router.post('/', protect, addUpdate);
router.put('/:updateId', protect, updateUpdate);
router.delete('/:updateId', protect, deleteUpdate);

module.exports = router;
