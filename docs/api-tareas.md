Método: GET
Ruta: get "/tasks"
Qué se envía: Nada
Qué responde: status 200 array con todas las tareas o status 500 error del servidor

Método: GET
Ruta: get "/tasks/:id"
Qué se envía: id para leer una tarea concreta
Qué responde: devuelve el objeto de la tarea encontranda con ese id, o devuelve el status 400 error de cliente o
status 404 tarea no encontrada o status 500 error del servidor

Método: DELETE
Ruta: delete "/tasks/:id"
Qué se envía: id para eliminar una tarea concreta
Qué responde: devuelve status 200 tarea eliminada, o status 400 errror de cliente,
status 404 tarea no encontrada o status 500 error interno del servidor

Método: POST
Ruta: post '/tasks'
Qué se envía: la nueva tarea por el req.body
Qué responde: devuelve status 201 tarea creada o status 400 error de validación o status 500 error interno del servidor.

Método: PUT
Ruta: put '/tasks/:id'
Qué se envía: la actualización de la tarea por req.body asignada a un id
Qué responde: devuelve status 200 tarea actualizada, o status 400 error de validación o
status 404 tarea no encontrada o status 500 error interno del servidor.
