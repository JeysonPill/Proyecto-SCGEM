import React from 'react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Users,
  BookOpen,
  UserCheck,
  Calendar,
  X,
  ClipboardList, 
  Wallet, 
  QrCode, 
  GraduationCap 
} from 'lucide-react'; 
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const { user } = useAuth();
  const role = user?.user_role;
  const { logout } = useAuth();

  const roleName = (roleId?: string) => {
    switch (roleId) {
      case '1': return 'Estudiante';
      case '2': return 'Profesor';
      case '3': return 'Administrativo';
      case '99': return 'Superadmin';
      default: return 'Desconocido';
    }
  };



  const canSee = (...roles: string[]) => roles.includes(role || '');

  return (
    <>
      <div
        className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-20 transition-opacity md:hidden ${open ? 'opacity-100 ease-out duration-300' : 'opacity-0 ease-in duration-200 pointer-events-none'
          }`}
        onClick={() => setOpen(false)}
      ></div>

      <div
        className={`fixed inset-y-0 left-0 flex flex-col z-30 w-64 bg-white shadow-lg transform transition duration-300 ease-in-out md:relative md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-semibold text-gray-800">SCGEM</span>
          </div>
          <button
            className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => setOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors duration-150 ease-in-out ${isActive
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <Home className="mr-3 h-5 w-5 flex-shrink-0" />
            Inicio
          </NavLink>

          {/* Panel de estudiantes*/}
          {canSee('1', '99') && (
            <>
              <h3 className="px-3 mt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estudiante</h3>
              <NavLink to="/student/StudentSubjectsPage" className={({ isActive }) => `flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors duration-150 ease-in-out ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>
                <BookOpen className="mr-3 h-5 w-5 flex-shrink-0" />
                Materias Inscritas
              </NavLink>
              <NavLink to="/student/schedules" className={({ isActive }) => `flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors duration-150 ease-in-out ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>
                <Calendar className="mr-3 h-5 w-5 flex-shrink-0" />
                Mi Horario
              </NavLink>
              <NavLink to="/student/grades" className={({ isActive }) => `flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors duration-150 ease-in-out ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>
                <GraduationCap className="mr-3 h-5 w-5 flex-shrink-0" />
                Calificaciones
              </NavLink>
              <NavLink to="/student/kardex" className={({ isActive }) => `flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors duration-150 ease-in-out ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>
                <ClipboardList className="mr-3 h-5 w-5 flex-shrink-0" />
                Kardex
              </NavLink>
              <NavLink to="/student/payments" className={({ isActive }) => `flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors duration-150 ease-in-out ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>
                <Wallet className="mr-3 h-5 w-5 flex-shrink-0" />
                Estado de Pagos
              </NavLink>
              <NavLink to="/student/attendance" className={({ isActive }) => `flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors duration-150 ease-in-out ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>
                <QrCode className="mr-3 h-5 w-5 flex-shrink-0" />
                Asistencia
              </NavLink>
            </>
          )}

          {/* Panel del profe */}
          {canSee('2', '99') && (
            <>
              <h3 className="px-3 mt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Profesor</h3>
              <NavLink to="/professor/schedule" className={({ isActive }) => `flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors duration-150 ease-in-out ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>
                <Calendar className="mr-3 h-5 w-5 flex-shrink-0" />
                Mi Horario
              </NavLink>
              <NavLink to="/professor/grade-entry" className={({ isActive }) => `flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors duration-150 ease-in-out ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>
                <ClipboardList className="mr-3 h-5 w-5 flex-shrink-0" />
                Ingresar Calificaciones
              </NavLink>
              <NavLink to="/professor/attendance-qr" className={({ isActive }) => `flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors duration-150 ease-in-out ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>
                <QrCode className="mr-3 h-5 w-5 flex-shrink-0" />
                Generar QR Asistencia
              </NavLink>
            </>
          )}

          {/* Panel de Admin y superAdmin*/}
          {canSee('3', '99') && (
            <>
              <h3 className="px-3 mt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Administración</h3>
              <NavLink
                to="/students"
                className={({ isActive }) =>
                  `flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors duration-150 ease-in-out ${isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <Users className="mr-3 h-5 w-5 flex-shrink-0" />
                Estudiantes
              </NavLink>
              <NavLink
                to="/professors"
                className={({ isActive }) =>
                  `flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors duration-150 ease-in-out ${isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <UserCheck className="mr-3 h-5 w-5 flex-shrink-0" />
                Profesores
              </NavLink>
              <NavLink
                to="/subjects"
                className={({ isActive }) =>
                  `flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors duration-150 ease-in-out ${isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <BookOpen className="mr-3 h-5 w-5 flex-shrink-0" />
                Materias
              </NavLink>
              <NavLink
                to="/schedules"
                className={({ isActive }) =>
                  `flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors duration-150 ease-in-out ${isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <Calendar className="mr-3 h-5 w-5 flex-shrink-0" />
                Horarios
              </NavLink>
            </>
          )}
        </nav>

        {}
        <div className="mt-auto px-4 py-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors duration-150 ease-in-out text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full"
          >
            <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;