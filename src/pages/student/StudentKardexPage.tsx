
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table'; 

interface KardexEntry {
  materia: string;
  periodo: string;
  calif_final: number | null;
  estado: string;
}

const StudentKardexPage: React.FC = () => {
  const { authToken, backendIP } = useAuth();
  const [kardex, setKardex] = useState<KardexEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadKardex = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://${backendIP}:3000/student/tabla-kardez/`, {
          headers: { "Authorization": `Bearer ${authToken}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al obtener el historial académico.");
        }

        const data: KardexEntry[] = await response.json();
        setKardex(data);
      } catch (err: any) {
        console.error("Error al obtener el kardex:", err);
        setError(err.message || "No se pudo cargar el historial académico. Inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    if (authToken && backendIP) {
      loadKardex();
    }
  }, [authToken, backendIP]);

  const columns = [
    { header: 'Materia', accessor: 'materia' as keyof KardexEntry },
    { header: 'Periodo', accessor: 'periodo' as keyof KardexEntry },
    { header: 'Calificación Final', accessor: 'calif_final' as keyof KardexEntry },
    { header: 'Estado', accessor: 'estado' as keyof KardexEntry },
  ];

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Historial Académico (Kardex)</h2>
      <Card>
        {loading ? (
          <p className="text-center text-gray-500">Cargando historial...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : kardex.length > 0 ? (
          <Table
            columns={columns}
            data={kardex}
            keyExtractor={(item) => `${item.materia}-${item.periodo}`}
          />
        ) : (
          <p className="text-center text-gray-500">No se encontraron registros en el historial académico.</p>
        )}
      </Card>
    </div>
  );
};

export default StudentKardexPage;