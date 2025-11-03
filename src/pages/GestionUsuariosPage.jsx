import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios'; // Importa tu cliente Axios

// --- 1. Importa los 4 componentes que me pasaste ---
import UserPermissionCard from '../components/Users/UserPermissionCard.jsx';
import AddUserModal from '../components/Users/AddUserModal.jsx';
import DeleteUserSelectModal from '../components/Users/DeleteUserSelectModal.jsx';
import DeleteConfirmModal from '../components/Users/DeleteConfirmModal.jsx';

// --- 2. Importa los iconos que usa esta página ---
import { PlusCircle, Trash2, AlertCircle } from 'lucide-react';

const GestionUsuariosPage = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteSelectOpen, setIsDeleteSelectOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState({ id: null, name: '' });
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    
    // Estado para feedback general (ej. 'Permisos actualizados')
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [isSaving, setIsSaving] = useState(false); // Estado de carga genérico para modals
    
    // Temporizador para limpiar el feedback
    useEffect(() => {
        if (feedback.message) {
            const timer = setTimeout(() => {
                setFeedback({ message: '', type: '' });
            }, 3000); // Oculta después de 3 segundos
            return () => clearTimeout(timer);
        }
    }, [feedback]);


    // *** INTERRUPTOR #1: Cargar la lista de usuarios ***
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            // --- CONEXIÓN API ---
            const response = await apiClient.get('/users');
            setUsers(response.data);
            // --------------------
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            setFeedback({ message: 'Error al cargar la lista de usuarios.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };
    
    // Carga los usuarios al montar el componente
    useEffect(() => {
        fetchUsers();
    }, []);

    // *** INTERRUPTOR #2: Actualizar un permiso ***
    const handlePermissionChange = async (userId, permissionKey, newValue) => {
        
        // Optimistic UI: Actualiza el estado local primero
        const originalUsers = users;
        setUsers(currentUsers =>
            currentUsers.map(user =>
                user.id === userId
                    ? { ...user, permissions: { ...user.permissions, [permissionKey]: newValue } }
                    : user
            )
        );

        const currentUser = originalUsers.find(u => u.id === userId);
        if (!currentUser) return;
        
        const updatedPermissions = {
             ...currentUser.permissions, 
             [permissionKey]: newValue 
        };

        try {
            // --- CONEXIÓN API ---
            // Llama a la API en segundo plano
            await apiClient.patch(`/users/${userId}/permissions`, {
                permissions: updatedPermissions 
            });
            // --------------------
            setFeedback({ message: 'Permisos actualizados.', type: 'success' });
            
        } catch (error) {
            console.error("Error al actualizar permiso:", error);
            setFeedback({ message: 'Error al guardar el permiso. Revirtiendo...', type: 'error' });
            // Rollback: Si la API falla, revierte el cambio en el estado local
            setUsers(originalUsers);
        }
    };

    // --- Funciones para Modal Agregar Usuario ---
    const openAddUserModal = () => setIsAddUserModalOpen(true);
    const closeAddUserModal = () => setIsAddUserModalOpen(false);

    // *** INTERRUPTOR #3: Agregar Nuevo Usuario ***
    const handleAddUser = async (newUserData) => {
        // Esta función 'lanza' un error si la API falla, que el modal (AddUserModal) atrapa
        // --- CONEXIÓN API ---
        const response = await apiClient.post('/users', newUserData);
        const createdUser = response.data; // El usuario creado con su ID real
        // --------------------

        // Si la API tiene éxito, actualiza el estado local
        setUsers(currentUsers => [...currentUsers, createdUser]);
        setFeedback({ message: 'Usuario creado exitosamente.', type: 'success' });
        // El modal se cierra solo desde su propio 'handleSubmit'
    };

    // --- Funciones para Eliminar Usuario ---
    const openDeleteUserModal = () => setIsDeleteSelectOpen(true);
    const closeDeleteUserModal = () => {
        setIsDeleteSelectOpen(false);
        setUserToDelete({ id: null, name: '' });
    };
    const handleConfirmSelection = (userId, userName) => {
        setUserToDelete({ id: userId, name: userName });
        setIsDeleteSelectOpen(false);
        setIsDeleteConfirmOpen(true);
    };
    const closeDeleteConfirm = () => {
        setIsDeleteConfirmOpen(false);
        setUserToDelete({ id: null, name: '' });
    };
    
    // *** INTERRUPTOR #4: Confirmar Eliminación ***
    const confirmDeleteUser = async () => {
        if (!userToDelete.id) return;
        
        setIsSaving(true);
        try {
            // --- CONEXIÓN API ---
            await apiClient.delete(`/users/${userToDelete.id}`);
            // --------------------
            
            setUsers(currentUsers => currentUsers.filter(user => user.id !== userToDelete.id));
            setFeedback({ message: 'Usuario eliminado.', type: 'success' });
            closeDeleteConfirm();
            
        } catch (error) {
             console.error(`Error al eliminar usuario ${userToDelete.id}:`, error);
             // Muestra el error de la API si existe (ej. "No se puede eliminar al admin")
             const apiErrorMessage = error.response?.data?.detail || 'Error al eliminar el usuario.';
             setFeedback({ message: apiErrorMessage, type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className="dashboard-main">
            <div className="page-title-container with-actions">
                <div className="title-group">
                    <h1 className="page-title">Gestión de Usuarios y Permisos</h1>
                    <div className="title-decorator"></div>
                </div>
                <div className="page-actions">
                    <button className="action-button add-button" onClick={openAddUserModal}>
                        <PlusCircle size={18} />
                        Agregar Usuario
                    </button>
                    <button className="action-button delete-button" onClick={openDeleteUserModal}>
                        <Trash2 size={18} />
                        Borrar Usuario
                    </button>
                </div>
            </div>

            <p className="page-subtitle">
                Asigna o revoca permisos a los perfiles de usuario que acceden al sistema.
            </p>
            
            {/* Feedback Global */}
            {feedback.message && (
                <div className={`form-feedback ${feedback.type} global-feedback`}>
                    <AlertCircle size={18} /> {feedback.message}
                </div>
            )}

            {isLoading ? (
                <div className="loading-message">Cargando usuarios...</div>
            ) : (
                <div className="user-cards-grid">
                    {users.length > 0 ? (
                        users.map(user => (
                            <UserPermissionCard
                                key={user.id}
                                user={user}
                                onPermissionChange={handlePermissionChange}
                            />
                        ))
                    ) : (
                        <p>No se encontraron usuarios. Puedes agregar uno para comenzar.</p>
                    )}
                </div>
            )}

            {/* --- RENDERIZA TODOS LOS MODALES --- */}
            <AddUserModal
                isOpen={isAddUserModalOpen}
                onClose={closeAddUserModal}
                onSubmit={handleAddUser}
            />

            <DeleteUserSelectModal
                isOpen={isDeleteSelectOpen}
                onClose={closeDeleteUserModal}
                users={users}
                onConfirmSelection={handleConfirmSelection}
            />

            {/* Tu DeleteConfirmModal (código 2) no acepta 'isSaving'. 
                Recomiendo actualizarlo para que los botones se deshabiliten, 
                pero este código funcionará de todos modos.
            */}
            <DeleteConfirmModal
                isOpen={isDeleteConfirmOpen}
                onClose={closeDeleteConfirm}
                onConfirm={confirmDeleteUser}
                userName={userToDelete.name}
                // isSaving={isSaving} // Descomenta si actualizas DeleteConfirmModal
            />
        </main>
    );
};

export default GestionUsuariosPage;