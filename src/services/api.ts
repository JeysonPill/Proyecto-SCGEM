// src/services/api.ts
import axios from 'axios';
// Asegúrate de que las interfaces Student, Subject, Professor, Schedule
// sean importadas correctamente desde DataContext u otro archivo de tipos
import { Student, Subject, Professor, Schedule } from '../context/DataContext';

const API_URL = 'http://192.168.100.83:3000'; // Asegúrate de que esta URL sea la correcta para tu backend

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Añadir token a las solicitudes si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken'); // Debe coincidir con la clave usada en AuthContext
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//////////////////////////
// Autenticación
//////////////////////////

export const login = async (username: string, password: string) => {
  const response = await api.post('/login', { username, password });
  // console.log(`Los datos de la respuesta son: ${JSON.stringify(response.data)}`); // Mejor loguear response.data
  return response.data;
};

//////////////////////////
// Estudiantes
//////////////////////////

// Ruta general para obtener todos los estudiantes
export const getAllStudents = async (): Promise<Student[]> => {
  const res = await api.get('/students');
  return res.data;
};

// Las funciones específicas de estudiante que tenías pueden seguir:
export const getStudentScheduleAndSubjects = async (): Promise<Student[]> => {
  const res = await api.get('/student/tabla-datos-estudiante');
  return res.data;
};

export const createStudent = async (student: Omit<Student, 'id_student'>): Promise<Student> => {
  const res = await api.post('/student/agregar-datos-estudiante', student); 
  return res.data;
};

export const updateStudent = async (id: string, student: Omit<Student, 'id_student'>): Promise<Student> => {

  const res = await api.put(`/student/update/${id}`, student);
  return res.data;
};

export const deleteStudent = async (id: string): Promise<void> => {

  await api.delete(`/student/delete/${id}`); 
};

export const getStudentGrades = async () => {
  const res = await api.get('/student/tabla-calificaciones');
  return res.data;
};

export const getStudentKardex = async () => {
  const res = await api.get('/student/tabla-kardex');
  return res.data;
};

export const getStudentPayments = async () => {
  const res = await api.get('/student/tabla-pagos');
  return res.data;
};

export const registerAttendance = async (codigo_asistencia: string) => {
  const res = await api.post('/student/registro-asistencias', { codigo_asistencia });
  return res.data;
};

//////////////////////////
// Profesores
//////////////////////////

export const getAllProfessors = async (): Promise<Professor[]> => {
  const res = await api.get('/professors'); 
  return res.data;
};

export const createProfessor = async (prof: Omit<Professor, 'id_profesor'>): Promise<Professor> => {
  const res = await api.post('/professor', prof); 
  return res.data;
};

export const updateProfessor = async (id: string, prof: Omit<Professor, 'id_profesor'>): Promise<Professor> => {
  const res = await api.put(`/professor/${id}`, prof); 
  return res.data;
};

export const deleteProfessor = async (id: string): Promise<void> => {
  await api.delete(`/professor/${id}`); 
};

//// Extensiones del profesor
export const getProfessorSchedule = async () => {
  const res = await api.get('/professor/schedule');
  return res.data;
};

export const getQRCode = async () => {
  const res = await api.get('/professor/QR_CODE_GEN');
  return res.data;
};

export const getProfessorSubjects = async () => {
  const res = await api.get('/professor/getSubjects');
  return res.data;
};

export const getStudentsBySubject = async (subjectId: string) => {
  const res = await api.get(`/professor/getStudents?subjectId=${subjectId}`);
  return res.data;
};

export const insertGrade = async (data: {
  id_materia: string;
  matricula: string;
  calif_p1: number | null;
  calif_p2: number | null;
  calif_final: number | null;
  ciclo_cursando: string;
}) => {
  const res = await api.post('/professor/insertGrade', data);
  return res.data;
};

//////////////////////////
// Materias
//////////////////////////

// Descomentado y rutas estandarizadas
export const getAllSubjects = async (): Promise<Subject[]> => {
  const res = await api.get('/subjects'); 
  return res.data;
};

export const createSubject = async (subject: Omit<Subject, 'id_materia'>): Promise<Subject> => {
  const res = await api.post('/subject', subject); 
  return res.data;
};

export const updateSubject = async (id: string, subject: Omit<Subject, 'id_materia'>): Promise<Subject> => {
  const res = await api.put(`/subject/${id}`, subject); 
  return res.data;
};

export const deleteSubject = async (id: string): Promise<void> => {
  await api.delete(`/subject/${id}`); 
};

//////////////////////////
// Horarios
//////////////////////////

// Descomentado y rutas estandarizadas
export const getAllSchedules = async (): Promise<Schedule[]> => {
  const res = await api.get('/schedules'); 
  return res.data;
};

export const createSchedule = async (schedule: Omit<Schedule, 'id_horario'>): Promise<Schedule> => {
  const res = await api.post('/schedule', schedule);
  return res.data;
};

export const updateSchedule = async (id: string, schedule: Omit<Schedule, 'id_horario'>): Promise<Schedule> => {
  const res = await api.put(`/schedule/${id}`, schedule);
  return res.data;
};

export const deleteSchedule = async (id: string): Promise<void> => {
  await api.delete(`/schedule/${id}`);
};

export default api;