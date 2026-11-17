const express = require("express");
const router = express.Router();

router.get("/health", (req, res) => {
  try {
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
});


module.exports = router;