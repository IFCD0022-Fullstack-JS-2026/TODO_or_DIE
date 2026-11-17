const express = require("express");
const router = express.Router();

const schemaDB = require("../db/schemaDb.js");


router.get("/tasks", (req, res) => {
  try {
    res.status(200).json( schemaDB );
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" + error.message });
  }
});


router.get("/tasks/:id", (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const tareasId = schemaDB.find(tasks => tasks.id === id);
        if (!tareasId) {
            return res.status(404).json({ error: "Tarea no encontrada!" });
        }
        res.status(200).json({ tarea: tareasId });
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor: " + error.message });
    }
});


router.post('/tasks', (req, res) => {
    try {
        const id = Math.max(0, ...schemaDB.map((t) => t.id)) + 1;
        const { titulo, descripcion, fecha_hora, prioridad, categoria, user_id } = req.body;
        const nuevaTarea = {
            id: id,
            titulo: titulo,
            descripcion: descripcion,
            fecha_hora: fecha_hora,
            prioridad: prioridad,
            categoria: categoria,
            user_id: user_id
        };
        schemaDB.push(nuevaTarea);
        res.status(201).json({success: true, message: "Nueva tarea creada correctamente", data: nuevaTarea});
    } catch (error) {
        return res.status(500).json({success: false, message: "Error interno del servidor"});
    }
});


router.put('/tasks/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const posicionTarea = schemaDB.findIndex((t) => t.id === id);
        if (posicionTarea === -1) {
            return res.status(404).json({success: false, message: "Tarea no encontrada"});
        }
        const { titulo, descripcion, fecha_hora, prioridad, categoria, user_id } = req.body;
        schemaDB[posicionTarea] = {
            id: id,
            titulo: titulo,
            descripcion: descripcion,
            fecha_hora: fecha_hora,
            prioridad: prioridad,
            categoria: categoria,
            user_id: user_id
        };
        res.status(200).json({success: true, message: "Tarea actualizada correctamente", data: schemaDB[posicionTarea]});
    } catch (error) {
        return res.status(500).json({success: false, message: "Error interno del servidor"});
    }
});





router.delete('/tasks/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const posicionTarea = schemaDB.findIndex((t) => t.id === id);
        if (posicionTarea === -1) {
            return res.status(404).json({success: false, message: "Tarea no encontrada"});
        }
        schemaDB.splice(posicionTarea, 1);
        res.status(200).json({success: true, message: "Tarea eliminada correctamente"});
    } catch (error) {
        return res.status(500).json({success: false, message: "Error interno del servidor"});
    }
});


module.exports = router;