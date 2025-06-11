// src/components/layout/Sidebar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/roles';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null; // No muestra la barra lateral si no hay usuario autenticado
  }

  return (
    <aside style={{ width: '200px', background: '#f0f0f0', padding: '20px', borderRight: '1px solid #ccc' }}>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {user.user_role === ROLES.STUDENT && (
            <>
              <li><Link to="/materias" style={{ textDecoration: 'none', color: '#333', display: 'block', padding: '8px 0' }}>Mis Materias</Link></li>
              <li><Link to="/calificaciones" style={{ textDecoration: 'none', color: '#333', display: 'block', padding: '8px 0' }}>Mis Calificaciones</Link></li>
              <li><Link to="/kardex" style={{ textDecoration: 'none', color: '#333', display: 'block', padding: '8px 0' }}>Kardex</Link></li>
              <li><Link to="/pagos" style={{ textDecoration: 'none', color: '#333', display: 'block', padding: '8px 0' }}>Mis Pagos</Link></li>
              <li><Link to="/asistencia" style={{ textDecoration: 'none', color: '#333', display: 'block', padding: '8px 0' }}>Registrar Asistencia</Link></li>
            </>
          )}
          {user.user_role === ROLES.PROFESSOR && (
            <>
              <li><Link to="/horario" style={{ textDecoration: 'none', color: '#333', display: 'block', padding: '8px 0' }}>Mi Horario</Link></li>
              <li><Link to="/qr" style={{ textDecoration: 'none', color: '#333', display: 'block', padding: '8px 0' }}>Generar QR Asistencia</Link></li>
              <li><Link to="/calificaciones" style={{ textDecoration: 'none', color: '#333', display: 'block', padding: '8px 0' }}>Gestionar Calificaciones</Link></li>
            </>
          )}
          {(user.user_role === ROLES.ADMIN_STAFF || user.user_role === ROLES.SUPER_ADMIN) && (
            <>
              <li><Link to="/admin/dashboard" style={{ textDecoration: 'none', color: '#333', display: 'block', padding: '8px 0' }}>Admin Dashboard</Link></li>
              {/* Añade más enlaces de administración aquí */}
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;