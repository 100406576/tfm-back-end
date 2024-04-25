const express = require('express');
const propertyController = require('../controllers/property.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
const userValidationMiddleware = require('../middlewares/userValidation.middleware.js');

const router = express.Router();

router.get('/properties/seed', async (req, res) => {
    const Property = require('../models/property.model');
    const Flat = require('../models/flat.model');

    const propiedad = await Property.create({
        property_name: 'Casa de la montaña',
        address: 'Calle de la montaña, 5, Bajo A',
        user_id: '6c28dd7d-f8d6-4f61-ac4c-ed6346ee2f8a'
    })
    
    const casa = await Flat.create({
        property_id: propiedad.property_id,
        numberOfRooms: 3,
        hasBalcony: true,
        floorNumber: 2
    })

    res.status(200).json(casa);
});
router.get('/users/:username/properties', authMiddleware, userValidationMiddleware, propertyController.readPropertiesOfUser);
router.get('/property/:propertyId', authMiddleware, propertyController.readProperty);
// router.post('/users/:username/properties', authMiddleware, userValidationMiddleware, propertyController.createProperty);
// router.put('/property/:propertyId', authMiddleware, propertyController.editProperty);
// router.delete('/property/:propertyId', authMiddleware, propertyController.deleteProperty);

module.exports = router;
