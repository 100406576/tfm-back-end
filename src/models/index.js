import { Sequelize } from "sequelize";
import { DB_HOST, DB_DATABASE, DB_DIALECT, DB_PASSWORD, DB_USERNAME, DB_PORT } from "../config/config.js";

const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: DB_DIALECT,
    port: DB_PORT
});


async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log("All good!!")
    } catch (error) {
        console.error("All bad!!", err)
    }
}

testConnection();

export default sequelize;