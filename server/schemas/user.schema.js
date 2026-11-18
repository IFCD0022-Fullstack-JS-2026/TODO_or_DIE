const { z } = require("zod");


const UserSchema = z.object({
    nombre: z.string().min(2, { message: "El nombre es obligatorio" }),
    email: z.email({ message: "El email no es válido" }),
    password: z.string().min(6, { message: "La contraseña no es válido" })
});

module.exports = {
    UserSchema
};
