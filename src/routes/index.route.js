const express = require('express');
const userRoute = require('./user.route.js');
const propertyRoute = require('./property.route.js');
const operationRoute = require('./operation.route.js');
const balanceRoute = require('./balance.route.js');

const router = express.Router();

router.use('/', userRoute);
router.use('/', propertyRoute);
router.use('/', operationRoute);
router.use('/', balanceRoute);

module.exports = router;
