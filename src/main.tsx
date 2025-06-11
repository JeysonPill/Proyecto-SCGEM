//import { StrictMode } from 'react';
//import { createRoot } from 'react-dom/client';
//import App from './App.tsx';
//import './index.css';
//
//createRoot(document.getElementById('root')!).render(
//  <StrictMode>
//    <App />
//  </StrictMode>
//);

// src/main.tsx (o src/index.tsx)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Necesario para las rutas
import AppRoutes from './App'; // Importamos tu componente principal de rutas
import { AuthProvider } from './context/AuthContext'; // Importamos AuthProvider
import { DataProvider } from './context/DataContext'; // Importamos DataProvider

import './index.css'; // Tu archivo CSS global

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* BrowserRouter es el contenedor de rutas */}
      <AuthProvider> {/* AuthProvider envuelve todo lo que necesita autenticación */}
        <DataProvider> {/* DataProvider envuelve todo lo que necesita datos, y depende de AuthProvider */}
          <AppRoutes /> {/* Tu componente principal de rutas, que usa useAuth() */}
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
