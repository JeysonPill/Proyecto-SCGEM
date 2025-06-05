import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner'; // Assuming you have a loading spinner

// Core Pages
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';

// Admin / Superadmin Pages (Roles '3', '99')
import StudentsPage from './pages/StudentsPage';
import ProfessorsPage from './pages/ProfessorsPage';
import SubjectsPage from './pages/SubjectsPage';
import SchedulesPage from './pages/SchedulesPage';

// Student Pages (Roles '1', '99')
import StudentSubjectsPage from './pages/student/StudentSubjectsPage';
import StudentGradesPage from './pages/student/StudentGradesPage';
import StudentKardexPage from './pages/student/StudentKardexPage';
import StudentPaymentsPage from './pages/student/StudentPaymentsPage';
import StudentAttendancePage from './pages/student/StudentAttendancePage';

// Professor Pages (Roles '2', '99')
import ProfessorSchedulePage from './pages/professor/ProfessorSchedulePage';
import ProfessorGradeEntryPage from './pages/professor/ProfessorGradeEntryPage';
import ProfessorAttendanceQRPage from './pages/professor/ProfessorAttendanceQRPage';


interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Optional array of roles that can access this route
}

// PrivateRoute component with role-based access control
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const { authToken, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner /> {/* Display a loading spinner while auth state is being determined */}
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated but role is not allowed, redirect to dashboard
  // Superadmin (role '99') implicitly has access to all pages, so no explicit check needed for '99'
  if (allowedRoles && user && !allowedRoles.includes(user.user_role) && user.user_role !== '99') {
    // Optionally, you could redirect to a /forbidden page or show an error
    return <Navigate to="/" replace />; // Redirect to dashboard if unauthorized
  }

  // If authenticated and role is allowed, render children
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Main Dashboard Route - Accessible by all authenticated users */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Admin / Superadmin Routes (Roles: '3', '99') */}
            <Route
              path="/students"
              element={
                <PrivateRoute allowedRoles={['3']}>
                  <Layout>
                    <StudentsPage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/professors"
              element={
                <PrivateRoute allowedRoles={['3']}>
                  <Layout>
                    <ProfessorsPage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/subjects" // General subjects list for admin
              element={
                <PrivateRoute allowedRoles={['3']}>
                  <Layout>
                    <SubjectsPage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/schedules" // General schedules list for admin
              element={
                <PrivateRoute allowedRoles={['3']}>
                  <Layout>
                    <SchedulesPage />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Student Panel Routes (Roles: '1', '99') */}
            <Route
              path="/student/subjects"
              element={
                <PrivateRoute allowedRoles={['1']}>
                  <Layout>
                    <StudentSubjectsPage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/student/grades"
              element={
                <PrivateRoute allowedRoles={['1']}>
                  <Layout>
                    <StudentGradesPage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/student/kardex"
              element={
                <PrivateRoute allowedRoles={['1']}>
                  <Layout>
                    <StudentKardexPage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/student/payments"
              element={
                <PrivateRoute allowedRoles={['1']}>
                  <Layout>
                    <StudentPaymentsPage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/student/attendance"
              element={
                <PrivateRoute allowedRoles={['1']}>
                  <Layout>
                    <StudentAttendancePage />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Professor Panel Routes (Roles: '2', '99') */}
            <Route
              path="/professor/schedule"
              element={
                <PrivateRoute allowedRoles={['2']}>
                  <Layout>
                    <ProfessorSchedulePage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/professor/grade-entry"
              element={
                <PrivateRoute allowedRoles={['2']}>
                  <Layout>
                    <ProfessorGradeEntryPage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/professor/attendance-qr"
              element={
                <PrivateRoute allowedRoles={['2']}>
                  <Layout>
                    <ProfessorAttendanceQRPage />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Fallback for unmatched routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;