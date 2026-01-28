const Prompt = require('../models/Prompt');

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Get all prompts
// @route   GET /api/prompts
// @access  Public
exports.getPrompts = async (req, res) => {
    try {
        const prompts = await Prompt.find().sort({ createdAt: -1 });

        // Check for user token manually to see if unlocked
        let user = null;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                const token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                user = await User.findById(decoded.id).select('unlockedPrompts');
            } catch (error) {
                // Invalid token, treat as guest
            }
        }

        const processedPrompts = prompts.map(prompt => {
            const promptObj = prompt.toObject();
            if (prompt.isPaid) {
                const isUnlocked = user && user.unlockedPrompts && user.unlockedPrompts.some(id => id.toString() === prompt._id.toString());
                if (!isUnlocked) {
                    promptObj.prompt = "This prompt is locked. Purchase to unlock."; // Simple masking
                    promptObj.isLocked = true;
                }
            }
            return promptObj;
        });

        res.status(200).json(processedPrompts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a prompt
// @route   POST /api/prompts
// @access  Private (Admin)
exports.createPrompt = async (req, res) => {
    try {
        if (!req.body.title || !req.body.prompt || !req.body.image) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const prompt = await Prompt.create(req.body);
        res.status(201).json(prompt);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a prompt
// @route   PUT /api/prompts/:id
// @access  Private (Admin)
exports.updatePrompt = async (req, res) => {
    try {
        const prompt = await Prompt.findById(req.params.id);

        if (!prompt) {
            return res.status(404).json({ message: 'Prompt not found' });
        }

        const updatedPrompt = await Prompt.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.status(200).json(updatedPrompt);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a prompt
// @route   DELETE /api/prompts/:id
// @access  Private (Admin)
exports.deletePrompt = async (req, res) => {
    try {
        const prompt = await Prompt.findById(req.params.id);

        if (!prompt) {
            return res.status(404).json({ message: 'Prompt not found' });
        }

        await prompt.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
