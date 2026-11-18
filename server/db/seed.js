const pool = require('./connection.js')
const bcrypt = require("bcryptjs");

async function cargarDatosPrueba(){
    // 1. Verificar si ya existen usuarios para evitar duplicados
    const [filas] = await pool.query("SELECT COUNT(*) AS total FROM users");
    if (filas[0].total > 0) return;

    // 2. Insertar usuarios en su propia consulta
    const passwordCifrada1 = await bcrypt.hash('qwerty11d', 10);
    const passwordCifrada2 = await bcrypt.hash('poiuyt22w', 10);
    const passwordCifrada3 = await bcrypt.hash('pñolik33', 10);
    const passwordCifrada4 = await bcrypt.hash('zasxdc44', 10);

    await pool.query(`
        INSERT INTO users (id, nombre, email, password, created_at) 
        VALUES 
        (DEFAULT, 'Saida', 'Saida@email.com', ?, DEFAULT),
        (DEFAULT, 'Armand', 'Armand@email.com', ? , DEFAULT),
        (DEFAULT, 'Maria', 'Maria@email.com', ? , DEFAULT),
        (DEFAULT, 'Dani', 'Dani@email.com', ? , DEFAULT);
    `, [passwordCifrada1, passwordCifrada2, passwordCifrada3, passwordCifrada4]);

    // 3. Insertar tareas en su propia consulta (prioridades en minúscula y comillas simples)
    await pool.query(`
        INSERT INTO tasks (id, titulo, descripcion, fecha_hora, prioridad, categoria, user_id, created_at) 
        VALUES
        (DEFAULT, 'BASE DE DATOS', 'Crear la base de datos, tablas y el código', '2026-06-10 14:00:00', 'media', 'TodoOrDie', 1, '2026-06-01 08:30:00'),
        (DEFAULT, 'CRUD DE TAREAS', 'Crear el CRUD de tareas con los datos guardados en un array en memoria. Más adelante se sustituirá por la base de datos.', '2026-06-05 18:30:00', 'alta', 'TodoOrDie', 1, '2026-06-01 09:00:00'),
        (DEFAULT, 'Revisión de presupuesto anual', 'Analizar los gastos del Q3 y Q4 con el departamento financiero.', '2026-11-20 09:30:00', 'alta', 'Presupuesto', 1, DEFAULT),
        (DEFAULT, 'Actualización de servidores', 'Aplicar parches de seguridad críticos en el clúster principal de producción.', '2026-11-21 02:00:00', 'media', 'Finanzas', 2, DEFAULT),
        (DEFAULT, 'Reunión de equipo semanal', 'Sincronización de avances del sprint y resolución de bloqueos técnicos.', '2026-11-22 10:00:00', 'media', 'Presupuesto', 3, DEFAULT),
        (DEFAULT, 'Diseño de landing page', 'Crear wireframes y prototipos para la nueva campaña de marketing.', '2026-11-24 15:00:00', 'baja', 'Marketing', 4, DEFAULT),
        (DEFAULT, 'Mantenimiento de base de datos', 'Optimizar índices de consultas lentas y verificar respaldos automáticos.', '2026-11-25 23:30:00', 'baja', 'Mantenimiento', 2, DEFAULT),
        (DEFAULT, 'Entrevista a candidato backend', 'Evaluación técnica en vivo con el candidato finalista para el puesto senior.', '2026-11-26 16:00:00', 'alta', 'Marketing', 1, DEFAULT),
        (DEFAULT, 'Entrega de reporte trimestral', 'Enviar el documento de métricas finalizado a la dirección general.', '2026-11-30 18:00:00', 'alta', 'Finanzas', 3, DEFAULT);
    `);

    console.log('Datos de prueba cargados correctamente');
}
module.exports = cargarDatosPrueba;