// src/api/api.ts
import axios from 'axios';
import { Student, Subject, Professor, Schedule } from '../context/DataContext';

const API_URL = 'http://192.168.100.83:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//////////////////////////
// Authentication
//////////////////////////

export const login = async (username: string, password: string) => {
  const response = await api.post('/login', { username, password });
  console.log(`Los datos de la respuesta son: ${username} ${password}`);
  return response.data;
};

//////////////////////////
// Estudiantes xd
//////////////////////////

export const getStudents = async (): Promise<Student[]> => {
  const res = await api.get('/students');
  return res.data;
};

export const createStudent = async (student: Omit<Student, 'id_student'>): Promise<Student> => {
  const res = await api.post('/student/tabla-datos-estudiante', student);
  return res.data;
};

export const updateStudent = async (id: string, student: Omit<Student, 'id_student'>): Promise<Student> => {
  const res = await api.put(`/student/${id}`, student);
  return res.data;
};

export const deleteStudent = async (id: string): Promise<void> => {
  await api.delete(`/student/${id}`);
};

// Extensiones del estudiante
export const getStudentGrades = async () => {
  const res = await api.get('/student/tabla-calificaciones');
  return res.data;
};

export const getStudentKardex = async () => {
  const res = await api.get('/student/tabla-kardez');
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
// Los Profes xd
//////////////////////////

export const getAllProfessors = async (): Promise<Professor[]> => {
  const res = await api.get('/professor');
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
// Las Materias lol

export const getAllSubjects = async (): Promise<Subject[]> => {
  const res = await api.get('/subjects');
  return res.data;
};

export const createSubject = async (subject: Omit<Subject, 'id'>): Promise<Subject> => {
  const res = await api.post('/addSubjects', subject);
  return res.data;
};

export const updateSubject = async (id: string, subject: Omit<Subject, 'id'>): Promise<Subject> => {
  const res = await api.put(`/updateSubjects/${id}`, subject);
  return res.data;
};

export const deleteSubject = async (id: string): Promise<void> => {
  await api.delete(`/deleteSubjects/${id}`);
};

//////////////////////////
//Materias para ADMIN 

//export const getAllSchedules = async (): Promise<Schedule[]> => {
//  const res = await api.get('/schedules');
//  return res.data;
//};

export const createSchedule = async (schedule: Omit<Schedule, 'id'>): Promise<Schedule> => {
  const res = await api.post('/addSchedules', schedule);
  return res.data;
};

export const updateSchedule = async (id: string, schedule: Omit<Schedule, 'id'>): Promise<Schedule> => {
  const res = await api.put(`/updateSchedules/${id}`, schedule);
  return res.data;
};

export const deleteSchedule = async (id: string): Promise<void> => {
  await api.delete(`/deleteSchedules/${id}`);
};

export default api;