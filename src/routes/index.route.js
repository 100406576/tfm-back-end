const express = require('express');
const pingRoute = require('../routes/ping.route.js');
const userRoute = require('../routes/user.route.js');

const router = express.Router();

router.use('/', pingRoute);
router.use('/', userRoute);

module.exports = router;
