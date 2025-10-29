// src/components/Users/DeleteConfirmModal.jsx
import React from 'react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, userName }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay confirm-overlay" onClick={onClose}>
            <div className="modal-content confirm-modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title confirm-title">Confirmar Eliminación</h2>
                <p className="confirm-message">
                    ¿Estás seguro de que deseas eliminar permanentemente al usuario <strong>{userName || 'seleccionado'}</strong>? Esta acción no se puede deshacer.
                </p>
                <div className="modal-actions confirm-actions">
                    <button className="modal-btn cancel" onClick={onClose}>
                        Cancelar
                    </button>
                    <button className="modal-btn delete" onClick={onConfirm}>
                        Sí, Eliminar Usuario
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;