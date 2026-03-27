import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const { currentUser } = useAuth();

  // TODO: Re-enable this once Firebase Auth is fully tested and accounts exist.
  // if (!currentUser) {
  //   return <Navigate to="/login" />;
  // }

  return <>{children}</>;
};
