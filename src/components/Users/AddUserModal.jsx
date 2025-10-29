// src/components/Users/AddUserModal.jsx
import React, { useState } from 'react';

// 'onSubmit' is the "interruptor" function from GestionUsuariosPage
const AddUserModal = ({ isOpen, onClose, onSubmit }) => {
    // State for each form field
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [nip, setNip] = useState(''); // Assuming NIP is like a PIN
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null); // To display potential errors

    if (!isOpen) {
        return null;
    }

    const clearForm = () => {
        setName('');
        setRole('');
        setPassword('');
        setNip('');
        setError(null);
        setIsSaving(false);
    };

    const handleClose = () => {
        clearForm(); // Clear fields when closing
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        setIsSaving(true);
        setError(null);

        // Basic validation (you might want more)
        if (!name || !role || !password || !nip) {
            setError('Todos los campos son requeridos.');
            setIsSaving(false);
            return;
        }

        const newUser = {
            name,
            role,
            password, // In a real app, send this securely, don't store plain text
            nip,
            // Default permissions for new users (can be adjusted)
            permissions: {
                canViewDashboard: true,
                canManageAlerts: false,
                canEditStudents: false,
                canManageUsers: false,
            }
        };

        try {
            // Call the "interruptor" function from the parent
            await onSubmit(newUser);
            handleClose(); // Close modal on success
        } catch (err) {
            console.error("Error adding user:", err);
            setError('Error al crear el usuario. Intenta de nuevo.');
            setIsSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content add-user-modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">Agregar Nuevo Usuario</h2>
                <form onSubmit={handleSubmit} className="add-user-form">
                    {error && <div className="form-error">{error}</div>}

                    <div className="modal-input-group">
                        <label htmlFor="newUserName">Nombre Completo:</label>
                        <input
                            type="text"
                            id="newUserName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="modal-input-group">
                        <label htmlFor="newUserRole">Cargo:</label>
                        <input
                            type="text"
                            id="newUserRole"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="Ej: Prefecto Matutino"
                            required
                        />
                    </div>

                    <div className="modal-input-group">
                        <label htmlFor="newUserPassword">Contraseña Temporal:</label>
                        <input
                            type="password"
                            id="newUserPassword"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="modal-input-group">
                        <label htmlFor="newUserNip">NIP (4 dígitos):</label>
                        <input
                            type="password" // Use password type to mask NIP
                            id="newUserNip"
                            value={nip}
                            onChange={(e) => setNip(e.target.value)}
                            maxLength={4} // Limit to 4 digits
                            pattern="\d{4}" // Basic pattern validation for 4 digits
                            title="Ingresa 4 dígitos numéricos"
                            required
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="modal-btn cancel" onClick={handleClose} disabled={isSaving}>
                            Cancelar
                        </button>
                        <button type="submit" className="modal-btn save" disabled={isSaving}>
                            {isSaving ? 'Creando...' : 'Generar Nuevo Usuario'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;