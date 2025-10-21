// src/pages/AlertasPage.jsx
import React, { useState, useEffect } from 'react';

// Reutilizamos los controles del dashboard
import DashboardControls from '../components/Dashboard/DashboardControls'; 
import AlertsTable from '../components/Alerts/AlertsTable';

// --- DATOS DEFAULT (MOCK DATA) ---
const MOCK_ALERTS_DATA = {
  general: [
    { id: 1, nombre: 'Sofía Martínez', grupo: '9A', faltas: 3, estado: 'No Justificado', observaciones: '' },
    { id: 2, nombre: 'Alejandro Pérez', grupo: '10B', faltas: 1, estado: 'Justificado', observaciones: 'Cita médica' },
    { id: 3, nombre: 'Valentina Soto', grupo: '9A', faltas: 5, estado: 'No Justificado', observaciones: 'Contactar a tutor' },
    { id: 4, nombre: 'Miguel Ángel Rico', grupo: '11C', faltas: 2, estado: 'Justificado', observaciones: '' },
    { id: 5, nombre: 'Lucía Fernández', grupo: '10B', faltas: 1, estado: 'Justificado', observaciones: '' },
    { id: 6, nombre: 'Javier Gómez', grupo: '11C', faltas: 4, estado: 'No Justificado', observaciones: '' },
  ],
  matutino: [
    { id: 1, nombre: 'Sofía Martínez', grupo: '9A', faltas: 3, estado: 'No Justificado', observaciones: '' },
    { id: 3, nombre: 'Valentina Soto', grupo: '9A', faltas: 5, estado: 'No Justificado', observaciones: 'Contactar a tutor' },
  ],
  vespertino: [
    { id: 2, nombre: 'Alejandro Pérez', grupo: '10B', faltas: 1, estado: 'Justificado', observaciones: 'Cita médica' },
    { id: 4, nombre: 'Miguel Ángel Rico', grupo: '11C', faltas: 2, estado: 'Justificado', observaciones: '' },
  ],
};
// --- FIN DE DATOS DEFAULT ---


const AlertasPage = () => {
  const [activeMode, setActiveMode] = useState('general');
  const [alertsList, setAlertsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // *** INTERRUPTOR DE API (useEffect) ***
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      console.log(`Buscando alertas para: ${activeMode}`);
      try {
        // --- TODO: AQUÍ VA TU CÓDIGO DE API (GET) ---
        // const response = await fetch(`https://tu-api.com/alertas?modo=${activeMode}`);
        // const data = await response.json();
        
        // Usamos los DATOS DEFAULT por ahora
        const data = MOCK_ALERTS_DATA[activeMode];
        // ----------------------------------------
        
        setAlertsList(data);
      } catch (error) {
        console.error("Error al obtener alertas:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Simulamos retraso de red
    const timer = setTimeout(() => fetchData(), 300);
    return () => clearTimeout(timer);
    
  }, [activeMode]); // Se ejecuta cada vez que 'activeMode' cambia

  // *** INTERRUPTOR DE API (CAMBIAR ESTADO) ***
  const handleToggleStatus = (alertId, currentStatus) => {
    const newStatus = currentStatus === 'Justificado' ? 'No Justificado' : 'Justificado';
    console.log(`API Call: Cambiar estado de ${alertId} a ${newStatus}`);
    
    // --- TODO: AQUÍ VA TU CÓDIGO DE API (PUT/PATCH) ---
    // await fetch(`https://tu-api.com/alertas/${alertId}/estado`, {
    //   method: 'PATCH',
    //   body: JSON.stringify({ estado: newStatus }),
    //   headers: { 'Content-Type': 'application/json' }
    // });
    // --------------------------------------------------

    // Actualizamos el estado local para que se vea el cambio
    setAlertsList(currentList =>
      currentList.map(alert =>
        alert.id === alertId ? { ...alert, estado: newStatus } : alert
      )
    );
  };

  // *** INTERRUPTOR DE API (GUARDAR OBSERVACIÓN) ***
  const handleSaveObservation = (alertId, observationText) => {
    console.log(`API Call: Guardar observación de ${alertId}: "${observationText}"`);
    
    // --- TODO: AQUÍ VA TU CÓDIGO DE API (PUT/PATCH) ---
    // await fetch(`https://tu-api.com/alertas/${alertId}/observacion`, {
    //   method: 'PATCH',
    //   body: JSON.stringify({ observacion: observationText }),
    //   headers: { 'Content-Type': 'application/json' }
    // });
    // --------------------------------------------------
    
    // Actualizamos el estado local
    setAlertsList(currentList =>
      currentList.map(alert =>
        alert.id === alertId ? { ...alert, observaciones: observationText } : alert
      )
    );
  };


  return (
    <main className="dashboard-main">
      <div className="page-title-container">
        <h1 className="page-title">Panel de Gestión de Alertas</h1>
        <div className="title-decorator"></div>
      </div>

      {/* Reutilizamos los controles de filtro */}
      <DashboardControls 
        activeMode={activeMode}
        onModeChange={setActiveMode}
      />

      {isLoading ? (
        <div className="loading-message">Cargando alertas...</div>
      ) : (
        <AlertsTable 
          alerts={alertsList}
          onToggleStatus={handleToggleStatus}
          onSaveObservation={handleSaveObservation}
        />
      )}
    </main>
  );
};

export default AlertasPage;