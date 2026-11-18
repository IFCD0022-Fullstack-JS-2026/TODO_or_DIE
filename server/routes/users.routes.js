const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { UserSchema } = require('../schemas/user.schema.js');
const pool = require("../db/connection.js")

router.post("/users/register", async (req, res) => {
    try {
        const validacion = UserSchema.safeParse(req.body);
        if (!validacion.success) {
            const mensajesError = (error) => {
                return error.issues.map((err) => err.message);
            }
            return res.status(400).json({success: false, errors: mensajesError(validacion.error)});
        } else {
            const { nombre, email, password } = validacion.data;
            const [result] = await pool.query("select * from users where email = ?", [email] )
            if (result.length > 0) {
                return res.status(409).json({success: false, errors: ["Email ya existe en la base de datos"]})
            }

            const passwordCifrada = await bcrypt.hash(password, 10);

            await pool.query("insert into users (nombre, email, password) values (?, ?, ?)", [ nombre, email, passwordCifrada])
            return res.status(201).json({success: true, message: "Usuario creado correctamente", data: {nombre:nombre, email: email}}); 
        }
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor: " + error.message });
    }
})

module.exports = router;