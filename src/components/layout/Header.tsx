import React from 'react';
import { Menu, User as UserIcon } from 'lucide-react'; 
import { useAuth } from '../../context/AuthContext'; 


interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;

}

// Function to map numeric role IDs to descriptive names
const roleName = (roleId: string | undefined) => { // Renamed role to roleId to avoid conflict
  switch (roleId) {
    case '1':
      return 'Estudiante';
    case '2':
      return 'Profesor';
    case '3':
      return 'Administrativo';
    case '99':
      return 'Superadmin';
    default:
      return 'Usuario';
  }
};

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const { user } = useAuth(); // Only need user info, logout is in Sidebar

  return (
    <header className="bg-white shadow-sm z-10"> {/* Removed flex-col as it's not needed */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Left section: Menu toggle and Application Title */}
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

        {}
        <div className="flex items-center space-x-3">
          <UserIcon className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm font-medium text-gray-800">{user?.username}</p> {/* Changed to user_name */}
            <p className="text-xs text-gray-500 truncate">{roleName(user?.user_role)}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;