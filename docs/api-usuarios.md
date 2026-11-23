# API de usuarios

Base URL: `/api`

Los routers se montan en `/api` desde `server/index.js`, así que las rutas finales son `/api/users/register` y `/api/users/login`.

---

## POST /api/users/register

Registra un nuevo usuario.

### Request body

```json
{
  "nombre": "test",
  "email": "test@example.com",
  "password": "123456"
}
```

### Respuestas

**201 Created** — usuario creado:
```json
{
  "success": true,
  "message": "Usuario creado",
  "data": { "nombre": "test", "email": "test@example.com" }
}
```

**400 Bad Request** — validación fallida:
```json
{ "success": false, "errors": ["El email no es válido"] }
```

**409 Conflict** — el email ya existe en la base de datos:
```json
{ "success": false, "errors": ["Email ya registrado"] }
```

**500 Internal Server Error**:
```json
{ "success": false, "message": "Error interno del servidor" }
```

---

## POST /api/users/login

Inicia sesión con email y contraseña.

### Request body

```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

### Respuestas

**200 OK** — credenciales correctas. En `data` se devuelve `id`, `nombre` y `email`:
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": { "id": 1, "nombre": "test", "email": "test@example.com", "token": "jwt:token"}
}
```

**400 Bad Request** — validación fallida:
```json
{ "success": false, "errors": ["La contraseña es obligatoria"] }
```

**401 Unauthorized** — email inexistente **o** contraseña incorrecta. Se devuelve el mismo mensaje en los dos casos para no revelar cuál ha fallado:
```json
{ "success": false, "message": "Email o contraseña incorrectos" }
```

**500 Internal Server Error**:
```json
{ "success": false, "message": "Error interno del servidor" }
```

## GET /api/users/perfil

Devuelve los datos del usuario autenticado. Requiere cabecera `Authorization`.

### Request headers

```
Authorization: Bearer <token>
```

El `<token>` se obtiene en la respuesta de `POST /api/users/login` (`data.token`).

### Respuestas

**200 OK** — token válido y usuario encontrado:
```json
{
  "success": true,
  "data": { "id": 1, "nombre": "test", "email": "test@example.com" }
}
```

**401 Unauthorized** — sin cabecera o cabecera mal formada:
```json
{ "success": false, "message": "Falta el token" }
```

**401 Unauthorized** — token inválido o caducado:
```json
{ "success": false, "message": "Token no válido o caducado" }
```

**404 Not Found** — el token es válido pero el usuario ya no existe:
```json
{ "success": false, "message": "Usuario no encontrado" }
```

**500 Internal Server Error**:
```json
{ "success": false, "message": "Error interno del servidor" }
```