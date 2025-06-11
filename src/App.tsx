// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import LoginPage from './pages/LoginPage';
import DashboardEstudiante from './pages/student/Dashboard';
import DashboardProfesor from './pages/professor/Dashboard'; // Si vas a implementar un dashboard de profesor

import DashboardAdmin from './pages/admin/Dashboard'; // Si vas a implementar un dashboard de admin

import { ROLES } from './utils/roles';

export default function AppRoutes() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando autenticación...</div>; // O un componente de spinner
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <DataProvider> {/* Envuelve las rutas autenticadas en DataProvider */}
      <Routes>
        {user?.user_role === ROLES.STUDENT && (
          <Route path="/*" element={<DashboardEstudiante />} />
        )}
        {user?.user_role === ROLES.PROFESSOR && (
          <Route path="/*" element={<DashboardProfesor />} />
        )}
        {user?.user_role === ROLES.ADMIN_STAFF && (
          <Route path="/*" element={<DashboardAdmin />} /> // Asegúrate de tener este componente
        )}
        {user?.user_role === ROLES.SUPER_ADMIN && (
          <Route path="/*" element={<DashboardAdmin />} /> // Puedes usar el mismo para superadmin
        )}

        {/* Si el usuario está autenticado pero su rol no coincide con ninguna ruta definida */}
        <Route path="*" element={<div>Acceso Denegado o Rol No Reconocido. Por favor, contacte a soporte.</div>} />
      </Routes>
    </DataProvider>
  );
  
}