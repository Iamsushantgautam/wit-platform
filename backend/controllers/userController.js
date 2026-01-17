const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const UsernameHistory = require('../models/UsernameHistory');

// @desc    Update user (Username change)
// @route   PUT /api/users/profile
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        if (req.body.username && req.body.username !== user.username) {
            // Check if new username exists
            const usernameExists = await User.findOne({ username: req.body.username });
            if (usernameExists) {
                res.status(400);
                throw new Error('Username already taken');
            }

            // Save old username to history
            await UsernameHistory.create({
                user: user._id,
                oldUsername: user.username,
                newUsername: req.body.username
            });

            user.username = req.body.username;
        }

        if (req.body.email) user.email = req.body.email;
        if (req.body.password) {
            // Hash handle in model pre-save or here? 
            // Simplest is here as authController manual hash.
            // But usually better to use pre-save hook. 
            // For now, I'll skip pw update complexity unless needed or addbcrypt here.
            const salt = await require('bcryptjs').genSalt(10);
            user.password = await require('bcryptjs').hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            token: require('../utils/generateToken')(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

// @desc    Block/Unblock user (Admin)
// @route   PUT /api/users/:id/block
// @access  Private/Admin
const blockUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.isBlocked = !user.isBlocked;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Delete user account
// @route   DELETE /api/user-manage/profile
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        // Find and delete the profile as well
        const Profile = require('../models/Profile');
        await Profile.findOneAndDelete({ user: req.user._id });

        await User.findByIdAndDelete(req.user._id);
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


module.exports = {
    updateUser,
    getUsers,
    blockUser,
    deleteUser
};
