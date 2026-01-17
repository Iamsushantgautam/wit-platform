const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request Logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/user-manage', require('./routes/userRoutes'));
app.use('/api/profiles', require('./routes/profileRoutes'));
app.use('/api/tools', require('./routes/toolRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

// DEBUG ROUTE: Remove in production
app.get('/api/debug/db', async (req, res) => {
    try {
        const users = await require('./models/User').find({}).select('-password');
        const profiles = await require('./models/Profile').find({});
        res.json({ users, profiles });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
