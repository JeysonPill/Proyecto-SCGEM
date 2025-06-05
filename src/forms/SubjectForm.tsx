import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Subject } from '../data/initialData';

interface SubjectFormProps {
  subject?: Subject;
  onClose: () => void;
  mode: 'add' | 'edit';
}

const SubjectForm: React.FC<SubjectFormProps> = ({ subject, onClose, mode }) => {
  const { addSubject, updateSubject } = useData();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const [formData, setFormData] = useState<Omit<Subject, 'id_materia'>>({
    materia_nombre: subject?.materia_nombre || '',
    sem_cursante: subject?.sem_cursante || 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'sem_cursante' ? parseInt(value, 10) : value,
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
    
    if (!formData.materia_nombre) {
      newErrors.materia_nombre = 'Nombre de materia es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (mode === 'add') {
      addSubject(formData as Subject);
    } else if (mode === 'edit' && subject) {
      updateSubject(subject.id_materia, formData as Subject);
    }
    
    onClose();
  };

  const semesterOptions = Array.from({ length: 10 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1}° Semestre`,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nopmbre de Materia"
        name="materia_nombre"
        value={formData.materia_nombre}
        onChange={handleChange}
        placeholder="Ingresa nombre de materia"
        error={errors.materia_nombre}
      />
      
      <Select
        label="Semestre Cursante"
        name="sem_cursante"
        value={String(formData.sem_cursante)}
        onChange={(value) => {
          setFormData({
            ...formData,
            sem_cursante: parseInt(value, 10),
          });
        }}
        options={semesterOptions}
      />
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="submit">
          {mode === 'add' ? 'Añadir Materia' : 'Actualizar Materia'}
        </Button>
      </div>
    </form>
  );
};

export default SubjectForm;