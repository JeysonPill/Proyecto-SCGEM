import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import QRCode from 'react-qr-code';//imoporte del genrador QR XD
import { QrCode as QrCodeIcon } from 'lucide-react';

interface ProfessorSubjectForQR {
  id_materia: string;
  materia_nombre: string;
  id_grupo: string;
}

const ProfessorAttendanceQRPage: React.FC = () => {
  const { authToken, backendIP } = useAuth();
  const [subjects, setSubjects] = useState<ProfessorSubjectForQR[]>([]);
  const [selectedSubjectValue, setSelectedSubjectValue] = useState<string>(''); // Stores "id_materia-id_grupo"
  const [generatedQRCodeData, setGeneratedQRCodeData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper functions for QR code generation (from your original HTML)
  const fallbackHash = (seed: string): number => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    return hash;
  };

  const base62Encode = (num: number, length: number = 10): string => {
    const base62chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let encoded = "";
    while (encoded.length < length) {
      encoded = base62chars[num % 62] + encoded;
      num = Math.floor(num / 62);
    }
    return encoded;
  };

  const generateShortCode = (seed: string): string => {
    const numericHash = fallbackHash(seed);
    return base62Encode(numericHash);
  };

  useEffect(() => {
    const fetchSubjectsForQR = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://${backendIP}:3000/professor/QR_CODE_GEN/`, {
          headers: { "Authorization": `Bearer ${authToken}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al obtener las materias para QR.");
        }

        const data: ProfessorSubjectForQR[] = await response.json();
        setSubjects(data);
      } catch (err: any) {
        console.error("Error al obtener las materias para QR:", err);
        setError(err.message || "No se pudieron cargar las materias. Inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    if (authToken && backendIP) {
      fetchSubjectsForQR();
    }
  }, [authToken, backendIP]);

  const handleGenerateQR = () => {
    if (selectedSubjectValue) {
      const [idMateria, idGrupo] = selectedSubjectValue.split("-");
      const seed = `${idMateria}-${idGrupo}`; // Use id_materia and id_grupo as seed
      const code = generateShortCode(seed);
      setGeneratedQRCodeData(code);
    } else {
      setGeneratedQRCodeData(null); // Clear QR if no subject selected
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Generar Código QR de Asistencia</h2>
      <Card>
        <div className="form-group mb-4">
          <label htmlFor="qr_subject_select" className="block text-sm font-medium text-gray-700 mb-2">
            Elegir materia
          </label>
          <Select
            id="qr_subject_select"
            value={selectedSubjectValue}
            onChange={setSelectedSubjectValue}
            disabled={loading}
            options={[
              { value: '', label: 'Seleccione una materia' },
              ...subjects.map((subject) => ({
                value: `${subject.id_materia}-${subject.id_grupo}`,
                label: `${subject.materia_nombre} - Grupo ${subject.id_grupo}`,
              })),
            ]}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <Button
          onClick={handleGenerateQR}
          disabled={!selectedSubjectValue}
          className="mb-6"
        >
          Generar QR
        </Button>

        <div id="qr-display" className="flex justify-center p-4">
          {generatedQRCodeData ? (
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md">
              <QRCode
                value={generatedQRCodeData}
                size={256}
                level="H"
                bgColor="#ffffff"
                fgColor="#000000"
              />
              <p className="text-center text-sm font-semibold mt-4 text-gray-700">Código: {generatedQRCodeData}</p>
            </div>
          ) : (
            <div className="text-center text-gray-500 flex flex-col items-center justify-center h-48 w-48 border-2 border-dashed border-gray-300 rounded-lg">
              <QrCodeIcon className="h-10 w-10 text-gray-400 mb-2" />
              Seleccione una materia y genere el QR.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProfessorAttendanceQRPage;