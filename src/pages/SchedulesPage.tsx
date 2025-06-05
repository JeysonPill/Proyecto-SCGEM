import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ScheduleForm from '../forms/ScheduleForm';
import { Plus, Edit, Trash2, Search, Calendar } from 'lucide-react';
import { Schedule } from '../data/initialData';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const SchedulesPage: React.FC = () => {
  const { schedules, deleteSchedule, subjects, professors } = useData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<Schedule | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedProfessor, setSelectedProfessor] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'timetable'>('list');

  const getSubjectName = (id: string) => {
    const subject = subjects.find(s => s.id === id);
    return subject ? subject.materia_nombre : 'Unknown Subject';
  };

  const getProfessorName = (id: string) => {
    const professor = professors.find(p => p.id === id);
    return professor ? professor.nombre : 'Unknown Professor';
  };

  const filteredSchedules = schedules.filter((schedule) => {
    const subjectName = getSubjectName(schedule.id_materia);
    const professorName = getProfessorName(schedule.id_profesor);
    
    const matchesSearch = 
      subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.id_grupo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubjectFilter = selectedSubject ? schedule.id_materia === selectedSubject : true;
    const matchesProfessorFilter = selectedProfessor ? schedule.id_profesor === selectedProfessor : true;
    
    return matchesSearch && matchesSubjectFilter && matchesProfessorFilter;
  });

  const handleEdit = (schedule: Schedule) => {
    setCurrentSchedule(schedule);
    setIsEditModalOpen(true);
  };

  const handleDelete = (schedule: Schedule) => {
    setCurrentSchedule(schedule);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (currentSchedule) {
      deleteSchedule(currentSchedule.id);
      setIsDeleteModalOpen(false);
    }
  };

  const columns = [
    {
      header: 'Subject',
      accessor: (schedule: Schedule) => getSubjectName(schedule.id_materia),
    },
    {
      header: 'Group',
      accessor: 'id_grupo',
    },
    {
      header: 'Professor',
      accessor: (schedule: Schedule) => getProfessorName(schedule.id_profesor),
    },
    {
      header: 'Schedule',
      accessor: (schedule: Schedule) => (
        <div className="text-xs space-y-1">
          {schedule.h_lunes && <div><span className="font-semibold">Mon:</span> {schedule.h_lunes}</div>}
          {schedule.h_martes && <div><span className="font-semibold">Tue:</span> {schedule.h_martes}</div>}
          {schedule.h_miercoles && <div><span className="font-semibold">Wed:</span> {schedule.h_miercoles}</div>}
          {schedule.h_jueves && <div><span className="font-semibold">Thu:</span> {schedule.h_jueves}</div>}
          {schedule.h_viernes && <div><span className="font-semibold">Fri:</span> {schedule.h_viernes}</div>}
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: (schedule: Schedule) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit className="h-4 w-4" />}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(schedule);
            }}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 className="h-4 w-4" />}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(schedule);
            }}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  const subjectOptions = [
    { value: '', label: 'Materias...' },
    ...subjects.map(subject => ({
      value: subject.id,
      label: subject.materia_nombre
    }))
  ];

  const professorOptions = [
    { value: '', label: 'Profesores...' },
    ...professors.map(professor => ({
      value: professor.id,
      label: professor.nombre
    }))
  ];

  // Time grid for timetable view
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const dayFields = ['h_lunes', 'h_martes', 'h_miercoles', 'h_jueves', 'h_viernes'];

  // Function to check if a schedule is active for a given day and time
  const isScheduleActive = (schedule: Schedule, day: string, time: string) => {
    const dayIndex = days.indexOf(day);
    if (dayIndex === -1) return false;
    
    const dayField = dayFields[dayIndex] as keyof Schedule;
    const scheduleTime = schedule[dayField] as string;
    
    if (!scheduleTime) return false;
    
    const [start, end] = scheduleTime.split('-');
    const startHour = parseInt(start.split(':')[0], 10);
    const endHour = parseInt(end.split(':')[0], 10);
    const currentHour = parseInt(time.split(':')[0], 10);
    
    return currentHour >= startHour && currentHour < endHour;
  };

  // Generate cells for the timetable
  const renderTimetable = () => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Time
              </th>
              {days.map(day => (
                <th key={day} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {timeSlots.map(time => (
              <tr key={time}>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 border-r">
                  {time}
                </td>
                {days.map(day => (
                  <td key={`${day}-${time}`} className="px-1 py-1 border-r border-b">
                    <div className="flex flex-col gap-1">
                      {filteredSchedules
                        .filter(schedule => isScheduleActive(schedule, day, time))
                        .map(schedule => (
                          <div 
                            key={schedule.id} 
                            className="bg-blue-100 p-1 rounded text-xs overflow-hidden"
                            onClick={() => handleEdit(schedule)}
                          >
                            <div className="font-semibold truncate">{getSubjectName(schedule.id_materia)}</div>
                            <div className="truncate text-gray-500">Group: {schedule.id_grupo}</div>
                            <div className="truncate text-gray-600">{getProfessorName(schedule.id_profesor)}</div>
                          </div>
                        ))
                      }
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Control de Horarios</h1>
        <Button
          leftIcon={<Plus className="h-5 w-5" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Añadir Horario
        </Button>
      </div>

      <Card>
        <div className="mb-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar horario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="h-5 w-5 text-gray-400" />}
              />
            </div>
            <div className="md:w-1/4">
              <Select
                options={subjectOptions}
                value={selectedSubject}
                onChange={setSelectedSubject}
                label="Filtro por Materia"
              />
            </div>
            <div className="md:w-1/4">
              <Select
                options={professorOptions}
                value={selectedProfessor}
                onChange={setSelectedProfessor}
                label="Filtro por Profesor"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-l-lg focus:z-10 focus:ring-2 focus:outline-none ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => setViewMode('list')}
              >
                Vista de Lista
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-r-lg focus:z-10 focus:ring-2 focus:outline-none ${
                  viewMode === 'timetable'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => setViewMode('timetable')}
              >
                Vista de Tabla
              </button>
            </div>
          </div>
        </div>
        
        {viewMode === 'list' ? (
          <Table
            columns={columns}
            data={filteredSchedules}
            keyExtractor={(schedule) => schedule.id}
            onRowClick={handleEdit}
            emptyState={
              <div className="text-center">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Sin horarios registrados</h3>
                <p className="mt-1 text-sm text-gray-500">
                 Añade un nuevo horario.
                </p>
                <div className="mt-6">
                  <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="h-5 w-5 mr-2" />
                    Añadir Horario
                  </Button>
                </div>
              </div>
            }
          />
        ) : (
          renderTimetable()
        )}
      </Card>

      {/* Add Schedule Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Schedule"
      >
        <ScheduleForm
          onClose={() => setIsAddModalOpen(false)}
          mode="add"
        />
      </Modal>

      {/* Edit Schedule Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Schedule"
      >
        {currentSchedule && (
          <ScheduleForm
            schedule={currentSchedule}
            onClose={() => setIsEditModalOpen(false)}
            mode="edit"
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Schedule"
        size="sm"
        footer={
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p>
          Are you sure you want to delete the schedule for{' '}
          <span className="font-semibold">
            {currentSchedule && getSubjectName(currentSchedule.id_materia)} (Group {currentSchedule?.id_grupo})
          </span>
          ? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default SchedulesPage;