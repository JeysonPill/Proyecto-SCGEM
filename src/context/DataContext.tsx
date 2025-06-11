// src/context/DataContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';
import { ROLES } from '../utils/roles';
import {
  StudentSubject,
  StudentGrade,
  StudentKardexEntry,
  StudentPayment,
  AttendanceResponse,
  ProfessorScheduleEntry,
  ProfessorSubjectGroup,
  StudentForGrading,
} from '../types/index'; // Importamos todos los tipos necesarios

interface DataContextType {
  // Estado para estudiante
  studentSubjects: StudentSubject[];
  studentGrades: StudentGrade[];
  studentKardex: StudentKardexEntry[];
  studentPayments: StudentPayment[];
  
  // Estado para profesor
  professorSchedule: ProfessorScheduleEntry[];
  professorQrSubjects: ProfessorSubjectGroup[];
  professorGradingSubjects: ProfessorSubjectGroup[];
  currentStudentsForGrading: StudentForGrading[];

  // Estados de carga y error
  isLoading: boolean;
  error: string | null;

  // Funciones para estudiante
  fetchStudentSubjects: () => Promise<void>;
  fetchStudentGrades: () => Promise<void>;
  fetchStudentKardex: () => Promise<void>;
  fetchStudentPayments: () => Promise<void>;
  registerStudentAttendance: (codigo: string) => Promise<AttendanceResponse>;

  // Funciones para profesor
  fetchProfessorSchedule: () => Promise<void>;
  fetchProfessorQrSubjects: () => Promise<void>;
  fetchProfessorGradingSubjects: () => Promise<void>;
  fetchStudentsForGrading: (idMateria: string, idGrupo: string) => Promise<void>;
  saveStudentGrade: (
    idMateria: string,
    matricula: string,
    califP1: number | null,
    califP2: number | null,
    califFinal: number | null,
    cicloCursando: string // Este campo es importante para tu backend
  ) => Promise<{ message: string }>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const getAuthHeaders = (token: string) => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const token = localStorage.getItem('token'); // Acceder al token directamente de localStorage

  const [studentSubjects, setStudentSubjects] = useState<StudentSubject[]>([]);
  const [studentGrades, setStudentGrades] = useState<StudentGrade[]>([]);
  const [studentKardex, setStudentKardex] = useState<StudentKardexEntry[]>([]);
  const [studentPayments, setStudentPayments] = useState<StudentPayment[]>([]);

  const [professorSchedule, setProfessorSchedule] = useState<ProfessorScheduleEntry[]>([]);
  const [professorQrSubjects, setProfessorQrSubjects] = useState<ProfessorSubjectGroup[]>([]);
  const [professorGradingSubjects, setProfessorGradingSubjects] = useState<ProfessorSubjectGroup[]>([]);
  const [currentStudentsForGrading, setCurrentStudentsForGrading] = useState<StudentForGrading[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Funciones para Estudiante
  const fetchStudentSubjects = async () => {
    if (!isAuthenticated || user?.user_role !== ROLES.STUDENT || !token) {
      setError("No autenticado o no es estudiante.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${api}/student/tabla-datos-estudiante/`, {
        headers: getAuthHeaders(token),
      });
      if (!response.ok) throw new Error((await response.json()).message || 'Error al cargar materias del estudiante.');
      setStudentSubjects(await response.json());
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching student subjects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentGrades = async () => {
    if (!isAuthenticated || user?.user_role !== ROLES.STUDENT || !token) {
      setError("No autenticado o no es estudiante.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${api}/student/tabla-calificaciones/`, {
        headers: getAuthHeaders(token),
      });
      if (!response.ok) throw new Error((await response.json()).message || 'Error al cargar calificaciones.');
      setStudentGrades(await response.json());
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching student grades:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentKardex = async () => {
    if (!isAuthenticated || user?.user_role !== ROLES.STUDENT || !token) {
      setError("No autenticado o no es estudiante.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${api}/student/tabla-kardez/`, {
        headers: getAuthHeaders(token),
      });
      if (!response.ok) throw new Error((await response.json()).message || 'Error al cargar kardex.');
      setStudentKardex(await response.json());
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching student kardex:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentPayments = async () => {
    if (!isAuthenticated || user?.user_role !== ROLES.STUDENT || !token) {
      setError("No autenticado o no es estudiante.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${api}/student/tabla-pagos/`, {
        headers: getAuthHeaders(token),
      });
      if (!response.ok) throw new Error((await response.json()).message || 'Error al cargar pagos.');
      setStudentPayments(await response.json());
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching student payments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const registerStudentAttendance = async (codigo: string): Promise<AttendanceResponse> => {
    if (!isAuthenticated || user?.user_role !== ROLES.STUDENT || !token) {
      throw new Error("No autenticado o no es estudiante.");
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${api}/student/registro-asistencias/`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ codigo_asistencia: codigo }),
      });
      const data: AttendanceResponse = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al registrar asistencia.');
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error("Error registering attendance:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Funciones para Profesor
  const fetchProfessorSchedule = async () => {
    if (!isAuthenticated || user?.user_role !== ROLES.PROFESSOR || !token) {
      setError("No autenticado o no es profesor.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${api}/professor/schedule/`, {
        headers: getAuthHeaders(token),
      });
      if (!response.ok) throw new Error((await response.json()).message || 'Error al cargar horario del profesor.');
      setProfessorSchedule(await response.json());
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching professor schedule:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfessorQrSubjects = async () => {
    if (!isAuthenticated || user?.user_role !== ROLES.PROFESSOR || !token) {
      setError("No autenticado o no es profesor.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${api}/professor/QR_CODE_GEN/`, {
        headers: getAuthHeaders(token),
      });
      if (!response.ok) throw new Error((await response.json()).message || 'Error al cargar materias para QR.');
      setProfessorQrSubjects(await response.json());
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching QR subjects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfessorGradingSubjects = async () => {
    if (!isAuthenticated || user?.user_role !== ROLES.PROFESSOR || !token) {
      setError("No autenticado o no es profesor.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${api}/professor/getSubjects`, {
        headers: getAuthHeaders(token),
      });
      if (!response.ok) throw new Error((await response.json()).message || 'Error al cargar materias para calificar.');
      setProfessorGradingSubjects(await response.json());
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching grading subjects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentsForGrading = async (idMateria: string, idGrupo: string) => {
    if (!isAuthenticated || user?.user_role !== ROLES.PROFESSOR || !token) {
      setError("No autenticado o no es profesor.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${api}/professor/getStudents?id_materia=${idMateria}&id_grupo=${idGrupo}`, {
        headers: getAuthHeaders(token),
      });
      if (!response.ok) throw new Error((await response.json()).message || 'Error al cargar alumnos para calificar.');
      setCurrentStudentsForGrading(await response.json());
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching students for grading:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveStudentGrade = async (
    idMateria: string,
    matricula: string,
    califP1: number | null,
    califP2: number | null,
    califFinal: number | null,
    cicloCursando: string
  ): Promise<{ message: string }> => {
    if (!isAuthenticated || user?.user_role !== ROLES.PROFESSOR || !token) {
      throw new Error("No autenticado o no es profesor.");
    }
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        id_materia: idMateria,
        matricula: matricula,
        calif_p1: califP1,
        calif_p2: califP2,
        calif_final: califFinal,
        ciclo_cursando: cicloCursando,
      };
      const response = await fetch(`${api}/professor/saveGrade`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(payload),
      });
      const data: { message: string } = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al guardar la calificación.');
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error("Error saving grade:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        studentSubjects,
        studentGrades,
        studentKardex,
        studentPayments,
        professorSchedule,
        professorQrSubjects,
        professorGradingSubjects,
        currentStudentsForGrading,
        isLoading,
        error,
        fetchStudentSubjects,
        fetchStudentGrades,
        fetchStudentKardex,
        fetchStudentPayments,
        registerStudentAttendance,
        fetchProfessorSchedule,
        fetchProfessorQrSubjects,
        fetchProfessorGradingSubjects,
        fetchStudentsForGrading,
        saveStudentGrade,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext debe ser usado dentro de un DataProvider');
  }
  return context;
};