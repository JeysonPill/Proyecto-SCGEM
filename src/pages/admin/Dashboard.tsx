// src/pages/admin/Dashboard.tsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';

const DashboardAdmin: React.FC = () => {
  const { user } = useAuth();
  return (
    <Layout>
      <h2>Dashboard de Administración {user?.user_name ? `(${user.user_name})` : ''}</h2>
      <p>Bienvenido al panel de administración. Aquí podrás gestionar usuarios, materias, etc.</p>
      {/* Aquí irá el contenido específico de tu dashboard de administración */}
    </Layout>
  );
};

export default DashboardAdmin;