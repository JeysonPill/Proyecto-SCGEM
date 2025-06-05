import React from 'react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Users,
  BookOpen,
  UserCheck,
  Calendar,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const { user } = useAuth();
  const role = user?.user_role;
  const { logout } = useAuth();

  const roleName = (role?: string) => {
    switch (role) {
      case '1': return 'Estudiante';
      case '2': return 'Profesor';
      case '3': return 'Administrativo';
      case '99': return 'Superadmin';
      default: return 'Desconocido';
    }
  };


  // Función de permiso por rol
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

          {canSee('3', '99') && (
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
          )}

          {canSee('1', '2', '3', '99') && (
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
          )}

          {canSee('3', '99') && (
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
          )}

          {canSee('1', '2', '3', '99') && (
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
          )}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
