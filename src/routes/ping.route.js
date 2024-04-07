const express = require('express');
const { ping } = require('../controllers/ping.controller.js');

const router = express.Router();

router.get('/ping', ping);

module.exports = router;
