const express = require('express');
const userController = require('../controllers/user.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
const userValidationMiddleware = require('../middlewares/userValidation.middleware.js')

const router = express.Router();

router.get('/users/login', userController.loginUser);
router.get('/users/:username', authMiddleware, userValidationMiddleware, userController.readUser);
router.post('/users', userController.createUser);
router.put('/users/:username', authMiddleware, userValidationMiddleware, userController.updateUser);
router.delete('/users/:username', authMiddleware, userValidationMiddleware, userController.deleteUser);

module.exports = router;
