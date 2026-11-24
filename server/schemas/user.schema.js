const { z } = require("zod");


const UserSchema = z.object({
    nombre: z.string({ message: "El nombre es obligatorio" }).min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    email: z.email({ message: "El email no es válido" }),
    password: z.string({ message: "La contraseña es obligatoria" }).min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
});

const LoginSchema = z.object({
    email: z.email({ message: "El email no es válido" }),
    password: z.string({ message: "La contraseña es obligatoria" }).min(1, { message: "La contraseña es obligatoria" })
});

const PerfilSchema = z.object({
    nombre: z.string({ message: "El nombre es obligatorio" }).min(2, { message: "El nombre es obligatorio" }),
    email: z.email({ message: "El email no es válido" }),
});

const PasswordSchema = z.object({
    actual: z.string({ message: "La contraseña actual es obligatoria" }).min(1, { message: "La contraseña actual es obligatoria" }),
    nueva: z.string({ message: "La contraseña nueva es obligatoria" }).min(6, { message: "La contraseña nueva debe tener al menos 6 caracteres" })
});

module.exports = {
    UserSchema,
    LoginSchema,
    PerfilSchema,
    PasswordSchema
};
