import React from 'react';
import { Menu, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  // Agrego para manejar estado local del sidebar dentro del header (opcional)
  setOpen?: (open: boolean) => void;
}

const roleName = (role: string | undefined) => {
  // Función para mostrar el nombre del rol, adaptala según tus roles reales
  switch (role) {
    case 'admin':
      return 'Administrador';
    case 'teacher':
      return 'Profesor';
    case 'student':
      return 'Estudiante';
    default:
      return 'Usuario';
  }
};

const Header: React.FC<HeaderProps> = ({ setSidebarOpen, setOpen }) => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    if (setOpen) setOpen(false);
  };

  return (
    <header className="bg-white shadow-sm z-10 flex flex-col">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            type="button"
            className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-4 md:ml-0">
            <h1 className="text-lg md:text-xl font-semibold text-gray-800">
              Sistema de control escolar a medida
            </h1>
          </div>
        </div>
        <div className="mt-auto  px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <UserIcon className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm font-medium text-gray-800">{user?.user_name}</p>
            
          </div>
        </div>
        <br />
        <button
          onClick={handleLogout}
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-100 transition"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar sesión
        </button>
      </div>
        {/* Aquí dejo el botón solo para escritorio si quieres, pero ahora se integra la info del usuario abajo */}
      </div>
    </header>
  );
};

export default Header;