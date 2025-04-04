require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware setup
app.use(cors()); // ← This must be a function
app.use(express.json());


const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST'],
  credentials: true
};

app.use(cors(corsOptions)); // Place this before your routes
// Import routes PROPERLY (critical fix)
const routes = require('./routes'); // ← Ensure this exports a router

// Use routes
app.use('/api', routes); // ← routes must be a function

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});