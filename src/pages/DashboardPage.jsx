import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios'; // ¡Importamos nuestro cliente API!

import DashboardControls from '../components/Dashboard/DashboardControls.jsx';
import StatsCard from '../components/Dashboard/StatsCard.jsx';
import StudentGroupsNav from '../components/Dashboard/StudentGroupsNav.jsx';
import GroupAttendanceCard from '../components/Dashboard/GroupAttendanceCard.jsx';

// --- LISTA FIJA DE SALONES ---
// Esta lista ahora define los botones que se mostrarán en el dashboard.
// La API ya no decide qué salones existen, solo da estadísticas.
const TODOS_LOS_SALONES = {
  '1er Semestre': ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110'],
  '2do Semestre': ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210'],
  '3er Semestre': ['301', '302', '303', '304', '305', '306', '307', '308'],
  '4to Semestre': ['401', '402', '403', '404', '405', '406', '407', '408'],
  '5to Semestre': ['501', '502', '503', '504', '505', '506', '507'],
  '6to Semestre': ['601', '602', '603', '604', '605', '606', '607'],
};
// --- FIN DE LISTA FIJA ---


const DashboardPage = () => {
  const [activeMode, setActiveMode] = useState('general');
  const [statsData, setStatsData] = useState({ totalStudents: 0, averageAttendance: 0.0 });
  
  // --- CAMBIO: 'semestersData' AHORA USA LA LISTA FIJA ---
  const [semestersData, setSemestersData] = useState(TODOS_LOS_SALONES);
  // ---------------------------------------------------

  const [selectedGroup, setSelectedGroup] = useState(null);
  
  const [attendancePeriod, setAttendancePeriod] = useState('semester');
  const [groupAttendanceData, setGroupAttendanceData] = useState(null);
  const [isTurnLoading, setIsTurnLoading] = useState(true);
  const [isGroupLoading, setIsGroupLoading] = useState(false);

  
  // *** INTERRUPTOR #1: Cargar datos del TURNO (StatsCard) ***
  useEffect(() => {
    setIsTurnLoading(true);
    const fetchTurnData = async () => {
      try {
        // --- CAMBIO: La API solo trae las estadísticas ---
        const response = await apiClient.get(`/dashboard/turno?modo=${activeMode}`);
        const apiData = response.data;
        // ----------------------------------------
        
        // Solo actualizamos las estadísticas
        setStatsData(apiData.stats); 
        
        // Ya NO actualizamos 'semestersData', porque es fijo
        // setSemestersData(apiData.groups); // <--- LÍNEA ELIMINADA
        
        setSelectedGroup(null); 
        setGroupAttendanceData(null); 
      } catch (error) {
        console.error("Error al obtener datos del turno:", error);
        // Si falla (ej. 404), mostrar datos vacíos
        setStatsData({ totalStudents: 0, averageAttendance: 0.0 });
        // No tocamos semestersData, se queda con la lista fija
      } finally {
        setIsTurnLoading(false);
      }
    };
    
    fetchTurnData();
    
  }, [activeMode]); // Se ejecuta solo cuando 'activeMode' cambia


  // *** INTERRUPTOR #2: Cargar datos de ASISTENCIA POR GRUPO/PERIODO ***
  // (Esta lógica no cambia, sigue funcionando igual)
  useEffect(() => {
    if (!selectedGroup) {
      setGroupAttendanceData(null);
      return;
    }

    setIsGroupLoading(true);
    
    const fetchGroupData = async () => {
      try {
        const response = await apiClient.get(
          `/dashboard/grupo/${selectedGroup}?periodo=${attendancePeriod}`
        );
        const data = response.data;
        setGroupAttendanceData(data);
        
      } catch (error) {
        console.error("Error al obtener datos de asistencia:", error);
        // Si falla (ej. 404), seteamos a null para que la tarjeta muestre "0"
        setGroupAttendanceData(null);
      } finally {
        setIsGroupLoading(false); 
      }
    };

    fetchGroupData();

  }, [selectedGroup, attendancePeriod]);


  // Wrapper para el selector de grupo que resetea el período
  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setAttendancePeriod('semester'); // Resetea el filtro a 'Total Semestre'
  };


  return (
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
              semesters={semestersData} // Pasa la lista fija de salones
              selectedGroup={selectedGroup}
              onGroupSelect={handleSelectGroup}
            />
          </div>
          
          <div className="group-attendance-section">
            <GroupAttendanceCard 
              groupName={selectedGroup}
              attendanceData={groupAttendanceData} // Pasa los datos (o null si no hay)
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