const express = require('express');
const userRoute = require('./user.route.js');
const propertyRoute = require('./property.route.js');

const router = express.Router();

router.use('/', userRoute);
router.use('/', propertyRoute);

module.exports = router;
