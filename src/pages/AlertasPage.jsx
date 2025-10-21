// src/pages/AlertasPage.jsx
import React, { useState, useEffect } from 'react';

import DashboardControls from '../components/Dashboard/DashboardControls.jsx'; 
import AlertsTable from '../components/Alerts/AlertsTable.jsx';

// ... (MOCK_ALERTS_DATA se queda exactamente igual que antes) ...
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

const AlertasPage = () => {
  const [activeMode, setActiveMode] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  
  // --- NUEVOS ESTADOS PARA BÚSQUEDA ---
  const [searchQuery, setSearchQuery] = useState(''); // Estado para el texto de búsqueda
  const [allAlertsList, setAllAlertsList] = useState([]); // Lista completa de la API
  const [filteredAlertsList, setFilteredAlertsList] = useState([]); // Lista filtrada para mostrar

  // *** INTERRUPTOR #1: Cargar datos del TURNO (General, Matutino, etc.) ***
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      console.log(`Buscando alertas para: ${activeMode}`);
      try {
        // --- TODO: INTERRUPTOR DE API (GET) ---
        // En un futuro, tu API podría recibir el 'searchQuery' aquí:
        // const response = await fetch(`.../alertas?modo=${activeMode}&search=${searchQuery}`);
        // const data = await response.json();
        
        // Usamos los DATOS DEFAULT por ahora
        const data = MOCK_ALERTS_DATA[activeMode];
        // ----------------------------------------
        
        setAllAlertsList(data); // Guardamos la lista completa
        setFilteredAlertsList(data); // Inicialmente, la lista filtrada es la misma
        setSearchQuery(''); // Limpiamos la búsqueda al cambiar de modo
      } catch (error) {
        console.error("Error al obtener alertas:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const timer = setTimeout(() => fetchData(), 300);
    return () => clearTimeout(timer);
    
  }, [activeMode]); // Se ejecuta solo cuando 'activeMode' cambia

  // *** INTERRUPTOR #2: Filtrar la lista localmente (Lógica Mock) ***
  useEffect(() => {
    // Esta lógica filtra la lista 'allAlertsList' cada vez que 'searchQuery' cambia
    // y guarda el resultado en 'filteredAlertsList'.
    const filtered = allAlertsList.filter(alert =>
      alert.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAlertsList(filtered);
    
    // --- TODO: INTERRUPTOR DE API ---
    // Cuando conectes tu API, borrarías este 'useEffect'
    // y añadirías 'searchQuery' como dependencia en el 'useEffect' de arriba
    // (posiblemente con un "debounce" para no llamar a la API en cada tecla).
    // ---
  }, [searchQuery, allAlertsList]); // Se ejecuta si la búsqueda o la lista cambian


  // ... (handleToggleStatus y handleSaveObservation se quedan igual) ...
  const handleToggleStatus = (alertId, currentStatus) => {
    const newStatus = currentStatus === 'Justificado' ? 'No Justificado' : 'Justificado';
    console.log(`API Call: Cambiar estado de ${alertId} a ${newStatus}`);
    
    // Actualizamos ambas listas para mantener consistencia
    const updateList = (list) => 
      list.map(alert =>
        alert.id === alertId ? { ...alert, estado: newStatus } : alert
      );
    setAllAlertsList(updateList);
    setFilteredAlertsList(updateList);
  };

  const handleSaveObservation = (alertId, observationText) => {
    console.log(`API Call: Guardar observación de ${alertId}: "${observationText}"`);
    
    const updateList = (list) => 
      list.map(alert =>
        alert.id === alertId ? { ...alert, observaciones: observationText } : alert
      );
    setAllAlertsList(updateList);
    setFilteredAlertsList(updateList);
  };


  return (
    <main className="dashboard-main">
      <div className="page-title-container">
        <h1 className="page-title">Panel de Gestión de Alertas</h1>
        <div className="title-decorator"></div>
      </div>

      <DashboardControls 
        activeMode={activeMode}
        onModeChange={setActiveMode}
      />

      {isLoading ? (
        <div className="loading-message">Cargando alertas...</div>
      ) : (
        <AlertsTable 
          alerts={filteredAlertsList} // Pasamos la lista FILTRADA
          searchQuery={searchQuery} // Pasamos el valor de la búsqueda
          onSearchChange={setSearchQuery} // Pasamos el "interruptor" para cambiar el valor
          onToggleStatus={handleToggleStatus}
          onSaveObservation={handleSaveObservation}
        />
      )}
    </main>
  );
};

export default AlertasPage;