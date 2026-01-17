const express = require('express');
const router = express.Router();
const {
    updateUser,
    getUsers,
    blockUser,
    deleteUser
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.put('/profile', protect, updateUser);
router.delete('/profile', protect, deleteUser);
router.get('/', protect, admin, getUsers);
router.put('/:id/block', protect, admin, blockUser);

module.exports = router;
