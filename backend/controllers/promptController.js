const Prompt = require('../models/Prompt');

// @desc    Get all prompts
// @route   GET /api/prompts
// @access  Public
exports.getPrompts = async (req, res) => {
    try {
        const prompts = await Prompt.find().sort({ createdAt: -1 });
        res.status(200).json(prompts);
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
