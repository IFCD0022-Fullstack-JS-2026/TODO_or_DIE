# API de tareas

Todas las rutas requieren autenticación con **JWT**.

## Autenticación

Cada petición debe incluir la cabecera:

```
Authorization: Bearer <token>
```

El `<token>` se obtiene en `POST /api/users/login`.

Si la cabecera falta o está mal formada → **401** con `{ success: false, message: "Falta el token" }`.
Si el token es inválido o ha caducado → **401** con `{ success: false, message: "Token no válido o caducado" }`.

**Aislamiento por usuario:** cada usuario solo puede ver, crear, editar y borrar sus propias tareas. Si intenta acceder a una tarea de otro usuario, la API responde **404** igual que si no existiera, para no revelar su existencia.

---

## GET /api/tasks

Devuelve todas las tareas del usuario autenticado.

### Qué se envía

Solo la cabecera `Authorization`.

```
Authorization: Bearer <token>
```

### Parámetros opcionales

| Parámetro | Tipo | Ejemplo | Descripción |
|---|---|---|---|
| `buscar` | string | `?buscar=presupuesto` | Tareas cuyo **título** o **descripción** contengan ese texto. |
| `categoria` | string | `?categoria=Marketing` | Solo las tareas de esa **categoría exacta**. |

Se pueden usar **los dos a la vez**, o **ninguno**. El resultado siempre se ordena por `fecha_hora`.

### Qué responde

**200 OK** — listado de tareas del usuario:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "Terminar el CSS",
      "descripcion": "Aplicar el design system",
      "fecha_hora": "2026-11-23 19:30:00",
      "prioridad": "alta",
      "categoria": "Frontend",
      "user_id": 1,
      "completada": 0
    }
  ]
}
```

**401 Unauthorized** — sin token o token inválido:
```json
{ "success": false, "message": "Falta el token" }
```
```json
{ "success": false, "message": "Token no válido o caducado" }
```

**500 Internal Server Error**:
```json
{ "success": false, "message": "Error interno del servidor" }
```

---

## GET /api/tasks/:id

Devuelve una tarea concreta del usuario autenticado.

### Qué se envía

- Cabecera `Authorization`.
- `id` de la tarea en la ruta.

```
Authorization: Bearer <token>
GET /api/tasks/1
```

### Qué responde

**200 OK** — tarea encontrada:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "titulo": "Terminar el CSS",
    "descripcion": "Aplicar el design system",
    "fecha_hora": "2026-11-23 19:30:00",
    "prioridad": "alta",
    "categoria": "Frontend",
    "user_id": 1,
    "completada": 0
  }
}
```

**400 Bad Request** — `id` no numérico:
```json
{ "success": false, "message": "El id debe ser un número" }
```

**401 Unauthorized** — sin token o token inválido:
```json
{ "success": false, "message": "Falta el token" }
```
```json
{ "success": false, "message": "Token no válido o caducado" }
```

**404 Not Found** — la tarea no existe **o es de otro usuario**:
```json
{ "success": false, "message": "Tarea no encontrada" }
```

**500 Internal Server Error**:
```json
{ "success": false, "message": "Error interno del servidor" }
```

---

## POST /api/tasks

Crea una tarea nueva para el usuario autenticado.

> **Importante:** el `user_id` **no se envía en el body**. Lo pone el servidor a partir del token. Si el body incluye un `user_id`, se ignora.

### Qué se envía

- Cabecera `Authorization`.
- Body JSON con los datos de la tarea (sin `user_id`).

```
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "titulo": "Terminar el CSS",
  "descripcion": "Aplicar el design system a las pantallas",
  "fecha_hora": "2026-11-23 19:30:00",
  "prioridad": "alta",
  "categoria": "Frontend",
  "completada": 0
}
```

### Qué responde

**201 Created** — tarea creada:
```json
{
  "success": true,
  "message": "Tarea creada",
  "data": {
    "id": 5,
    "titulo": "Terminar el CSS",
    "descripcion": "Aplicar el design system a las pantallas",
    "fecha_hora": "2026-11-23 19:30:00",
    "prioridad": "alta",
    "categoria": "Frontend",
    "user_id": 1
  }
}
```

**400 Bad Request** — validación Zod fallida:
```json
{
  "success": false,
  "errors": ["La prioridad debe ser 'alta', 'media' o 'baja'", "La categoría es obligatoria", "La fecha no es válida"]
}
```

**401 Unauthorized** — sin token o token inválido:
```json
{ "success": false, "message": "Falta el token" }
```
```json
{ "success": false, "message": "Token no válido o caducado" }
```

**500 Internal Server Error**:
```json
{ "success": false, "message": "Error interno del servidor" }
```

---

## PUT /api/tasks/:id

Actualiza una tarea existente del usuario autenticado.

> **Importante:** el `user_id` **no se envía en el body** y **no se modifica** en la actualización. La tarea sigue perteneciendo al mismo usuario aunque se intente enviar otro `user_id`.

### Qué se envía

- Cabecera `Authorization`.
- `id` de la tarea en la ruta.
- Body JSON con los campos a actualizar (todos los de la tarea menos `user_id`).

```
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "titulo": "Terminar el CSS (revisado)",
  "descripcion": "Aplicar el design system a todas las pantallas",
  "fecha_hora": "",
  "prioridad": "media",
  "categoria": "Frontend"
}
```

### Qué responde

**200 OK** — tarea actualizada:
```json
{ "success": true, "message": "Tarea actualizada" }
```

**400 Bad Request** — `id` no numérico o validación Zod fallida:
```json
{ "success": false, "message": "El id debe ser un número" }
```
```json
{ "success": false, "errors": ["El título debe tener al menos 2 caracteres"] }
```
```json
{ "success": false, "errors": ["La categoría es obligatoria"] } 
```
```json
{ "success": false, "errors": ["La fecha no es válida"]}
``` 

**401 Unauthorized** — sin token o token inválido:
```json
{ "success": false, "message": "Falta el token" }
```
```json
{ "success": false, "message": "Token no válido o caducado" }
```

**404 Not Found** — la tarea no existe **o es de otro usuario**:
```json
{ "success": false, "message": "Tarea no encontrada" }
```

**500 Internal Server Error**:
```json
{ "success": false, "message": "Error interno del servidor" }
```

---

## DELETE /api/tasks/:id

Borra una tarea del usuario autenticado.

### Qué se envía

- Cabecera `Authorization`.
- `id` de la tarea en la ruta.

```
Authorization: Bearer <token>
DELETE /api/tasks/1
```

### Qué responde

**200 OK** — tarea eliminada:
```json
{ "success": true, "message": "Tarea eliminada" }
```

**400 Bad Request** — `id` no numérico:
```json
{ "success": false, "message": "El id debe ser un número" }
```

**401 Unauthorized** — sin token o token inválido:
```json
{ "success": false, "message": "Falta el token" }
```
```json
{ "success": false, "message": "Token no válido o caducado" }
```

**404 Not Found** — la tarea no existe **o es de otro usuario**:
```json
{ "success": false, "message": "Tarea no encontrada" }
```

**500 Internal Server Error**:
```json
{ "success": false, "message": "Error interno del servidor" }
```

---

## GET /api/tasks/estadisticas

Devuelve estadisticas del usuario con sesion.

### Qué se envía

- Cabecera `Authorization`.

```
Authorization: Bearer <token>
GET /api/tasks/estadisticas
```

### Qué responde

**200 OK** — success
```json
{
    "success": true,
    "data": {
        "totalTareas": 4,
        "porPrioridad": [
            {
                "prioridad": "media",
                "total": 1
            },
            {
                "prioridad": "alta",
                "total": 2
            },
            {
                "prioridad": "baja",
                "total": 1
            }
        ],
        "porCategoria": [
            {
                "categoria": "Presupuesto",
                "total": 1
            },
            {
                "categoria": "Finanzas",
                "total": 1
            },
            {
                "categoria": "Test",
                "total": 1
            },
            {
                "categoria": "Perrito",
                "total": 1
            }
        ],
        "completadas": 1,
        "pendientes": 3
    }
}
```


**401 Unauthorized** — sin token o token inválido:
```json
{ "success": false, "message": "Falta el token" }
```
```json
{ "success": false, "message": "Token no válido o caducado" }
```


**500 Internal Server Error**:
```json
{ "success": false, "message": "Error interno del servidor" }
```

---

## GET /api/tasks/hoy

Devuelve las tareas de hoy al usuario conectado.

### Qué se envía

- Cabecera `Authorization`.

```
Authorization: Bearer <token>
GET /api/tasks/hoy
```

### Qué responde

**200 OK** — success
```json
{
    "success": true,
    "data": [
        {
            "id": 11,
            "titulo": "Comprobación Hoy",
            "descripcion": "dmbgfjdsflid",
            "fecha_hora": "2026-11-25 19:21:00",
            "prioridad": "alta",
            "categoria": "Test",
            "user_id": 3,
            "completada": 0,
            "created_at": "2026-11-25 19:22:29"
        }
    ]
}
```


**401 Unauthorized** — sin token o token inválido:
```json
{ "success": false, "message": "Falta el token" }
```
```json
{ "success": false, "message": "Token no válido o caducado" }
```


**500 Internal Server Error**:
```json
{ "success": false, "message": "Error interno del servidor" }
```

---

## GET /api/tasks/categorias 

Devuelve las categorías del usuario

### Qué se envía

- Cabecera `Authorization`.

```
Authorization: Bearer <token>
GET /api/tasks/categorias
```

### Qué responde

**200 OK** — success
```json
{
    "success": true,
    "data": [
        "Marketing",
        "Presupuesto",
        "TodoOrDie"
    ]
}
```

**401 Unauthorized** — sin token o token inválido:
```json
{ "success": false, "message": "Falta el token" }
```
```json
{ "success": false, "message": "Token no válido o caducado" }
```

**500 Internal Server Error**:
```json
{ "success": false, "message": "Error interno del servidor" }
```

---

## ⚠️ Acción requerida para bases de datos existentes

Antes de probar la nueva ruta `PATCH /api/tasks/:id/completada`, cada uno debe ejecutar una vez en MySQL:

```sql
ALTER TABLE tasks ADD COLUMN completada BOOLEAN NOT NULL DEFAULT FALSE;
```

## PATCH /api/tasks/:id/completada

Alterna el estado de una tarea entre pendiente y completada.

### Qué se envía

- Cabecera `Authorization`.
- `id` de la tarea en la ruta. **No lleva body.**

```
Authorization: Bearer <token>
PATCH /api/tasks/1/completada
```

### Qué responde

**200 OK** — tarea actualizada con su nuevo estado:
```json
{
  "success": true,
  "message": "Tarea actualizada",
  "data": {
    "id": 1,
    "titulo": "Terminar el CSS",
    "descripcion": "Aplicar el design system",
    "fecha_hora": "2026-11-23 19:30:00",
    "prioridad": "alta",
    "categoria": "Frontend",
    "user_id": 1,
    "completada": 1
  }
}
```

**400 Bad Request** — `id` no numérico:
```json
{ "success": false, "message": "El id debe ser un número" }
```

**401 Unauthorized** — sin token o token inválido:
```json
{ "success": false, "message": "Falta el token" }
```
```json
{ "success": false, "message": "Token no válido o caducado" }
```

**404 Not Found** — la tarea no existe **o es de otro usuario**:
```json
{ "success": false, "message": "Tarea no encontrada" }
```

**500 Internal Server Error**:
```json
{ "success": false, "message": "Error interno del servidor" }
```

---
## GET /api/tasks/vencidas

Devuelve las tareas vencidas del usuario: las que siguen pendientes y cuya fecha ya ha pasado.

### Qué se envía

- Cabecera `Authorization`.

```
Authorization: Bearer <token>
GET /api/tasks/vencidas
```

### Qué responde

**200 OK** — success
```json
{
    "success": true,
    "data": [
        {
            "id": 3,
            "titulo": "Tareas vencidas  #136",
            "descripcion": "Prepararme repasando todo lo apuntado hasta aprender la secuencia de inicio de un archivo React",
            "fecha_hora": "2026-11-26 16:10:00",
            "prioridad": "alta",
            "categoria": "Presupuesto",
            "user_id": 1,
            "completada": 0,
            "created_at": "2026-11-27 16:10:13"
        },
        {
            "id": 1,
            "titulo": "Entrevista a candidato backend",
            "descripcion": "Prepararme repasando todo lo apuntado hasta aprender la secuencia de inicio de un archivo React",
            "fecha_hora": "2026-11-27 16:02:00",
            "prioridad": "media",
            "categoria": "Marketing",
            "user_id": 1,
            "completada": 0,
            "created_at": "2026-11-27 16:02:46"
        }
    ]
}
```
**401 Unauthorized** — sin token o token inválido:
```json
{ "success": false, "message": "Falta el token" }
```
```json
{ "success": false, "message": "Token no válido o caducado" }
```
**500 Internal Server Error**:
```json
{ "success": false, "message": "Error interno del servidor" }
```
---


## GET /api/tasks/calendario

Devuelve las tareas del usuario autenticado correspondientes al mes indicado, para mostrarlas en el calendario.

### Qué se envía

- Cabecera `Authorization`.
- Parámetros obligatorios `anio` y `mes` en la query.

```http
GET /api/tasks/calendario?anio=2026&mes=11
Authorization: Bearer <token>
```

| Parámetro | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `anio` | entero | Sí | Año de las tareas (por ejemplo, `2026`). |
| `mes` | entero entre `1` y `12` | Sí | Mes de las tareas (por ejemplo, `11`). |

### Qué responde

**200 OK** — tareas del mes solicitado:

```json
{
  "success": true,
  "data": [
    {
      "id": 15,
      "titulo": "Revisión de sprint",
      "descripcion": "Preparar demo del calendario",
      "fecha_hora": "2026-11-27T17:00:00.000Z",
      "prioridad": "media",
      "categoria": "Trabajo",
      "completada": 0,
      "user_id": 2
    }
  ]
}
```

**400 Bad Request** — falta `anio` o `mes`, o no son números enteros válidos:

```json
{
  "success": false,
  "message": "El año y el mes son obligatorios"
}
```

**401 Unauthorized** — sin token o token inválido:

```json
{ "success": false, "message": "Falta el token" }
```

```json
{ "success": false, "message": "Token no válido o caducado" }
```

**500 Internal Server Error**:

```json
{
  "success": false,
  "message": "Error interno del servidor"
}
```
