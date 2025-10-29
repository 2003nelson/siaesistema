import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios'; // ¡Importamos nuestro cliente API!

import DashboardControls from '../components/Dashboard/DashboardControls.jsx';
import StatsCard from '../components/Dashboard/StatsCard.jsx';
import StudentGroupsNav from '../components/Dashboard/StudentGroupsNav.jsx';
import GroupAttendanceCard from '../components/Dashboard/GroupAttendanceCard.jsx';

// --- DATOS DEFAULT (MOCK DATA) ---
// ¡Ya no necesitamos los mocks de datos! Los hemos movido al backend.
// --- FIN DE DATOS DEFAULT ---


const DashboardPage = () => {
  const [activeMode, setActiveMode] = useState('general');
  const [statsData, setStatsData] = useState({ totalStudents: 0, averageAttendance: 0.0 });
  const [semestersData, setSemestersData] = useState({});
  const [selectedGroup, setSelectedGroup] = useState(null);
  
  // -- Nuevos Estados --
  const [attendancePeriod, setAttendancePeriod] = useState('semester');
  const [groupAttendanceData, setGroupAttendanceData] = useState(null);
  const [isTurnLoading, setIsTurnLoading] = useState(true);
  const [isGroupLoading, setIsGroupLoading] = useState(false);

  
  // *** INTERRUPTOR #1: Cargar datos del TURNO (General, Matutino, etc.) ***
  useEffect(() => {
    setIsTurnLoading(true);
    const fetchTurnData = async () => {
      console.log(`Buscando datos del TURNO: ${activeMode}`);
      try {
        // --- ¡AQUÍ ESTÁ LA MAGIA! ---
        // Llamamos a nuestro endpoint protegido
        const response = await apiClient.get(`/dashboard/turno?modo=${activeMode}`);
        const apiData = response.data;
        // ----------------------------------------
        setStatsData(apiData.stats);
        setSemestersData(apiData.groups);
        setSelectedGroup(null); 
        setGroupAttendanceData(null); 
      } catch (error) {
        console.error("Error al obtener datos del turno:", error);
      } finally {
        setIsTurnLoading(false);
      }
    };
    
    // Ya no usamos el timer, llamamos a la API directamente
    fetchTurnData();
    
  }, [activeMode]); // Se ejecuta solo cuando 'activeMode' cambia


  // *** INTERRUPTOR #2: Cargar datos de ASISTENCIA POR GRUPO/PERIODO ***
  useEffect(() => {
    if (!selectedGroup) {
      setGroupAttendanceData(null);
      return;
    }

    setIsGroupLoading(true);
    
    const fetchGroupData = async () => {
      console.log(`Buscando datos del GRUPO: ${selectedGroup} (Periodo: ${attendancePeriod})`);
      try {
        // --- ¡AQUÍ ESTÁ LA OTRA LLAMADA A LA API! ---
        const response = await apiClient.get(
          `/dashboard/grupo/${selectedGroup}?periodo=${attendancePeriod}`
        );
        const data = response.data;
        // ----------------------------------------

        setGroupAttendanceData(data); // Guardamos la respuesta
        
      } catch (error) {
        console.error("Error al obtener datos de asistencia:", error);
      } finally {
        setIsGroupLoading(false); 
      }
    };

    fetchGroupData();

  }, [selectedGroup, attendancePeriod]); // <-- Se ejecuta si cambia el grupo O el período


  // Wrapper para el selector de grupo que resetea el período
  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setAttendancePeriod('semester'); // Resetea el filtro a 'Total Semestre'
  };


  return (
    // ... Tu JSX se queda EXACTAMENTE IGUAL ...
    <main className="dashboard-main">
      <div className="page-title-container">
        <h1 className="page-title">INICIO</h1>
        <div className="title-decorator"></div>
      </div>

      <DashboardControls 
        activeMode={activeMode}
        onModeChange={setActiveMode}
      />

      {isTurnLoading ? (
        <div className="loading-message">Cargando datos del turno...</div>
      ) : (
        <>
          <div className="widgets-grid">
            <StatsCard 
              title={`Datos de la Sección ${activeMode}`}
              totalStudents={statsData.totalStudents}
              averageAttendance={statsData.averageAttendance}
            />
            <StudentGroupsNav 
              semesters={semestersData}
Copiado
              selectedGroup={selectedGroup}
              onGroupSelect={handleSelectGroup}
            />
          </div>
          
          <div className="group-attendance-section">
            <GroupAttendanceCard 
              groupName={selectedGroup}
              attendanceData={groupAttendanceData}
              selectedPeriod={attendancePeriod}
              onPeriodChange={setAttendancePeriod}
              isLoading={isGroupLoading}
            />
          </div>
        </>
      )}
    </main>
  );
};

export default DashboardPage;