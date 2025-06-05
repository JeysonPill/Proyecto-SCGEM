import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Schedule } from '../data/initialData';

interface ScheduleFormProps {
  schedule?: Schedule;
  onClose: () => void;
  mode: 'add' | 'edit';
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ schedule, onClose, mode }) => {
  const { addSchedule, updateSchedule, subjects, professors } = useData();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const [formData, setFormData] = useState<Omit<Schedule, 'id'>>({
    id_materia: schedule?.id_materia || '',
    id_grupo: schedule?.id_grupo || '',
    id_profesor: schedule?.id_profesor || '',
    h_lunes: schedule?.h_lunes || '',
    h_martes: schedule?.h_martes || '',
    h_miercoles: schedule?.h_miercoles || '',
    h_jueves: schedule?.h_jueves || '',
    h_viernes: schedule?.h_viernes || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.id_materia) {
      newErrors.id_materia = 'Subject is required';
    }
    
    if (!formData.id_grupo) {
      newErrors.id_grupo = 'Group is required';
    }
    
    if (!formData.id_profesor) {
      newErrors.id_profesor = 'Professor is required';
    }
    
    // Validate that at least one day has a schedule
    if (
      !formData.h_lunes &&
      !formData.h_martes &&
      !formData.h_miercoles &&
      !formData.h_jueves &&
      !formData.h_viernes
    ) {
      newErrors.h_lunes = 'At least one day schedule is required';
    }
    
    // Validate time format for each day (if provided)
    const validateTimeFormat = (time: string, field: string) => {
      if (time && !/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(time)) {
        newErrors[field] = 'Time format should be HH:MM-HH:MM';
      }
    };
    
    validateTimeFormat(formData.h_lunes, 'h_lunes');
    validateTimeFormat(formData.h_martes, 'h_martes');
    validateTimeFormat(formData.h_miercoles, 'h_miercoles');
    validateTimeFormat(formData.h_jueves, 'h_jueves');
    validateTimeFormat(formData.h_viernes, 'h_viernes');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (mode === 'add') {
      addSchedule(formData as Schedule);
    } else if (mode === 'edit' && schedule) {
      updateSchedule(schedule.id, formData as Schedule);
    }
    
    onClose();
  };

  const subjectOptions = subjects.map(subject => ({
    value: subject.id,
    label: subject.materia_nombre,
  }));

  const professorOptions = professors.map(professor => ({
    value: professor.id,
    label: professor.nombre,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Select
          label="Subject"
          name="id_materia"
          value={formData.id_materia}
          onChange={(value) => {
            setFormData({
              ...formData,
              id_materia: value,
            });
            if (errors.id_materia) {
              setErrors({
                ...errors,
                id_materia: '',
              });
            }
          }}
          options={subjectOptions}
          error={errors.id_materia}
        />
        
        <Input
          label="Group"
          name="id_grupo"
          value={formData.id_grupo}
          onChange={handleChange}
          placeholder="Enter group (e.g. A1, B2)"
          error={errors.id_grupo}
        />
      </div>
      
      <Select
        label="Professor"
        name="id_profesor"
        value={formData.id_profesor}
        onChange={(value) => {
          setFormData({
            ...formData,
            id_profesor: value,
          });
          if (errors.id_profesor) {
            setErrors({
              ...errors,
              id_profesor: '',
            });
          }
        }}
        options={professorOptions}
        error={errors.id_profesor}
      />
      
      <div className="border rounded-md p-4 bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Weekly Schedule</h3>
        <p className="text-xs text-gray-500 mb-3">Format: HH:MM-HH:MM (e.g. 08:00-10:00)</p>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Monday"
            name="h_lunes"
            value={formData.h_lunes}
            onChange={handleChange}
            placeholder="e.g. 08:00-10:00"
            error={errors.h_lunes}
          />
          
          <Input
            label="Tuesday"
            name="h_martes"
            value={formData.h_martes}
            onChange={handleChange}
            placeholder="e.g. 08:00-10:00"
            error={errors.h_martes}
          />
          
          <Input
            label="Wednesday"
            name="h_miercoles"
            value={formData.h_miercoles}
            onChange={handleChange}
            placeholder="e.g. 08:00-10:00"
            error={errors.h_miercoles}
          />
          
          <Input
            label="Thursday"
            name="h_jueves"
            value={formData.h_jueves}
            onChange={handleChange}
            placeholder="e.g. 08:00-10:00"
            error={errors.h_jueves}
          />
          
          <Input
            label="Friday"
            name="h_viernes"
            value={formData.h_viernes}
            onChange={handleChange}
            placeholder="e.g. 08:00-10:00"
            error={errors.h_viernes}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="submit">
          {mode === 'add' ? 'Add Schedule' : 'Update Schedule'}
        </Button>
      </div>
    </form>
  );
};

export default ScheduleForm;