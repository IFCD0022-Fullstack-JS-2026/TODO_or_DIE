require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { UserSchema, LoginSchema  } = require('../schemas/user.schema.js');
const pool = require("../db/connection.js")

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

        const token = jwt.sign({id: usuario.id, nombre: usuario.nombre }, process.env.JWT_SECRET, { 
            expiresIn: "1h"
        })
        res.json({token})

        return res.status(200).json({
            success: true,
            message: "Login exitoso",
            data: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, token},
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});

module.exports = router;