const { z } = require("zod");


const UserSchema = z.object({
    nombre: z.string({ message: "El nombre es obligatorio" }).min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    email: z.email({ message: "El email no es válido" }),
    password: z.string({ message: "La contraseña es obligatoria" }).min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
});

module.exports = {
    UserSchema
};
