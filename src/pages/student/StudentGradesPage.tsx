import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table'; 

interface Grade {
  materia: string;
  calif_p1: number | null;
  calif_p2: number | null;
  calif_final: number | null;
  promedio: number | null;
}

const StudentGradesPage: React.FC = () => {
  const { authToken, backendIP } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGrades = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://${backendIP}:3000/student/tabla-calificaciones/`, {
          headers: { "Authorization": `Bearer ${authToken}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al obtener las calificaciones.");
        }

        const data: Grade[] = await response.json();
        setGrades(data);
      } catch (err: any) {
        console.error("Error al obtener las calificaciones:", err);
        setError(err.message || "No se pudieron cargar las calificaciones. Inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    if (authToken && backendIP) {
      loadGrades();
    }
  }, [authToken, backendIP]);

  const columns = [
    { header: 'Materia', accessor: 'materia' as keyof Grade },
    { header: 'Parcial 1', accessor: 'calif_p1' as keyof Grade },
    { header: 'Parcial 2', accessor: 'calif_p2' as keyof Grade },
    { header: 'Final', accessor: 'calif_final' as keyof Grade },
    { header: 'Promedio', accessor: 'promedio' as keyof Grade },
  ];

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Calificaciones</h2>
      <Card>
        {loading ? (
          <p className="text-center text-gray-500">Cargando calificaciones...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : grades.length > 0 ? (
          <Table
            columns={columns}
            data={grades}
            keyExtractor={(item) => item.materia}
          />
        ) : (
          <p className="text-center text-gray-500">No se encontraron calificaciones.</p>
        )}
      </Card>
    </div>
  );
};

export default StudentGradesPage;