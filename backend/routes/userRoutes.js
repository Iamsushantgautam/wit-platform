const express = require('express');
const router = express.Router();
const {
    updateUser,
    getUsers,
    blockUser,
    deleteUser,
    updateUserPlan
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.put('/profile', protect, updateUser);
router.delete('/profile', protect, deleteUser);
router.get('/', protect, admin, getUsers);
router.put('/:id/block', protect, admin, blockUser);
router.put('/:id/plan', protect, admin, updateUserPlan);

module.exports = router;
