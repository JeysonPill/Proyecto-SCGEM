// src/pages/estudiante/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'; // Para navegación interna
import { useDataContext } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext'; // Para mostrar matrícula o nombre

// Puedes crear componentes separados para cada vista (MateriasEstudiante, CalificacionesEstudiante, etc.)
// src/pages/estudiante/Materias.tsx
const MateriasEstudiante: React.FC = () => {
  const { studentSubjects, fetchStudentSubjects, isLoading, error } = useDataContext();

  useEffect(() => {
    fetchStudentSubjects();
  }, [fetchStudentSubjects]); // La dependencia es la función, pero React garantiza estabilidad

  if (isLoading) return <p>Cargando materias...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h3>Mis Materias</h3>
      <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Materia</th>
            <th>Profesor</th>
            <th>Horarios</th>
            <th>Grupo</th>
          </tr>
        </thead>
        <tbody>
          {studentSubjects.length > 0 ? (
            studentSubjects.map((s, index) => (
              <tr key={index}>
                <td>{s.materia_nombre}</td>
                <td>{s.profesor_nombre}</td>
                <td dangerouslySetInnerHTML={{ __html: s.horarios }}></td> {/* OJO: usar dangerouslySetInnerHTML con cuidado */}
                <td>{s.id_grupo}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={4}>No hay materias registradas.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// src/pages/estudiante/Calificaciones.tsx
const CalificacionesEstudiante: React.FC = () => {
  const { studentGrades, fetchStudentGrades, isLoading, error } = useDataContext();

  useEffect(() => {
    fetchStudentGrades();
  }, [fetchStudentGrades]);

  if (isLoading) return <p>Cargando calificaciones...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h3>Mis Calificaciones</h3>
      <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Materia</th>
            <th>P1</th>
            <th>P2</th>
            <th>Final</th>
            <th>Promedio</th>
            <th>Ciclo</th>
          </tr>
        </thead>
        <tbody>
          {studentGrades.length > 0 ? (
            studentGrades.map((g, index) => (
              <tr key={index}>
                <td>{g.materia}</td>
                <td>{g.calif_p1 !== null ? g.calif_p1 : 'N/A'}</td>
                <td>{g.calif_p2 !== null ? g.calif_p2 : 'N/A'}</td>
                <td>{g.calif_final !== null ? g.calif_final : 'N/A'}</td>
                <td>{g.promedio !== null ? g.promedio : 'N/A'}</td>
                <td>{g.ciclo_cursando}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={6}>No hay calificaciones registradas.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// src/pages/estudiante/Asistencia.tsx (para el POST)
const AsistenciaEstudiante: React.FC = () => {
  const { registerStudentAttendance, isLoading, error } = useDataContext();
  const [attendanceCode, setAttendanceCode] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Limpiar mensajes anteriores
    try {
      const response = await registerStudentAttendance(attendanceCode);
      setMessage(response.message);
      setAttendanceCode(''); // Limpiar input
    } catch (err: any) {
      setMessage(`Error: ${err.message || 'Error al registrar asistencia.'}`);
    }
  };

  return (
    <div>
      <h3>Registrar Asistencia</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <input
          type="text"
          placeholder="Código de Asistencia"
          value={attendanceCode}
          onChange={(e) => setAttendanceCode(e.target.value)}
          required
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrar Asistencia'}
        </button>
        {message && <p style={{ color: error ? 'red' : 'green' }}>{message}</p>}
      </form>
    </div>
  );
};
// ... y así sucesivamente para Kardex y Pagos ...

// Dashboard Estudiante principal
const DashboardEstudiante: React.FC = () => {
  const { user } = useAuth(); // Para mostrar el nombre del estudiante
  const location = useLocation(); // Para saber la ruta actual y resaltar el link

  return (
    <div>
      <h2>Dashboard de Estudiante {user?.user_name ? `(${user.user_name})` : ''}</h2>
      {/* Navegación interna del dashboard */}
      <nav style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '15px' }}>
          <li><Link to="materias" style={{ fontWeight: location.pathname.includes('/materias') ? 'bold' : 'normal' }}>Materias</Link></li>
          <li><Link to="calificaciones" style={{ fontWeight: location.pathname.includes('/calificaciones') ? 'bold' : 'normal' }}>Calificaciones</Link></li>
          <li><Link to="kardex" style={{ fontWeight: location.pathname.includes('/kardex') ? 'bold' : 'normal' }}>Kardex</Link></li>
          <li><Link to="pagos" style={{ fontWeight: location.pathname.includes('/pagos') ? 'bold' : 'normal' }}>Pagos</Link></li>
          <li><Link to="asistencia" style={{ fontWeight: location.pathname.includes('/asistencia') ? 'bold' : 'normal' }}>Asistencia</Link></li>
        </ul>
      </nav>

      {/* Rutas anidadas para el contenido del dashboard */}
      <Routes>
        <Route path="/" element={<Navigate to="materias" replace />} /> {/* Ruta por defecto */}
        <Route path="materias" element={<MateriasEstudiante />} />
        <Route path="calificaciones" element={<CalificacionesEstudiante />} />
        <Route path="kardex" element={<MateriasEstudiante />} /> {/* Debes crear el componente real de Kardex */}
        <Route path="pagos" element={<MateriasEstudiante />} />     {/* Debes crear el componente real de Pagos */}
        <Route path="asistencia" element={<AsistenciaEstudiante />} />
        <Route path="*" element={<div>Selecciona una opción del menú.</div>} />
      </Routes>
    </div>
  );
};

export default DashboardEstudiante;