import React, { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Professor } from '../context/DataContext';

interface ProfessorFormProps {
  professor?: Professor;
  onClose: () => void;
  mode: 'add' | 'edit';
}

const ProfessorForm: React.FC<ProfessorFormProps> = ({ professor, onClose, mode }) => {
  const { addProfessor, updateProfessor} = useDataContext();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const [formData, setFormData] = useState<Omit<Professor, 'id_profesor'>>({
    nombre: professor?.nombre || '',
    celular: professor?.celular || '',
    email: professor?.email || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    if (!formData.nombre) {
      newErrors.nombre = 'Nombnre es requerido';
    }
    
    if (!formData.celular) {
      newErrors.celular = 'Número de celular es requerido';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email es inválido';
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
      addProfessor(formData as Professor);
    } else if (mode === 'edit' && professor) {
      updateProfessor(professor.id_profesor, formData as Professor);
    }
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre Completo"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        placeholder="Ingresa el nombre completo"
        error={errors.nombre}
      />
      
      <Input
        label="Numero de Celular"
        type="tel"
        name="celular"
        value={formData.celular}
        onChange={handleChange}
        placeholder="Ingresa el número de celular"
        error={errors.celular}
      />
      
      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Ingresa el email"
        error={errors.email}
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
          {mode === 'add' ? 'Añadir Profesor' : 'Actualizar Profesor'}
        </Button>
      </div>
    </form>
  );
};

export default ProfessorForm;