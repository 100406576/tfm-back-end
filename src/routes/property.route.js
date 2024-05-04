const express = require('express');
const propertyController = require('../controllers/property.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
const userValidationMiddleware = require('../middlewares/userValidation.middleware.js');

const router = express.Router();

router.get('/properties/seed', async (req, res) => {
    const Property = require('../models/property.model');
    //const Flat = require('../models/flat.model');
    //const House = require('../models/house.model');
    const Garage = require('../models/garage.model');

    const propiedad = await Property.create({
        propertyName: 'Casa de la montaña',
        address: 'Calle de la montaña, 5, Bajo A',
        cadastralReference: '12345678901234',
        user_id: '1833a628-a640-4754-ab20-10989104e1ad'
    })
    
    const casa = await Garage.create({
        property_id: propiedad.property_id,
        capacity: 1,
        isPrivate: true
    })

    res.status(200).json(casa);
});
router.get('/users/:username/properties', authMiddleware, userValidationMiddleware, propertyController.readPropertiesOfUser);
router.get('/properties/:property_id', authMiddleware, propertyController.readProperty);
// router.post('/users/:username/properties', authMiddleware, userValidationMiddleware, propertyController.createProperty);
// router.put('/property/:property_id', authMiddleware, propertyController.editProperty);
// router.delete('/property/:property_id', authMiddleware, propertyController.deleteProperty);

module.exports = router;
