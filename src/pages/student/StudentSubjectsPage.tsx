
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table'; 

interface Subject {
  materia_nombre: string;
  profesor_nombre: string;
  horarios: string;
  id_grupo: string;
}

const StudentSubjectsPage: React.FC = () => {
  const { authToken, backendIP } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSubjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://${backendIP}:3000/student/tabla-datos-estudiante/`, {
          headers: { "Authorization": `Bearer ${authToken}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al obtener las materias inscritas.");
        }

        const data: Subject[] = await response.json();
        setSubjects(data);
      } catch (err: any) {
        console.error("Error al obtener las materias:", err);
        setError(err.message || "No se pudieron cargar las materias. Inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    if (authToken && backendIP) {
      loadSubjects();
    }
  }, [authToken, backendIP]);

  const columns = [
    { header: 'Nombre', accessor: 'materia_nombre' as keyof Subject },
    { header: 'Profesor', accessor: 'profesor_nombre' as keyof Subject },
    { header: 'Horarios', accessor: 'horarios' as keyof Subject },
    { header: 'Grupo', accessor: 'id_grupo' as keyof Subject },
  ];

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Materias Inscritas</h2>
      <Card>
        {loading ? (
          <p className="text-center text-gray-500">Cargando materias...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : subjects.length > 0 ? (
          <Table
            columns={columns}
            data={subjects}
            keyExtractor={(subject) => subject.id_grupo}
          />
        ) : (
          <p className="text-center text-gray-500">No se encontraron materias inscritas.</p>
        )}
      </Card>
    </div>
  );
};

export default StudentSubjectsPage;