const express = require('express');
const router = express.Router();
const { tokenController } = require('../controllers/tokenController');

// Get token information
router.get('/:address', tokenController.getTokenInfo);

// Get top wallet holders for a token
router.get('/:address/holders', tokenController.getTopWallets);

// Get token transactions
router.get('/:address/transactions', tokenController.getTransactions);

// Get protocol statistics for a token
router.get('/:address/protocol-stats', tokenController.getProtocolStats);

// Get historical data for a token
router.get('/:address/historical', tokenController.getHistoricalData);

module.exports = router;
