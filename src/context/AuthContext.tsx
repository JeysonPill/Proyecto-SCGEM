// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import  api  from '../services/api';
//import { ROLES } from '../utils/roles';
import { UserAuthData } from '../types'; // Importamos la interfaz UserAuthData

export interface AuthContextType {
  user: UserAuthData | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAuthData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Nuevo estado de carga

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser: UserAuthData = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Error parsing stored user data:", e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      console.log(response);

      const data: {
        token: string;
        user_role: string;
        user_id: string;
        user_matricula: string; // Asegúrate de que tu backend siempre envíe esto
      } = await response.data();

      const authenticatedUser: UserAuthData = {
        user_id: data.user_id,
        user_name: username,
        user_role: data.user_role,
        user_matricula: data.user_matricula,
      };

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(authenticatedUser));

      setUser(authenticatedUser);
      setIsAuthenticated(true);

    } catch (error: any) {
      console.error('Login fallido:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      throw new Error(error.message || 'Error de autenticación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login: handleLogin, logout: handleLogout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};