// src/components/Auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Recibe 'isLoggedIn' como prop desde App.jsx
const ProtectedRoute = ({ isLoggedIn }) => {
  if (!isLoggedIn) {
    // Si no está logueado, lo redirige a /login
    return <Navigate to="/login" replace />;
  }

  // Si está logueado, renderiza el contenido (en nuestro caso, el MainLayout)
  return <Outlet />;
};

export default ProtectedRoute;