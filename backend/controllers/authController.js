const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Profile = require('../models/Profile');
const generateToken = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/users
// @access  Public
// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Check if username exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
        res.status(400);
        throw new Error('Username already taken');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    if (user) {
        // Automatically create a profile for the user
        try {
            await Profile.create({
                user: user._id,
                name: user.username,
                category: 'Developer'
            });

            res.status(201).json({
                _id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } catch (error) {
            // Rollback user creation if profile creation fails
            await User.findByIdAndDelete(user._id);
            res.status(400);
            throw new Error('Could not create profile. Registration failed.');
        }
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        if (user.isBlocked) {
            res.status(403);
            throw new Error('Your account has been blocked. Contact admin.');
        }

        res.json({
            _id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid credentials');
    }
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

module.exports = {
    registerUser,
    loginUser,
    getMe,
};
