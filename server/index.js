const express = require('express')
const cors = require('cors');
require("dotenv").config();
const PORT = process.env.PORT;

const pool = require("./db/connection");


const healthRoutes = require("./routes/health.routes");
const tasksRoutes = require("./routes/tasks.routes");

const server = express()


server.use(express.json());
server.use(cors());

server.use("/api", healthRoutes);
server.use("/api", tasksRoutes);

server.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Error 404 - Ruta no encontrada",
    });
});

const cargarDatosPrueba = require('./db/seed.js');

pool.query("SELECT 1")
    .then(() => {
        console.log("Conexión a MySQL correcta")
        return cargarDatosPrueba();
    })
    .catch((error) => console.error("Error con MySQL:", error.message));

server.listen(PORT, () => {
    console.log(`===========================================`);
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`URL http://localhost:${PORT}`);
    console.log(`===========================================`);
});
