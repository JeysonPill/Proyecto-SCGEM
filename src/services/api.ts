// src/services/api.ts
import axios from 'axios';

// Para proyectos Vite, las variables de entorno se acceden a través de import.meta.env
// Y deben comenzar con VITE_ (por defecto) en el archivo .env
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:3000';

// AÑADE ESTA LÍNEA PARA DEPURAR:
console.log('DEBUG: API_BASE_URL from .env:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token a cada petición saliente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta (opcional, pero recomendado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Token expirado o no autorizado. Redirigiendo a login...");
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Puedes añadir aquí window.location.href = '/login'; si quieres una redirección forzada
    }
    return Promise.reject(error);
  }
);

export default api;