// src/components/layout/Header.tsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header style={{ padding: '10px 20px', background: '#333', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1>SCGEM</h1>
      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>Bienvenido, {user.user_name} (Rol: {user.user_role})</span> {/* Muestra el rol directamente */}
          <button onClick={logout} style={{ padding: '8px 15px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Cerrar Sesión
          </button>
        </div>
      ) : (
        <span>No autenticado</span>
      )}
    </header>
  );
};

export default Header;