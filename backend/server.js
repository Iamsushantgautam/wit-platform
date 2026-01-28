const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');

connectDB();

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'https://withub-iota.vercel.app'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true); // Postman, curl, etc.

        if (
            allowedOrigins.includes(origin) ||
            /^http:\/\/[a-z0-9-]+\.localhost:5173$/i.test(origin) // e.g. sushant.localhost:5173
        ) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS: ' + origin));
    },
    credentials: true
}));
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
app.use('/api/profiles/customize', require('./routes/profileCustomizationRoutes'));
app.use('/api/profiles/updates', require('./routes/updatesRoutes'));
app.use('/api/profiles/pages', require('./routes/customPagesRoutes'));
app.use('/api/tools', require('./routes/toolRoutes'));
app.use('/api/prompts', require('./routes/promptRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/offers', require('./routes/offerRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));

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
