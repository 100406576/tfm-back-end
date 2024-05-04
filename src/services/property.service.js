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

const readPropertiesByUserId = async function(user_id) {
    try {
      const properties = await Property.findAll({
        where: { user_id: user_id },
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

const readProperty = async function(property_id) {
    const property = await Property.findByPk(property_id, {
        include: [
            { model: House, as: 'houseDetails' },
            { model: Flat, as: 'flatDetails' },
            { model: Garage, as: 'garageDetails' },
        ],
    });

    if (property === null) {
        return null;
    }
    return cleanPropertyDetails(property);
}

const deleteProperty = async function(property_id) {
    return await Property.destroy({
        where: {
            property_id: property_id
        }
    });
}
  
module.exports = {
    readPropertiesByUserId,
    readProperty,
    deleteProperty
};