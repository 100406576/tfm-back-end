const Property = require('../models/property.model');
const House = require('../models/house.model');
const Flat = require('../models/flat.model');
const Garage = require('../models/garage.model');

const cleanPropertyDetails = (property) => {
    const propertyObject = property.toJSON();
    if (!propertyObject.houseDetails) delete propertyObject.houseDetails;
    if (!propertyObject.flatDetails) delete propertyObject.flatDetails;
    if (!propertyObject.garageDetails) delete propertyObject.garageDetails;
    return propertyObject;
};

const readPropertiesByUserId = async function(userId) {
    try {
      const properties = await Property.findAll({
        where: { user_id: userId },
        include: [
          { model: House, as: 'houseDetails' },
          { model: Flat, as: 'flatDetails' },
          { model: Garage, as: 'garageDetails' },
        ],
      });
  
      const cleanedProperties = properties.map(cleanPropertyDetails);
  
      return cleanedProperties;
    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener las propiedades del usuario');
    }
};

const readProperty = async function(propertyId) {
    const property = await Property.findByPk(propertyId, {
        include: [
            { model: House, as: 'houseDetails' },
            { model: Flat, as: 'flatDetails' },
            { model: Garage, as: 'garageDetails' },
        ],
    });
    return cleanPropertyDetails(property);
}
  
module.exports = {
    readPropertiesByUserId,
    readProperty
};