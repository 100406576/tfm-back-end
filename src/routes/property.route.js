const express = require('express');
const propertyController = require('../controllers/property.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
const userValidationMiddleware = require('../middlewares/userValidation.middleware.js');

const router = express.Router();

router.get('/users/:username/properties', authMiddleware, userValidationMiddleware, propertyController.readPropertiesOfUser);
router.get('/properties/:property_id', authMiddleware, propertyController.readProperty);
router.post('/users/:username/properties', authMiddleware, userValidationMiddleware, propertyController.createProperty);
// router.put('/property/:property_id', authMiddleware, propertyController.editProperty);
router.delete('/properties/:property_id', authMiddleware, propertyController.deleteProperty);

module.exports = router;
