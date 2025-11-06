import React, { useState } from 'react';
import { X, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

const CreateCycleModal = ({ isOpen, onClose, onSubmit, isCreating }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        fecha_inicio: '',
        fecha_fin: ''
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio';
        }

        if (!formData.fecha_inicio) {
            newErrors.fecha_inicio = 'La fecha de inicio es obligatoria';
        }

        if (!formData.fecha_fin) {
            newErrors.fecha_fin = 'La fecha de fin es obligatoria';
        }

        if (formData.fecha_inicio && formData.fecha_fin) {
            const fechaInicio = new Date(formData.fecha_inicio);
            const fechaFin = new Date(formData.fecha_fin);
            
            if (fechaFin <= fechaInicio) {
                newErrors.fecha_fin = 'La fecha de fin debe ser posterior a la fecha de inicio';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Siempre crear con activo: false
            onSubmit({ ...formData, activo: false });
        }
    };

    const handleClose = () => {
        setFormData({
            nombre: '',
            fecha_inicio: '',
            fecha_fin: ''
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>
                        <Calendar size={20} />
                        Crear Nuevo Ciclo Escolar
                    </h3>
                    <button onClick={handleClose} className="close-button" disabled={isCreating}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre del Ciclo *</label>
                        <input
                            id="nombre"
                            name="nombre"
                            type="text"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            placeholder="Ej: Agosto-Enero 2025"
                            disabled={isCreating}
                            className={errors.nombre ? 'error' : ''}
                        />
                        {errors.nombre && (
                            <span className="error-message">
                                <AlertCircle size={14} />
                                {errors.nombre}
                            </span>
                        )}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="fecha_inicio">Fecha de Inicio *</label>
                            <input
                                id="fecha_inicio"
                                name="fecha_inicio"
                                type="date"
                                value={formData.fecha_inicio}
                                onChange={handleInputChange}
                                disabled={isCreating}
                                className={errors.fecha_inicio ? 'error' : ''}
                            />
                            {errors.fecha_inicio && (
                                <span className="error-message">
                                    <AlertCircle size={14} />
                                    {errors.fecha_inicio}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="fecha_fin">Fecha de Fin *</label>
                            <input
                                id="fecha_fin"
                                name="fecha_fin"
                                type="date"
                                value={formData.fecha_fin}
                                onChange={handleInputChange}
                                disabled={isCreating}
                                className={errors.fecha_fin ? 'error' : ''}
                            />
                            {errors.fecha_fin && (
                                <span className="error-message">
                                    <AlertCircle size={14} />
                                    {errors.fecha_fin}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="button secondary"
                            disabled={isCreating}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="button primary"
                            disabled={isCreating}
                        >
                            {isCreating ? (
                                <>
                                    <div className="spinner"></div>
                                    Creando...
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={16} />
                                    Crear Ciclo
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCycleModal;