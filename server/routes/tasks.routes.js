const express = require("express");
const router = express.Router();
const pool = require("../db/connection.js")
const { TareaSchema } = require('../schemas/task.schema.js');
const { verificarToken } = require("../middleware/verificarToken.js");

router.get("/tasks", verificarToken, async (req, res) => {
  try {
    const { buscar, categoria } = req.query;

    let sql = "SELECT * FROM tasks WHERE user_id = ?";
    const valores = [req.usuario.id];

    if (buscar) {
      sql += " AND (titulo LIKE ? OR descripcion LIKE ?)";
      valores.push(`%${buscar}%`, `%${buscar}%`);
    }

    if (categoria) {
      sql += " AND categoria = ?";
      valores.push(categoria);
    }

    sql += " ORDER BY fecha_hora";

    const [rows] = await pool.query(sql, valores);

    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

router.get("/tasks/estadisticas", verificarToken, async (req, res) => {
  try {
    const [total] = await pool.query("SELECT COUNT(*) AS total FROM tasks WHERE user_id =?",
      [req.usuario.id]
    );
    const [porPrioridad] = await pool.query("SELECT prioridad, COUNT(*) AS total FROM tasks WHERE user_id =? group by prioridad",
      [req.usuario.id]
    );
    const [porCategoria] = await pool.query("SELECT categoria, COUNT(*) AS total FROM tasks WHERE user_id =? group by categoria",
      [req.usuario.id]
    );

    const [porCompletadas] = await pool.query("SELECT COUNT(*) AS total FROM tasks WHERE user_id = ? AND completada = 1",
      [req.usuario.id]
    );
    
    const totalTareas = total[0].total;
    const completadas = porCompletadas[0].total;
    const pendientes = totalTareas - completadas;

    res.status(200).json({ success: true, data: { totalTareas, porPrioridad, porCategoria, completadas, pendientes } });
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

router.get("/tasks/hoy", verificarToken, async (req, res) => {

  try {

    const [hoy] = await pool.query(" SELECT * FROM tasks WHERE user_id = ? AND DATE(fecha_hora) = CURDATE() ORDER BY fecha_hora",
      [req.usuario.id]
    );


    return res.status(200).json({ success: true, data: hoy });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});


router.get("/tasks/categorias", verificarToken, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT DISTINCT categoria FROM tasks WHERE user_id = ? ORDER BY categoria", [req.usuario.id]);

    const data = rows.map((fila) => fila.categoria);

    return res.status(200).json({ success: true, data });

  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

router.get("/tasks/calendario", verificarToken, async (req, res) => {
  try {
    const anio = Number(req.query.anio);
    const mes = Number(req.query.mes);

    if (
      !req.query.anio ||
      !req.query.mes ||
      String(req.query.anio).trim() === "" ||
      String(req.query.mes).trim() === "" ||
      !Number.isInteger(anio) ||
      !Number.isInteger(mes) ||
      mes < 1 ||
      mes > 12
    ) {
      return res.status(400).json({
        success: false,
        message: "El año y el mes son obligatorios",
      });
    }

    const [rows] = await pool.query(
      "SELECT * FROM tasks WHERE user_id = ? AND YEAR(fecha_hora) = ? AND MONTH(fecha_hora) = ? ORDER BY fecha_hora",
      [req.usuario.id, anio, mes]
    );

    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

router.get("/tasks/vencidas", verificarToken, async (req, res) => {
  try {
    const [vencidas] = await pool.query(`SELECT * FROM tasks WHERE user_id = ? AND completada = 0 AND fecha_hora < NOW() ORDER BY fecha_hora`,
  [req.usuario.id]
);
    return res.status(200).json({ success: true, data: vencidas });
  } catch (error) {
    console.error("Error al obtener tareas vencidas:", error);
    return res.status(500).json({ success: false,message: "Error interno del servidor",});
  }
});

router.get("/tasks/:id", verificarToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, message: "El id debe ser un número" });
    }

    const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ? AND user_id = ?", [id, req.usuario.id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Tarea no encontrada" });
    }

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ success: false, message: "Error de servidor" });
  }
});

router.delete("/tasks/:id", verificarToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, message: "El id debe ser un número" });
    }

    const [result] = await pool.query("DELETE FROM tasks WHERE id = ? AND user_id = ?", [id, req.usuario.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Tarea no encontrada" });
    }

    res.status(200).json({ success: true, message: "Tarea eliminada" });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

router.post('/tasks', verificarToken, async (req, res) => {
  try {
    const validacion = TareaSchema.safeParse(req.body);
    if (!validacion.success) {
      const mensajesError = (error) => error.issues.map((err) => err.message);
      return res.status(400).json({ success: false, errors: mensajesError(validacion.error) });
    }

    const { titulo, descripcion, prioridad, categoria } = validacion.data;
    const fecha_hora = validacion.data.fecha_hora || null;
    const user_id = req.usuario.id;
    const [result] = await pool.query(
      "insert into tasks (titulo, descripcion, fecha_hora, prioridad, categoria, user_id) values (?, ?, ?, ?, ?, ?)",
      [titulo, descripcion, fecha_hora, prioridad, categoria, user_id]
    );
    const nuevaTarea = {
      id: result.insertId,
      titulo,
      descripcion,
      fecha_hora,
      prioridad,
      categoria,
      user_id
    };
    res.status(201).json({
      success: true,
      message: "Tarea creada",
      data: nuevaTarea
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});


router.put('/tasks/:id', verificarToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, message: "El id debe ser un número" });
    }

    const validacion = TareaSchema.safeParse(req.body);
    if (!validacion.success) {
      return res.status(400).json({ success: false, errors: validacion.error.issues.map((err) => err.message) });
    }

    const { titulo, descripcion, prioridad, categoria } = validacion.data;
    const fecha_hora = validacion.data.fecha_hora || null;

    const [result] = await pool.query(
      "UPDATE tasks SET titulo = ?, descripcion = ?, fecha_hora = ?, prioridad = ?, categoria = ? WHERE id = ? AND user_id = ?",
      [titulo, descripcion, fecha_hora, prioridad, categoria, id, req.usuario.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Tarea no encontrada" });
    }
    res.status(200).json({ success: true, message: "Tarea actualizada" });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

router.patch("/tasks/:id/completada", verificarToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, message: "El id debe ser un número" });
    }

    const [update] = await pool.query(
      "UPDATE tasks SET completada = NOT completada WHERE id = ? AND user_id = ?",
      [id, req.usuario.id]
    );

    if (update.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Tarea no encontrada" });
    }

    const [rows] = await pool.query(
      "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
      [id, req.usuario.id]
    );

    res.status(200).json({
      success: true,
      message: "Tarea actualizada",
      data: rows[0],
    });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

module.exports = router;