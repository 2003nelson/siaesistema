import React from 'react';

// --- CAMBIO 1 ---
// El componente 'PermissionToggle' ya no acepta ni renderiza la prop 'description'
const PermissionToggle = ({ label, isChecked, onChange }) => {
    const id = `toggle-${label.replace(/\s+/g, '-')}`;
    return (
        <div className="permission-toggle-item">
            <div className="permission-toggle-label">
                <label htmlFor={id}>{label}</label>
                {/* La línea <p className="permission-description">... se ha eliminado */}
            </div>
            <div className="toggle-switch">
                <input
                    type="checkbox"
                    id={id}
                    checked={isChecked}
                    onChange={onChange}
                />
                <label htmlFor={id} className="slider"></label>
            </div>
        </div>
    );
};

// Componente principal de la tarjeta
const UserPermissionCard = ({ user, onPermissionChange }) => {
    
    // Handler que avisa a la página padre (GestionUsuariosPage) sobre un cambio
    const handleChange = (permissionKey) => {
        const newValue = !user.permissions[permissionKey];
        // Llama a la función 'handlePermissionChange' de la página padre
        onPermissionChange(user.id, permissionKey, newValue);
    };

    return (
        <div className="user-permission-card card">
            <div className="user-info-header">
                <h3 className="user-name">{user.full_name || user.username}</h3>
                <span className="user-role-badge">{user.role}</span>
                <span className="user-username">(@{user.username})</span>
            </div>
            
            <div className="permissions-list">
                {/* --- CAMBIO 2 --- */}
                {/* Se eliminaron las props 'description' de todos los toggles */}
                <PermissionToggle
                    label="Ver Dashboard"
                    isChecked={user.permissions.canViewDashboard}
                    onChange={() => handleChange('canViewDashboard')}
                />
                <PermissionToggle
                    label="Gestionar Alertas"
                    isChecked={user.permissions.canManageAlerts}
                    onChange={() => handleChange('canManageAlerts')}
                />
                <PermissionToggle
                    label="Editar Estudiantes"
                    isChecked={user.permissions.canEditStudents}
                    onChange={() => handleChange('canEditStudents')}
                />
                <PermissionToggle
                    label="Gestionar Usuarios"
                    isChecked={user.permissions.canManageUsers}
                    onChange={() => handleChange('canManageUsers')}
                />
            </div>
        </div>
    );
};

export default UserPermissionCard;