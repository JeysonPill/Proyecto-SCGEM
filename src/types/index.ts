// src/types/index.ts

// --- Tipos para la autenticación ---
export interface UserAuthData {
  user_id: string;        // id_user del backend
  user_name: string;      // username usado en el login
  user_role: string;      // '1', '2', '3', '99'
  user_matricula: string; // user_matricula del backend
}

// --- Tipos para datos de Estudiantes (basado en los endpoints de tu server.js) ---

export interface StudentSubject {
  id_materia: string;
  materia_nombre: string;
  profesor_nombre: string;
  horarios: string; // El backend devuelve un string HTML para horarios
  id_grupo: string;
}

export interface StudentGrade {
  id_calificacion: string;
  materia: string;
  calif_p1: number | null; // Usamos `null` porque pueden no estar cargadas
  calif_p2: number | null;
  calif_final: number | null;
  promedio: number | null;
  ciclo_cursando: string;
}

export interface StudentKardexEntry {
  id_kardex: string;
  materia: string;
  periodo: string; // Ej. '2025-1'
  creditos: number;
  calificacion_final: number;
  estatus: 'Aprobado' | 'Reprobado' | 'Cursando' | string; // Asegúrate de los estados reales
}

export interface StudentPayment {
  id_pago: string;
  concepto: string;
  monto: number;
  fecha: string; // 'YYYY-MM-DD'
  estatus: 'Pagado' | 'Pendiente' | 'Vencido' | string; // Asegúrate de los estados reales
}

export interface AttendanceResponse {
  message: string;
  success: boolean;
  // Puedes añadir otros campos si el backend los devuelve
}

// --- Tipos para datos de Profesores (basado en los endpoints de tu server.js) ---

export interface ProfessorScheduleEntry {
  id_horario: string;
  materia_nombre: string;
  id_grupo: string;
  horarios: string; // String HTML
}

export interface ProfessorSubjectGroup {
  id_materia: string;
  materia_nombre: string;
  id_grupo: string;
}

export interface StudentForGrading {
  matricula: string;
  user_name: string;
  calif_p1: number | null;
  calif_p2: number | null;
  calif_final: number | null;
  // El backend envía ciclo_cursando en el payload, pero no en la lista de estudiantes
  // Si lo necesitaras aquí, deberías asegurarte de que tu backend lo devuelva.
}