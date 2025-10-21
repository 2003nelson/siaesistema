// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';

import DashboardControls from '../components/Dashboard/DashboardControls.jsx';
import StatsCard from '../components/Dashboard/StatsCard.jsx';
import StudentGroupsNav from '../components/Dashboard/StudentGroupsNav.jsx';
import GroupAttendanceCard from '../components/Dashboard/GroupAttendanceCard.jsx';

// --- DATOS DEFAULT (MOCK DATA) ---
const SALONES_SEMESTRES = {
  '1er Semestre': ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110'],
  '3er Semestre': ['301', '302', '303', '304', '305', '306', '307', '308'],
  '5to Semestre': ['501', '502', '503', '504', '505', '506', '507'],
};
const MOCK_ATTENDANCE_DATA = {
  '101': { totalStudents: 35, attendance: { week: 98.0, month: 95.5, semester: 92.5 } },
  '102': { totalStudents: 32, attendance: { week: 91.0, month: 89.0, semester: 88.0 } },
  '103': { totalStudents: 30, attendance: { week: 100.0, month: 97.2, semester: 95.1 } },
  '104': { totalStudents: 33, attendance: { week: 88.5, month: 90.0, semester: 90.0 } },
  '105': { totalStudents: 31, attendance: { week: 95.0, month: 94.1, semester: 93.7 } },
  '106': { totalStudents: 34, attendance: { week: 90.0, month: 91.0, semester: 91.2 } },
  '107': { totalStudents: 29, attendance: { week: 85.0, month: 88.2, semester: 89.5 } },
  '108': { totalStudents: 36, attendance: { week: 99.0, month: 97.5, semester: 96.0 } },
  '109': { totalStudents: 32, attendance: { week: 92.0, month: 91.0, semester: 90.5 } },
  '110': { totalStudents: 30, attendance: { week: 96.0, month: 95.0, semester: 94.8 } },
  '301': { totalStudents: 28, attendance: { week: 89.0, month: 88.1, semester: 87.2 } },
  '302': { totalStudents: 27, attendance: { week: 94.0, month: 92.5, semester: 91.8 } },
  '303': { totalStudents: 29, attendance: { week: 80.0, month: 83.0, semester: 85.5 } },
  '304': { totalStudents: 30, attendance: { week: 95.0, month: 94.0, semester: 93.0 } },
  '305': { totalStudents: 26, attendance: { week: 90.0, month: 89.5, semester: 89.0 } },
  '306': { totalStudents: 28, attendance: { week: 92.0, month: 91.0, semester: 90.2 } },
  '307': { totalStudents: 25, attendance: { week: 93.0, month: 92.5, semester: 92.1 } },
  '308': { totalStudents: 27, attendance: { week: 85.0, month: 87.0, semester: 88.7 } },
  '501': { totalStudents: 24, attendance: { week: 98.0, month: 96.0, semester: 94.0 } },
  '502': { totalStudents: 23, attendance: { week: 90.0, month: 90.5, semester: 90.8 } },
  '503': { totalStudents: 22, attendance: { week: 99.0, month: 97.0, semester: 95.5 } },
  '504': { totalStudents: 25, attendance: { week: 88.0, month: 90.0, semester: 91.5 } },
  '505': { totalStudents: 26, attendance: { week: 81.0, month: 85.0, semester: 87.0 } },
  '506': { totalStudents: 21, attendance: { week: 95.0, month: 94.0, semester: 93.3 } },
  '507': { totalStudents: 24, attendance: { week: 91.0, month: 90.0, semester: 89.8 } },
};
// ESTE MOCK SIMULA LA RESPUESTA DE LA API PARA EL *TURNO*
const MOCK_API_DATA_BY_TURN = {
  general: {
    stats: { totalStudents: 1250, averageAttendance: 94.5 },
    groups: SALONES_SEMESTRES,
  },
  matutino: {
    stats: { totalStudents: 680, averageAttendance: 95.2 },
    groups: SALONES_SEMESTRES,
  },
  vespertino: {
    stats: { totalStudents: 570, averageAttendance: 93.8 },
    groups: SALONES_SEMESTRES,
  },
};
// --- FIN DE DATOS DEFAULT ---


const DashboardPage = () => {
  const [activeMode, setActiveMode] = useState('general');
  const [statsData, setStatsData] = useState({ totalStudents: 0, averageAttendance: 0.0 });
  const [semestersData, setSemestersData] = useState({});
  const [selectedGroup, setSelectedGroup] = useState(null);
  
  // -- Nuevos Estados --
  // 'semester' es el valor por defecto: 'week', 'month', 'semester'
  const [attendancePeriod, setAttendancePeriod] = useState('semester');
  // Estado para guardar el dato específico de asistencia
  const [groupAttendanceData, setGroupAttendanceData] = useState(null);
  // Estados de carga separados
  const [isTurnLoading, setIsTurnLoading] = useState(true);
  const [isGroupLoading, setIsGroupLoading] = useState(false);

  
  // *** INTERRUPTOR #1: Cargar datos del TURNO (General, Matutino, etc.) ***
  useEffect(() => {
    setIsTurnLoading(true);
    const fetchTurnData = async () => {
      console.log(`Buscando datos del TURNO: ${activeMode}`);
      try {
        // --- TODO: AQUÍ VA TU API (GET /datos_turno?modo=...) ---
        const apiData = MOCK_API_DATA_BY_TURN[activeMode];
        // ----------------------------------------
        setStatsData(apiData.stats);
        setSemestersData(apiData.groups);
        setSelectedGroup(null); // Resetea el grupo
        setGroupAttendanceData(null); // Limpia los datos de asistencia
      } catch (error) {
        console.error("Error al obtener datos del turno:", error);
      } finally {
        setIsTurnLoading(false);
      }
    };
    
    const timer = setTimeout(() => fetchTurnData(), 300);
    return () => clearTimeout(timer);
    
  }, [activeMode]); // Se ejecuta solo cuando 'activeMode' cambia


  // *** INTERRUPTOR #2: Cargar datos de ASISTENCIA POR GRUPO/PERIODO ***
  useEffect(() => {
    // No hacer nada si no hay un grupo seleccionado
    if (!selectedGroup) {
      setGroupAttendanceData(null);
      return;
    }

    setIsGroupLoading(true); // Activa la carga solo para la tarjeta de asistencia
    
    const fetchGroupData = async () => {
      console.log(`Buscando datos del GRUPO: ${selectedGroup} (Periodo: ${attendancePeriod})`);
      try {
        // --- TODO: AQUÍ VA TU API (GET /asistencia_grupo?grupo=...&periodo=...) ---
        // const response = await fetch(`https://tu-api.com/asistencia?grupo=${selectedGroup}&periodo=${attendancePeriod}`);
        // const data = await response.json();
        
        // Simulamos la respuesta de la API buscando en nuestro MOCK
        const allGroupData = MOCK_ATTENDANCE_DATA[selectedGroup];
        const data = {
          totalStudents: allGroupData.totalStudents,
          // Devolvemos solo el dato de asistencia que pedimos
          attendance: {
            [attendancePeriod]: allGroupData.attendance[attendancePeriod]
          }
        };
        // ----------------------------------------

        setGroupAttendanceData(data); // Guardamos la respuesta
        
      } catch (error) {
        console.error("Error al obtener datos de asistencia:", error);
      } finally {
        setIsGroupLoading(false); // Desactiva la carga
      }
    };

    // Simulamos un retraso de red para la llamada al grupo
    const groupTimer = setTimeout(() => fetchGroupData(), 400);
    return () => clearTimeout(groupTimer);

  }, [selectedGroup, attendancePeriod]); // <-- Se ejecuta si cambia el grupo O el período


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
              semesters={semestersData}
              selectedGroup={selectedGroup}
              onGroupSelect={handleSelectGroup} // Usamos el nuevo handler
            />
          </div>
          
          <div className="group-attendance-section">
            <GroupAttendanceCard 
              groupName={selectedGroup}
              attendanceData={groupAttendanceData} // Le pasamos los datos específicos
              selectedPeriod={attendancePeriod}
              onPeriodChange={setAttendancePeriod} // Le pasamos el "interruptor"
              isLoading={isGroupLoading} // Le pasamos el estado de carga
            />
          </div>
        </>
      )}
    </main>
  );
};

export default DashboardPage;