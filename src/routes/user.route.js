const express = require('express');
const userController = require('../controllers/user.controller.js');

const router = express.Router();

router.get('/users', userController.readUsers);
router.get('/users/:username', userController.readUser)
router.post('/users', userController.createUser);

module.exports = router;
