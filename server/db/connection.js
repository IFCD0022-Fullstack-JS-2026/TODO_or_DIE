require("dotenv").config();
const mysql = require("mysql2/promise");


 async function getConexion() {
    try {
        let connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        });

        return connection;

    } catch (error) {
        console.log('message' + error);
    }
}

module.exports = getConexion;
