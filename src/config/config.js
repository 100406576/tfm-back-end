const { config } = require('dotenv');

if (process.env.NODE_ENV === 'test') {
    console.log("Entorno de test")
    config({ path: '.env.test' });
} else {
    config();
}

exports.PORT = process.env.PORT || 3000;
exports.DB_HOST = process.env.DB_HOST || "localhost";
exports.DB_DATABASE = process.env.DB_DATABASE || "tfm_db";
exports.DB_USERNAME = process.env.DB_USERNAME || "root";
exports.DB_PASSWORD = process.env.DB_PASSWORD || "1234";
exports.DB_DIALECT = process.env.DB_DIALECT || "mysql";
exports.DB_PORT = process.env.DB_PORT || 3306;