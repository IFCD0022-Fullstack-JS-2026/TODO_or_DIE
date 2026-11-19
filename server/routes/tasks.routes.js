const express = require("express");
const router = express.Router();
const { z } = require("zod");

const pool = require ("../db/connection.js")

const { TareaSchema } = require('../schemas/task.schema.js');


router.get("/tasks", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tasks");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ success: false, message: "Error en el servidor: " + error.message });
  }
});

router.get("/tasks/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, message: "El id debe ser un número" });
    }

    const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    res.status(200).json({ tarea: rows[0] });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ error: "Error de servidor: " + error.message });
  }
});

router.delete("/tasks/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, message: "El id debe ser un número" });
    }

    const [result] = await pool.query("DELETE FROM tasks WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Tarea no encontrada" });
    }

    res.status(200).json({ success: true, message: "Tarea eliminada" });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

router.post('/tasks', async (req, res) => {
    try {
        const validacion = TareaSchema.safeParse(req.body);
        if (!validacion.success) {
            const mensajesError = (error) => {
              return error.issues.map((err) => err.message);
            }
            return res.status(400).json({success: false, errors: mensajesError(validacion.error)});
        }
        
        const titulo = validacion.data.titulo;
        const descripcion = validacion.data.descripcion;
        const fecha_hora = validacion.data.fecha_hora;
        const prioridad = validacion.data.prioridad;
        const categoria = validacion.data.categoria;
        const user_id = validacion.data.user_id;

        const [result] = await pool.query("insert into tasks (titulo, descripcion, fecha_hora, prioridad, categoria, user_id) values (?, ?, ?, ?, ?, ?)", [titulo, descripcion, fecha_hora, prioridad, categoria, user_id]);

        res.status(201).json({
          success: true, message: "tarea creada correctamente", id: result.insertId});
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});


router.put('/tasks/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const validacion = TareaSchema.safeParse(req.body);
        if (!validacion.success) {
            return res.status(400).json({success: false, errors: validacion.error.issues.map((err) => err.message)});
        }

        const titulo = validacion.data.titulo;
        const descripcion = validacion.data.descripcion;
        const fecha_hora = validacion.data.fecha_hora;
        const prioridad = validacion.data.prioridad;
        const categoria = validacion.data.categoria;
        const user_id = validacion.data.user_id;

        const [result] = await pool.query("update tasks set titulo=?, descripcion=?, fecha_hora=?, prioridad=?, categoria=?, user_id=? where id=?", [titulo, descripcion,  fecha_hora, prioridad, categoria, user_id, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({success: false, message: "Tarea no encontrada" });
        }
        res.status(200).json({success: true, message: "Tarea actualizada correctamente"});
    } catch (error) {
        console.error("Error en el servidor:", error);
        return res.status(500).json({success: false, message: "Error interno del servidor"});
    }
}); 

module.exports = router;