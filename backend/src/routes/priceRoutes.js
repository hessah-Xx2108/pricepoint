const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, checkTrustLevel } = require('../middleware/auth');
const { submitPrice, getNearbyPrices } = require('../controllers/priceController');

router.post('/submit', protect, checkTrustLevel, upload.single('receipt'), submitPrice);
router.get('/nearby', protect, getNearbyPrices);

module.exports = router;