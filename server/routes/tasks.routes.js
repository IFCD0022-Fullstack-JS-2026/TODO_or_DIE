const express = require("express");
const router = express.Router();
const { z } = require("zod");


/* const schemaDB = require("../db/schemaDb.js"); */

const pool = require ("../db/connection.js")

const { TareaSchema } = require('../schemas/task.schema.js');


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

router.post("/tasks", async (req, res) => {
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

        const conexion = await pool;
        await conexion.query("insert into tasks (titulo, descripcion, fecha_hora, prioridad, categoria, user_id) values (?, ?, ?, ?, ?, ?)", [titulo, descripcion, fecha_hora, prioridad, categoria, user_id]);
        
        res.status(201).json({msg: "tarea creada correctamente"});
    } catch (error) {
        res.status(500).json({message: "Error de servidor", error})
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

        const conexion = await pool;
        const [resultado] = await conexion.query("update tasks set titulo=?, descripcion=?, fecha_hora=?, prioridad=?, categoria=?, user_id=? where id=?", [titulo, descripcion,  fecha_hora, prioridad, categoria, user_id, id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: "Tarea no encontrada" });
        }

        res.status(200).json({success: true, message: "Tarea actualizada correctamente"});
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