import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ProfessorForm from '../forms/ProfessorForm';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Professor } from '../context/DataContext';
import Input from '../components/ui/Input';

type TableColumn<T> = {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
};

const ProfessorsPage: React.FC = () => {
  const { professors, deleteProfessor } = useData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProfessor, setCurrentProfessor] = useState<Professor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProfessors = professors.filter((professor: Professor) => 
    professor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (professor: Professor) => {
    setCurrentProfessor(professor);
    setIsEditModalOpen(true);
  };

  const handleDelete = (professor: Professor) => {
    setCurrentProfessor(professor);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (currentProfessor) {
      deleteProfessor(currentProfessor.id_profesor);
      setIsDeleteModalOpen(false);
      setCurrentProfessor(null);
    }
  };

  const columns: TableColumn<Professor>[] = [
    {
      header: 'Professor ID',
      accessor: 'id_profesor',
    },
    {
      header: 'Name',
      accessor: 'nombre',
    },
    {
      header: 'Contact',
      accessor: (professor: Professor): React.ReactNode => (
        <div>
          <div>{professor.email}</div>
          <div className="text-gray-400">{professor.celular}</div>
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: (professor: Professor): React.ReactNode => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit className="h-4 w-4" />}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(professor);
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
              handleDelete(professor);
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
        <h1 className="text-2xl font-bold text-gray-900">Control de profesores</h1>
        <Button
          leftIcon={<Plus className="h-5 w-5" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Añadir Profesor
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <Input
            placeholder="Buscar profesor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-5 w-5 text-gray-400" />}
          />
        </div>
        
        <Table
          columns={columns}
          data={filteredProfessors}
          keyExtractor={(professor) => professor.id_profesor}
          onRowClick={handleEdit}
          emptyState={
            <div className="text-center">
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No hay registro de profesores</h3>
              <p className="mt-1 text-sm text-gray-500">
                Añade un nuevo profesor.
              </p>
              <div className="mt-6">
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="h-5 w-5 mr-2" />
                  Añadir Profesor
                </Button>
              </div>
            </div>
          }
        />
      </Card>

      {/* Add Professor Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Professor"
      >
        <ProfessorForm
          onClose={() => setIsAddModalOpen(false)}
          mode="add"
        />
      </Modal>

      {/* Edit Professor Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Professor"
      >
        {currentProfessor && (
          <ProfessorForm
            professor={currentProfessor}
            onClose={() => setIsEditModalOpen(false)}
            mode="edit"
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Professor"
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
            {currentProfessor?.nombre}
          </span>
          ?.
        </p>
      </Modal>
    </div>
  );
};

export default ProfessorsPage;