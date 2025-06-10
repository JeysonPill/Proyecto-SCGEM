import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';


export interface Subject {
    id_materia: string;
    materia_nombre: string;
    description: string;
    sem_cursante: number;
}


export interface Student {
    id: string;
    user_name: string;
    carrera: string;
    semestre: number;
    matricula: string;
    celular: string;
    email: string;
}


export interface Professor {
    id_professor: string;
    nombre: string;
    celular: string;
    email: string;

}


export interface Schedule {
    id_schedule: string;
    id_materia: string;
    id_profesor: string;
    id_grupo: string;
}


interface DataContextProps {
    subjects: Subject[];
    students: Student[];
    professors: Professor[];
    schedules: Schedule[];
    loading: boolean;
    error: string | null;


    addSubject: (newSubject: Omit<Subject, 'id_materia'>) => Promise<void>;
    updateSubject: (updatedSubject: Subject) => Promise<void>;
    deleteSubject: (id: string) => Promise<void>;
}


const DataContext = createContext<DataContextProps | undefined>(undefined);


export const useDataContext = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useDataContext debe ser usado dentro de un DataProvider');
    }
    return context;
};


export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [professors, setProfessors] = useState<Professor[]>([]);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    const fetchSubjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/subjects');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data: Subject[] = await response.json();
            setSubjects(data);
        } catch (err: any) {
            console.error("Error fetching subjects:", err);
            setError(`Failed to fetch subjects: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Obtener Estudiantes
    const fetchStudents = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/students');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data: Student[] = await response.json();
            setStudents(data);
        } catch (err: any) {
            console.error("Error fetching students:", err);
            setError(`Failed to fetch students: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Obtener Profesores
    const fetchProfessors = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/professors'); // Ajusta la ruta a tu endpoint de profesores
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data: Professor[] = await response.json();
            setProfessors(data);
        } catch (err: any) {
            console.error("Error fetching professors:", err);
            setError(`Failed to fetch professors: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Obtener Horarios
    const fetchSchedules = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/schedules'); // Ajusta la ruta a tu endpoint de horarios
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data: Schedule[] = await response.json();
            setSchedules(data);
        } catch (err: any) {
            console.error("Error fetching schedules:", err);
            setError(`Failed to fetch schedules: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // useEffect para cargar todas las entidades cuando el componente se monta
    useEffect(() => {
        fetchSubjects();
        fetchStudents();
        fetchProfessors();
        fetchSchedules();
    }, []);

    // --- Funciones CRUD para Subjects (las mismas, con tipos consistentes) ---
    const addSubject = async (newSubject: Omit<Subject, 'id_materia'>) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/subjects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSubject),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            const addedSubject: Subject = await response.json();
            setSubjects((prevSubjects: Subject[]) => [...prevSubjects, addedSubject]);
        } catch (err: any) {
            console.error("Error adding subject:", err);
            setError(`Failed to add subject: ${err.message}`);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const addProfessor = async (newSubject: Omit<Subject, 'id_professor'>) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/professor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSubject),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            const addedSubject: Subject = await response.json();
            setSubjects((prevSubjects: Subject[]) => [...prevSubjects, addedSubject]);
        } catch (err: any) {
            console.error("Error al crear nuevo profesor:", err);
            setError(`Error encontrado en la peticion (Crear Profesor): ${err.message}`);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateSubject = async (updatedSubject: Subject) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/subjects/${updatedSubject.id_materia}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedSubject),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            const data: Subject = await response.json();
            setSubjects((prevSubjects: Subject[]) =>
                prevSubjects.map((subject) =>
                    subject.id_materia === data.id_materia ? data : subject
                )
            );
        } catch (err: any) {
            console.error("Error updating subject:", err);
            setError(`Failed to update subject: ${err.message}`);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteSubject = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/subjects/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            setSubjects((prevSubjects: Subject[]) => prevSubjects.filter((subject) => subject.id_materia !== id));
        } catch (err: any) {
            console.error("Error al intentar borrar materia:", err);
            setError(`Fallo borrar la materias: ${err.message}`);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Valores que se proporcionarán a los consumidores del contexto
    const contextValue = {
        subjects,
        students,
        professors,
        schedules,
        addSubject,
        updateSubject,
        deleteSubject,
        loading,
        error,
        addProfessor,
    };

    return (
        <DataContext.Provider value={contextValue}>
            {children}
        </DataContext.Provider>
    );
};