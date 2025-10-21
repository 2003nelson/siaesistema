// src/pages/GestionUsuariosPage.jsx
import React, { useState, useEffect } from 'react';
import UserPermissionCard from '../components/Users/UserPermissionCard.jsx';

// --- DATOS DEFAULT (MOCK DATA) ---
// El Director no está en esta lista, ya que él es quien edita.
// Esta lista es de los usuarios "gestionables".
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

  // *** INTERRUPTOR #1: Cargar la lista de usuarios ***
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      console.log('API Call: Obteniendo lista de usuarios...');
      try {
        // --- TODO: AQUÍ VA TU CÓDIGO DE API (GET /usuarios) ---
        // const response = await fetch('https://tu-api.com/usuarios');
        // const data = await response.json();
        
        // Usamos los DATOS DEFAULT por ahora
        const data = MOCK_USERS_DATA;
        // ----------------------------------------
        
        setUsers(data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const timer = setTimeout(() => fetchData(), 300);
    return () => clearTimeout(timer);
    
  }, []); // Se ejecuta solo una vez al cargar la página

  // *** INTERRUPTOR #2: Actualizar un permiso ***
  const handlePermissionChange = (userId, permissionKey, newValue) => {
    console.log(`API Call: Actualizando permiso ${permissionKey} a ${newValue} para usuario ${userId}`);

    // --- TODO: AQUÍ VA TU CÓDIGO DE API (PATCH /usuarios/{userId}) ---
    // try {
    //   await fetch(`https://tu-api.com/usuarios/${userId}/permisos`, {
    //     method: 'PATCH',
    //     body: JSON.stringify({ [permissionKey]: newValue }),
    //     headers: { 'Content-Type': 'application/json' }
    //   });
    // } catch (error) {
    //   console.error("Error al actualizar permiso:", error);
    //   // Aquí revertiríamos el cambio si la API falla
    // }
    // --------------------------------------------------

    // Actualización "optimista" del estado local (se actualiza
    // visualmente antes de que la API responda, para fluidez)
    setUsers(currentUsers =>
      currentUsers.map(user =>
        user.id === userId
          ? {
              ...user,
              permissions: {
                ...user.permissions,
                [permissionKey]: newValue,
              },
            }
          : user
      )
    );
  };

  return (
    <main className="dashboard-main">
      <div className="page-title-container">
        <h1 className="page-title">Gestión de Usuarios y Permisos</h1>
        <div className="title-decorator"></div>
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
    </main>
  );
};

export default GestionUsuariosPage;