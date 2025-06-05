
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button'; 

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
}

interface Payment {
  MES: string;
  CANTIDAD: number;
  FECHA_CORTE: string;
  ESTADO: string;
  ACCION: string;
}

const StudentPaymentsPage: React.FC = () => {
  const { authToken, backendIP } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://${backendIP}:3000/student/tabla-pagos/`, {
          headers: { "Authorization": `Bearer ${authToken}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al obtener el estado de pagos.");
        }

        const data: Payment[] = await response.json();
        setPayments(data);
      } catch (err: any) {
        console.error("Error al obtener los pagos:", err);
        setError(err.message || "No se pudieron cargar los pagos. Inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    if (authToken && backendIP) {
      loadPayments();
    }
  }, [authToken, backendIP]);

  const columns: Column<Payment>[] = [
    { header: 'Mes', accessor: 'MES' as keyof Payment },
    { header: 'Cantidad', accessor: 'CANTIDAD' as keyof Payment },
    { header: 'Fecha de Corte', accessor: 'FECHA_CORTE' as keyof Payment },
    { header: 'Estado', accessor: 'ESTADO' as keyof Payment },
    {
      header: 'Acción',
      accessor: (row: Payment) => (
        <Button variant="secondary" size="sm" onClick={() => alert(`Acción para ${row.MES}: ${row.ACCION}`)}>
          {row.ACCION}
        </Button>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Estado de Pagos</h2>
      <Card>
        {loading ? (
          <p className="text-center text-gray-500">Cargando pagos...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : payments.length > 0 ? (
          <Table
            columns={columns}
            data={payments}
            keyExtractor={(payment) => `${payment.MES}-${payment.FECHA_CORTE}`}
          />
        ) : (
          <p className="text-center text-gray-500">No se encontraron registros de pagos.</p>
        )}
      </Card>
    </div>
  );
};

export default StudentPaymentsPage;