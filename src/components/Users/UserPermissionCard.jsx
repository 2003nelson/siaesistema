// src/components/Users/UserPermissionCard.jsx
import React from 'react';

// Un diccionario para "traducir" las llaves de permisos a texto legible
const PERMISSION_LABELS = {
  canViewDashboard: 'Ver Dashboard Principal',
  canManageAlerts: 'Gestionar Alertas (Justificar Faltas)',
  canEditStudents: 'Editar Info. de Estudiantes',
  canManageUsers: 'Gestionar Usuarios (esta página)',
};

const UserPermissionCard = ({ user, onPermissionChange }) => {

  // Esta función se llama cuando se hace clic en un interruptor
  const handleToggle = (permissionKey, currentValue) => {
    // Llama al "interruptor" de la página principal
    onPermissionChange(user.id, permissionKey, !currentValue);
  };

  return (
    <div className="user-card">
      <div className="user-card-header">
        <h3 className="user-name">{user.name}</h3>
        <span className="user-role">{user.role}</span>
      </div>
      <div className="permission-list">
        <h4 className="permission-list-title">Permisos Asignados:</h4>
        {Object.entries(user.permissions).map(([key, value]) => (
          <div key={key} className="permission-item">
            <span className="permission-label">
              {PERMISSION_LABELS[key] || key}
            </span>
            
            {/* El interruptor (toggle switch) */}
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={value}
                onChange={() => handleToggle(key, value)}
              />
              <span className="slider"></span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPermissionCard;