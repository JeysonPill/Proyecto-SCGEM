// src/pages/profesor/Dashboard.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useDataContext } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import QRCode from 'qrcode';
import Layout from '../../components/layout/Layout'; // Importa el Layout

// Importar todos los tipos relevantes para el profesor
import {
  ProfessorScheduleEntry,
  ProfessorSubjectGroup,
  StudentForGrading, // ¡Esta es la que faltaba y te causaba el error!
} from '../../types';


// Componente para el horario del profesor
const HorarioProfesor: React.FC = () => {
  const { professorSchedule, fetchProfessorSchedule, isLoading, error } = useDataContext();

  useEffect(() => {
    fetchProfessorSchedule();
  }, [fetchProfessorSchedule]);

  if (isLoading) return <p>Cargando horario...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h3>Mi Horario de Clases</h3>
      <table border={1} style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr>
            <th>Materia</th>
            <th>Grupo</th>
            <th>Horarios</th>
          </tr>
        </thead>
        <tbody>
          {professorSchedule.length > 0 ? (
            professorSchedule.map((entry, index) => (
              <tr key={index}>
                <td>{entry.materia_nombre}</td>
                <td>{entry.id_grupo}</td>
                <td dangerouslySetInnerHTML={{ __html: entry.horarios }}></td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={3}>No hay horario registrado.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Componente para generar QR
const GenerarQrAsistencia: React.FC = () => {
  const { professorQrSubjects, fetchProfessorQrSubjects, isLoading, error } = useDataContext();
  const [selectedSubjectGroup, setSelectedSubjectGroup] = useState<{ id_materia: string; id_grupo: string } | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [generatedQrCodeValue, setGeneratedQrCodeValue] = useState<string | null>(null);

  useEffect(() => {
    fetchProfessorQrSubjects();
  }, [fetchProfessorQrSubjects]);

  const generateQrCode = async () => {
    if (selectedSubjectGroup) {
      const { id_materia, id_grupo } = selectedSubjectGroup;
      const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const attendanceCode = `${id_materia}-${id_grupo}-${date}`;
      setGeneratedQrCodeValue(attendanceCode);

      try {
        const dataUrl = await QRCode.toDataURL(attendanceCode, { margin: 1 });
        setQrCodeDataUrl(dataUrl);
      } catch (err) {
        console.error(err);
        alert('Error al generar código QR.');
      }
    } else {
      alert('Por favor, selecciona una materia y grupo.');
    }
  };

  if (isLoading) return <p>Cargando materias para QR...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h3>Generar Código QR de Asistencia</h3>
      <div style={{ marginBottom: '15px', marginTop: '10px' }}>
        <label htmlFor="qr-subject-select">Selecciona Materia y Grupo:</label>
        <select
          id="qr-subject-select"
          value={selectedSubjectGroup ? `${selectedSubjectGroup.id_materia}-${selectedSubjectGroup.id_grupo}` : ''}
          onChange={(e) => {
            const [materiaId, groupId] = e.target.value.split('-');
            setSelectedSubjectGroup({ id_materia: materiaId, id_grupo: groupId });
            setQrCodeDataUrl('');
            setGeneratedQrCodeValue(null);
          }}
          style={{ marginLeft: '10px', padding: '5px' }}
        >
          <option value="">Selecciona...</option>
          {professorQrSubjects.map((subject, index) => (
            <option key={index} value={`${subject.id_materia}-${subject.id_grupo}`}>
              {subject.materia_nombre} (Grupo: {subject.id_grupo})
            </option>
          ))}
        </select>
        <button
          onClick={generateQrCode}
          disabled={!selectedSubjectGroup}
          style={{ marginLeft: '15px', padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Generar QR
        </button>
      </div>
      {qrCodeDataUrl && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <h4>Código QR Generado:</h4>
          <img src={qrCodeDataUrl} alt="QR Code for Attendance" style={{ border: '1px solid #ddd', padding: '10px' }} />
          <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Código: {generatedQrCodeValue}</p>
        </div>
      )}
    </div>
  );
};

// Componente para gestionar calificaciones
const GestionarCalificaciones: React.FC = () => {
  const {
    professorGradingSubjects,
    fetchProfessorGradingSubjects,
    currentStudentsForGrading,
    fetchStudentsForGrading,
    saveStudentGrade,
    isLoading,
    error
  } = useDataContext();

  const [selectedGradingSubjectGroup, setSelectedGradingSubjectGroup] = useState<{ id_materia: string; id_grupo: string } | null>(null);
  const [localStudents, setLocalStudents] = useState<StudentForGrading[]>([]); // Tipo correcto aquí

  useEffect(() => {
    fetchProfessorGradingSubjects();
  }, [fetchProfessorGradingSubjects]);

  useEffect(() => {
    setLocalStudents(currentStudentsForGrading);
  }, [currentStudentsForGrading]);

  const handleSubjectGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [materiaId, groupId] = e.target.value.split('-');
    const selected = professorGradingSubjects.find(s => s.id_materia === materiaId && s.id_grupo === groupId) || null;
    setSelectedGradingSubjectGroup(selected);
    if (selected) {
      fetchStudentsForGrading(selected.id_materia, selected.id_grupo);
    }
  };

  const handleGradeChange = (matricula: string, field: keyof StudentForGrading, value: string) => {
    setLocalStudents(prevStudents =>
      prevStudents.map(student =>
        student.matricula === matricula
          ? { ...student, [field]: value === '' ? null : parseFloat(value) }
          : student
      )
    );
  };

  const handleSaveGrade = async (student: StudentForGrading) => {
    if (!selectedGradingSubjectGroup) {
      alert('Selecciona una materia y grupo antes de guardar.');
      return;
    }
    try {
      const response = await saveStudentGrade(
        selectedGradingSubjectGroup.id_materia,
        student.matricula,
        student.calif_p1,
        student.calif_p2,
        student.calif_final,
        '2025-1' // Este ciclo debería ser dinámico si lo gestionas, pero coincide con tu backend
      );
      alert(response.message);
    } catch (err: any) {
      alert(`Error al guardar: ${err.message || 'Error desconocido'}`);
    }
  };

  if (isLoading) return <p>Cargando materias/alumnos...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h3>Gestionar Calificaciones</h3>
      <div style={{ marginBottom: '15px', marginTop: '10px' }}>
        <label htmlFor="grading-subject-select">Selecciona Materia y Grupo:</label>
        <select
          id="grading-subject-select"
          value={selectedGradingSubjectGroup ? `${selectedGradingSubjectGroup.id_materia}-${selectedGradingSubjectGroup.id_grupo}` : ''}
          onChange={handleSubjectGroupChange}
          style={{ marginLeft: '10px', padding: '5px' }}
        >
          <option value="">Selecciona...</option>
          {professorGradingSubjects.map((subject, index) => (
            <option key={index} value={`${subject.id_materia}-${subject.id_grupo}`}>
              {subject.materia_nombre} (Grupo: {subject.id_grupo})
            </option>
          ))}
        </select>
      </div>

      {selectedGradingSubjectGroup && localStudents.length > 0 ? (
        <table border={1} style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Matrícula</th>
              <th>Nombre</th>
              <th>P1</th>
              <th>P2</th>
              <th>Final</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {localStudents.map((student) => (
              <tr key={student.matricula}>
                <td>{student.matricula}</td>
                <td>{student.user_name}</td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    value={student.calif_p1 !== null ? student.calif_p1 : ''}
                    onChange={(e) => handleGradeChange(student.matricula, 'calif_p1', e.target.value)}
                    style={{ width: '60px', padding: '5px' }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    value={student.calif_p2 !== null ? student.calif_p2 : ''}
                    onChange={(e) => handleGradeChange(student.matricula, 'calif_p2', e.target.value)}
                    style={{ width: '60px', padding: '5px' }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    value={student.calif_final !== null ? student.calif_final : ''}
                    onChange={(e) => handleGradeChange(student.matricula, 'calif_final', e.target.value)}
                    style={{ width: '60px', padding: '5px' }}
                  />
                </td>
                <td>
                  <button onClick={() => handleSaveGrade(student)} style={{ padding: '5px 10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                    Guardar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : selectedGradingSubjectGroup && !isLoading && localStudents.length === 0 ? (
        <p>No hay alumnos en este grupo o no se han cargado.</p>
      ) : (
        <p>Selecciona una materia y grupo para gestionar calificaciones.</p>
      )}
    </div>
  );
};


const DashboardProfesor: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <Layout> {/* Envuelve el contenido en el Layout */}
      <h2>Dashboard de Profesor {user?.user_name ? `(${user.user_name})` : ''}</h2>
      <nav style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '15px' }}>
          <li><Link to="horario" style={{ fontWeight: location.pathname.includes('/horario') ? 'bold' : 'normal' }}>Mi Horario</Link></li>
          <li><Link to="qr" style={{ fontWeight: location.pathname.includes('/qr') ? 'bold' : 'normal' }}>Generar QR Asistencia</Link></li>
          <li><Link to="calificaciones" style={{ fontWeight: location.pathname.includes('/calificaciones') ? 'bold' : 'normal' }}>Gestionar Calificaciones</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="horario" replace />} />
        <Route path="horario" element={<HorarioProfesor />} />
        <Route path="qr" element={<GenerarQrAsistencia />} />
        <Route path="calificaciones" element={<GestionarCalificaciones />} />
        <Route path="*" element={<div>Selecciona una opción del menú.</div>} />
      </Routes>
    </Layout>
  );
};

export default DashboardProfesor;