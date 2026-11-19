const express = require("express");
const router = express.Router();
const { z } = require("zod");

const pool = require("../db/connection.js");
const schemaDB = require("../db/schemaDb.js"); 
const { TareaSchema } = require('../schemas/task.schema.js');


router.get("/tasks", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tasks");
    res.status(200).json({success: true, data: rows});
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
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
      return res.status(404).json({ success: false, message: "Tarea no encontrada" });
    }

    res.status(200).json({ success: true, data:rows[0] });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ success: false, message: "Error de servidor"});
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

router.post('/tasks', (req, res) => {
    try {
        const validacion = TareaSchema.safeParse(req.body);
        if (!validacion.success) {
            const mensajesError = (error) => {
                return error.issues.map((err) => err.message);
            }
            return res.status(400).json({success: false, errors: mensajesError(validacion.error)});
        } else {
            const { titulo, descripcion, fecha_hora, prioridad, categoria, user_id } = validacion.data;
            const nuevoId = schemaDB.length > 0 ? Math.max(...schemaDB.map(t => t.id)) + 1 : 1;

            const nuevaTarea = {
            id: nuevoId,
            titulo: titulo,
            descripcion: descripcion,
            fecha_hora: fecha_hora,
            prioridad: prioridad,
            categoria: categoria,
            user_id: user_id
            };
            schemaDB.push(nuevaTarea);
            return res.status(201).json({success: true, message: "Tarea creada", data: nuevaTarea});
        }
    } catch (error) {
        return res.status(500).json({success: false, message: "Error interno del servidor", error});
    }
});

router.put('/tasks/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const validacion = TareaSchema.safeParse(req.body);
        if (!validacion.success) {
            return res.status(400).json({success: false, errors: validacion.error.issues.map((err) => err.message)});
        } 
        const posicionTarea = schemaDB.findIndex((t) => t.id === id);
        if (posicionTarea === -1) {
            return res.status(404).json({success: false, message: "Tarea no encontrada"});
        }
        const { titulo, descripcion, fecha_hora, prioridad, categoria, user_id } = validacion.data;
            
        schemaDB[posicionTarea] = {
            id: id,
            titulo: titulo,
            descripcion: descripcion,
            fecha_hora: fecha_hora,
            prioridad: prioridad,
            categoria: categoria,
            user_id: user_id
        }
        return res.status(200).json({success: true, message: "Tarea actualizada", data: schemaDB[posicionTarea]});
    } catch (error) {
        console.error("Error en el servidor:", error);
        return res.status(500).json({success: false, message: "Error interno del servidor"});
    }
});

module.exports = router;