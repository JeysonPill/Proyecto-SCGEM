// src/pages/estudiante/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useDataContext } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout'; // Importa el Layout

// Importar todos los tipos relevantes para el estudiante

// Componentes internos para cada vista del dashboard del estudiante
const MateriasEstudiante: React.FC = () => {
  const { studentSubjects, fetchStudentSubjects, isLoading, error } = useDataContext();

  useEffect(() => {
    fetchStudentSubjects();
  }, [fetchStudentSubjects]);

  if (isLoading) return <p>Cargando materias...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h3>Mis Materias</h3>
      <table border={1} style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
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
                <td dangerouslySetInnerHTML={{ __html: s.horarios }}></td>
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
      <table border={1} style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
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

const KardexEstudiante: React.FC = () => {
  const { studentKardex, fetchStudentKardex, isLoading, error } = useDataContext();

  useEffect(() => {
    fetchStudentKardex();
  }, [fetchStudentKardex]);

  if (isLoading) return <p>Cargando kardex...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h3>Mi Kardex</h3>
      <table border={1} style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr>
            <th>Materia</th>
            <th>Periodo</th>
            <th>Créditos</th>
            <th>Calificación Final</th>
            <th>Estatus</th>
          </tr>
        </thead>
        <tbody>
          {studentKardex.length > 0 ? (
            studentKardex.map((k, index) => (
              <tr key={index}>
                <td>{k.materia}</td>
                <td>{k.periodo}</td>
                <td>{k.creditos}</td>
                <td>{k.calificacion_final}</td>
                <td>{k.estatus}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={5}>No hay entradas en el kardex.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const PagosEstudiante: React.FC = () => {
  const { studentPayments, fetchStudentPayments, isLoading, error } = useDataContext();

  useEffect(() => {
    fetchStudentPayments();
  }, [fetchStudentPayments]);

  if (isLoading) return <p>Cargando pagos...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h3>Mis Pagos</h3>
      <table border={1} style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr>
            <th>Concepto</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Estatus</th>
          </tr>
        </thead>
        <tbody>
          {studentPayments.length > 0 ? (
            studentPayments.map((p, index) => (
              <tr key={index}>
                <td>{p.concepto}</td>
                <td>${p.monto.toFixed(2)}</td>
                <td>{p.fecha}</td>
                <td>{p.estatus}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={4}>No hay pagos registrados.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const AsistenciaEstudiante: React.FC = () => {
  const { registerStudentAttendance, isLoading, error } = useDataContext();
  const [attendanceCode, setAttendanceCode] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const response = await registerStudentAttendance(attendanceCode);
      setMessage(response.message);
      setAttendanceCode('');
    } catch (err: any) {
      setMessage(`Error: ${err.message || 'Error al registrar asistencia.'}`);
    }
  };

  return (
    <div>
      <h3>Registrar Asistencia</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', marginTop: '10px' }}>
        <input
          type="text"
          placeholder="Código de Asistencia"
          value={attendanceCode}
          onChange={(e) => setAttendanceCode(e.target.value)}
          required
          disabled={isLoading}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{ padding: '8px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {isLoading ? 'Registrando...' : 'Registrar Asistencia'}
        </button>
        {message && <p style={{ color: error ? 'red' : 'green', marginTop: '10px' }}>{message}</p>}
      </form>
    </div>
  );
};


// Componente principal del Dashboard de Estudiante
const DashboardEstudiante: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <Layout> {/* Envuelve el contenido en el Layout */}
      <h2>Dashboard de Estudiante {user?.user_name ? `(${user.user_name})` : ''}</h2>
      <nav style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '15px' }}>
          <li><Link to="materias" style={{ fontWeight: location.pathname.includes('/materias') ? 'bold' : 'normal' }}>Materias</Link></li>
          <li><Link to="calificaciones" style={{ fontWeight: location.pathname.includes('/calificaciones') ? 'bold' : 'normal' }}>Calificaciones</Link></li>
          <li><Link to="kardex" style={{ fontWeight: location.pathname.includes('/kardex') ? 'bold' : 'normal' }}>Kardex</Link></li>
          <li><Link to="pagos" style={{ fontWeight: location.pathname.includes('/pagos') ? 'bold' : 'normal' }}>Pagos</Link></li>
          <li><Link to="asistencia" style={{ fontWeight: location.pathname.includes('/asistencia') ? 'bold' : 'normal' }}>Asistencia</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="materias" replace />} />
        <Route path="materias" element={<MateriasEstudiante />} />
        <Route path="calificaciones" element={<CalificacionesEstudiante />} />
        <Route path="kardex" element={<KardexEstudiante />} />
        <Route path="pagos" element={<PagosEstudiante />} />
        <Route path="asistencia" element={<AsistenciaEstudiante />} />
        <Route path="*" element={<div>Selecciona una opción del menú.</div>} />
      </Routes>
    </Layout>
  );
};

export default DashboardEstudiante;