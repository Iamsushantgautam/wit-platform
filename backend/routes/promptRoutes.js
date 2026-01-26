const express = require('express');
const router = express.Router();
const { getPrompts, createPrompt, updatePrompt, deletePrompt } = require('../controllers/promptController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getPrompts).post(protect, admin, createPrompt);
router.route('/:id').put(protect, admin, updatePrompt).delete(protect, admin, deletePrompt);

module.exports = router;
