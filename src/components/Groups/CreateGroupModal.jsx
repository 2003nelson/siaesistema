// src/components/Groups/CreateGroupModal.jsx
import React, { useState } from 'react';
import { X, PlusCircle, AlertCircle, CheckCircle } from 'lucide-react';

const CreateGroupModal = ({ isOpen, onClose, onSubmit, isCreating = false }) => {
    // Estados para el formulario
    const [groupName, setGroupName] = useState('');
    const [groupTurno, setGroupTurno] = useState('Matutino');
    const [groupSemestre, setGroupSemestre] = useState(1);
    const [error, setError] = useState('');

    const clearForm = () => {
        setGroupName('');
        setGroupTurno('Matutino');
        setGroupSemestre(1);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Validaciones
        if (!groupName.trim()) {
            setError('El nombre del grupo es obligatorio.');
            return;
        }
        
        if (groupName.trim().length < 2) {
            setError('El nombre del grupo debe tener al menos 2 caracteres.');
            return;
        }
        
        if (groupName.trim().length > 20) {
            setError('El nombre del grupo no puede tener más de 20 caracteres.');
            return;
        }

        const groupData = {
            nombre: groupName.trim(),
            turno: groupTurno,
            semestre: groupSemestre
        };

        try {
            await onSubmit(groupData);
            // Si tiene éxito, cierra el modal y limpia
            clearForm();
            onClose();
        } catch (apiError) {
            // Si onSubmit lanza un error (de la API), lo mostramos
            setError(apiError.message || "Error al crear el grupo.");
        }
    };

    const handleClose = () => {
        clearForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content create-group-modal">
                <div className="modal-header">
                    <h2 className="modal-title">Crear Nuevo Grupo</h2>
                    <button onClick={handleClose} className="close-form-btn" disabled={isCreating}>
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && (
                            <div className="form-feedback error">
                                <AlertCircle size={18} /> {error}
                            </div>
                        )}
                        
                        <div className="form-grid">
                            <div className="modal-input-group">
                                <label htmlFor="modalGroupName">Nombre del Grupo:</label>
                                <input 
                                    type="text" 
                                    id="modalGroupName" 
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    placeholder="Ej: 101, 305, 507, A1, B2"
                                    required
                                    disabled={isCreating}
                                    maxLength={20}
                                    minLength={2}
                                />
                            </div>
                            <div className="modal-input-group">
                                <label htmlFor="modalGroupTurno">Turno:</label>
                                <select 
                                    id="modalGroupTurno" 
                                    value={groupTurno}
                                    onChange={(e) => setGroupTurno(e.target.value)}
                                    disabled={isCreating}
                                >
                                    <option value="Matutino">Matutino</option>
                                    <option value="Vespertino">Vespertino</option>
                                </select>
                            </div>
                            <div className="modal-input-group">
                                <label htmlFor="modalGroupSemestre">Semestre:</label>
                                <select 
                                    id="modalGroupSemestre" 
                                    value={groupSemestre}
                                    onChange={(e) => setGroupSemestre(parseInt(e.target.value))}
                                    disabled={isCreating}
                                >
                                    <option value={1}>1° Semestre</option>
                                    <option value={2}>2° Semestre</option>
                                    <option value={3}>3° Semestre</option>
                                    <option value={4}>4° Semestre</option>
                                    <option value={5}>5° Semestre</option>
                                    <option value={6}>6° Semestre</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div className="modal-actions">
                        <button type="button" className="modal-btn cancel" onClick={handleClose} disabled={isCreating}>
                            Cancelar
                        </button>
                        <button type="submit" className="modal-btn save" disabled={isCreating}>
                            <PlusCircle size={18} />
                            {isCreating ? 'Creando...' : 'Crear Grupo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGroupModal;