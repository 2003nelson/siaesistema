// src/components/Layout/Header.jsx
import React from 'react';
// 1. Importamos NavLink
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        
        <div className="logo-container">
          <span className="logo">SIAE</span>
        </div>

        {/* 2. Usamos NavLink en lugar de <a> */}
        {/* 'to' define la ruta y 'className' aplica 'active' si la ruta coincide */}
        <nav className="nav">
          <NavLink 
            to="/"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            DASHBOARD
          </NavLink>
          <NavLink 
            to="/alertas"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            GESTIÓN DE ALERTAS
          </NavLink>
          <NavLink 
            to="/usuarios"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            GESTIÓN DE USUARIOS
          </NavLink>
          <NavLink 
            to="/estudiantes"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            GESTIÓN DE ESTUDIANTES
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;