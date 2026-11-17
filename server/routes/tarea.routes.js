const express = require("express");
const router = express.Router();
const getConexion = require('../db/connection.js');
const { log } = require("console");

router.get("/health", async (req, res) => {
  try {
    const conexion = await getConexion();

    const [result] = await conexion.execute('select * from users')
    console.log('connection ok');
    
    res.status(200).json({ msg: result });

  } catch (error) {
    console.log('connection error')
    res.status(500).json({ message: "connection error" + error.message });
  }
});


module.exports = router;