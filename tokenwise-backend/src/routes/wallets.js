const express = require('express');
const router = express.Router();

// Placeholder wallet routes
router.get('/', (req, res) => {
  res.json({ message: 'Wallets endpoint - coming soon' });
});

router.get('/:address', (req, res) => {
  res.json({ message: 'Wallet details endpoint - coming soon' });
});

module.exports = router;
