// src/components/Alerts/AlertRow.jsx
import React, { useState } from 'react';

// 'alert' son los datos de la fila
// 'onToggleStatus' y 'onSaveObservation' son las funciones "interruptor"
const AlertRow = ({ alert, onToggleStatus, onSaveObservation }) => {
  // Estado local para el texto de observación
  const [observationText, setObservationText] = useState(alert.observaciones);
  const [isSaving, setIsSaving] = useState(false);

  // Clase CSS para el botón de estado
  const statusClass = alert.estado === 'Justificado'
    ? 'status-btn justificado'
    : 'status-btn no-justificado';

  // Manejador del botón Guardar
  const handleSave = () => {
    // Simula el guardado
    setIsSaving(true);
    // Llama a la función "padre" que eventualmente llamará a la API
    onSaveObservation(alert.id, observationText);
    // Simula fin de guardado
    setTimeout(() => setIsSaving(false), 500); 
  };

  return (
    <div className="alert-row">
      <div className="alert-cell" data-label="Nombre">{alert.nombre}</div>
      <div className="alert-cell" data-label="Grupo">{alert.grupo}</div>
      <div className="alert-cell" data-label="Faltas">{alert.faltas}</div>
      <div className="alert-cell" data-label="Estado">
        <button 
          className={statusClass}
          onClick={() => onToggleStatus(alert.id, alert.estado)}
        >
          {alert.estado}
        </button>
      </div>
      <div className="alert-cell observations-cell" data-label="Observaciones">
        <textarea
          value={observationText}
          onChange={(e) => setObservationText(e.target.value)}
          placeholder="Añadir observación..."
        />
        <button 
          className="btn-save" 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </div>
  );
};

export default AlertRow;