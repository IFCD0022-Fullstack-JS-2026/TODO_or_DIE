require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { UserSchema, LoginSchema, PerfilSchema, PasswordSchema } = require('../schemas/user.schema.js');
const pool = require("../db/connection.js")
const { verificarToken } = require("../middleware/verificarToken.js");
const nodemailer = require("nodemailer");
const { RecuperarSchema, RestablecerSchema } = require('../schemas/user.schema.js');

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
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
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
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
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

router.put("/users/password", verificarToken, async (req, res) => {
    try {
        const validacion = PasswordSchema.safeParse(req.body);
        if (!validacion.success) {
            return res.status(400).json({
                success: false,
                errors: validacion.error.issues.map((err) => err.message)
            });
        }

        const { actual, nueva } = validacion.data;

        const [result] = await pool.query(
            "SELECT password FROM users WHERE id = ?",
            [req.usuario.id]
        );

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        const coincide = await bcrypt.compare(actual, result[0].password);

        if (!coincide) {
            return res.status(400).json({
                success: false,
                errors: ["La contraseña actual no es correcta"]
            });
        }

        const passwordCifrada = await bcrypt.hash(nueva, 10);

        await pool.query(
            "UPDATE users SET password = ? WHERE id = ?",
            [passwordCifrada, req.usuario.id]
        );

        res.status(200).json({ success: true, message: "Contraseña actualizada" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});


router.post("/users/recuperar", async (req, res) => {
    try {
        const validacion = RecuperarSchema.safeParse(req.body);
        if (!validacion.success) {
            return res.status(400).json({
                success: false,
                errors: validacion.error.issues.map((err) => err.message)
            });
        }

        const { email } = validacion.data;

        const [result] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);

        if (result.length > 0) {
            const usuario = result[0];

            const tokenRecuperacion = jwt.sign(
                { id: usuario.id, tipo: "recuperar" },
                process.env.JWT_SECRET,
                { expiresIn: "15m" }
            );

            const enlace = `http://localhost:5173/restablecer/${tokenRecuperacion}`;

            const testAccount = await nodemailer.createTestAccount();
            const transporter = nodemailer.createTransport({
                host: testAccount.smtp.host,
                port: testAccount.smtp.port,
                secure: testAccount.smtp.secure,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });

            const info = await transporter.sendMail({
                from: '"TODO or DIE" <no-reply@todoordie.com>',
                to: email,
                subject: "Recupera tu contraseña",
                text: `Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace (válido 15 minutos): ${enlace}`,
                html: `<p>Has solicitado restablecer tu contraseña.</p><p>Haz clic en el siguiente enlace (válido 15 minutos):</p><a href="${enlace}">${enlace}</a>`,
            });

            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }

        return res.status(200).json({
            success: true,
            message: "Si el correo está registrado, te hemos enviado un enlace"
        });

    } catch (error) {
        console.error("Error en recuperar contraseña:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});

router.post("/users/restablecer", async (req, res) => {
    try {
        const validacion = RestablecerSchema.safeParse(req.body);
        if (!validacion.success) {
            return res.status(400).json({
                success: false,
                errors: validacion.error.issues.map((err) => err.message)
            });
        }

        const { token, nueva } = validacion.data;

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(400).json({
                success: false,
                errors: ["El enlace no es válido o ha caducado"]
            });
        }

        if (decoded.tipo !== "recuperar") {
            return res.status(400).json({
                success: false,
                errors: ["El enlace no es válido o ha caducado"]
            });
        }

        const [result] = await pool.query("SELECT id FROM users WHERE id = ?", [decoded.id]);

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        const passwordCifrada = await bcrypt.hash(nueva, 10);
        await pool.query("UPDATE users SET password = ? WHERE id = ?", [passwordCifrada, decoded.id]);

        return res.status(200).json({
            success: true,
            message: "Contraseña cambiada"
        });

    } catch (error) {
        console.error("Error en restablecer contraseña:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});

module.exports = router;