const express = require('express');
const router = express.Router();

// Import and use your route files
const predictRoutes = require('./api/predict');

router.use('/predict', predictRoutes); // ← Must be a function

module.exports = router; // ← This exports the router