// src/components/Groups/DeleteGroupModal.jsx
import React from 'react';
import { XCircle, Trash2, AlertTriangle } from 'lucide-react';

const DeleteGroupModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    isDeleting, 
    groupData 
}) => {
    if (!isOpen) return null;

    const handleClose = () => {
        if (!isDeleting) {
            onClose();
        }
    };

    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title delete-title">
                        <AlertTriangle size={24} />
                        Confirmar Eliminación
                    </h2>
                    <button 
                        onClick={handleClose} 
                        className="close-modal-btn"
                        disabled={isDeleting}
                        title="Cerrar"
                    >
                        <XCircle size={24} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="delete-warning">
                        <div className="warning-icon">
                            <Trash2 size={48} />
                        </div>
                        <div className="warning-content">
                            <h3>¿Estás seguro que deseas eliminar este grupo?</h3>
                            
                            {groupData && (
                                <div className="group-details-summary">
                                    <p><strong>Nombre:</strong> {groupData.nombre || `Sin nombre (ID: ${groupData.id})`}</p>
                                    <p><strong>Turno:</strong> {groupData.turno}</p>
                                    <p><strong>Semestre:</strong> {groupData.semestre}°</p>
                                </div>
                            )}
                            
                            <div className="warning-message">
                                <p>⚠️ <strong>Esta acción no se puede deshacer.</strong></p>
                                <p>Si este grupo tiene estudiantes asignados, la eliminación podría fallar.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-actions">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="action-button cancel-button"
                        disabled={isDeleting}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="action-button delete-button"
                        disabled={isDeleting}
                    >
                        <Trash2 size={18} />
                        {isDeleting ? 'Eliminando...' : 'Eliminar Grupo'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteGroupModal;