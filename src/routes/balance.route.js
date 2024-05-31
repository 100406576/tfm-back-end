const express = require('express');
const balanceController = require('../controllers/balance.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');

const router = express.Router();

router.post('/balances', authMiddleware, balanceController.createBalance);

module.exports = router;
