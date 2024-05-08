const Property = require('../models/property.model');
const House = require('../models/house.model');
const Flat = require('../models/flat.model');
const Garage = require('../models/garage.model');

const cleanPropertyDetails = (property) => {
    if (property === null) {
        return null;
    }

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
    return cleanPropertyDetails(property);
}

const createProperty = async function(property) {

    const createdProperty = await Property.create({
        propertyName: property.propertyName,
        address: property.address,
        cadastralReference: property.cadastralReference,
        user_id: property.user_id,
    });

    if (property.houseDetails) {
        await House.create({
            property_id: createdProperty.property_id,
            ...property.houseDetails
        });
    }

    if (property.flatDetails) {
        await Flat.create({
            property_id: createdProperty.property_id,
            ...property.flatDetails
        });
    }

    if (property.garageDetails) {
        await Garage.create({
            property_id: createdProperty.property_id,
            ...property.garageDetails
        });
    }

    return cleanPropertyDetails(createdProperty);
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
    createProperty,
    deleteProperty
};