/*const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const qr = require('qrcode');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const db = mysql.createConnection({
  host: '192.168.100.20',
  user: 'node_user',
  password: 'Zapatitoblanco123***',
  database: 'SCGEM',
});

const ROLES = {
  STUDENT: '1',
  PROFESSOR: '2',
  ADMIN_STAFF: '3',
  SUPER_ADMIN: '99'
};

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Authentication required' });


  jwt.verify(token, 'aVeryStrongSecretKeyHere', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });

};

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.user_role)) {  return res.status(403).json({ message: 'Access denied' });  }
    next();
  };
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM USUARIOS WHERE user_name = ?;', [username], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (result.length === 0 || result[0].password !== password) return res.status(401).json({ message: 'Invalid credentials' });
    const user = result[0];
    const token = jwt.sign(
      {
        user_id: user.id_user,
        user_name: user.user_name,
        user_role: user.user_role,
        user_matricula: user.id_user
      },
      'aVeryStrongSecretKeyHere',
      { expiresIn: '1h' }
    );
    res.json({
      token,
      user_role: user.user_role,
      user_id: user.id_user,
      user_matricula: user.id_user
    });
    console.dir(res.json());
  });
  console.log("Login attempt:", username, password);
});

///////////////////////////////////////////////////////       ESTUDIANTES       ////////////////////////////////////////////////////////////////////////////////

/////////////////       MATERIAS       ////////////////////////////////////////////
app.get('/student/tabla-datos-estudiante/', authenticateToken, (req, res) => {
  const query = `
    SELECT 
    MATERIAS.materia_nombre AS materia_nombre,
    PROFESORES.nombre AS profesor_nombre,
    CONCAT(
        IF(h_lunes IS NOT NULL AND h_lunes != '', CONCAT('Lunes: ', h_lunes, '<br>'), ''),
        IF(h_martes IS NOT NULL AND h_martes != '', CONCAT('Martes: ', h_martes, '<br>'), ''),
        IF(h_miercoles IS NOT NULL AND h_miercoles != '', CONCAT('Miércoles: ', h_miercoles, '<br>'), ''),
        IF(h_jueves IS NOT NULL AND h_jueves != '', CONCAT('Jueves: ', h_jueves, '<br>'), ''),
        IF(h_viernes IS NOT NULL AND h_viernes != '', CONCAT('Viernes: ', h_viernes), '')
    ) AS horarios,
    GRUPOSALUM.id_grupo
    FROM MATERIAS
    JOIN HORARIOS ON MATERIAS.id_materia = HORARIOS.id_materia
    JOIN PROFESORES ON HORARIOS.id_profesor = PROFESORES.id_profesor
    JOIN GRUPOSALUM ON GRUPOSALUM.id_materia = MATERIAS.id_materia AND GRUPOSALUM.id_grupo = HORARIOS.id_grupo
    JOIN ALUMNOS ON GRUPOSALUM.matricula_alumno = ALUMNOS.matricula
    WHERE ALUMNOS.matricula = 'A0001';
  `;
  db.query(query, [req.user.user_matricula], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    console.log(results);
    res.json(results);
  });
});
/////////////////       CALIFICACIONES       ///////////////////////////////////////
app.get('/student/tabla-calificaciones/', authenticateToken, (req, res) => {
  const query = `
    SELECT 
      m.materia_nombre as materia,
      c.calif_p1,
      c.calif_p2,
      c.calif_final,
      ROUND((CAST(c.calif_p1 AS DECIMAL) + CAST(c.calif_p2 AS DECIMAL) + CAST(c.calif_final AS DECIMAL)) / 3, 2) as promedio,
      c.ciclo_cursando
    FROM CALIFICACIONES c
    JOIN MATERIAS m ON c.id_materia = m.id_materia
    WHERE c.matricula = ? AND c.ciclo_cursando = '2025-1';
  `;
  db.query(query, [req.user.user_matricula], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(results);
  });
});


/////////////////       KARDEZ       ///////////////////////////////////////
app.get('/student/tabla-kardez/', authenticateToken, (req, res) => {
  const query = `
 SELECT 
    m.materia_nombre AS materia,
    c.ciclo_cursando AS periodo,
    ROUND((CAST(c.calif_p1 AS DECIMAL) + CAST(c.calif_p2 AS DECIMAL) + CAST(c.calif_final AS DECIMAL)) / 3, 2) AS calif_final,
    CASE 
        WHEN ROUND((CAST(c.calif_p1 AS DECIMAL) + CAST(c.calif_p2 AS DECIMAL) + CAST(c.calif_final AS DECIMAL)) / 3, 2) > 7 
        THEN 'Aprobado' 
        ELSE 'Reprobado' 
    END AS estado
FROM CALIFICACIONES c
JOIN MATERIAS m ON c.id_materia = m.id_materia
WHERE c.matricula = 'A0001';
`;
  db.query(query, [req.user.user_matricula], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    console.log(results);
    res.json(results);
  });
});
/////////////////       PAGOS       ///////////////////////////////////////
app.get('/student/tabla-pagos/', authenticateToken, (req, res) => {
  const query = `
    SELECT 
    DATE_FORMAT(p.fecha_vencimiento, '%M') AS MES,  -- Extracts month name
    p.pago_mensual AS CANTIDAD,
    p.fecha_vencimiento AS FECHA_CORTE,
    CASE 
        WHEN p.fecha_pago IS NULL THEN 'Pendiente'
        WHEN DAY(p.fecha_pago) BETWEEN 1 AND 5 THEN 'Descuento 5%'
        WHEN DAY(p.fecha_pago) BETWEEN 6 AND 15 THEN 'Normal'
        WHEN DAY(p.fecha_pago) > 15 THEN 'Recargo 5%'
    END AS ESTADO,
    CASE 
        WHEN p.fecha_pago IS NULL THEN 'Por pagar'
        ELSE 'Pagado'
    END AS ACCION

  FROM PAGOS p
  JOIN ALUMNOS on ALUMNOS.matricula = p.matricula
  where ALUMNOS.matricula = ?;
  `;
  db.query(query, [req.user.user_matricula], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    console.log(results);
    res.json(results);
  });
});


/////////////////       ASISTENCIAS       ///////////////////////////////////////
app.post('/student/registro-asistencias/', authenticateToken, (req, res) => {
  const { codigo_asistencia } = req.body;
  const user_matricula = req.user.user_matricula;
  if (!codigo_asistencia)
    return res.status(400).json({ success: false, message: "Código de asistencia requerido" });

  const query = ` INSERT INTO ASISTENCIA (matricula, codigo, asistencia) VALUES (?, ?, NOW()); `;
  db.query(query, [user_matricula, codigo_asistencia], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json({ success: true, message: "Asistencia registrada correctamente" });
  });
});


///////////////////////////////////////////////////////    FIN   ESTUDIANTES       ////////////////////////////////////////////////////////////////////////////////










///////////////////////////////////////////////////////       PROFESORES       ////////////////////////////////////////////////////////////////////////////////
///////////////CALENDARIO DE MATERIAS A IMPARTIR
app.get('/professor/schedule/', authenticateToken, (req, res) => {
  const query = `
    SELECT 
      M.materia_nombre AS materia_nombre,
      H.id_grupo,
      CONCAT (
    IF(h_lunes IS NOT NULL AND h_lunes != '', CONCAT('Lunes: ', h_lunes, '<br>'), ''),
    IF(h_martes IS NOT NULL AND h_martes != '', CONCAT('Martes: ', h_martes, '<br>'), ''),
    IF(h_miercoles IS NOT NULL AND h_miercoles != '', CONCAT('Miércoles: ', h_miercoles, '<br>'), ''),
    IF(h_jueves IS NOT NULL AND h_jueves != '', CONCAT('Jueves: ', h_jueves, '<br>'), ''),
    IF(h_viernes IS NOT NULL AND h_viernes != '', CONCAT('Viernes: ', h_viernes), '')
  ) AS horarios
    FROM HORARIOS H
    JOIN MATERIAS M ON M.id_materia = H.id_materia
    JOIN PROFESORES P ON P.id_profesor = H.id_profesor
    WHERE P.id_profesor = 'P0001';
  `;
  console.log("matre", req.user.user_matricula);
  db.query(query, [req.user.user_matricula], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    console.log(results);
    res.json(results);
  });
});
//////////////////////////////////////////////////////// QR ASISTENCIA //////////////////////////////////////////////////////////////////
app.get('/professor/QR_CODE_GEN/', authenticateToken, (req, res) => {
  const query = `
    SELECT 
    HORARIOS.id_materia,
    MATERIAS.materia_nombre,
    HORARIOS.id_grupo
FROM HORARIOS
JOIN MATERIAS ON HORARIOS.id_materia = MATERIAS.id_materia
WHERE HORARIOS.id_profesor = ?;
  `;
  console.log("matricula del profesor:", req.user.user_matricula);
  db.query(query, [req.user.user_matricula], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    console.log(results);
    res.json(results);
  });
});
///////////////////       CALIFICAICONES /////////////////////////
app.get('/professor/getSubjects', authenticateToken, (req, res) => {
const query = `
    SELECT DISTINCT
    GRUPOSALUM.id_materia,
    MATERIAS.materia_nombre,
    GRUPOSALUM.id_grupo
FROM MATERIAS
JOIN GRUPOSALUM ON MATERIAS.id_materia = GRUPOSALUM.id_materia
JOIN MATERIASPROF ON GRUPOSALUM.id_grupo = MATERIASPROF.id_grupo
JOIN PROFESORES ON MATERIASPROF.id_profesor = PROFESORES.id_profesor
WHERE PROFESORES.id_profesor = ?;
  `;
  db.query(query, [req.user.user_matricula], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    console.log(results);
    res.json(results);
  });
});
app.get('/professor/getStudents', async (req, res) => {
  const { id_materia, id_grupo } = req.query;
 console.log("Received:", id_materia, id_grupo);
 
  const query = `
    SELECT 
      A.matricula, A.user_name, C.calif_p1, C.calif_p2, C.calif_final
    FROM ALUMNOS A
    JOIN GRUPOSALUM G ON A.matricula = G.matricula_alumno
    LEFT JOIN CALIFICACIONES C ON A.matricula = C.matricula AND G.id_materia = C.id_materia
    WHERE G.id_materia = ? AND G.id_grupo = ?;
  `;
  db.query(query, [id_materia, id_grupo], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(results);
  });
});
app.post('/professor/saveGrade', (req, res) => {
  const { id_materia, matricula, calif_p1, calif_p2, calif_final, ciclo_cursando } = req.body;
  const sql = `
    INSERT INTO CALIFICACIONES (id_materia, matricula, calif_p1, calif_p2, calif_final, ciclo_cursando)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      calif_p1 = VALUES(calif_p1),
      calif_p2 = VALUES(calif_p2),
      calif_final = VALUES(calif_final),
      ciclo_cursando = VALUES(ciclo_cursando);
  `;
  db.query(sql, [id_materia, matricula, calif_p1, calif_p2, calif_final, ciclo_cursando], (err, result) => {
    if (err) {
      console.error("Error saving grade:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "Grade saved successfully" });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});*/

const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const cors = require('cors');
// const bodyParser = require('body-parser'); // bodyParser ya no es necesario con express.json()
const qr = require('qrcode'); // Asumiendo que aún lo necesitas, aunque no se usa en las rutas proporcionadas

const app = express();
const port = 3000;

// Configuración de CORS: permite solicitudes desde tu frontend de Vite
app.use(cors({
    origin: 'http://localhost:5173' // Asegúrate de que esta URL sea la de tu frontend
}));

// Middleware para parsear JSON: express.json() reemplaza a body-parser.json()
app.use(express.json());
// app.use(bodyParser.json()); // Eliminar esta línea

// Configuración de la base de datos
const db = mysql.createConnection({
    host: '192.168.100.20',
    user: 'node_user',
    password: 'Zapatitoblanco123***',
    database: 'SCGEM',
    // Opcional: configurar un pool de conexiones para mejor manejo de la base de datos
    // Si usas un pool, el .connect() no es necesario para cada query
});

// ¡IMPORTANTE! Conectar a la base de datos.
// Sin esto, las consultas fallarán y podrían causar problemas al servidor.
db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.stack);
        // Aquí podrías decidir si quieres que el servidor no se inicie si la DB no está disponible
        // process.exit(1);
        return; // No continua si no hay conexión a la DB
    }
    console.log('Conexión a la base de datos MySQL establecida como id ' + db.threadId);
});

const ROLES = {
    STUDENT: '1',
    PROFESSOR: '2',
    ADMIN_STAFF: '3',
    SUPER_ADMIN: '99'
};

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    jwt.verify(token, 'aVeryStrongSecretKeyHere', (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.user_role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log('Datos recibidos en /login:', username, password);

    // En un entorno real, la contraseña NUNCA debe almacenarse en texto plano.
    // Deberías usar una librería como `bcrypt` para comparar hashes.
    db.query('SELECT id_user, user_name, user_role, password FROM USUARIOS WHERE user_name = ?;', [username], (err, result) => {
        if (err) {
            console.error('Error en la base de datos durante el login:', err);
            return res.status(500).json({ message: 'Error en el servidor.' });
        }

        if (result.length === 0 || result[0].password !== password) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const user = result[0];
        const token = jwt.sign(
            {
                user_id: user.id_user,
                user_name: user.user_name,
                user_role: user.user_role,
                // Si user.id_user es la matrícula para estudiantes y profesores, entonces esto es correcto
                user_matricula: user.id_user
            },
            'aVeryStrongSecretKeyHere', // ¡En producción, esta clave debe ser una variable de entorno!
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user_role: user.user_role,
            user_id: user.id_user,
            user_matricula: user.id_user, // Asegúrate de que esto sea lo que espera tu frontend
            user_password: user.password, // Esto es inseguro, no deberías enviar la contraseña al frontend
        });
        // console.dir(res.json()); // Esta línea causaría un error "Headers already sent". Debe ser eliminada.
    });
});

///////////////////////////////////////////////////////       ESTUDIANTES       ////////////////////////////////////////////////////////////////////////////////

/////////////////       MATERIAS       ////////////////////////////////////////////
app.get('/student/tabla-datos-estudiante/', authenticateToken, (req, res) => {
    const query = `
        SELECT 
        MATERIAS.materia_nombre AS materia_nombre,
        PROFESORES.nombre AS profesor_nombre,
        CONCAT(
            IF(h_lunes IS NOT NULL AND h_lunes != '', CONCAT('Lunes: ', h_lunes, '<br>'), ''),
            IF(h_martes IS NOT NULL AND h_martes != '', CONCAT('Martes: ', h_martes, '<br>'), ''),
            IF(h_miercoles IS NOT NULL AND h_miercoles != '', CONCAT('Miércoles: ', h_miercoles, '<br>'), ''),
            IF(h_jueves IS NOT NULL AND h_jueves != '', CONCAT('Jueves: ', h_jueves, '<br>'), ''),
            IF(h_viernes IS NOT NULL AND h_viernes != '', CONCAT('Viernes: ', h_viernes), '')
        ) AS horarios,
        GRUPOSALUM.id_grupo
        FROM MATERIAS
        JOIN HORARIOS ON MATERIAS.id_materia = HORARIOS.id_materia
        JOIN PROFESORES ON HORARIOS.id_profesor = PROFESORES.id_profesor
        JOIN GRUPOSALUM ON GRUPOSALUM.id_materia = MATERIAS.id_materia AND GRUPOSALUM.id_grupo = HORARIOS.id_grupo
        JOIN ALUMNOS ON GRUPOSALUM.matricula_alumno = ALUMNOS.matricula
        WHERE ALUMNOS.matricula = ?; -- Corregido: Usar placeholder
    `;
    // Asegúrate de que req.user.user_matricula contiene la matrícula del estudiante
    db.query(query, [req.user.user_matricula], (err, results) => {
        if (err) {
            console.error('Error en /student/tabla-datos-estudiante:', err);
            return res.status(500).json({ message: 'Error en la base de datos' });
        }
        console.log(results);
        res.json(results);
    });
});

/////////////////       CALIFICACIONES       ///////////////////////////////////////
app.get('/student/tabla-calificaciones/', authenticateToken, (req, res) => {
    const query = `
        SELECT 
          m.materia_nombre as materia,
          c.calif_p1,
          c.calif_p2,
          c.calif_final,
          ROUND((CAST(c.calif_p1 AS DECIMAL) + CAST(c.calif_p2 AS DECIMAL) + CAST(c.calif_final AS DECIMAL)) / 3, 2) as promedio,
          c.ciclo_cursando
        FROM CALIFICACIONES c
        JOIN MATERIAS m ON c.id_materia = m.id_materia
        WHERE c.matricula = ? AND c.ciclo_cursando = '2025-1';
    `;
    db.query(query, [req.user.user_matricula], (err, results) => {
        if (err) {
            console.error('Error en /student/tabla-calificaciones:', err);
            return res.status(500).json({ message: 'Error en la base de datos' });
        }
        res.json(results);
    });
});

/////////////////       KARDEZ       ///////////////////////////////////////
app.get('/student/tabla-kardez/', authenticateToken, (req, res) => {
    const query = `
        SELECT 
            m.materia_nombre AS materia,
            c.ciclo_cursando AS periodo,
            ROUND((CAST(c.calif_p1 AS DECIMAL) + CAST(c.calif_p2 AS DECIMAL) + CAST(c.calif_final AS DECIMAL)) / 3, 2) AS calif_final,
            CASE 
                WHEN ROUND((CAST(c.calif_p1 AS DECIMAL) + CAST(c.calif_p2 AS DECIMAL) + CAST(c.calif_final AS DECIMAL)) / 3, 2) > 7 
                THEN 'Aprobado' 
                ELSE 'Reprobado' 
            END AS estado
        FROM CALIFICACIONES c
        JOIN MATERIAS m ON c.id_materia = m.id_materia
        WHERE c.matricula = ?; -- Corregido: Usar placeholder
    `;
    db.query(query, [req.user.user_matricula], (err, results) => {
        if (err) {
            console.error('Error en /student/tabla-kardez:', err);
            return res.status(500).json({ message: 'Error en la base de datos' });
        }
        console.log(results);
        res.json(results);
    });
});

/////////////////       PAGOS       ///////////////////////////////////////
app.get('/student/tabla-pagos/', authenticateToken, (req, res) => {
    const query = `
        SELECT 
        DATE_FORMAT(p.fecha_vencimiento, '%M') AS MES,    -- Extracts month name
        p.pago_mensual AS CANTIDAD,
        p.fecha_vencimiento AS FECHA_CORTE,
        CASE 
            WHEN p.fecha_pago IS NULL THEN 'Pendiente'
            WHEN DAY(p.fecha_pago) BETWEEN 1 AND 5 THEN 'Descuento 5%'
            WHEN DAY(p.fecha_pago) BETWEEN 6 AND 15 THEN 'Normal'
            WHEN DAY(p.fecha_pago) > 15 THEN 'Recargo 5%'
        END AS ESTADO,
        CASE 
            WHEN p.fecha_pago IS NULL THEN 'Por pagar'
            ELSE 'Pagado'
        END AS ACCION
        FROM PAGOS p
        JOIN ALUMNOS on ALUMNOS.matricula = p.matricula
        where ALUMNOS.matricula = ?;
    `;
    db.query(query, [req.user.user_matricula], (err, results) => {
        if (err) {
            console.error('Error en /student/tabla-pagos:', err);
            return res.status(500).json({ message: 'Error en la base de datos' });
        }
        console.log(results);
        res.json(results);
    });
});

/////////////////       ASISTENCIAS       ///////////////////////////////////////
app.post('/student/registro-asistencias/', authenticateToken, (req, res) => {
    const { codigo_asistencia } = req.body;
    const user_matricula = req.user.user_matricula; // Asumiendo que esta es la matrícula del estudiante
    if (!codigo_asistencia)
        return res.status(400).json({ success: false, message: "Código de asistencia requerido" });

    // En un entorno real, también verificarías si el código es válido y si la asistencia no ha sido ya registrada
    const query = ` INSERT INTO ASISTENCIA (matricula, codigo, asistencia) VALUES (?, ?, NOW()); `;
    db.query(query, [user_matricula, codigo_asistencia], (err, result) => {
        if (err) {
            console.error("Error al registrar asistencia:", err);
            return res.status(500).json({ success: false, message: "Error en la base de datos." });
        }
        res.json({ success: true, message: "Asistencia registrada correctamente." });
    });
});

///////////////////////////////////////////////////////    FIN   ESTUDIANTES       ////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////       PROFESORES       ////////////////////////////////////////////////////////////////////////////////
///////////////CALENDARIO DE MATERIAS A IMPARTIR
app.get('/professor/schedule/', authenticateToken, (req, res) => {
    const query = `
        SELECT 
          M.materia_nombre AS materia_nombre,
          H.id_grupo,
          CONCAT (
            IF(h_lunes IS NOT NULL AND h_lunes != '', CONCAT('Lunes: ', h_lunes, '<br>'), ''),
            IF(h_martes IS NOT NULL AND h_martes != '', CONCAT('Martes: ', h_martes, '<br>'), ''),
            IF(h_miercoles IS NOT NULL AND h_miercoles != '', CONCAT('Miércoles: ', h_miercoles, '<br>'), ''),
            IF(h_jueves IS NOT NULL AND h_jueves != '', CONCAT('Jueves: ', h_jueves, '<br>'), ''),
            IF(h_viernes IS NOT NULL AND h_viernes != '', CONCAT('Viernes: ', h_viernes), '')
        ) AS horarios
        FROM HORARIOS H
        JOIN MATERIAS M ON M.id_materia = H.id_materia
        JOIN PROFESORES P ON P.id_profesor = H.id_profesor
        WHERE P.id_profesor = ?; -- Corregido: Usar placeholder
    `;
    // Asumo que user_matricula en el JWT del profesor es su id_profesor
    db.query(query, [req.user.user_matricula], (err, results) => {
        if (err) {
            console.error('Error en /professor/schedule:', err);
            return res.status(500).json({ message: 'Error en la base de datos' });
        }
        console.log(results);
        res.json(results);
    });
});

//////////////////////////////////////////////////////// QR ASISTENCIA //////////////////////////////////////////////////////////////////
app.get('/professor/QR_CODE_GEN/', authenticateToken, (req, res) => {
    const query = `
        SELECT 
            HORARIOS.id_materia,
            MATERIAS.materia_nombre,
            HORARIOS.id_grupo
        FROM HORARIOS
        JOIN MATERIAS ON HORARIOS.id_materia = MATERIAS.id_materia
        WHERE HORARIOS.id_profesor = ?;
    `;
    console.log("matricula del profesor (desde JWT):", req.user.user_matricula);
    db.query(query, [req.user.user_matricula], (err, results) => {
        if (err) {
            console.error('Error en /professor/QR_CODE_GEN:', err);
            return res.status(500).json({ message: 'Error en la base de datos' });
        }
        console.log(results);
        res.json(results);
    });
});

///////////////////       CALIFICACIONES /////////////////////////
app.get('/professor/getSubjects', authenticateToken, (req, res) => {
    const query = `
        SELECT DISTINCT
        GRUPOSALUM.id_materia,
        MATERIAS.materia_nombre,
        GRUPOSALUM.id_grupo
        FROM MATERIAS
        JOIN GRUPOSALUM ON MATERIAS.id_materia = GRUPOSALUM.id_materia
        JOIN MATERIASPROF ON GRUPOSALUM.id_grupo = MATERIASPROF.id_grupo
        JOIN PROFESORES ON MATERIASPROF.id_profesor = PROFESORES.id_profesor
        WHERE PROFESORES.id_profesor = ?;
    `;
    db.query(query, [req.user.user_matricula], (err, results) => {
        if (err) {
            console.error('Error en /professor/getSubjects:', err);
            return res.status(500).json({ message: 'Error en la base de datos' });
        }
        console.log(results);
        res.json(results);
    });
});

app.get('/professor/getStudents', async (req, res) => {
    const { id_materia, id_grupo } = req.query;
    console.log("Recibido:", id_materia, id_grupo);

    const query = `
        SELECT 
          A.matricula, A.user_name, C.calif_p1, C.calif_p2, C.calif_final
        FROM ALUMNOS A
        JOIN GRUPOSALUM G ON A.matricula = G.matricula_alumno
        LEFT JOIN CALIFICACIONES C ON A.matricula = C.matricula AND G.id_materia = C.id_materia
        WHERE G.id_materia = ? AND G.id_grupo = ?;
    `;
    db.query(query, [id_materia, id_grupo], (err, results) => {
        if (err) {
            console.error('Error en /professor/getStudents:', err);
            return res.status(500).json({ message: 'Error en la base de datos' });
        }
        res.json(results);
    });
});

app.post('/professor/saveGrade', (req, res) => {
    const { id_materia, matricula, calif_p1, calif_p2, calif_final, ciclo_cursando } = req.body;
    const sql = `
        INSERT INTO CALIFICACIONES (id_materia, matricula, calif_p1, calif_p2, calif_final, ciclo_cursando)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          calif_p1 = VALUES(calif_p1),
          calif_p2 = VALUES(calif_p2),
          calif_final = VALUES(calif_final),
          ciclo_cursando = VALUES(ciclo_cursando);
    `;
    db.query(sql, [id_materia, matricula, calif_p1, calif_p2, calif_final, ciclo_cursando], (err, result) => {
        if (err) {
            console.error("Error al guardar calificación:", err);
            return res.status(500).json({ message: "Error en la base de datos." });
        }
        res.json({ message: "Calificación guardada correctamente." });
    });
});

// Inicio del servidor
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});