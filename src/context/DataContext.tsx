// src/context/DataContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  getAllStudents,
  getAllProfessors,
  getAllSubjects,
  getAllSchedules,
  // Asegúrate de importar tus funciones CRUD también si las pasas por el contexto
  createStudent,
  //updateStudent,
  //deleteStudent,
  createProfessor,
  //updateProfessor,
  //deleteProfessor,
  createSubject,
 // updateSubject,
  //deleteSubject,
  createSchedule,
  //updateSchedule,
  //deleteSchedule,
} from '../services/api'; // Importación correcta de funciones API

import { useAuth } from './AuthContext'; // Importa useAuth para acceder al rol del usuario

// ¡Añade 'export' a cada interfaz!
export interface Student {
  id_student: string; // O el tipo de ID que uses
  user_name: string;
  matricula: string;
  carrera: string;
  email: string;
  user_role: string;
  password?: string; // Asegúrate de incluirla si es parte del tipo
  // Añade todas las propiedades de Student
}

export interface Subject {
  id_materia: string; // O el tipo de ID que uses
  materia_nombre: string;
  sem_cursante: string;
  // Añade todas las propiedades de Subject
}

export interface Professor {
  id_profesor: string; // O el tipo de ID que uses
  nombre: string;
  email: string;
  user_role: string;
  password?: string; // Asegúrate de incluirla si es parte del tipo
  // Añade todas las propiedades de Professor
}

export interface Schedule {
  id_horario: string; // O el tipo de ID que uses
  id_materia: string;
  id_grupo: string;
  hora_inicio: string;
  hora_fin: string;
  dia_semana: string;
  id_profesor: string; // Para relacionar con el profesor que la imparte
  // Añade todas las propiedades de Schedule
}

interface DataContextType {
  students: Student[];
  subjects: Subject[];
  professors: Professor[];
  schedules: Schedule[];
  isLoading: boolean;
  // Funciones CRUD para estudiantes
  addStudent: (student: Omit<Student, 'id_student'>) => Promise<void>;
  updateStudent: (id: string, student: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  // Funciones CRUD para profesores
  addProfessor: (professor: Omit<Professor, 'id_profesor'>) => Promise<void>;
  updateProfessor: (id: string, professor: Partial<Professor>) => Promise<void>;
  deleteProfessor: (id: string) => Promise<void>;
  // Funciones CRUD para materias
  addSubject: (subject: Omit<Subject, 'id_materia'>) => Promise<void>;
  updateSubject: (id: string, subject: Partial<Subject>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  // Funciones CRUD para horarios
  addSchedule: (schedule: Omit<Schedule, 'id_horario'>) => Promise<void>;
  updateSchedule: (id: string, schedule: Partial<Schedule>) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Nuevo estado para indicar carga de datos

  const { user, isLoading: authLoading } = useAuth(); // Obtén el usuario y el estado de carga de autenticación
  const userRole = user?.user_role; // Obtén el rol del usuario

  // Define los roles como en tu backend (server.js)
  const ROLES = {
    STUDENT: '1',
    PROFESSOR: '2',
    ADMIN_STAFF: '3',
    SUPER_ADMIN: '99',
  };

  useEffect(() => {
    // Solo intenta cargar datos si la autenticación ha terminado y hay un usuario
    if (!authLoading && user) {
      const fetchData = async () => {
        setIsLoading(true); // Inicia carga de datos
        try {
          // Cargar estudiantes (Admin Staff, Superadmin)
          if (userRole === ROLES.ADMIN_STAFF || userRole === ROLES.SUPER_ADMIN || userRole === ROLES.STUDENT) {
            const studentsData = await getAllStudents();
            setStudents(studentsData);
          } else {
            setStudents([]); // Asegúrate de limpiar el estado si el usuario no tiene acceso
          }

          // Cargar profesores (Admin Staff, Superadmin, Profesor)
          if (userRole === ROLES.ADMIN_STAFF || userRole === ROLES.SUPER_ADMIN || userRole === ROLES.PROFESSOR) {
            const professorsData = await getAllProfessors();
            setProfessors(professorsData);
          } else {
            setProfessors([]);
          }

          // Cargar materias (Todos los roles)
          if (userRole) { // Todos los roles pueden ver materias
            const subjectsData = await getAllSubjects();
            setSubjects(subjectsData);
          } else {
            setSubjects([]);
          }


          // Cargar horarios (Todos los roles)
          if (userRole) { // Todos los roles pueden ver horarios
            const schedulesData = await getAllSchedules();
            setSchedules(schedulesData);
          } else {
            setSchedules([]);
          }

        } catch (error) {
          console.error('Error obtener los datos por rol ' + userRole + ':', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    } else if (!authLoading && !user) {
        setIsLoading(false);
    }
  }, [user, authLoading, userRole]); 


  const addStudent = async (student: Omit<Student, 'id_student'>) => {
    try {
      await createStudent(student);
      if (userRole === ROLES.ADMIN_STAFF || userRole === ROLES.SUPER_ADMIN) {
        const studentsData = await getAllStudents();
        setStudents(studentsData);
      }
    } catch (error) {
      console.error("Error adding student:", error);
      throw error;
    }
  };

  const updateStudent = async (id: string, student: Partial<Student>) => {
    try {
      await updateStudent(id, student);
      if (userRole === ROLES.ADMIN_STAFF || userRole === ROLES.SUPER_ADMIN) {
        const studentsData = await getAllStudents();
        setStudents(studentsData);
      }
    } catch (error) {
      console.error("Error updating student:", error);
      throw error;
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      await deleteStudent(id);
      if (userRole === ROLES.ADMIN_STAFF || userRole === ROLES.SUPER_ADMIN) {
        const studentsData = await getAllStudents();
        setStudents(studentsData);
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      throw error;
    }
  };

  // Profesores
  const addProfessor = async (professor: Omit<Professor, 'id_profesor'>) => {
    try {
      await createProfessor(professor);
      if (userRole === ROLES.ADMIN_STAFF || userRole === ROLES.SUPER_ADMIN) {
        const professorsData = await getAllProfessors();
        setProfessors(professorsData);
      }
    } catch (error) {
      console.error("Error adding professor:", error);
      throw error;
    }
  };

  const updateProfessor = async (id: string, professor: Partial<Professor>) => {
    try {
      await updateProfessor(id, professor);
      if (userRole === ROLES.ADMIN_STAFF || userRole === ROLES.SUPER_ADMIN) {
        const professorsData = await getAllProfessors();
        setProfessors(professorsData);
      }
    } catch (error) {
      console.error("Error updating professor:", error);
      throw error;
    }
  };

  const deleteProfessor = async (id: string) => {
    try {
      await deleteProfessor(id);
      if (userRole === ROLES.ADMIN_STAFF || userRole === ROLES.SUPER_ADMIN) {
        const professorsData = await getAllProfessors();
        setProfessors(professorsData);
      }
    } catch (error) {
      console.error("Error deleting professor:", error);
      throw error;
    }
  };

  // Materias
  const addSubject = async (subject: Omit<Subject, 'id_materia'>) => {
    try {
      await createSubject(subject);
      if (userRole && (userRole === ROLES.ADMIN_STAFF || userRole === ROLES.SUPER_ADMIN)) {
        const subjectsData = await getAllSubjects();
        setSubjects(subjectsData);
      }
    } catch (error) {
      console.error("Error adding subject:", error);
      throw error;
    }
  };

  const updateSubject = async (id: string, subject: Partial<Subject>) => {
    try {
      await updateSubject(id, subject);
      if (userRole && (userRole === ROLES.ADMIN_STAFF || userRole === ROLES.SUPER_ADMIN)) {
        const subjectsData = await getAllSubjects();
        setSubjects(subjectsData);
      }
    } catch (error) {
      console.error("Error updating subject:", error);
      throw error;
    }
  };

  const deleteSubject = async (id: string) => {
    try {
      await deleteSubject(id);
      if (userRole && (userRole === ROLES.ADMIN_STAFF || userRole === ROLES.SUPER_ADMIN)) {
        const subjectsData = await getAllSubjects();
        setSubjects(subjectsData);
      }
    } catch (error) {
      console.error("Error deleting subject:", error);
      throw error;
    }
  };

  // Horarios
  const addSchedule = async (schedule: Omit<Schedule, 'id_horario'>) => {
    try {
      await createSchedule(schedule);
      if (userRole && (userRole === ROLES.ADMIN_STAFF || userRole === ROLES.SUPER_ADMIN)) {
        const schedulesData = await getAllSchedules();
        setSchedules(schedulesData);
      }
    } catch (error) {
      console.error("Error adding schedule:", error);
      throw error;
    }
  };

  const updateSchedule = async (id: string, schedule: Partial<Schedule>) => {
    try {
      await updateSchedule(id, schedule);
      if (userRole && (userRole === ROLES.ADMIN_STAFF || userRole === ROLES.SUPER_ADMIN)) {
        const schedulesData = await getAllSchedules();
        setSchedules(schedulesData);
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
      throw error;
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      await deleteSchedule(id);
      if (userRole && (userRole === ROLES.ADMIN_STAFF || userRole === ROLES.SUPER_ADMIN)) {
        const schedulesData = await getAllSchedules();
        setSchedules(schedulesData);
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
      throw error;
    }
  };



  const value = {
    students,
    subjects,
    professors,
    schedules,
    isLoading,
    addStudent, updateStudent, deleteStudent,
    addProfessor, updateProfessor, deleteProfessor,
    addSubject, updateSubject, deleteSubject,
    addSchedule, updateSchedule, deleteSchedule,
  };

  if (authLoading) {
    return <div>Cargando datos de usuario...</div>; // O un spinner más elaborado
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};