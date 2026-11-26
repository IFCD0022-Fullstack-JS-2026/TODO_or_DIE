const { z } = require("zod");


const TareaSchema = z.object({
    titulo: z.string().min(2, { message: "El título debe tener al menos 2 caracteres" }),
    descripcion: z.string(),
    fecha_hora: z.union([
        z.literal(""), 
        z.iso.datetime({ 
            local: true, 
            message: "La fecha no es válida" 
        })
    ]),
    
    prioridad: z.enum(["alta", "media", "baja"], { message: "La prioridad debe ser 'alta', 'media' o 'baja'" }),
    categoria: z.string().trim().min(1, { message: "La categoría es obligatoria" }),
});

module.exports = {
    TareaSchema
};