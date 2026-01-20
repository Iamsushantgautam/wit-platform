const asyncHandler = require('express-async-handler');
const Tool = require('../models/Tool');

// @desc    Get all tools
// @route   GET /api/tools
// @access  Public (or Private depending on needs, assume Public for now so users can see list to add)
const getTools = asyncHandler(async (req, res) => {
    const tools = await Tool.find({ isEnabled: true });
    res.json(tools);
});

// @desc    Get all tools (Admin - includes disabled)
// @route   GET /api/tools/admin
// @access  Private/Admin
const getAdminTools = asyncHandler(async (req, res) => {
    const tools = await Tool.find({});
    res.json(tools);
});

// @desc    Create a tool
// @route   POST /api/tools
// @access  Private/Admin
const createTool = asyncHandler(async (req, res) => {
    const { name, description, logo, url, category, prompt, promptDescription, type, platform, tags } = req.body;

    const tool = await Tool.create({
        name,
        description,
        logo,
        url,
        category,
        prompt,
        promptDescription,
        type: type || 'tool',
        platform: platform || 'Generic',
        tags: tags || []
    });

    res.status(201).json(tool);
});

// @desc    Update a tool
// @route   PUT /api/tools/:id
// @access  Private/Admin
const updateTool = asyncHandler(async (req, res) => {
    const { name, description, logo, url, category, prompt, promptDescription, type, platform, tags, isEnabled } = req.body;

    const tool = await Tool.findById(req.params.id);

    if (tool) {
        tool.name = name || tool.name;
        tool.description = description || tool.description;
        tool.logo = logo || tool.logo;
        tool.url = url || tool.url;
        tool.category = category || tool.category;
        tool.prompt = prompt !== undefined ? prompt : tool.prompt;
        tool.promptDescription = promptDescription !== undefined ? promptDescription : tool.promptDescription;
        tool.type = type || tool.type;
        tool.platform = platform || tool.platform;
        tool.tags = tags || tool.tags;
        if (isEnabled !== undefined) tool.isEnabled = isEnabled;

        const updatedTool = await tool.save();
        res.json(updatedTool);
    } else {
        res.status(404);
        throw new Error('Tool not found');
    }
});

// @desc    Delete a tool
// @route   DELETE /api/tools/:id
// @access  Private/Admin
const deleteTool = asyncHandler(async (req, res) => {
    const tool = await Tool.findById(req.params.id);

    if (tool) {
        await tool.deleteOne();
        res.json({ id: req.params.id });
    } else {
        res.status(404);
        throw new Error('Tool not found');
    }
});

module.exports = {
    getTools,
    getAdminTools,
    createTool,
    updateTool,
    deleteTool
};
