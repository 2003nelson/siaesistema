// src/pages/AlertasPage.jsx
import React, { useState, useEffect } from 'react';

import DashboardControls from '../components/Dashboard/DashboardControls.jsx'; 
import AlertsTable from '../components/Alerts/AlertsTable.jsx';
// *** ¡FALTABA ESTE IMPORT! ***
import JustifyModal from '../components/Alerts/JustifyModal.jsx'; 

// --- NUEVA ESTRUCTURA DE DATOS DEFAULT (MOCK DATA) ---
const MOCK_ALERTS_DATA = {
  general: [
    { id: 3, nombre: 'Valentina Soto', grupo: '9A', unjustifiedFaltas: 5, unjustifiedDates: ['2025-10-15', '2025-10-16', '2025-10-18', '2025-10-19', '2025-10-21'] },
    { id: 6, nombre: 'Javier Gómez', grupo: '11C', unjustifiedFaltas: 4, unjustifiedDates: ['2025-10-10', '2025-10-11', '2025-10-17', '2025-10-20'] },
    { id: 1, nombre: 'Sofía Martínez', grupo: '9A', unjustifiedFaltas: 3, unjustifiedDates: ['2025-10-05', '2025-10-06', '2025-10-22'] },
  ],
  matutino: [
    { id: 3, nombre: 'Valentina Soto', grupo: '9A', unjustifiedFaltas: 5, unjustifiedDates: ['2025-10-15', '2025-10-16', '2025-10-18', '2025-10-19', '2025-10-21'] },
    { id: 1, nombre: 'Sofía Martínez', grupo: '9A', unjustifiedFaltas: 3, unjustifiedDates: ['2025-10-05', '2025-10-06', '2025-10-22'] },
  ],
  vespertino: [
     { id: 6, nombre: 'Javier Gómez', grupo: '11C', unjustifiedFaltas: 4, unjustifiedDates: ['2025-10-10', '2025-10-11', '2025-10-17', '2025-10-20'] },
  ],
};
// --- FIN DE DATOS DEFAULT ---


const AlertasPage = () => {
  const [activeMode, setActiveMode] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [allAlertsList, setAllAlertsList] = useState([]); 
  const [filteredAlertsList, setFilteredAlertsList] = useState([]); 
  
  // --- ¡FALTABAN ESTOS ESTADOS! ---
  const [expandedHistoryId, setExpandedHistoryId] = useState(null); 
  const [modalState, setModalState] = useState({ isOpen: false, studentId: null, studentName: '' }); 

  // *** INTERRUPTOR #1: Cargar datos del TURNO ***
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      console.log(`Buscando alertas para: ${activeMode}`);
      try {
        // --- TODO: API GET /alertas?modo=... ---
        const data = MOCK_ALERTS_DATA[activeMode] || []; 
        // ----------------------------------------
        
        setAllAlertsList(data); 
        setFilteredAlertsList(data); 
        setSearchQuery(''); 
        // *** ¡FALTABA ESTO! ***
        setExpandedHistoryId(null); 
        setModalState({ isOpen: false, studentId: null, studentName: '' }); 
      } catch (error) {
        console.error("Error al obtener alertas:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const timer = setTimeout(() => fetchData(), 300);
    return () => clearTimeout(timer);
    
  }, [activeMode]); 

  // *** INTERRUPTOR #2: Filtrar localmente por búsqueda ***
  useEffect(() => {
    const filtered = allAlertsList.filter(alert =>
      alert.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAlertsList(filtered);
    // --- TODO: API ---
  }, [searchQuery, allAlertsList]);

  // --- ¡FALTABAN ESTAS FUNCIONES! ---
  const toggleHistory = (studentId) => {
    setExpandedHistoryId(prevId => (prevId === studentId ? null : studentId));
  };

  const openJustifyModal = (studentId, studentName) => {
    setModalState({ isOpen: true, studentId, studentName });
  };

  const closeJustifyModal = () => {
    setModalState({ isOpen: false, studentId: null, studentName: '' });
  };

  // *** INTERRUPTOR #3: Enviar justificación a la API ***
  const submitJustification = async (reason) => {
    const studentId = modalState.studentId;
    console.log(`API Call: Justificar faltas de ${studentId} con motivo: "${reason}"`);
    
    // --- TODO: AQUÍ VA TU CÓDIGO DE API (POST/PATCH /justificar) ---
    await new Promise(resolve => setTimeout(resolve, 500));
    // --------------------------------------------------

    // Eliminamos al alumno de las listas locales
    setAllAlertsList(prevList => prevList.filter(alert => alert.id !== studentId));
    // filteredAlertsList se actualiza en el useEffect #2
    
    closeJustifyModal(); 
  };
  // --- FIN NUEVAS FUNCIONES ---


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
        // *** ¡FALTABAN ESTOS PROPS! ***
        <AlertsTable 
          alerts={filteredAlertsList} 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
          onOpenJustifyModal={openJustifyModal} 
          onToggleHistory={toggleHistory}       
          expandedHistoryId={expandedHistoryId} 
        />
      )}

      {/* *** ¡FALTABA ESTE COMPONENTE! *** */}
      <JustifyModal 
        isOpen={modalState.isOpen}
        onClose={closeJustifyModal}
        studentName={modalState.studentName}
        onSubmit={submitJustification} 
      />
    </main>
  );
};

export default AlertasPage;