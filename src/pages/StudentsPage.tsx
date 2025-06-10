import React, { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import StudentForm from '../forms/StudentForm';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Student } from '../context/DataContext';
import Input from '../components/ui/Input';

const StudentsPage: React.FC = () => {
  const { students } = useDataContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter((student) => 
    student.user_name ||
    student.matricula ||
    student.carrera ||
    student.email
  );

  console.dir(`${filteredStudents}`);  

  const handleEdit = (student: Student) => {
    setCurrentStudent(student);
    setIsEditModalOpen(true);
  };

  const handleDelete = (student: Student) => {
    setCurrentStudent(student);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (currentStudent) {
      //deleteStudent(currentStudent.id);
      console.log(`Deleting student: ${currentStudent.user_name}`);
      setIsDeleteModalOpen(false);
    }
  };

  const columns = [
    {
      header: 'Nombre',
      accessor: 'user_name' as keyof Student,
    },
    {
      header: 'Matricula',
      accessor: 'matricula' as keyof Student,
    },
    {
      header: 'Carrera',
      accessor: 'carrera' as keyof Student,
    },
    {
      header: 'Semestre',
      accessor: (student: Student) => `${student.semestre}° Semester`,
    },
    {
      header: 'Información de contacto',
      accessor: (student: Student) => (
        <div>
          <div>{student.email}</div>
          <div className="text-gray-400">{student.celular}</div>
        </div>
      ),
    },
    {
      header: 'Acciones',
      accessor: (student: Student) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit className="h-4 w-4" />}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(student);
            }}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 className="h-4 w-4" />}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(student);
            }}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Control de estudiantes</h1>
        <Button
          leftIcon={<Plus className="h-5 w-5" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Añadir Estudiante
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <Input
            placeholder="Buscar estudiante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-5 w-5 text-gray-400" />}
          />
        </div>
        
        <Table
          columns={columns}
          data={filteredStudents}
          keyExtractor={(student) => student.id}
          onRowClick={handleEdit}
          emptyState={
            <div className="text-center">
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No hay registros de estudiantes</h3>
              <p className="mt-1 text-sm text-gray-500">
                Registra un nuevo estudiante.
              </p>
              <div className="mt-6">
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="h-5 w-5 mr-2" />
                  Añadir Estudiante
                </Button>
              </div>
            </div>
          }
        />
      </Card>

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Student"
      >
        <StudentForm
          onClose={() => setIsAddModalOpen(false)}
          mode="add"
        />
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Student"
      >
        {currentStudent && (
          <StudentForm
            student={currentStudent}
            onClose={() => setIsEditModalOpen(false)}
            mode="edit"
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Student"
        size="sm"
        footer={
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              Eliminar
            </Button>
          </div>
        }
      >
        <p>
          ¿Estás seguro de eliminar el regsitro?{' '}
          <span className="font-semibold">
            {currentStudent?.user_name} ({currentStudent?.matricula})
          </span>
          ?.
        </p>
      </Modal>
    </div>
  );
};

export default StudentsPage;