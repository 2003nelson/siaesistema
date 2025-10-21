// src/components/Alerts/AlertsTable.jsx
import React from 'react';
import AlertRow from './AlertRow.jsx'; // Asegúrate de que la extensión .jsx esté aquí

// 1. Aceptamos los nuevos props: 'searchQuery' y 'onSearchChange'
const AlertsTable = ({ 
  alerts, 
  searchQuery, 
  onSearchChange, 
  onToggleStatus, 
  onSaveObservation 
}) => {
  return (
    <div className="card alerts-table-card">
      <h2 className="card-title">Lista de Alumnos</h2>
      
      {/* 2. AÑADIMOS LA BARRA DE BÚSQUEDA */}
      <div className="search-bar-container">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por nombre de alumno..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      {/* --- FIN DE LA BARRA DE BÚSQUEDA --- */}

      <div className="alerts-table">
        <div className="alert-header">
          <div className="alert-cell-header">Nombre del Alumno</div>
          <div className="alert-cell-header">Grupo</div>
          <div className="alert-cell-header">Faltas</div>
          <div className="alert-cell-header">Estado</div>
          <div className="alert-cell-header observations-header">Observaciones</div>
        </div>
        
        <div className="alerts-table-body">
          {/* 3. Mensaje mejorado si no hay resultados */}
          {alerts.length === 0 ? (
            <p className="no-alerts">
              {searchQuery ? 'No se encontraron alumnos con ese nombre.' : 'No hay alertas para mostrar.'}
            </p>
          ) : (
            alerts.map((alert) => (
              <AlertRow 
                key={alert.id}
                alert={alert}
                onToggleStatus={onToggleStatus}
                onSaveObservation={onSaveObservation}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsTable;