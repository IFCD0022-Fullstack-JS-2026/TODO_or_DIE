require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { UserSchema, LoginSchema, PerfilSchema } = require('../schemas/user.schema.js');
const pool = require("../db/connection.js")
const { verificarToken } = require("../middleware/verificarToken.js");

router.post("/users/register", async (req, res) => {
    try {
        const validacion = UserSchema.safeParse(req.body);
        if (!validacion.success) {
            const mensajesError = (error) => {
                return error.issues.map((err) => err.message);
            }
            return res.status(400).json({
                success: false, errors: mensajesError(validacion.error)
            });
        }

        const { nombre, email, password } = validacion.data;
        const [result] = await pool.query("select * from users where email = ?", [email]);
        if (result.length > 0) {
            return res.status(409).json({ success: false, errors: ["Email ya registrado"] });
        }

        const passwordCifrada = await bcrypt.hash(password, 10);

        await pool.query(
            "insert into users (nombre, email, password) values (?, ?, ?)",
            [nombre, email, passwordCifrada]
        );
        return res.status(201).json({
            success: true,
            message: "Usuario creado",
            data: { nombre, email }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});

router.post("/users/login", async (req, res) => {
    try {
        const validacion = LoginSchema.safeParse(req.body);
        if (!validacion.success) {
            const mensajesError = (error) => {
                return error.issues.map((err) => err.message);
            }
            return res.status(400).json({ success: false, errors: mensajesError(validacion.error) });
        }

        const { email, password } = validacion.data;
        const [result] = await pool.query("select * from users where email = ?", [email]);

        if (result.length === 0) {
            return res.status(401).json({ success: false, message: "Email o contraseña incorrectos" });
        }

        const usuario = result[0];
        const coincide = await bcrypt.compare(password, usuario.password);

        if (!coincide) {
            return res.status(401).json({ success: false, message: "Email o contraseña incorrectos" });
        }

        const token = jwt.sign({ id: usuario.id, nombre: usuario.nombre }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        })

        return res.status(200).json({
            success: true,
            message: "Login exitoso",
            data: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, token },
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});

router.get("/users/perfil", verificarToken, async (req, res) => {
    try {
        const [result] = await pool.query(
            "select id, nombre, email from users where id = ?",
            [req.usuario.id]
        );

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        return res.status(200).json({ success: true, data: result[0] });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});

router.put("/users/perfil", verificarToken, async (req, res) => {
    try {
        const validacion = PerfilSchema.safeParse(req.body);
        if (!validacion.success) {
            const mensajesError = (error) => {
                return error.issues.map((err) => err.message);
            }
            return res.status(400).json({
                success: false, errors: mensajesError(validacion.error)
            });
        }

        const { nombre, email } = validacion.data;
        const [result] = await pool.query("select id from users where email = ? and id !=?", [email, req.usuario.id]);
        if (result.length > 0) {
            return res.status(409).json({ success: false, errors: ["Email ya registrado"] });
        }

        const [usuario] = await pool.query("select id from users where id = ?", [req.usuario.id]);
        if (usuario.length === 0) {
            return res.status(404).json({ success: false, message: ["Usuario no encontrado"] });
        }

        await pool.query(
            "update users set nombre = ?, email = ? where id = ?",
            [nombre, email, req.usuario.id]
        );
        return res.status(200).json({
            success: true,
            message: "Perfil actualizado",
            data: { id: req.usuario.id, nombre, email }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }

});

router.delete("/users/perfil", verificarToken, async (req, res) => {
    try {
       const [usuario] = await pool.query("select id from users where id = ?", [req.usuario.id]);
        if (usuario.length === 0) {
            return res.status(404).json({ success: false, errors: ["Usuario no encontrado"] });
        }
        
        await pool.query(
            "delete from tasks where user_id = ?",
            [req.usuario.id]
        );
        await pool.query(
            "delete from users where id = ?",
            [req.usuario.id]
        );
        return res.status(200).json({
            success: true,
            message: "Cuenta borrada"
        });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }

});

module.exports = router;