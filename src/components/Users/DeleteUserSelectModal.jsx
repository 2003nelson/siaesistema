// src/components/Users/DeleteUserSelectModal.jsx
import React, { useState } from 'react';

const DeleteUserSelectModal = ({ isOpen, onClose, users, onConfirmSelection }) => {
    const [selectedUserId, setSelectedUserId] = useState(null);

    if (!isOpen) {
        return null;
    }

    const handleConfirm = () => {
        if (selectedUserId) {
            const selectedUser = users.find(u => u.id === selectedUserId);
            onConfirmSelection(selectedUserId, selectedUser?.name || 'Usuario desconocido'); // Pass ID and name
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content select-user-modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">Seleccionar Usuario a Eliminar</h2>
                <p className="modal-subtitle">Elige el perfil de usuario que deseas eliminar del sistema.</p>

                <div className="user-selection-list">
                    {users.length === 0 ? (
                        <p>No hay usuarios para eliminar.</p>
                    ) : (
                        users.map(user => (
                            <label key={user.id} className={`user-selection-item ${selectedUserId === user.id ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="userToDelete"
                                    value={user.id}
                                    checked={selectedUserId === user.id}
                                    onChange={() => setSelectedUserId(user.id)}
                                />
                                <div className="user-details">
                                    <span className="user-name">{user.name}</span>
                                    <span className="user-role">{user.role}</span>
                                </div>
                            </label>
                        ))
                    )}
                </div>

                <div className="modal-actions">
                    <button className="modal-btn cancel" onClick={onClose}>
                        Cancelar
                    </button>
                    <button
                        className="modal-btn delete" // Use delete style for confirmation
                        onClick={handleConfirm}
                        disabled={!selectedUserId} // Disable if no user is selected
                    >
                        Confirmar Selección
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteUserSelectModal;