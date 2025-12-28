require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const articleRoutes = require('./routes/articleRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database
connectDB();

// Routes
app.use('/api/articles', articleRoutes);

// Health Check
app.get('/', (req, res) => res.send('BeyondChats Assignment API is Running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));