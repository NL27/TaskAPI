const path = require('path');
const express = require('express');
const cors = require('cors');

require('dotenv').config();
const port = process.env.PORT || 5001;
const connectDB = require('./config/db');

connectDB();

const app = express();

// Request logging for debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// CORS middleware for development
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cors middleware
app.use(
    cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5001'],
    credentials: true,
    }),
);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const tasksRouter = require('./routes/tasks');
app.use('/api/tasks', tasksRouter);

app.listen(port, () => console.log(`Server is running on port ${port}`));