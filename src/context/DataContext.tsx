import React, { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../services/api';

// Tipos
export type Student = {
  id: string;
  id_student: string;
  matricula: string;
  carrera: string;
  semestre: number;
  user_name: string;
  celular: string;
  email: string;
};

export interface Professor {
  id_profesor: string;
  nombre: string;
  celular: string;
  email: string;
}


export type Subject = {
  id_materia: string;
  materia_nombre: string;
  sem_cursante: number;
};

export type Schedule = {
  id_materia: string;
  id_grupo: string;
  id_profesor: string;
  h_lunes: string;
  h_martes: string;
  h_miercoles: string;
  h_jueves: string;
  h_viernes: string;
};

type DataContextType = {
  professors: any[];
  students: Student[];
  subjects: Subject[];
  schedules: Schedule[];

  addProfessor: (professor: Omit<Professor, 'id_profesor'>) => Promise<void>;
  updateProfessor: (id_profesor: string, professor: Omit<Professor, 'id_profesor'>) => Promise<void>;
  deleteProfessor: (id_profesor: string) => Promise<void>;

  addStudent: (student: Omit<Student, 'id_student'>) => Promise<void>;
  updateStudent: (id_student: string, student: Omit<Student, 'id_student'>) => Promise<void>;
  deleteStudent: (id_student: string) => Promise<void>;

  addSubject: (subject: Omit<Subject, 'id_materia'>) => Promise<void>;
  updateSubject: (id_materia: string, subject: Omit<Subject, 'id_materia'>) => Promise<void>;
  deleteSubject: (id_materia: string) => Promise<void>;


  fetchProfessors: () => Promise<void>;
  fetchStudents: () => Promise<void>;
  fetchSubjects: () => Promise<void>;
  fetchSchedules: () => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);



  const addProfessor = async (id_professor: Omit<Professor, 'id_profesor'>) => {
    try {
      const newProfessor = await api.createProfessor(id_professor);
      setProfessors(prev => [...prev, newProfessor]);
    } catch (error) {
      console.error('Error al agregar profesor', error);
    }
  };
  const updateProfessor = async (id_profesor: string, professor: Omit<Professor, 'id_profesor'>) => {
    try {
      const updatedProfessor = await api.updateProfessor(id_profesor, professor);
      setProfessors(prev => prev.map(p => (p.id_profesor === id_profesor ? updatedProfessor : p)));
    } catch (error) {
      console.error('Error al actualizar profesor', error);
    }
  }
  const addStudent = async (student: Omit<Student, 'id_student'>) => {
    try {
      const newStudent = await api.createStudent(student);
      setStudents(prev => [...prev, newStudent]);
    } catch (error) {
      console.error('Error al agregar estudiante', error);
    }
  };

  const updateStudent = async (id_student: string, student: Omit<Student, 'id_student'>) => {
    try {
      const updatedStudent = await api.updateStudent(id_student, student);
      setStudents(prev => prev.map(s => (s.id_student === id_student ? updatedStudent : s)));
    } catch (error) {
      console.error('Error al actualizar estudiante', error);
    }
  }
  const fetchProfessors = async () => {
    try {
      const data = await api.getProfessorSubjects();
      setProfessors(data);
    } catch (error) {
      console.error('Error al obtener profesores', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await api.getStudents();
      setStudents(data);
    } catch (error) {
      console.error('Error al obtener estudiantes', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const data = await api.getAllSubjects(); 
      setSubjects(data);
    } catch (error) {
      console.error('Error al obtener materias', error);
    }
  };


  const deleteProfessor = async (id: string) => {
    try {
      await api.deleteProfessor(id);
      setProfessors(prev => prev.filter(p => p.id_profesor !== id));
    } catch (error) {
      console.error('Error al borrar profesor', error);
    }
  };

  const deleteSubject = async (id: string) => {
    try {
      await api.deleteSubject(id);
      setSubjects(prev => prev.filter(p => p.id_materia !== id));
    } catch (error) {
      console.error('Error al borrar profesor', error);
    }
  };
  const deleteStudent = async (id: string) => {
    try {
      await api.deleteStudent(id);
      setStudents(prev => prev.filter(p => p.id_student !== id));
    } catch (error) {
      console.error('Error al borrar profesor', error);
    }
  };

  // Add Subject
  const addSubject = async (subject: Omit<Subject, 'id_materia'>) => {
    try {
      const newSubject = await api.createSubject(subject);
      setSubjects(prev => [...prev, newSubject]);
    } catch (error) {
      console.error('Error al agregar materia', error);
    }
  };

  // Update Subject
  const updateSubject = async (id_materia: string, subject: Omit<Subject, 'id_materia'>) => {
    try {
      const updatedSubject = await api.updateSubject(id_materia, subject);
      setSubjects(prev => prev.map(s => (s.id_materia === id_materia ? updatedSubject : s)));
    } catch (error) {
      console.error('Error al actualizar materia', error);
    }
  };

  // Fetch Schedules
  const fetchSchedules = async () => {
    try {
      const data = await api.getSchedules();
      setSchedules(data);
    } catch (error) {
      console.error('Error al obtener horarios', error);
    }
  };

  useEffect(() => {
    fetchProfessors();
    fetchStudents();
    fetchSubjects();
    fetchSchedules();
  }, []);

  return (
    <DataContext.Provider
      value={{
        professors,
        students,
        subjects,
        schedules,
        addProfessor,
        updateProfessor,
        addStudent,
        updateStudent,
        addSubject,
        updateSubject,
        fetchProfessors,
        fetchStudents,
        fetchSubjects,
        fetchSchedules,
        deleteProfessor,
        deleteSubject,
        deleteStudent,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('Error en obtener el contexto de datos. Asegúrate de envolver tu componente con DataProvider.');
  }
  return context;
};

export default DataContext;