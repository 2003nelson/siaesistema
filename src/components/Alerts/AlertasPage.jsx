// src/pages/AlertasPage.jsx
import React, { useState, useEffect } from 'react';

import DashboardControls from '../components/Dashboard/DashboardControls.jsx'; 
import AlertsTable from '../components/Alerts/AlertsTable.jsx';
import JustifyModal from '../components/Alerts/JustifyModal.jsx'; // Importa el modal

// --- NUEVA ESTRUCTURA DE DATOS DEFAULT (MOCK DATA) ---
const MOCK_ALERTS_DATA = {
  general: [
    { id: 3, nombre: 'Valentina Soto', grupo: '109', unjustifiedFaltas: 5, unjustifiedDates: ['2025-10-15', '2025-10-16', '2025-10-18', '2025-10-19', '2025-10-21'] },
    { id: 6, nombre: 'Javier Gómez', grupo: '503', unjustifiedFaltas: 4, unjustifiedDates: ['2025-10-10', '2025-10-11', '2025-10-17', '2025-10-20'] },
    { id: 1, nombre: 'Sofía Martínez', grupo: '103', unjustifiedFaltas: 3, unjustifiedDates: ['2025-10-05', '2025-10-06', '2025-10-22'] },
    { id: 7, nombre: 'Carlos Ruiz', grupo: '301', unjustifiedFaltas: 2, unjustifiedDates: ['2025-10-20', '2025-10-23'] },
    { id: 8, nombre: 'Ana Torres', grupo: '107', unjustifiedFaltas: 1, unjustifiedDates: ['2025-10-24'] },
  ],
  matutino: [
    { id: 3, nombre: 'Valentina Soto', grupo: '109', unjustifiedFaltas: 5, unjustifiedDates: ['2025-10-15', '2025-10-16', '2025-10-18', '2025-10-19', '2025-10-21'] },
    { id: 1, nombre: 'Sofía Martínez', grupo: '103', unjustifiedFaltas: 3, unjustifiedDates: ['2025-10-05', '2025-10-06', '2025-10-22'] },
  ],
  vespertino: [
     { id: 6, nombre: 'Javier Gómez', grupo: '503', unjustifiedFaltas: 4, unjustifiedDates: ['2025-10-10', '2025-10-11', '2025-10-17', '2025-10-20'] },
  ],
};
// --- FIN DE DATOS DEFAULT ---


const AlertasPage = () => {
  const [activeMode, setActiveMode] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [allAlertsList, setAllAlertsList] = useState([]); 
  const [filteredAlertsList, setFilteredAlertsList] = useState([]); 
  
  // --- NUEVOS ESTADOS ---
  const [expandedHistoryId, setExpandedHistoryId] = useState(null); // ID del alumno cuyo historial está expandido
  const [modalState, setModalState] = useState({ isOpen: false, studentId: null, studentName: '' }); // Estado para el modal

  // *** INTERRUPTOR #1: Cargar datos del TURNO ***
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      console.log(`Buscando alertas para: ${activeMode}`);
      try {
        // --- TODO: API GET /alertas?modo=... ---
        // Tu API debería devolver SOLO alumnos con unjustifiedFaltas > 0
        // y ya ORDENADOS por unjustifiedFaltas descendente.
        // También debería incluir unjustifiedDates.
        const data = MOCK_ALERTS_DATA[activeMode] || []; // Usa [] si no hay datos para ese modo
        // ----------------------------------------
        
        // La data ya viene filtrada y ordenada (según el TODO anterior)
        setAllAlertsList(data); 
        setFilteredAlertsList(data); 
        setSearchQuery(''); 
        setExpandedHistoryId(null); // Cierra historial al cambiar modo
        setModalState({ isOpen: false, studentId: null, studentName: '' }); // Cierra modal
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
    // Mantenemos el orden original (por faltas)
    setFilteredAlertsList(filtered);
    
    // --- TODO: API ---
    // Si la API hace la búsqueda, este useEffect desaparece y
    // searchQuery se añade como dependencia en el useEffect #1.
    // ---
  }, [searchQuery, allAlertsList]);

  // --- NUEVAS FUNCIONES ---

  // Función para abrir/cerrar el historial
  const toggleHistory = (studentId) => {
    setExpandedHistoryId(prevId => (prevId === studentId ? null : studentId));
  };

  // Función para abrir el modal de justificación
  const openJustifyModal = (studentId, studentName) => {
    setModalState({ isOpen: true, studentId, studentName });
  };

  // Función para cerrar el modal
  const closeJustifyModal = () => {
    setModalState({ isOpen: false, studentId: null, studentName: '' });
  };

  // *** INTERRUPTOR #3: Enviar justificación a la API ***
  const submitJustification = async (reason) => {
    const studentId = modalState.studentId;
    console.log(`API Call: Justificar faltas de ${studentId} con motivo: "${reason}"`);
    
    // --- TODO: AQUÍ VA TU CÓDIGO DE API (POST/PATCH /justificar) ---
    // Deberías enviar el studentId y el reason.
    // La API debería marcar las faltas como justificadas y devolver éxito/error.
    // await fetch(`https://tu-api.com/justificar/${studentId}`, {
    //   method: 'POST', // o PATCH
    //   body: JSON.stringify({ motivo: reason }),
    //   headers: { 'Content-Type': 'application/json' }
    // });
    // Aquí simula éxito después de 500ms
    await new Promise(resolve => setTimeout(resolve, 500));
    // --------------------------------------------------

    // Si la API tiene éxito, eliminamos al alumno de las listas locales
    setAllAlertsList(prevList => prevList.filter(alert => alert.id !== studentId));
    // setFilteredAlertsList se actualizará automáticamente por el useEffect #2
    
    closeJustifyModal(); // Cierra el modal
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
        <AlertsTable 
          alerts={filteredAlertsList} 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
          onOpenJustifyModal={openJustifyModal} // Pasar handler para abrir modal
          onToggleHistory={toggleHistory}       // Pasar handler para historial
          expandedHistoryId={expandedHistoryId} // Pasar ID del historial expandido
        />
      )}

      {/* Renderizamos el Modal (solo se muestra si isOpen es true) */}
      <JustifyModal 
        isOpen={modalState.isOpen}
        onClose={closeJustifyModal}
        studentName={modalState.studentName}
        onSubmit={submitJustification} // Pasar el "interruptor" de submit
      />
    </main>
  );
};

export default AlertasPage;