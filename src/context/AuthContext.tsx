import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
// Asegúrate de importar tu API para el login
import api from '../services/api'; // <--- Cambiado a importación por defecto

interface User {
  id: string;
  user_name: string;
  user_role: string;
}

interface AuthContextType {
  authToken: string | null;
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
  // Estos son los useState correctos, dentro del componente funcional
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAuthData = async () => {
      setIsLoading(true);
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          setAuthToken(storedToken);
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (e) {
          console.error('Failed to parse stored user data:', e);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setAuthToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    loadAuthData();
  }, []);

  // Función de Login
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/login', { username, password });
      const { token, user: userData } = response.data;

      setAuthToken(token);
      setUser(userData);
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData)); 
    } catch (error) {
      console.error('Error during login:', error);
      throw new Error('Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Para cerrar sesión
  const logout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const value = {
    authToken,
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};