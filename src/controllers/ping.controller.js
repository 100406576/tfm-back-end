import pingService from '../services/ping.service.js'

export const ping = async (req, res) => {
    try {
        const response = await pingService.sayPong()
        res.json({'message': response});
    } catch (error) {
        res.status(500).send({ msg: 'Internal error ping' })
    }
};