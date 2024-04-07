const pingService = require('../services/ping.service.js');

exports.ping = async (req, res) => {
    try {
        const response = await pingService.sayPong();
        res.json({'message': response});
    } catch (error) {
        res.status(500).send({ msg: 'Internal error ping' });
    }
};
