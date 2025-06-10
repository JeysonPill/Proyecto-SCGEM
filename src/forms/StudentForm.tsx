import React, { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Student } from '../context/DataContext';

interface StudentFormProps {
  student?: Student;
  onClose: () => void;
  mode: 'add' | 'edit';
}

const StudentForm: React.FC<StudentFormProps> = ({ student, onClose, mode }) => {
  const { addStudent, updateStudent } = useDataContext();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState<Omit<Student, 'id_student'>>({
    id: student?.id || '',
    matricula: student?.matricula || '',
    carrera: student?.carrera || '',
    semestre: student?.semestre || 1,
    user_name: student?.user_name || '',
    celular: student?.celular || '',
    email: student?.email || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'semestre' ? parseInt(value, 10) : value,
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

    if (!formData.matricula) {
      newErrors.matricula = 'ID estudiante es requerido';
    }

    if (!formData.carrera) {
      newErrors.carrera = 'Carrera es requerida';
    }

    if (!formData.user_name) {
      newErrors.user_name = 'Nombre completo es requerido';
    }

    if (!formData.email) {
      newErrors.email = 'Email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.celular) {
      newErrors.celular = 'Numero de celular es requerido';
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
      addStudent(formData as Student);
    } else if (mode === 'edit' && student) {
      updateStudent(student.id, formData as Student);
    }

    onClose();
  };

  const semesterOptions = Array.from({ length: 10 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1}° Semestre`,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="ID Estudiante"
          name="matricula"
          value={formData.matricula}
          onChange={handleChange}
          placeholder="Ingresa ID estudiante"
          error={errors.matricula}
        />

        <Input
          label="Carrera"
          name="carrera"
          value={formData.carrera}
          onChange={handleChange}
          placeholder="Ingrersa carrera"
          error={errors.carrera}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Select
          label="Semestre"
          name="semestre"
          value={String(formData.semestre)}
          onChange={(value) => {
            setFormData({
              ...formData,
              semestre: parseInt(value, 10),
            });
          }}
          options={semesterOptions}
        />

        <Input
          label="Nombre Completo"
          name="user_name"
          value={formData.user_name}
          onChange={handleChange}
          placeholder="Ingresa nombre completo"
          error={errors.user_name}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Número de Celular"
          name="celular"
          value={formData.celular}
          onChange={handleChange}
          placeholder="Ingresa número de celular"
          error={errors.celular}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Ingresa email"
          error={errors.email}
        />
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
          {mode === 'add' ? 'Añadir Estudiante' : 'Actualizar Estudiante'}
        </Button>
      </div>
    </form>
  );
};

export default StudentForm;