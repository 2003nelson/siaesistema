// src/pages/GestionEstudiantesPage.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios'; // Importamos el cliente API
import { PlusCircle, UserPlus, XCircle, Link2, Users, CheckCircle, AlertCircle, Edit3, Trash2, ChevronDown } from 'lucide-react';
import StudentGroupsNav from '../components/Dashboard/StudentGroupsNav.jsx'; // Reutilizamos el filtro de grupos
import StudentLinkTable from '../components/Students/StudentLinkTable.jsx'; // Componente nuevo para la tabla
import LinkNfcModal from '../components/Students/LinkNfcModal.jsx'; // Componente nuevo para el modal
import CreateGroupModal from '../components/Groups/CreateGroupModal.jsx'; // Modal para crear grupos
import EditGroupModal from '../components/Groups/EditGroupModal.jsx'; // Modal para editar grupos
import DeleteGroupModal from '../components/Groups/DeleteGroupModal.jsx'; // Modal para eliminar grupos

// --- ¡MOCK DATA ELIMINADO! ---

const GestionEstudiantesPage = () => {
    // Estado para visibilidad de formularios
    const [isAddFormVisible, setIsAddFormVisible] = useState(false);
    const [isLinkListViewVisible, setIsLinkListViewVisible] = useState(false);
    const [isGroupManagementVisible, setIsGroupManagementVisible] = useState(false);

    // Estados para gestión de grupos
    const [grupos, setGrupos] = useState([]);
    const [isLoadingGroups, setIsLoadingGroups] = useState(false);
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
    const [isAddingGroup, setIsAddingGroup] = useState(false);
    
    // Estados para edición de grupos
    const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);
    const [groupToEdit, setGroupToEdit] = useState(null);
    const [isUpdatingGroup, setIsUpdatingGroup] = useState(false);
    
    // Estados para eliminación de grupos
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState(null);
    const [isDeletingGroup, setIsDeletingGroup] = useState(false);
    
    // Estados para colapsar/expandir semestres
    const [collapsedSemesters, setCollapsedSemesters] = useState(new Set());

    // Estado para formulario "Agregar"
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState(''); // <-- NUEVO CAMPO
    const [matricula, setMatricula] = useState('');
    const [salonNombre, setSalonNombre] = useState(''); // <-- CAMBIO DE NOMBRE (antes 'grupo')

    // Estados para la lista y filtro de "Vincular"
    const [semestersData, setSemestersData] = useState({}); // Para el filtro de grupos
    const [filteredStudents, setFilteredStudents] = useState([]); // Lista filtrada por grupo
    const [selectedGroupFilter, setSelectedGroupFilter] = useState('all'); // Grupo seleccionado

    // Estados para el MODAL de vincular NFC
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [studentToLink, setStudentToLink] = useState(null); // Guarda el estudiante completo

    // Estados generales
    const [isLoading, setIsLoading] = useState(false); // Para la lista de estudiantes
    const [isSaving, setIsSaving] = useState(false); // Para los formularios
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    // --- Control de Vistas ---
    const showAddForm = () => { setIsAddFormVisible(true); setIsLinkListViewVisible(false); setIsGroupManagementVisible(false); clearFields(); };
    const hideAddForm = () => setIsAddFormVisible(false);
    const showLinkListView = () => { setIsLinkListViewVisible(true); setIsAddFormVisible(false); setIsGroupManagementVisible(false); clearFields(); };
    const hideLinkListView = () => setIsLinkListViewVisible(false);
    const showGroupManagement = () => { setIsGroupManagementVisible(true); setIsAddFormVisible(false); setIsLinkListViewVisible(false); clearFields(); };
    const hideGroupManagement = () => setIsGroupManagementVisible(false);

    const clearFields = () => {
        setNombre(''); setApellido(''); setMatricula(''); setSalonNombre('');
        setSelectedGroupFilter('all'); setStudentToLink(null);
        setFeedback({ message: '', type: '' });
    };

    // *** INTERRUPTOR #1: Cargar Grupos (para el filtro) ***
    useEffect(() => {
        // Solo carga si la vista de lista está activa
        if (!isLinkListViewVisible) return;

        const fetchGroups = async () => {
            try {
                // Usamos el mismo endpoint del dashboard para obtener los grupos
                const response = await apiClient.get('/dashboard/turno?modo=general');
                setSemestersData(response.data.groups);
            } catch (error) {
                console.error("Error al obtener grupos:", error);
                setFeedback({ message: 'Error al cargar filtros de grupo.', type: 'error' });
            }
        };
        fetchGroups();
    }, [isLinkListViewVisible]);

    // *** INTERRUPTOR #2: Cargar Lista de Estudiantes (para Vincular) ***
    useEffect(() => {
        // Solo carga si la vista de lista está activa
        if (!isLinkListViewVisible) return;

        setIsLoading(true);
        const fetchStudents = async () => {
            try {
                // Filtramos por grupo 'all' (todos) o un grupo específico
                let url = '/estudiantes';
                if (selectedGroupFilter !== 'all') {
                    url = `/estudiantes/salon/${selectedGroupFilter}`;
                }
                
                const response = await apiClient.get(url);
                // La API ahora devuelve EstudianteReadForLinking
                // que incluye { matricula, nombre, apellido, salon_nombre, tarjetas: [] }
                setFilteredStudents(response.data); 
            } catch (error) {
                console.error("Error al obtener estudiantes:", error);
                setFeedback({ message: 'Error al cargar estudiantes.', type: 'error' });
                setFilteredStudents([]); // Limpiamos la lista en caso de error
            } finally {
                setIsLoading(false);
            }
        };
        fetchStudents();
    }, [isLinkListViewVisible, selectedGroupFilter]); // Se re-ejecuta si cambia el filtro

    // *** INTERRUPTOR #2.5: Cargar Lista de Grupos (para Gestión) ***
    useEffect(() => {
        // Solo carga si la vista de gestión de grupos está activa
        if (!isGroupManagementVisible) return;

        const fetchGroups = async () => {
            setIsLoadingGroups(true);
            setFeedback({ message: '', type: '' }); // Limpiar feedback previo
            
                try {
                const response = await apiClient.get('/grupos');
                setGrupos(response.data);
                
                // Mensaje informativo con estadísticas
                if (response.data.length > 0) {
                    const gruposConNombre = response.data.filter(g => g.nombre && g.nombre.trim() !== '').length;
                    const gruposSinNombre = response.data.length - gruposConNombre;
                    
                    // Estadísticas por semestre
                    const semestreStats = response.data.reduce((acc, grupo) => {
                        acc[grupo.semestre] = (acc[grupo.semestre] || 0) + 1;
                        return acc;
                    }, {});
                    
                    const semestresInfo = Object.entries(semestreStats)
                        .sort(([a], [b]) => parseInt(a) - parseInt(b))
                        .map(([sem, count]) => `${count} grupo(s) de ${sem}° semestre`)
                        .join(', ');
                    
                    let mensaje = `Se encontraron ${response.data.length} grupo(s): ${semestresInfo}.`;
                    if (gruposSinNombre > 0) {
                        mensaje += ` ⚠️ ${gruposSinNombre} grupo(s) sin nombre.`;
                    }
                    
                    setFeedback({ message: mensaje, type: 'success' });
                } else {
                    setFeedback({ message: 'No se encontraron grupos. ¡Crea tu primer grupo!', type: 'success' });
                }
            } catch (error) {
                console.error("Error al obtener grupos:", error);
                
                let errorMsg = 'Error al cargar grupos.';
                if (error.response) {
                    const status = error.response.status;
                    const detail = error.response.data?.detail;
                    
                    if (status === 401) {
                        errorMsg = 'No tienes permisos para ver los grupos.';
                    } else if (status === 403) {
                        errorMsg = 'Acceso denegado para consultar grupos.';
                    } else if (status === 404) {
                        errorMsg = 'El servicio de grupos no está disponible.';
                    } else {
                        errorMsg = detail || `Error del servidor (${status}).`;
                    }
                } else if (error.request) {
                    errorMsg = 'Error de conexión. Verifica tu conexión a internet.';
                }
                
                setFeedback({ message: errorMsg, type: 'error' });
                setGrupos([]);
            } finally {
                setIsLoadingGroups(false);
            }
        };
        fetchGroups();
    }, [isGroupManagementVisible]);

    
    // *** INTERRUPTOR #3: Guardar Nuevo Estudiante ***
    const handleSaveStudent = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setFeedback({ message: '', type: '' });
        
        // Usamos los nombres de campo de la API (EstudianteCreate)
        const newStudentData = { 
            nombre, 
            apellido,
            matricula, 
            salon_nombre: salonNombre 
        };
        
        try {
            // --- API POST /estudiantes ---
            const response = await apiClient.post('/estudiantes', newStudentData);
            const savedStudent = response.data; // La API devuelve el estudiante creado
            // -----------------------------------
            
            setFeedback({ message: `¡Estudiante ${savedStudent.nombre} guardado!`, type: 'success' });
            clearFields(); // Limpia el formulario
        
        } catch (error) {
            console.error("Error guardando estudiante:", error);
            const errorMsg = error.response?.data?.detail || 'Error desconocido al guardar.';
            setFeedback({ message: `Error: ${errorMsg}`, type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    // --- FUNCIONES PARA MODAL DE VINCULAR NFC ---
    const openLinkModal = (student) => {
        setStudentToLink(student); // Guarda el estudiante seleccionado
        setIsLinkModalOpen(true);
    };
    const closeLinkModal = () => {
        setIsLinkModalOpen(false);
        setStudentToLink(null); // Limpia al cerrar
        setFeedback({ message: '', type: '' }); // Limpia feedback
    };

    // *** INTERRUPTOR #4: VINCULAR NFC (Submit del modal) ***
    const submitNfcLink = async (nfcId) => {
        if (!studentToLink || !nfcId) return;
        setIsSaving(true);
        setFeedback({ message: '', type: '' });

        // Usamos los nombres de campo de la API (TarjetaCreate)
        const linkData = {
            nfc_id: nfcId,
            estudiante_matricula: studentToLink.matricula, // Usamos la matrícula
        };
        
        try {
            // --- API POST /tarjetas ---
            const response = await apiClient.post('/tarjetas', linkData);
            const linkedCard = response.data; // La API devuelve la tarjeta creada
            // ----------------------------------------------------------------------
            
            setFeedback({ message: `¡NFC vinculado a ${studentToLink.nombre}!`, type: 'success' });

            // Actualiza la lista local para reflejar el cambio (deshabilita el botón)
            setFilteredStudents(prevStudents => prevStudents.map(s =>
                s.matricula === studentToLink.matricula 
                    ? { ...s, tarjetas: [...s.tarjetas, linkedCard] } // Añade la nueva tarjeta a la lista
                    : s
            ));

            closeLinkModal(); // Cierra el modal de vincular
        
        } catch (error) {
            console.error("Error al vincular NFC:", error);
            const errorMsg = error.response?.data?.detail || 'Error desconocido al vincular.';
            // En lugar de poner el feedback en la página, lo pasamos al modal
            // (Asumiremos que LinkNfcModal puede mostrar un error)
            // O, si LinkNfcModal no puede, lo mostramos en el modal:
            // setModalError(errorMsg); // (Necesitarías añadir este estado al modal)
            
            // Por ahora, lo mostramos en la página principal:
            setFeedback({ message: `Error: ${errorMsg}`, type: 'error' });
            // Cerramos el modal incluso si hay error
            closeLinkModal();
        } finally {
            setIsSaving(false);
        }
    };

    // *** INTERRUPTOR #5: CREAR NUEVO GRUPO (desde el modal) ***
    const handleCreateGroup = async (groupData) => {
        setIsAddingGroup(true);
        setFeedback({ message: '', type: '' });

        try {
            // --- API POST /grupos ---
            const response = await apiClient.post('/grupos', groupData);
            const newGroup = response.data;
            // -----------------------------------
            
            setFeedback({ message: `¡Grupo "${newGroup.nombre}" creado exitosamente!`, type: 'success' });
            
            // Actualizar la lista local de grupos
            setGrupos(prevGroups => [...prevGroups, newGroup]);

        } catch (error) {
            console.error("Error al crear grupo:", error);
            
            // Manejo específico de errores conocidos
            let errorMsg = 'Error desconocido al crear grupo.';
            
            if (error.response) {
                const status = error.response.status;
                const detail = error.response.data?.detail;
                
                if (status === 409) {
                    // Conflicto - grupo ya existe
                    errorMsg = detail || `El grupo "${groupData.nombre}" ya existe.`;
                } else if (status === 400) {
                    // Bad request - datos inválidos
                    errorMsg = detail || 'Los datos del grupo son inválidos.';
                } else if (status === 401) {
                    // No autorizado
                    errorMsg = 'No tienes permisos para crear grupos.';
                } else if (status === 403) {
                    // Prohibido
                    errorMsg = 'Acceso denegado para crear grupos.';
                } else {
                    // Otros errores del servidor
                    errorMsg = detail || `Error del servidor (${status}).`;
                }
            } else if (error.request) {
                // Error de red
                errorMsg = 'Error de conexión. Verifica tu conexión a internet.';
            }
            
            // Lanzar el error para que el modal lo capture
            throw new Error(errorMsg);
        } finally {
            setIsAddingGroup(false);
        }
    };
    // -----------------------------------------

    // Función para actualizar un grupo existente
    const handleUpdateGroup = async (groupData) => {
        setIsUpdatingGroup(true);
        
        try {
            // -----------------------------------
            // Hacer petición PUT a la API para actualizar el grupo
            const response = await apiClient.put(`/grupos/${groupToEdit.id}`, groupData);
            const updatedGroup = response.data;
            // -----------------------------------
            
            setFeedback({ message: `¡Grupo "${updatedGroup.nombre}" actualizado exitosamente!`, type: 'success' });
            
            // Actualizar la lista local de grupos
            setGrupos(prevGroups => 
                prevGroups.map(grupo => 
                    grupo.id === groupToEdit.id ? updatedGroup : grupo
                )
            );

            // Cerrar el modal de edición
            setIsEditGroupModalOpen(false);
            setGroupToEdit(null);

        } catch (error) {
            console.error("Error al actualizar grupo:", error);
            
            // Manejo específico de errores conocidos
            let errorMsg = 'Error desconocido al actualizar grupo.';
            
            if (error.response) {
                const status = error.response.status;
                const detail = error.response.data?.detail;
                
                if (status === 404) {
                    // Grupo no encontrado
                    errorMsg = 'El grupo no fue encontrado.';
                } else if (status === 409) {
                    // Conflicto - nombre ya existe
                    errorMsg = detail || `El nombre "${groupData.nombre}" ya está en uso.`;
                } else if (status === 400) {
                    // Bad request - datos inválidos
                    errorMsg = detail || 'Los datos del grupo son inválidos.';
                } else if (status === 401) {
                    // No autorizado
                    errorMsg = 'No tienes permisos para actualizar grupos.';
                } else if (status === 403) {
                    // Prohibido
                    errorMsg = 'Acceso denegado para actualizar grupos.';
                } else {
                    // Otros errores del servidor
                    errorMsg = detail || `Error del servidor (${status}).`;
                }
            } else if (error.request) {
                // Error de red
                errorMsg = 'Error de conexión. Verifica tu conexión a internet.';
            }
            
            // Lanzar el error para que el modal lo capture
            throw new Error(errorMsg);
        } finally {
            setIsUpdatingGroup(false);
        }
    };

    // Función para abrir el modal de edición
    const openEditModal = (grupo) => {
        setGroupToEdit(grupo);
        setIsEditGroupModalOpen(true);
    };

    // Función para cerrar el modal de edición
    const closeEditModal = () => {
        setIsEditGroupModalOpen(false);
        setGroupToEdit(null);
    };

    // Función para eliminar un grupo
    const handleDeleteGroup = async () => {
        if (!groupToDelete) return;
        
        setIsDeletingGroup(true);
        
        try {
            // -----------------------------------
            // Hacer petición DELETE a la API para eliminar el grupo
            await apiClient.delete(`/grupos/${groupToDelete.id}`);
            // -----------------------------------
            
            setFeedback({ 
                message: `¡Grupo "${groupToDelete.nombre || `ID: ${groupToDelete.id}`}" eliminado exitosamente!`, 
                type: 'success' 
            });
            
            // Actualizar la lista local de grupos
            setGrupos(prevGroups => 
                prevGroups.filter(grupo => grupo.id !== groupToDelete.id)
            );

            // Cerrar el modal de confirmación
            setIsDeleteConfirmModalOpen(false);
            setGroupToDelete(null);

        } catch (error) {
            console.error("Error al eliminar grupo:", error);
            
            // Manejo específico de errores conocidos
            let errorMsg = 'Error desconocido al eliminar grupo.';
            
            if (error.response) {
                const status = error.response.status;
                const detail = error.response.data?.detail;
                
                if (status === 404) {
                    // Grupo no encontrado
                    errorMsg = 'El grupo no fue encontrado o ya fue eliminado.';
                } else if (status === 400) {
                    // Bad request - posible referencia en otras tablas
                    errorMsg = detail || 'No se puede eliminar el grupo. Puede tener estudiantes asignados.';
                } else if (status === 401) {
                    // No autorizado
                    errorMsg = 'No tienes permisos para eliminar grupos.';
                } else if (status === 403) {
                    // Prohibido
                    errorMsg = 'Acceso denegado para eliminar grupos.';
                } else {
                    // Otros errores del servidor
                    errorMsg = detail || `Error del servidor (${status}).`;
                }
            } else if (error.request) {
                // Error de red
                errorMsg = 'Error de conexión. Verifica tu conexión a internet.';
            }
            
            setFeedback({ 
                message: errorMsg, 
                type: 'error' 
            });
        } finally {
            setIsDeletingGroup(false);
        }
    };

    // Función para abrir el modal de confirmación de eliminación
    const openDeleteModal = (grupo) => {
        setGroupToDelete(grupo);
        setIsDeleteConfirmModalOpen(true);
    };

    // Función para cerrar el modal de confirmación de eliminación
    const closeDeleteModal = () => {
        if (!isDeletingGroup) {
            setIsDeleteConfirmModalOpen(false);
            setGroupToDelete(null);
        }
    };

    // Función para alternar el colapso de semestres
    const toggleSemesterCollapse = (semestre) => {
        setCollapsedSemesters(prev => {
            const newSet = new Set(prev);
            if (newSet.has(semestre)) {
                newSet.delete(semestre);
            } else {
                newSet.add(semestre);
            }
            return newSet;
        });
    };
    // -----------------------------------------

    // Función para organizar grupos por semestre
    const groupsBySemester = () => {
        if (grupos.length === 0) return {};
        
        return grupos.reduce((acc, grupo) => {
            const semestre = grupo.semestre || 'Sin semestre';
            if (!acc[semestre]) {
                acc[semestre] = [];
            }
            acc[semestre].push(grupo);
            return acc;
        }, {});
    };

    // Determina si CUALQUIER formulario/vista está activo
    const formActive = isAddFormVisible || isLinkListViewVisible || isGroupManagementVisible;

    return (
        <main className="dashboard-main">
            <div className="page-title-container">
                <h1 className="page-title">Gestión de Estudiantes</h1>
                <div className="title-decorator"></div>
            </div>

            <div className={`student-management-container ${formActive ? 'form-active' : ''}`}>

                {/* Card/Button 1: Agregar Estudiante */}
                <div className={`action-trigger-card add-student-card ${formActive ? 'hidden' : ''}`} onClick={showAddForm}>
                    <PlusCircle size={64} className="add-icon" />
                    <span>Agregar Nuevo Estudiante</span>
                </div>

                {/* Card/Button 2: Vincular NFC */}
                <div className={`action-trigger-card link-nfc-card ${formActive ? 'hidden' : ''}`} onClick={showLinkListView}>
                    <Link2 size={64} className="link-icon" />
                    <span>Vincular Matrícula con NFC</span>
                </div>

                {/* Card/Button 3: Gestión de Grupos */}
                <div className={`action-trigger-card group-management-card ${formActive ? 'hidden' : ''}`} onClick={showGroupManagement}>
                    <Users size={64} className="group-icon" />
                    <span>Gestión de Grupos</span>
                </div>

                {/* ----- FORMULARIO 1: AGREGAR ESTUDIANTE (Condicional) ----- */}
                {isAddFormVisible && (
                    <div className="student-form-card card">
                        <div className="form-header">
                            <h2 className="card-title">Datos del Nuevo Estudiante</h2>
                            <button onClick={hideAddForm} className="close-form-btn" title="Cerrar formulario"><XCircle size={24} /></button>
                        </div>
                        <form onSubmit={handleSaveStudent}>
                            {feedback.message && ( 
                                <div className={`form-feedback ${feedback.type}`}>
                                    {feedback.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                    {feedback.message}
                                </div> 
                            )}
                            <div className="form-grid">
                                <div className="modal-input-group">
                                    <label htmlFor="studentNombre">Nombre(s):</label>
                                    <input type="text" id="studentNombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                                </div>
                                <div className="modal-input-group">
                                    <label htmlFor="studentApellido">Apellido(s):</label>
                                    <input type="text" id="studentApellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
                                </div>
                                <div className="modal-input-group">
                                    <label htmlFor="studentMatricula">Matrícula:</label>
                                    <input type="text" id="studentMatricula" value={matricula} onChange={(e) => setMatricula(e.target.value)} required />
                                </div>
                                <div className="modal-input-group">
                                    <label htmlFor="studentSalon">Salón (Grupo):</label>
                                    <input type="text" id="studentSalon" value={salonNombre} onChange={(e) => setSalonNombre(e.target.value)} placeholder="Ej: 101, 305, 507" required />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="action-button clear-button" onClick={clearFields} disabled={isSaving}>Limpiar Campos</button>
                                <button type="submit" className="action-button save-button" disabled={isSaving}>
                                    <UserPlus size={18} />{isSaving ? 'Guardando...' : 'Guardar Nuevo Estudiante'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* ----- VISTA 2: VINCULAR NFC (Condicional) ----- */}
                {isLinkListViewVisible && (
                    <div className="student-link-view card">
                        <div className="form-header">
                            <h2 className="card-title">Vincular NFC a Estudiante</h2>
                            <button onClick={hideLinkListView} className="close-form-btn" title="Cerrar vista">
                                <XCircle size={24} />
                            </button>
                        </div>

                        {/* Filtro por Grupo */}
                        <div className="student-group-filter-container">
                            <StudentGroupsNav
                                semesters={semestersData} // ¡Datos de la API!
                                selectedGroup={selectedGroupFilter} // Estado del grupo seleccionado
                                onGroupSelect={setSelectedGroupFilter} // Handler para cambiar grupo
                                showAllOption={true} // Le decimos que muestre "Mostrar Todos"
                            />
                        </div>

                        {/* Feedback global para esta vista (ej. al vincular) */}
                        {feedback.message && feedback.type === 'success' && (
                            <div className={`form-feedback ${feedback.type}`}>
                                <CheckCircle size={18} />
                                {feedback.message}
                            </div>
                        )}

                        {/* Tabla de Estudiantes */}
                        {isLoading ? (
                            <div className="loading-message">Cargando estudiantes...</div>
                        ) : (
                            <StudentLinkTable
                                students={filteredStudents} // Pasa lista filtrada de la API
                                onOpenLinkModal={openLinkModal} // Pasa handler para abrir modal
                            />
                        )}
                    </div>
                )}
                {/* --- FIN VISTA 2 --- */}

                {/* ----- VISTA 3: GESTIÓN DE GRUPOS (Condicional) ----- */}
                {isGroupManagementVisible && (
                    <div className="group-management-view card">
                        <div className="form-header">
                            <h2 className="card-title">Gestión de Grupos</h2>
                            <button onClick={hideGroupManagement} className="close-form-btn" title="Cerrar vista">
                                <XCircle size={24} />
                            </button>
                        </div>

                        {/* Feedback global para esta vista */}
                        {feedback.message && (
                            <div className={`form-feedback ${feedback.type}`}>
                                {feedback.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                {feedback.message}
                            </div>
                        )}

                        {/* Lista de grupos existentes - SECCIÓN PRINCIPAL */}
                        <div className="groups-list-section main-section">
                            <div className="section-header">
                                <div className="title-group">
                                    <h3 className="form-section-title">Grupos Existentes</h3>
                                    {grupos.length > 0 && (
                                        <span className="groups-counter">
                                            {grupos.length} grupo{grupos.length !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>
                                <button 
                                    type="button"
                                    className="action-button add-button compact"
                                    onClick={() => setIsCreateGroupModalOpen(true)}
                                    disabled={isLoadingGroups}
                                    title="Crear nuevo grupo"
                                >
                                    <PlusCircle size={16} />
                                    Nuevo Grupo
                                </button>
                            </div>

                            {isLoadingGroups ? (
                                <div className="loading-message">Cargando grupos...</div>
                            ) : grupos.length === 0 ? (
                                <div className="no-groups-message">
                                    <Users size={64} className="placeholder-icon" />
                                    <h4>No hay grupos creados aún</h4>
                                    <p>Los grupos te permiten organizar estudiantes por semestre y turno.</p>
                                    <button 
                                        type="button"
                                        className="action-button add-button"
                                        onClick={() => setIsCreateGroupModalOpen(true)}
                                    >
                                        <PlusCircle size={18} />
                                        Crear mi primer grupo
                                    </button>
                                </div>
                            ) : (
                                <div className="groups-by-semester">
                                    {Object.entries(groupsBySemester())
                                        .sort(([a], [b]) => {
                                            if (a === 'Sin semestre') return 1;
                                            if (b === 'Sin semestre') return -1;
                                            return parseInt(a) - parseInt(b);
                                        })
                                        .map(([semestre, gruposSemestre]) => (
                                        <div key={semestre} className="semester-section">
                                            <button 
                                                className="semester-title-button"
                                                onClick={() => toggleSemesterCollapse(semestre)}
                                                aria-expanded={!collapsedSemesters.has(semestre)}
                                            >
                                                <h4 className="semester-title">
                                                    {semestre === 'Sin semestre' ? 
                                                        'Grupos sin semestre asignado' : 
                                                        `${semestre}° Semestre`
                                                    }
                                                    <span className="semester-count">
                                                        ({gruposSemestre.length} grupo{gruposSemestre.length !== 1 ? 's' : ''})
                                                    </span>
                                                </h4>
                                                <ChevronDown 
                                                    size={20} 
                                                    className={`semester-chevron ${collapsedSemesters.has(semestre) ? 'collapsed' : ''}`}
                                                />
                                            </button>
                                            
                                            <div className={`semester-content ${collapsedSemesters.has(semestre) ? 'collapsed' : 'expanded'}`}>
                                                <div className="groups-grid">
                                                {gruposSemestre.map((grupo) => (
                                                    <div key={grupo.id} className="group-card">
                                                        <div className="group-card-header">
                                                            <div className="group-info-section">
                                                                <h4 className="group-name">
                                                                    {grupo.nombre ? grupo.nombre : `Sin nombre (ID: ${grupo.id})`}
                                                                </h4>
                                                                <div className="group-badges">
                                                                    <span className="group-turno">{grupo.turno}</span>
                                                                    <span className="group-semestre">{grupo.semestre}° Sem</span>
                                                                </div>
                                                            </div>
                                                            <div className="group-actions">
                                                                <button 
                                                                    className="edit-group-btn"
                                                                    onClick={() => openEditModal(grupo)}
                                                                    title="Editar grupo"
                                                                >
                                                                    <Edit3 size={18} />
                                                                </button>
                                                                <button 
                                                                    className="delete-group-btn"
                                                                    onClick={() => openDeleteModal(grupo)}
                                                                    title="Eliminar grupo"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="group-card-body">
                                                            {grupo.nombre === "" && (
                                                                <p className="group-warning">
                                                                    ⚠️ Este grupo no tiene nombre asignado
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {/* --- FIN VISTA 3 --- */}
            </div>

            {/* --- MODAL PARA INGRESAR NFC (se muestra sobre todo) --- */}
            <LinkNfcModal
                isOpen={isLinkModalOpen}
                onClose={closeLinkModal}
                onSubmit={submitNfcLink} // Pasa el "interruptor" para guardar
                studentName={studentToLink ? `${studentToLink.nombre} ${studentToLink.apellido}` : ''} // Pasa el nombre del estudiante
                isSaving={isSaving} // Pasa el estado de guardado
            />
            {/* --- FIN MODAL NFC --- */}

            {/* --- MODAL PARA CREAR GRUPO (se muestra sobre todo) --- */}
            <CreateGroupModal
                isOpen={isCreateGroupModalOpen}
                onClose={() => setIsCreateGroupModalOpen(false)}
                onSubmit={handleCreateGroup}
                isCreating={isAddingGroup}
            />
            {/* --- FIN MODAL CREAR GRUPO --- */}

            {/* --- MODAL PARA EDITAR GRUPO --- */}
            <EditGroupModal
                isOpen={isEditGroupModalOpen}
                onClose={closeEditModal}
                onSubmit={handleUpdateGroup}
                isLoading={isUpdatingGroup}
                groupData={groupToEdit}
            />
            {/* --- FIN MODAL EDITAR GRUPO --- */}

            {/* --- MODAL PARA ELIMINAR GRUPO --- */}
            <DeleteGroupModal
                isOpen={isDeleteConfirmModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteGroup}
                isDeleting={isDeletingGroup}
                groupData={groupToDelete}
            />
            {/* --- FIN MODAL ELIMINAR GRUPO --- */}
        </main>
    );
};

export default GestionEstudiantesPage;