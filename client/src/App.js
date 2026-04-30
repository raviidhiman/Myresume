import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ResumeProvider } from './context/ResumeContext';

import Navbar from './components/Navbar';
import ResumePage from './pages/ResumePage';
import LoginPage from './pages/LoginPage';
import OTPPage from './pages/OTPPage';
import DashboardPage from './pages/DashboardPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500 font-serif">Verifying session...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<ResumePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<OTPPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ResumeProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: 'Georgia, serif',
                fontSize: '14px',
                borderRadius: '2px',
                border: '1px solid #e0e0e0',
              },
            }}
          />
          <AppRoutes />
        </ResumeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
