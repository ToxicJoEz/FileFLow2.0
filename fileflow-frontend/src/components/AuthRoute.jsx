import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function AuthRoute({ children }) {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
