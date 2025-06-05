
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, logout as apiLogout } from '../services/api';
import { useNavigate } from 'react-router-dom';

export interface User {
  user_id: string; 
  username: string;
  user_role: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const loadAuthData = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser && storedUser !== "undefined") {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } else {
          setUser(null); 
        }
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false); 
      }
    };

    loadAuthData();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const userData = await apiLogin(username, password);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/'); 
    } catch (error) {
      console.error('Login failed:', error);
      localStorage.removeItem('user');
      setUser(null);
      throw error; 
    } finally {
        setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    apiLogout();
    navigate('/login');
  };

  const value = { user, login, logout, isLoading };

  if (isLoading) {
    return <div>Cargando autenticación...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('No se puede usar useAuth fuera de AuthProvider');
  }
  return context;
};