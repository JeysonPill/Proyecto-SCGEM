// Types
export interface Student {
  id: string;
  matricula: string;
  carrera: string;
  semestre: number;
  userName: string;
  celular: string;
  email: string;
}

export interface Subject {
  id_materia: string;
  materia_nombre: string;
  sem_cursante: number;
}

export interface Professor {
  id_profesor: string;
  nombre: string;
  celular: string;
  email: string;
}

export interface Schedule {
  id: string;
  id_materia: string;
  id_grupo: string;
  id_profesor: string;
  h_lunes: string;
  h_martes: string;
  h_miercoles: string;
  h_jueves: string;
  h_viernes: string;
}

// Initial data
export const initialStudents: Student[] = [
  {
    id: '1',
    matricula: 'A12345',
    carrera: 'Computer Science',
    semestre: 3,
    userName: 'john_doe',
    celular: '555-123-4567',
    email: 'john.doe@example.com',
  },
  {
    id: '2',
    matricula: 'B67890',
    carrera: 'Mathematics',
    semestre: 2,
    userName: 'jane_smith',
    celular: '555-987-6543',
    email: 'jane.smith@example.com',
  },
  {
    id: '3',
    matricula: 'C11223',
    carrera: 'Physics',
    semestre: 4,
    userName: 'alex_johnson',
    celular: '555-456-7890',
    email: 'alex.johnson@example.com',
  },
];

export const initialSubjects: Subject[] = [
  {
    id: '1',
    materia_nombre: 'Calculus I',
    sem_cursante: 1,
  },
  {
    id: '2',
    materia_nombre: 'Programming Fundamentals',
    sem_cursante: 1,
  },
  {
    id: '3',
    materia_nombre: 'Data Structures',
    sem_cursante: 2,
  },
  {
    id: '4',
    materia_nombre: 'Physics I',
    sem_cursante: 2,
  },
];

export const initialProfessors: Professor[] = [
  {
    id: '1',
    nombre: 'Dr. Michael Brown',
    celular: '555-111-2222',
    email: 'michael.brown@example.com',
  },
  {
    id: '2',
    nombre: 'Dr. Sarah Wilson',
    celular: '555-333-4444',
    email: 'sarah.wilson@example.com',
  },
  {
    id: '3',
    nombre: 'Dr. Robert Taylor',
    celular: '555-555-6666',
    email: 'robert.taylor@example.com',
  },
];

export const initialSchedules: Schedule[] = [
  {
    id: '1',
    id_materia: '1',
    id_grupo: 'A1',
    id_profesor: '1',
    h_lunes: '08:00-10:00',
    h_martes: '',
    h_miercoles: '08:00-10:00',
    h_jueves: '',
    h_viernes: '08:00-10:00',
  },
  {
    id: '2',
    id_materia: '2',
    id_grupo: 'B1',
    id_profesor: '2',
    h_lunes: '',
    h_martes: '10:00-12:00',
    h_miercoles: '',
    h_jueves: '10:00-12:00',
    h_viernes: '',
  },
  {
    id: '3',
    id_materia: '3',
    id_grupo: 'C1',
    id_profesor: '3',
    h_lunes: '14:00-16:00',
    h_martes: '',
    h_miercoles: '14:00-16:00',
    h_jueves: '',
    h_viernes: '',
  },
];