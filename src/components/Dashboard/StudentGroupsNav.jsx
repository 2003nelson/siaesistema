// src/components/Dashboard/StudentGroupsNav.jsx
import React from 'react';

// 1. Añade un nuevo prop opcional: showAllOption (con valor por defecto false)
const StudentGroupsNav = ({ semesters, selectedGroup, onGroupSelect, showAllOption = false }) => {
  return (
    // 2. Añade una clase 'filter-variant' para estilos específicos si es necesario
    <div className="card student-groups-nav filter-variant">
      <h2 className="card-title">Salones y Grupos</h2>

      {/* 3. Añade el botón "Todos" condicionalmente */}
      {showAllOption && (
        <div className="group-buttons all-groups-button">
          <button
            // Comprueba si 'all' es el grupo seleccionado
            className={`group-btn ${selectedGroup === 'all' ? 'active' : ''}`}
            // Llama a onGroupSelect con 'all'
            onClick={() => onGroupSelect('all')}
          >
            Mostrar Todos
          </button>
        </div>
      )}
      {/* --- Fin Botón Todos --- */}

      <div className="semesters-container">
        {Object.entries(semesters).map(([semesterName, groups]) => (
          <div key={semesterName} className="semester-section">
            <h3 className="semester-title">{semesterName}</h3>
            <div className="group-buttons">
              {groups.map((group) => (
                <button
                  key={group}
                  className={`group-btn ${selectedGroup === group ? 'active' : ''}`}
                  onClick={() => onGroupSelect(group)}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentGroupsNav;