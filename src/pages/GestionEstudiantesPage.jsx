// src/pages/GestionEstudiantesPage.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios'; // Importamos el cliente API
import { PlusCircle, UserPlus, XCircle, Link2 } from 'lucide-react';
import StudentGroupsNav from '../components/Dashboard/StudentGroupsNav.jsx'; // Reutilizamos el filtro de grupos
import StudentLinkTable from '../components/Students/StudentLinkTable.jsx'; // Componente nuevo para la tabla
import LinkNfcModal from '../components/Students/LinkNfcModal.jsx'; // Componente nuevo para el modal

// --- ¡MOCK DATA ELIMINADO! ---

const GestionEstudiantesPage = () => {
    // Estado para visibilidad de formularios
    const [isAddFormVisible, setIsAddFormVisible] = useState(false);
    const [isLinkListViewVisible, setIsLinkListViewVisible] = useState(false);

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
    const showAddForm = () => { setIsAddFormVisible(true); setIsLinkListViewVisible(false); clearFields(); };
    const hideAddForm = () => setIsAddFormVisible(false);
    const showLinkListView = () => { setIsLinkListViewVisible(true); setIsAddFormVisible(false); clearFields(); };
    const hideLinkListView = () => setIsLinkListViewVisible(false);

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
    // -----------------------------------------

    // Determina si CUALQUIER formulario/vista está activo
    const formActive = isAddFormVisible || isLinkListViewVisible;

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

                {/* ----- FORMULARIO 1: AGREGAR ESTUDIANTE (Condicional) ----- */}
                {isAddFormVisible && (
                    <div className="student-form-card card">
                        <div className="form-header">
                            <h2 className="card-title">Datos del Nuevo Estudiante</h2>
                            <button onClick={hideAddForm} className="close-form-btn" title="Cerrar formulario"><XCircle size={24} /></button>
                        </div>
                        <form onSubmit={handleSaveStudent}>
                            {feedback.message && ( <div className={`form-feedback ${feedback.type}`}>{feedback.message}</div> )}
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
                            <div className={`form-feedback ${feedback.type}`}>{feedback.message}</div>
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
            </div>

            {/* --- MODAL PARA INGRESAR NFC (se muestra sobre todo) --- */}
            <LinkNfcModal
                isOpen={isLinkModalOpen}
                onClose={closeLinkModal}
                onSubmit={submitNfcLink} // Pasa el "interruptor" para guardar
                studentName={studentToLink ? `${studentToLink.nombre} ${studentToLink.apellido}` : ''} // Pasa el nombre del estudiante
                isSaving={isSaving} // Pasa el estado de guardado
            />
            {/* --- FIN MODAL --- */}
        </main>
    );
};

export default GestionEstudiantesPage;