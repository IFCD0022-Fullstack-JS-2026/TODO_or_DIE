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
      "user_id": 1
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
    "user_id": 1
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
  "categoria": "Frontend"
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
  "errors": ["La prioridad debe ser 'alta', 'media' o 'baja'"]
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
        "totalTareas": 3,
        "porPrioridad": [
            {
                "prioridad": "alta",
                "total": 1
            },
            {
                "prioridad": "media",
                "total": 1
            },
            {
                "prioridad": "baja",
                "total": 1
            }
        ],
        "porCategoria": [
            {
                "categoria": "bbbbbbbbbbb",
                "total": 1
            },
            {
                "categoria": "eeeeeeeeeeeeeee",
                "total": 1
            },
            {
                "categoria": "hhhhhhhhhhhhh",
                "total": 1
            }
        ]
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