const express = require('express');
const propertyController = require('../controllers/property.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
const userValidationMiddleware = require('../middlewares/userValidation.middleware.js');

const router = express.Router();

router.get('/properties', authMiddleware, propertyController.readPropertiesOfUser);
router.get('/properties/:property_id', authMiddleware, propertyController.readProperty);
router.post('/properties', authMiddleware, propertyController.createProperty);
router.put('/properties/:property_id', authMiddleware, propertyController.editProperty);
router.delete('/properties/:property_id', authMiddleware, propertyController.deleteProperty);

module.exports = router;
