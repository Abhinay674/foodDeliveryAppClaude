const express = require('express');
const router = express.Router();
const { resolveIssue } = require('../controllers/supportController');

// POST /api/support/resolve
// Body: { message: "My order is delayed and I want a refund" }
router.post('/resolve', resolveIssue);

module.exports = router;
