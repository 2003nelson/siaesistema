// src/components/Dashboard/DashboardControls.jsx
import React from 'react';
// Importamos los iconos de lucide-react (esto sigue igual)
import { Calendar, ChevronDown } from 'lucide-react';

// Opciones de los botones de turno
const MODES = [
  { id: 'general', label: 'GENERAL' },
  { id: 'matutino', label: 'MATUTINO' },
  { id: 'vespertino', label: 'VESPERTINO' },
];

const DashboardControls = ({ activeMode, onModeChange }) => {
  // TODO: La lógica para el dropdown de fecha se puede añadir aquí
  
  return (
    <div className="controls-container">
      
      {/* Selectores de Modo */}
      <div className="mode-selectors">
        {MODES.map((mode) => {
          const isActive = mode.id === activeMode;
          // Aplicamos la clase 'active' dinámicamente
          const btnClass = `btn-mode ${isActive ? 'active' : ''}`;

          return (
            <button
              key={mode.id}
              className={btnClass}
              onClick={() => onModeChange(mode.id)}
            >
              {mode.label}
            </button>
          );
        })}
      </div>

      {/* Botón de Filtro (Dropdown) */}
      <button className="btn-filter">
        <Calendar size={20} />
        <span>Filtrar por Fecha</span>
        <ChevronDown size={20} />
      </button>
    </div>
  );
};

export default DashboardControls;