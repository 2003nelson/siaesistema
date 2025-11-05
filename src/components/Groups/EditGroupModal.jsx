// src/components/Groups/EditGroupModal.jsx
import React, { useState, useEffect } from 'react';
import { XCircle, Edit3, AlertCircle, CheckCircle } from 'lucide-react';

const EditGroupModal = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    isLoading, 
    groupData // Los datos del grupo a editar
}) => {
    const [formData, setFormData] = useState({
        nombre: '',
        turno: 'Matutino',
        semestre: '1'
    });
    const [errors, setErrors] = useState({});
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    // Llenar el formulario con los datos del grupo cuando se abre el modal
    useEffect(() => {
        if (isOpen && groupData) {
            setFormData({
                nombre: groupData.nombre || '',
                turno: groupData.turno || 'Matutino',
                semestre: groupData.semestre?.toString() || '1'
            });
            setErrors({});
            setFeedback({ message: '', type: '' });
        }
    }, [isOpen, groupData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Limpiar error específico cuando el usuario empiece a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validar nombre del grupo
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre del grupo es obligatorio';
        } else if (formData.nombre.trim().length < 2) {
            newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
        } else if (formData.nombre.trim().length > 10) {
            newErrors.nombre = 'El nombre no puede exceder 10 caracteres';
        }

        // Validar turno
        if (!['Matutino', 'Vespertino'].includes(formData.turno)) {
            newErrors.turno = 'Turno inválido';
        }

        // Validar semestre
        const semestre = parseInt(formData.semestre);
        if (isNaN(semestre) || semestre < 1 || semestre > 9) {
            newErrors.semestre = 'El semestre debe ser entre 1 y 9';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            await onSubmit({
                nombre: formData.nombre.trim(),
                turno: formData.turno,
                semestre: parseInt(formData.semestre)
            });
            
            setFeedback({ 
                message: '¡Grupo actualizado exitosamente!', 
                type: 'success' 
            });
            
            // Cerrar modal después de un breve delay para mostrar el feedback
            setTimeout(() => {
                onClose();
            }, 1500);
            
        } catch (error) {
            setFeedback({ 
                message: error.message || 'Error al actualizar el grupo', 
                type: 'error' 
            });
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setFeedback({ message: '', type: '' });
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        <Edit3 size={24} />
                        Editar Grupo
                    </h2>
                    <button 
                        onClick={handleClose} 
                        className="close-modal-btn"
                        disabled={isLoading}
                        title="Cerrar"
                    >
                        <XCircle size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    {feedback.message && (
                        <div className={`form-feedback ${feedback.type}`}>
                            {feedback.type === 'success' ? 
                                <CheckCircle size={18} /> : 
                                <AlertCircle size={18} />
                            }
                            {feedback.message}
                        </div>
                    )}

                    <div className="modal-input-group">
                        <label htmlFor="edit-nombre">
                            Nombre del Grupo <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="edit-nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            placeholder="Ej: 101, 102, 501"
                            maxLength="10"
                            disabled={isLoading}
                            className={errors.nombre ? 'error' : ''}
                        />
                        {errors.nombre && (
                            <span className="error-message">{errors.nombre}</span>
                        )}
                        <small className="input-help">
                            Identificador único del grupo (máximo 10 caracteres)
                        </small>
                    </div>

                    <div className="modal-input-group">
                        <label htmlFor="edit-turno">
                            Turno <span className="required">*</span>
                        </label>
                        <select
                            id="edit-turno"
                            name="turno"
                            value={formData.turno}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            className={errors.turno ? 'error' : ''}
                        >
                            <option value="Matutino">Matutino</option>
                            <option value="Vespertino">Vespertino</option>
                        </select>
                        {errors.turno && (
                            <span className="error-message">{errors.turno}</span>
                        )}
                    </div>

                    <div className="modal-input-group">
                        <label htmlFor="edit-semestre">
                            Semestre <span className="required">*</span>
                        </label>
                        <select
                            id="edit-semestre"
                            name="semestre"
                            value={formData.semestre}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            className={errors.semestre ? 'error' : ''}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(sem => (
                                <option key={sem} value={sem.toString()}>
                                    {sem}° Semestre
                                </option>
                            ))}
                        </select>
                        {errors.semestre && (
                            <span className="error-message">{errors.semestre}</span>
                        )}
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="action-button cancel-button"
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="action-button save-button"
                            disabled={isLoading}
                        >
                            <Edit3 size={18} />
                            {isLoading ? 'Actualizando...' : 'Actualizar Grupo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditGroupModal;