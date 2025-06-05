import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import { Users, BookOpen, UserCheck, Calendar, QrCode, ClipboardList, Wallet, GraduationCap } from 'lucide-react'; // Added new icons
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { students, subjects, professors, schedules } = useData();
  const { user } = useAuth();
  const role = user?.user_role;

  // Función de control por rol
  const canSee = (...roles: string[]) => roles.includes(role || '');

  const stats = [];

  // Estudiante o Superadmin
  if (canSee('1', '99')) {
    stats.push(
      {
        title: 'Materias',
        value: subjects.length, // This should ideally be 'enrolledSubjects.length' if you fetch student-specific enrolled subjects
        icon: <BookOpen className="h-8 w-8 text-emerald-500" />,
        description: 'Materias inscritas',
        link: '/student/subjects', // Specific student link
        color: 'bg-emerald-50',
      },
      {
        title: 'Horarios',
        value: schedules.length, // This should ideally be 'studentSchedules.length'
        icon: <Calendar className="h-8 w-8 text-amber-500" />,
        description: 'Horario de clases',
        link: '/student/schedules', // Specific student link
        color: 'bg-amber-50',
      },
      {
        title: 'Calificaciones',
        value: '-', // Value depends on fetching specific data
        icon: <GraduationCap className="h-8 w-8 text-indigo-500" />,
        description: 'Ver mis calificaciones',
        link: '/student/grades', // New student link
        color: 'bg-indigo-50',
      },
      {
        title: 'Kardex',
        value: '-', // Value depends on fetching specific data
        icon: <ClipboardList className="h-8 w-8 text-fuchsia-500" />,
        description: 'Historial académico',
        link: '/student/kardex', // New student link
        color: 'bg-fuchsia-50',
      },
      {
        title: 'Pagos',
        value: '-', // Value depends on fetching specific data
        icon: <Wallet className="h-8 w-8 text-green-500" />,
        description: 'Estado de mis pagos',
        link: '/student/payments', // New student link
        color: 'bg-green-50',
      },
      {
        title: 'Asistencia',
        value: '-', // Value depends on fetching specific data
        icon: <QrCode className="h-8 w-8 text-rose-500" />,
        description: 'Registrar asistencia',
        link: '/student/attendance', // New student link
        color: 'bg-rose-50',
      }
    );
  }

  // Profesor o Superadmin
  if (canSee('2', '99')) {
    stats.push(
      {
        title: 'Horario de Clases', // Renamed for clarity for professors
        value: subjects.length, // This should ideally be 'professorSubjects.length'
        icon: <BookOpen className="h-8 w-8 text-purple-500" />,
        description: 'Clases asignadas',
        link: '/professor/schedule', // Specific professor link
        color: 'bg-purple-50',
      },
      {
        title: 'Generar QR',
        value: '-',
        icon: <QrCode className="h-8 w-8 text-pink-500" />,
        description: 'QR de asistencia',
        link: '/professor/attendance-qr', // Specific professor link
        color: 'bg-pink-50',
      },
      {
        title: 'Ingresar Calificaciones',
        value: '-',
        icon: <ClipboardList className="h-8 w-8 text-teal-500" />,
        description: 'Registro de calificaciones',
        link: '/professor/grade-entry', // New professor link
        color: 'bg-teal-50',
      }
      // Removed redundant 'Horarios' for professors as it's covered by 'Horario de Clases'
    );
  }

  // Admin o Superadmin (existing links are generally fine for administrative oversight)
  if (canSee('3', '99')) {
    stats.push(
      {
        title: 'Estudiantes',
        value: students.length,
        icon: <Users className="h-8 w-8 text-blue-500" />,
        description: 'Total Estudiantes',
        link: '/students',
        color: 'bg-blue-50',
      },
      {
        title: 'Profesores',
        value: professors.length,
        icon: <UserCheck className="h-8 w-8 text-purple-500" />,
        description: 'Total Profesores',
        link: '/professors',
        color: 'bg-purple-50',
      },
      {
        title: 'Materias',
        value: subjects.length,
        icon: <BookOpen className="h-8 w-8 text-emerald-500" />,
        description: 'Materias activas',
        link: '/subjects',
        color: 'bg-emerald-50',
      },
      {
        title: 'Horarios',
        value: schedules.length,
        icon: <Calendar className="h-8 w-8 text-amber-500" />,
        description: 'Horarios activos',
        link: '/schedules',
        color: 'bg-amber-50',
      }
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Panel</h1>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Link key={index} to={stat.link} className="transition-transform duration-200 hover:scale-105">
            <Card className="h-full">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                    <dd>
                      <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                    </dd>
                    <dd className="text-sm text-gray-500">{stat.description}</dd>
                  </dl>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Secciones exclusivas de ADMIN y SUPERADMIN */}
      {canSee('3', '99') && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card title="Estudiantes recientes">
            <ul className="divide-y divide-gray-200">
              {students.slice(0, 3).map((student) => (
                <li key={student.id_student} className="py-3"> {/* Changed to id_student */}
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-700 font-medium">{student.user_name.charAt(0)}</span> {/* Show first letter of name */}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{student.user_name}</p>
                      <p className="text-sm text-gray-500 truncate">{student.carrera} - {student.semestre}° Semestre</p>
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {student.matricula}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Link to="/students" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Ver todos los estudiantes
              </Link>
            </div>
          </Card>

          <Card title="Clases recientes">
            <ul className="divide-y divide-gray-200">
              {schedules.slice(0, 3).map((schedule) => {
                const subject = subjects.find(s => s.id_materia === schedule.id_materia);
                const professor = professors.find(p => p.id_profesor === schedule.id_profesor);
                return (
                  <li key={schedule.id_grupo} className="py-3"> {/* Changed key to id_grupo, assuming unique per schedule entry */}
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                          <span className="text-emerald-700 font-medium">
                            {subject?.materia_nombre.charAt(0) || 'C'}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {subject?.materia_nombre || 'Materia desconocida'}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {professor?.nombre || 'Profesor desconocido'} - Grupo {schedule.id_grupo}
                        </p>
                      </div>
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          Sem {subject?.sem_cursante || '?'}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4">
              <Link to="/schedules" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                Ver todas las clases
              </Link>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;