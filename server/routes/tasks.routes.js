const express = require("express");
const router = express.Router();
const { z } = require("zod");


const schemaDB = require("../db/schemaDb.js");
const { TareaSchema } = require('../schemas/tasks.schema.js');


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
            return res.status(201).json({success: true, message: "Tarea creada correctamente", data: nuevaTarea});
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
            return res.status(404).json({success: false, errors: validacion.error.issues[0].message});
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
        return res.status(200).json({success: true, message: "Tarea actualizada correctamente", data: schemaDB[posicionTarea]});
    } catch (error) {
        console.error("ERROR REAL EN EL SERVIDOR:", error);
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