const Sequelize = require("sequelize");
const { DB_HOST, DB_DATABASE, DB_DIALECT, DB_PASSWORD, DB_USERNAME, DB_PORT } = require("../config/config.js");

const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: DB_DIALECT,
    port: DB_PORT,
    logging: process.env.NODE_ENV === 'test' ? false : console.log
});

module.exports = sequelize;

/*async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log("All good!!")
    } catch (error) {
        console.error("All bad!!", err)
    }
}

testConnection();*/
