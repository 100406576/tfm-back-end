const express = require('express');
const { readUsers, createUser } = require('../controllers/user.controller.js');

const router = express.Router();

router.get('/users', readUsers);
router.post('/users', createUser);

module.exports = router;
