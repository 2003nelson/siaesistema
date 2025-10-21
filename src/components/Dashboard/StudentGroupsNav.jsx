// src/components/Dashboard/StudentGroupsNav.jsx
import React from 'react';

const StudentGroupsNav = ({ semesters, selectedGroup, onGroupSelect }) => {
  return (
    <div className="card student-groups-nav">
      <h2 className="card-title">Salones y Grupos</h2>
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