
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button'; 
import { QrCode as QrCodeIcon } from 'lucide-react'; 

const StudentAttendancePage: React.FC = () => {
  const { authToken, backendIP } = useAuth();
  const [attendanceCode, setAttendanceCode] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus on the input field when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []); // Empty dependency array means this runs once on mount

  const handleSubmitAttendance = async () => {
    if (!attendanceCode.trim()) {
      setMessage('Por favor, ingresa un código de asistencia.');
      setMessageType('error');
      return;
    }

    setMessage(null);
    setMessageType(null);

    try {
      const response = await fetch(`http://${backendIP}:3000/student/registro-asistencias/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ codigo_asistencia: attendanceCode }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage('Asistencia registrada exitosamente.');
        setMessageType('success');
        setAttendanceCode(''); // Clear input on success
      } else {
        setMessage(data.message || 'Error al registrar asistencia.');
        setMessageType('error');
      }
    } catch (err) {
      console.error('Error al registrar asistencia:', err);
      setMessage('Error al conectar con el servidor. Inténtalo de nuevo.');
      setMessageType('error');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Registro de Asistencia</h2>
      <Card>
        <div className="qr-section flex flex-col items-center p-4">
          <QrCodeIcon className="h-16 w-16 text-blue-600 mb-4" /> {/* Example icon */}
          <p className="text-lg text-gray-700 mb-4">Ingresa código de asistencia:</p>
          <div className="w-full max-w-sm">
            <Input
              type="text"
              placeholder="Ingresa el código"
              value={attendanceCode}
              onChange={(e) => setAttendanceCode(e.target.value)}
              ref={inputRef} // Assign ref to the input
              // No label needed here based on the HTML structure
            />
          </div>
          <Button
            onClick={handleSubmitAttendance}
            className="mt-6 w-full max-w-sm"
          >
            Enviar Asistencia
          </Button>

          {message && (
            <p className={`mt-4 text-sm ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default StudentAttendancePage;