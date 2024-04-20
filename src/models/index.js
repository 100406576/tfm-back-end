const Sequelize = require("sequelize");
const { DB_HOST, DB_DATABASE, DB_DIALECT, DB_PASSWORD, DB_USERNAME, DB_PORT } = require("../config/config.js");

console.log(DB_HOST, DB_DATABASE, DB_DIALECT, DB_PASSWORD, DB_USERNAME, DB_PORT);

const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: DB_DIALECT,
    port: DB_PORT
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
