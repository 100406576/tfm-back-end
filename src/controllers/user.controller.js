import userService from "../services/user.service.js"

export const readUsers = async (req, res) => {
    try {
        const response = await userService.readUsers();
        res.json({'users': response});
    } catch (error) {
        console.error(error);
        res.status(500).send({
            msg: 'Internal server error',
            error: error.message,
        });
    }
};

export const createUser = async (req, res) => {
    try {
        const dataUser = req.body;
        await userService.createUser(dataUser)
        res.status(201).json({
            ok: true,
            status: 201,
            message: "Created Product",
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            msg: 'Internal server error',
            error: error.message,
        });
    }
};