const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getPendingSubmissions, approveSubmission, rejectSubmission } = require('../controllers/adminController');

router.get('/pending-submissions', protect, adminOnly, getPendingSubmissions);
router.post('/approve-submission/:id', protect, adminOnly, approveSubmission);
router.post('/reject-submission/:id', protect, adminOnly, rejectSubmission);

module.exports = router;