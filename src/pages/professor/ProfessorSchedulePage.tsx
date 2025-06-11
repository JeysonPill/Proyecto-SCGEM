// src/pages/professor/ProfessorSchedulePage.tsx

import React, { useEffect } from 'react'; // Eliminamos useState ya que el estado viene del DataContext
import { useAuth } from '../../context/AuthContext';
import { useDataContext } from '../../context/DataContext'; // Importamos useDataContext
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Layout from '../../components/layout/Layout'; // Asumo que necesitas estos componentes de layout
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
//import Loader from '../../components/ui/Loader';
//import ErrorMessage from '../../components/ui/ErrorMessage';
import { ROLES } from '../../utils/roles'; // Para verificar el rol del usuario
import { ProfessorScheduleEntry } from '../../types'; // Importamos la interfaz del archivo de tipos centralizado

// La interfaz ProfessorSubject que tenías es ahora ProfessorScheduleEntry
// que ya está definida en src/types/index.ts.
// No necesitamos definirla aquí de nuevo.

const ProfessorSchedulePage: React.FC = () => {
  // Obtenemos el usuario y el estado de autenticación del AuthContext
  const { user, isAuthenticated } = useAuth();

  // Obtenemos los datos del horario, la función para cargarlos,
  // y los estados de carga y error del DataContext
  const {
    professorSchedule,
    fetchProfessorSchedule,
    isLoading, // Ahora viene de DataContext
    error,     // Ahora viene de DataContext
  } = useDataContext();

  useEffect(() => {
    // Solo cargamos el horario si el usuario está autenticado y es un profesor
    if (isAuthenticated && user?.user_role === ROLES.PROFESSOR) {
      fetchProfessorSchedule();
    }
  }, [isAuthenticated, user, fetchProfessorSchedule]); // Asegúrate de que fetchProfessorSchedule esté en las dependencias

  // Las columnas para la tabla, usando la interfaz ProfessorScheduleEntry
  const columns = [
    { header: 'Materia', accessor: 'materia_nombre' as keyof ProfessorScheduleEntry },
    { header: 'Grupo', accessor: 'id_grupo' as keyof ProfessorScheduleEntry },
    // Dado que 'horarios' es un string HTML, Table podría necesitar un renderizador personalizado
    { header: 'Horario', accessor: 'horarios' as keyof ProfessorScheduleEntry },
  ];

  // Renderizado del componente
  return (
    <Layout>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Horario de Clases</h2>
          <Card>
            {isLoading ? (
              // Reemplazado Loader con texto simple
              <p className="text-center text-gray-500">Cargando horario...</p>
            ) : error ? (
              // Reemplazado ErrorMessage con texto simple
              <p className="text-center text-red-500">Error: {error}</p>
            ) : professorSchedule.length > 0 ? (
              <Table
                columns={columns}
                data={professorSchedule}
                keyExtractor={(item) => item.id_horario}
              />
            ) : (
              <p className="text-center text-gray-500">No se encontró horario de clases.</p>
            )}
          </Card>
        </main>
      </div>
    </Layout>
  );
};

export default ProfessorSchedulePage;