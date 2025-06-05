import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table'; 
import Select from '../../components/ui/Select'; 
import Input from '../../components/ui/Input'; 
import Button from '../../components/ui/Button'; 

interface ProfessorSubject {
  id_materia: string;
  id_grupo: string;
  materia_nombre: string;
}

interface StudentGrade {
  matricula: string;
  user_name: string;
  calif_p1: number | null;
  calif_p2: number | null;
  calif_final: number | null;
  // Note: 'promedio' is usually calculated, not entered directly
}

const ProfessorGradeEntryPage: React.FC = () => {
  const { authToken, backendIP } = useAuth();
  const [subjects, setSubjects] = useState<ProfessorSubject[]>([]);
  const [selectedSubjectInfo, setSelectedSubjectInfo] = useState<ProfessorSubject | null>(null);
  const [students, setStudents] = useState<StudentGrade[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [errorSubjects, setErrorSubjects] = useState<string | null>(null);
  const [errorStudents, setErrorStudents] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<{ [matricula: string]: 'idle' | 'saving' | 'saved' | 'error' }>({});

  useEffect(() => {
    const fetchProfessorSubjects = async () => {
      setLoadingSubjects(true);
      setErrorSubjects(null);
      try {
        const response = await fetch(`http://${backendIP}:3000/professor/getSubjects/`, {
          headers: { "Authorization": `Bearer ${authToken}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al obtener las materias del profesor.");
        }

        const data: ProfessorSubject[] = await response.json();
        setSubjects(data);
      } catch (err: any) {
        console.error("Error al obtener las materias del profesor:", err);
        setErrorSubjects(err.message || "No se pudieron cargar las materias. Inténtalo de nuevo.");
      } finally {
        setLoadingSubjects(false);
      }
    };

    if (authToken && backendIP) {
      fetchProfessorSubjects();
    }
  }, [authToken, backendIP]);

  const handleSubjectChange = async (selectedValue: string) => {
    if (!selectedValue) {
      setSelectedSubjectInfo(null);
      setStudents([]);
      setSaveStatus({});
      return;
    }

    const [id_materia, id_grupo, materia_nombre] = selectedValue.split("-");
    const subjectInfo: ProfessorSubject = { id_materia, id_grupo, materia_nombre };
    setSelectedSubjectInfo(subjectInfo);
    setStudents([]); // Clear previous students
    setSaveStatus({}); // Clear previous save statuses

    setLoadingStudents(true);
    setErrorStudents(null);
    try {
      const response = await fetch(`http://${backendIP}:3000/professor/getStudents?id_materia=${id_materia}&id_grupo=${id_grupo}`, {
        headers: { "Authorization": `Bearer ${authToken}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al obtener los estudiantes.");
      }

      const data: StudentGrade[] = await response.json();
      setStudents(data);
    } catch (err: any) {
      console.error("Error al obtener los estudiantes:", err);
      setErrorStudents(err.message || "No se pudieron cargar los estudiantes para esta materia.");
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleGradeChange = (matricula: string, field: 'calif_p1' | 'calif_p2' | 'calif_final', value: string) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.matricula === matricula
          ? { ...student, [field]: value === '' ? null : parseFloat(value) }
          : student
      )
    );
    // Reset save status to idle if a grade is changed
    setSaveStatus((prev) => ({ ...prev, [matricula]: 'idle' }));
  };

  const saveGrade = async (matricula: string) => {
    if (!selectedSubjectInfo) {
      alert("Error: No se ha seleccionado una materia.");
      return;
    }

    setSaveStatus((prev) => ({ ...prev, [matricula]: 'saving' }));
    const studentToSave = students.find(s => s.matricula === matricula);

    if (!studentToSave) {
      setSaveStatus((prev) => ({ ...prev, [matricula]: 'error' }));
      return;
    }

    const data = {
      id_materia: selectedSubjectInfo.id_materia,
      matricula: matricula,
      calif_p1: studentToSave.calif_p1,
      calif_p2: studentToSave.calif_p2,
      calif_final: studentToSave.calif_final,
      ciclo_cursando: "2025-1"
    };

    try {
      const response = await fetch(`http://${backendIP}:3000/professor/saveGrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error al guardar calificación para ${studentToSave.user_name}.`);
      }

      const result = await response.json();
      console.log("Server response:", result);
      setSaveStatus((prev) => ({ ...prev, [matricula]: 'saved' }));
        alert(`Calificación guardada para ${studentToSave.user_name}.`);
    } catch (err: any) {
      console.error("Error saving grade:", err);
      setSaveStatus((prev) => ({ ...prev, [matricula]: 'error' }));
      alert(err.message || "Error al guardar la calificación.");
    }
  };

  //Definicion de las columnas de la tabla
  const columns = [
    {
      header: 'Estudiante',
      accessor: (row: StudentGrade) => row.user_name,
    },
    {
      header: 'Parcial 1',
      accessor: (row: StudentGrade) => (
        <Input
          type="number"
          value={row.calif_p1 ?? ''}
          onChange={(e) => handleGradeChange(row.matricula, 'calif_p1', e.target.value)}
          step="0.1"
          min="0"
          max="10"
          className="w-24 text-center"
        />
      ),
    },
    {
      header: 'Parcial 2',
      accessor: (row: StudentGrade) => (
        <Input
          type="number"
          value={row.calif_p2 ?? ''}
          onChange={(e) => handleGradeChange(row.matricula, 'calif_p2', e.target.value)}
          step="0.1"
          min="0"
          max="10"
          className="w-24 text-center"
        />
      ),
    },
    {
      header: 'Final',
      accessor: (row: StudentGrade) => (
        <Input
          type="number"
          value={row.calif_final ?? ''}
          onChange={(e) => handleGradeChange(row.matricula, 'calif_final', e.target.value)}
          step="0.1"
          min="0"
          max="10"
          className="w-24 text-center"
        />
      ),
    },
    {
      header: 'Acción',
      accessor: (row: StudentGrade) => {
        const status = saveStatus[row.matricula] || 'idle';
        let buttonText = 'Guardar';
        let buttonVariant: 'primary' | 'danger' | 'secondary' | 'outline' | undefined = 'primary';
        let buttonDisabled = false;

        if (status === 'saving') {
          buttonText = 'Guardando...';
          buttonDisabled = true;
        } else if (status === 'saved') {
          buttonText = 'Guardado';
          buttonVariant = 'secondary'; 
          buttonDisabled = true;
        } else if (status === 'error') {
          buttonText = 'Error';
          buttonVariant = 'danger';
        }

        return (
          <Button
            onClick={() => saveGrade(row.matricula)}
            disabled={buttonDisabled}
            variant={buttonVariant}
            size="sm"
          >
            {buttonText}
          </Button>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Ingreso de Calificaciones</h2>
      <Card>
        <div className="form-group mb-6">
          <label htmlFor="professor_grade_subject_select" className="block text-sm font-medium text-gray-700 mb-2">
            Elija materia
          </label>
          <Select
            id="professor_grade_subject_select"
            value={selectedSubjectInfo ? `${selectedSubjectInfo.id_materia}-${selectedSubjectInfo.id_grupo}-${selectedSubjectInfo.materia_nombre}` : ''}
            onChange={handleSubjectChange}
            disabled={loadingSubjects}
            options={[
              { value: '', label: 'Seleccione una materia' },
              ...subjects.map((subject) => ({
                value: `${subject.id_materia}-${subject.id_grupo}-${subject.materia_nombre}`,
                label: `${subject.materia_nombre} (Grupo: ${subject.id_grupo})`
              }))
            ]}
          />
          {errorSubjects && <p className="text-red-500 text-sm mt-2">{errorSubjects}</p>}
        </div>

        {selectedSubjectInfo && (
          <>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Estudiantes en {selectedSubjectInfo.materia_nombre} (Grupo: {selectedSubjectInfo.id_grupo})
            </h3>
            {loadingStudents ? (
              <p className="text-center text-gray-500">Cargando estudiantes...</p>
            ) : errorStudents ? (
              <p className="text-center text-red-500">{errorStudents}</p>
            ) : students.length > 0 ? (
              <Table
                columns={columns}
                data={students}
                keyExtractor={(student) => student.matricula}
              />
            ) : (
              <p className="text-center text-gray-500">No se encontraron estudiantes para esta materia.</p>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default ProfessorGradeEntryPage;