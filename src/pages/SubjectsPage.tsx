import React, { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import SubjectForm from '../forms/SubjectForm';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Subject } from '../context/DataContext';
import Input from '../components/ui/Input';

const SubjectsPage: React.FC = () => {
  const { subjects, deleteSubject } = useDataContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentSubject, setCurrentSubject] = useState< Subject | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubjects = subjects.filter((subject) => 
    subject.materia_nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (subject: Subject) => {
    setCurrentSubject(subject);
    setIsEditModalOpen(true);
  };

  const handleDelete = (subject: Subject) => {
    setCurrentSubject(subject);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (currentSubject) {
      deleteSubject(currentSubject.id_materia);
      setIsDeleteModalOpen(false);
    }
  };

  const columns = [
    {
      header: 'ID Materia',
      accessor: (subject: Subject) => subject.id_materia,
    },
    {
      header: 'Nombre de Materia',
      accessor: (subject: Subject) => subject.materia_nombre,
    },
    {
      header: 'Semestre',
      accessor: (subject: Subject) => `${subject.sem_cursante}° Semester`,
    },
    {
      header: 'Accciones',
      accessor: (subject: Subject) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit className="h-4 w-4" />}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(subject);
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
              handleDelete(subject);
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
        <h1 className="text-2xl font-bold text-gray-900">Control de Materias</h1>
        <Button
          leftIcon={<Plus className="h-5 w-5" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Añadir Materia
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <Input
            placeholder="Buscar Materia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-5 w-5 text-gray-400" />}
          />
        </div>
        
        <Table
          columns={columns}
          data={filteredSubjects}
          keyExtractor={(subject) => subject.id_materia}
          onRowClick={handleEdit}
          emptyState={
            <div className="text-center">
              <h3 className="mt-2 text-sm font-semibold text-gray-900">Sin registros de materias</h3>
              <p className="mt-1 text-sm text-gray-500">
                Añade una nueva materia haciendo clic en el botón "Añadir Materia".
              </p>
              <div className="mt-6">
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="h-5 w-5 mr-2" />
                  Añadir Materia
                </Button>
              </div>
            </div>
          }
        />
      </Card>

      {/* Add Subject Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Subject"
      >
        <SubjectForm
          onClose={() => setIsAddModalOpen(false)}
          mode="add"
        />
      </Modal>

      {/* Edit Subject Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Subject"
      >
        {currentSubject && (
          <SubjectForm
            subject={currentSubject}
            onClose={() => setIsEditModalOpen(false)}
            mode="edit"
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Subject"
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
          ¿Estás seguro de eliminar el registro?{' '}
          <span className="font-semibold">
            {currentSubject?.materia_nombre}
          </span>
          ?.
        </p>
      </Modal>
    </div>
  );
};

export default SubjectsPage;