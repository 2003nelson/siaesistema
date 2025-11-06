import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

const DeleteCycleModal = ({ isOpen, onClose, onConfirm, isDeleting, cycleData }) => {
    if (!isOpen || !cycleData) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content small">
                <div className="modal-header">
                    <h3>
                        <AlertTriangle size={20} className="warning-icon" />
                        Confirmar Eliminación
                    </h3>
                    <button onClick={onClose} className="close-button" disabled={isDeleting}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <p>¿Estás seguro de que deseas eliminar el ciclo escolar?</p>
                    
                    <div className="cycle-info-summary">
                        <strong>{cycleData.nombre}</strong>
                        <div className="dates-summary">
                            <span>
                                {new Date(cycleData.fecha_inicio).toLocaleDateString('es-ES')} - {' '}
                                {new Date(cycleData.fecha_fin).toLocaleDateString('es-ES')}
                            </span>
                            {cycleData.activo && (
                                <span className="active-badge-small">Activo</span>
                            )}
                        </div>
                    </div>

                    <div className="warning-message">
                        <AlertTriangle size={16} />
                        <span>Esta acción no se puede deshacer.</span>
                    </div>
                </div>

                <div className="modal-actions">
                    <button
                        type="button"
                        onClick={onClose}
                        className="button secondary"
                        disabled={isDeleting}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="button danger"
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <div className="spinner"></div>
                                Eliminando...
                            </>
                        ) : (
                            <>
                                <Trash2 size={16} />
                                Eliminar Ciclo
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteCycleModal;