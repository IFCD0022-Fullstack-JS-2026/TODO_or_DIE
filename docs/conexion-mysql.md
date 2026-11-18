# Prueba de Conexión a Base de Datos

## archivo de connection

```js

require("dotenv").config();
const mysql = require("mysql2/promise");


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

module.exports = pool;

```

Creamos la conexion con `createPool()` porque solo es necesario abrirlo una vez y luego nos permite reutilizar la conexion. Por el contrario de `createConnection()`, que abre una petición nueva cada vez y se acumulan hasta que MySQL rechaza más (Too many connections)

## Comprobar la conexión a la base de datos

```js
const pool = require("./db/connection");

pool.query("SELECT 1")
  .then(() => console.log("Conexión a MySQL correcta"))
  .catch((error) => console.error("Error al conectar con MySQL:", error.message));
```

El script de prueba de conexión utiliza el pool de conexiones configurado en `./db/connection` para realizar una verificación de estado. Ejecuta la consulta SELECT 1 contra el servidor MySQL. Si la conexión es exitosa, imprimirá un mensaje de confirmación en la consola; en caso contrario, mostrará el error por consola.
