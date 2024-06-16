const express = require('express');
const taxReturnController = require('../controllers/taxReturn.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');

const router = express.Router();

router.post('/tax-return', authMiddleware, taxReturnController.calculateTaxReturn);

module.exports = router;
