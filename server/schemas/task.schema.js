const { z } = require("zod");


const TareaSchema = z.object({
    titulo: z.string().min(2, { message: "El título debe tener al menos 2 caracteres" }),
    descripcion: z.string(),
    fecha_hora: z.string(),
    prioridad: z.enum(["alta", "media", "baja"], { message: "La prioridad debe ser 'alta', 'media' o 'baja'" }),
    categoria: z.string(),
    user_id: z.number().int({ message: "user_id debe ser un número entero" })
});

module.exports = {
    TareaSchema
};