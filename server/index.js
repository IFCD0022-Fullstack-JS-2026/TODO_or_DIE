const express  = require('express')
const cors = require('cors');
require("dotenv").config();
const PORT = process.env.PORT;
const tareaRoutes = require("../routes/tarea.routes");
const server = express()


server.use(express.json());
server.use(cors());

server.use("/api", tareaRoutes);

server.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Error 404 - Ruta no encontrada",
  });
});

// TODO (404): responder 404 en JSON a las rutas que no existen
server.listen(PORT, () => {
  console.log(`===========================================`);
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`URL http://localhost:${PORT}`);
  console.log(`===========================================`);
});
