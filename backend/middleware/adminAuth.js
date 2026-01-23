const jwt = require('jsonwebtoken');
const User = require('../models/User');

const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Check if user is master_admin
        if (user.role !== 'master_admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Admin auth error:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = adminAuth;
