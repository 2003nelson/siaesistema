// src/pages/GestionUsuariosPage.jsx
import React, { useState, useEffect } from 'react';
import UserPermissionCard from '../components/Users/UserPermissionCard.jsx';
import { PlusCircle, Trash2 } from 'lucide-react';
import DeleteUserSelectModal from '../components/Users/DeleteUserSelectModal.jsx';
import DeleteConfirmModal from '../components/Users/DeleteConfirmModal.jsx';
// 1. Importa el modal de Agregar Usuario
import AddUserModal from '../components/Users/AddUserModal.jsx';

// --- DATOS DEFAULT (MOCK DATA) ---
const MOCK_USERS_DATA = [
    {
        id: 'u1',
        name: 'Marco Antonio Pérez',
        role: 'Prefecto Matutino',
        permissions: {
            canViewDashboard: true,
            canManageAlerts: true,
            canEditStudents: false,
            canManageUsers: false,
        },
    },
    {
        id: 'u2',
        name: 'Sandra López',
        role: 'Prefecto Vespertino',
        permissions: {
            canViewDashboard: true,
            canManageAlerts: true,
            canEditStudents: false,
            canManageUsers: false,
        },
    },
    {
        id: 'u3',
        name: 'Laura Mendoza',
        role: 'Coordinación Académica',
        permissions: {
            canViewDashboard: true,
            canManageAlerts: false,
            canEditStudents: true,
            canManageUsers: false,
        },
    },
];
// --- FIN DE DATOS DEFAULT ---


const GestionUsuariosPage = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteSelectOpen, setIsDeleteSelectOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState({ id: null, name: '' });

    // --- 2. AÑADE ESTADO PARA MODAL AGREGAR USUARIO ---
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    // --------------------------------------------------

    // *** INTERRUPTOR #1: Cargar la lista de usuarios ***
    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            console.log('API Call: Obteniendo lista de usuarios...');
            try {
                // --- TODO: API GET /usuarios ---
                const data = MOCK_USERS_DATA;
                // -----------------------------
                setUsers(data);
            } catch (error) {
                console.error("Error al obtener usuarios:", error);
            } finally {
                setIsLoading(false);
            }
        };
        const timer = setTimeout(() => fetchData(), 300);
        return () => clearTimeout(timer);
    }, []);

    // *** INTERRUPTOR #2: Actualizar un permiso ***
    const handlePermissionChange = (userId, permissionKey, newValue) => {
        console.log(`API Call: Actualizando permiso ${permissionKey} a ${newValue} para usuario ${userId}`);
        // --- TODO: API PATCH /usuarios/{userId} ---
        // ---------------------------------------
        setUsers(currentUsers =>
            currentUsers.map(user =>
                user.id === userId
                    ? { ...user, permissions: { ...user.permissions, [permissionKey]: newValue } }
                    : user
            )
        );
    };

    // --- 3. FUNCIONES PARA MODAL AGREGAR USUARIO ---
    const openAddUserModal = () => setIsAddUserModalOpen(true);
    const closeAddUserModal = () => setIsAddUserModalOpen(false);

    // *** INTERRUPTOR #4: Agregar Nuevo Usuario ***
    const handleAddUser = async (newUserData) => {
        console.log('API Call: Agregando nuevo usuario:', newUserData);

        // --- TODO: AQUÍ VA TU CÓDIGO DE API (POST /usuarios) ---
        // Envía newUserData y obtén el usuario creado con ID real.
        await new Promise(resolve => setTimeout(resolve, 500)); // Simula API success
        // Simulación: crea un ID temporal
        const createdUser = {
            ...newUserData, // Incluye name, role, permissions (la contraseña no se guarda en el estado local)
            id: `temp-${Date.now()}` // Usa ID temporal
        };
        // ----------------------------------------------------

        // Si la API tiene éxito, actualiza el estado local
        setUsers(currentUsers => [...currentUsers, createdUser]);
        // closeAddUserModal(); // El modal se cierra solo en su handleSubmit
    };
    // --------------------------------------

    // --- Funciones para Eliminar Usuario (sin cambios) ---
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
    const confirmDeleteUser = async () => {
        if (!userToDelete.id) return;
        console.log(`API Call: Eliminando usuario ${userToDelete.id} (${userToDelete.name})`);
        // --- TODO: API DELETE /usuarios/{userId}) ---
        await new Promise(resolve => setTimeout(resolve, 500)); // Simula API success
        // ---------------------------------------
        setUsers(currentUsers => currentUsers.filter(user => user.id !== userToDelete.id));
        closeDeleteConfirm();
    };
    // ------------------------------------

    return (
        <main className="dashboard-main">
            <div className="page-title-container with-actions">
                <div className="title-group">
                    <h1 className="page-title">Gestión de Usuarios y Permisos</h1>
                    <div className="title-decorator"></div>
                </div>
                <div className="page-actions">
                    {/* 4. Vincula el botón Agregar a la función que abre el modal de agregar */}
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

            {isLoading ? (
                <div className="loading-message">Cargando usuarios...</div>
            ) : (
                <div className="user-cards-grid">
                    {users.map(user => (
                        <UserPermissionCard
                            key={user.id}
                            user={user}
                            onPermissionChange={handlePermissionChange}
                        />
                    ))}
                </div>
            )}

            {/* --- 5. RENDERIZA TODOS LOS MODALES --- */}
            <AddUserModal
                isOpen={isAddUserModalOpen}
                onClose={closeAddUserModal}
                onSubmit={handleAddUser} // Pasa el "interruptor" para agregar
            />

            <DeleteUserSelectModal
                isOpen={isDeleteSelectOpen}
                onClose={closeDeleteUserModal}
                users={users}
                onConfirmSelection={handleConfirmSelection}
            />

            <DeleteConfirmModal
                isOpen={isDeleteConfirmOpen}
                onClose={closeDeleteConfirm}
                onConfirm={confirmDeleteUser}
                userName={userToDelete.name}
            />
            {/* --- FIN RENDERIZADO MODALES --- */}
        </main>
    );
};

export default GestionUsuariosPage;