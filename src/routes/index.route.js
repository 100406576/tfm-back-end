const express = require('express');
const userRoute = require('./user.route.js');

const router = express.Router();

router.use('/', userRoute);

module.exports = router;
