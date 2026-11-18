const { z } = require("zod");


const UserSchema = z.object({
    nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    email: z.email(),
    password: z.string().min(6, { message: "El password debe tener al menos 6 caracteres" })
});

module.exports = {
    UserSchema
};
