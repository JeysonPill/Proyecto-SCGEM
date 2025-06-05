import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table'; 
interface ProfessorSubject {
  materia_nombre: string;
  id_grupo: string;
  horarios: string;
}

const ProfessorSchedulePage: React.FC = () => {
  const { authToken, backendIP } = useAuth();
  const [schedule, setSchedule] = useState<ProfessorSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfessorSchedule = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://${backendIP}:3000/professor/schedule/`, {
          headers: { "Authorization": `Bearer ${authToken}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al obtener el horario de clases.");
        }

        const data: ProfessorSubject[] = await response.json();
        setSchedule(data);
      } catch (err: any) {
        console.error("Error al obtener el horario del profesor:", err);
        setError(err.message || "No se pudo cargar el horario. Inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    if (authToken && backendIP) {
      loadProfessorSchedule();
    }
  }, [authToken, backendIP]);

  const columns = [
    { header: 'Materia', accessor: 'materia_nombre' as keyof ProfessorSubject },
    { header: 'Grupo', accessor: 'id_grupo' as keyof ProfessorSubject },
    { header: 'Horario', accessor: 'horarios' as keyof ProfessorSubject },
  ];

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Horario de Clases</h2>
      <Card>
        {loading ? (
          <p className="text-center text-gray-500">Cargando horario...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : schedule.length > 0 ? (
          <Table
            columns={columns}
            data={schedule}
            keyExtractor={(item) => item.id_grupo}
          />
        ) : (
          <p className="text-center text-gray-500">No se encontró horario de clases.</p>
        )}
      </Card>
    </div>
  );
};

export default ProfessorSchedulePage;