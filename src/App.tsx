import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import StudentsPage from './pages/StudentsPage';
import SubjectsPage from './pages/SubjectsPage';
import ProfessorsPage from './pages/ProfessorsPage';
import SchedulesPage from './pages/SchedulesPage';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

const PrivateRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: string[]; // ← permite filtrar por rol
}> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.user_role)) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }>
              <Route path="admin" element={
                <PrivateRoute allowedRoles={['99']}>
                  <h1>Vista de Super Admin</h1> {/* Reemplaza con tu página real */}
                </PrivateRoute>
              } />
              <Route index element={<Dashboard />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="subjects" element={<SubjectsPage />} />
              <Route path="professors" element={<ProfessorsPage />} />
              <Route path="schedules" element={<SchedulesPage />} />
            </Route>
          </Routes>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;