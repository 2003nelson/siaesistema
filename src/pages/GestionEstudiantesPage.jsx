// src/pages/GestionEstudiantesPage.jsx
import React, { useState, useEffect, } from 'react';
// 1. Importa los iconos y los nuevos componentes que usaremos
import { PlusCircle, UserPlus, XCircle, Link2 } from 'lucide-react';
import StudentGroupsNav from '../components/Dashboard/StudentGroupsNav.jsx'; // Reutilizamos el filtro de grupos
import StudentLinkTable from '../components/Students/StudentLinkTable.jsx'; // Componente nuevo para la tabla
import LinkNfcModal from '../components/Students/LinkNfcModal.jsx'; // Componente nuevo para el modal

// --- MOCK DATA ---
// Simula los grupos/salones existentes para el filtro
const MOCK_GROUPS = {
    '1er Semestre': ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110'],
    '3er Semestre': ['301', '302', '303', '304', '305', '306', '307', '308'],
    '5to Semestre': ['501', '502', '503', '504', '505', '506', '507'],
};
// Simula estudiantes ya registrados (algunos con NFC, otros no)
const MOCK_STUDENTS = [
    { id: 's100', nombre: 'Elena Rodríguez', grupo: '101', matricula: 'MATRICULA001', nfcId: null },
    { id: 's101', nombre: 'Mario Fernández', grupo: '102', matricula: 'MATRICULA002', nfcId: null },
    { id: 's102', nombre: 'Camila Torres', grupo: '301', matricula: 'MATRICULA003', nfcId: null },
    { id: 's103', nombre: 'David Sánchez', grupo: '301', matricula: 'MATRICULA004', nfcId: 'linked_nfc_123' }, // Ya vinculado
    { id: 's104', nombre: 'Isabela Ramírez', grupo: '505', matricula: 'MATRICULA005', nfcId: null },
    { id: 's105', nombre: 'Javier Gómez', grupo: '101', matricula: 'MATRICULA006', nfcId: null },
    { id: 's106', nombre: 'Valentina Soto', grupo: '302', matricula: 'MATRICULA007', nfcId: null },
];
// --- FIN MOCK DATA ---


const GestionEstudiantesPage = () => {
    // Estado para visibilidad de formularios
    const [isAddFormVisible, setIsAddFormVisible] = useState(false);
    // 2. Renombra el estado para la vista de lista de vinculación
    const [isLinkListViewVisible, setIsLinkListViewVisible] = useState(false);

    // Estado para formulario "Agregar"
    const [nombre, setNombre] = useState('');
    const [matriculaAdd, setMatriculaAdd] = useState('');
    const [grupo, setGrupo] = useState('');

    // 3. Estados para la lista y filtro de "Vincular"
    const [allStudents, setAllStudents] = useState([]); // Lista completa de la API
    const [filteredStudents, setFilteredStudents] = useState([]); // Lista filtrada por grupo
    const [selectedGroupFilter, setSelectedGroupFilter] = useState('all'); // Grupo seleccionado

    // 4. Estados para el MODAL de vincular NFC
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [studentToLink, setStudentToLink] = useState(null); // Guarda el {id, nombre} del estudiante

    // Estados generales
    const [isLoading, setIsLoading] = useState(false); // Para la lista de estudiantes
    const [isSaving, setIsSaving] = useState(false); // Para los formularios
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    // --- Control de Vistas ---
    const showAddForm = () => { setIsAddFormVisible(true); setIsLinkListViewVisible(false); clearFields(); };
    const hideAddForm = () => setIsAddFormVisible(false);
    const showLinkListView = () => { setIsLinkListViewVisible(true); setIsAddFormVisible(false); clearFields(); };
    const hideLinkListView = () => setIsLinkListViewVisible(false);

    // Limpia campos (solo para Add form por ahora, el filtro se maneja diferente)
    const clearFields = () => {
        setNombre(''); setMatriculaAdd(''); setGrupo('');
        setSelectedGroupFilter('all'); setStudentToLink(null);
        setFeedback({ message: '', type: '' });
    };

    // *** INTERRUPTOR #1: Cargar Lista de Estudiantes (para Vincular) ***
    useEffect(() => {
        // Solo carga si la vista de lista está activa
        if (!isLinkListViewVisible) return;

        setIsLoading(true);
        const fetchStudents = async () => {
            console.log("API Call: Obteniendo lista de estudiantes...");
            try {
                // --- TODO: API GET /estudiantes (debe devolver id, nombre, grupo, matricula, nfcId) ---
                await new Promise(resolve => setTimeout(resolve, 500)); // Simula API
                const data = MOCK_STUDENTS;
                // ----------------------------------------------------
                setAllStudents(data);
                setFilteredStudents(data); // Inicialmente muestra todos
                setSelectedGroupFilter('all'); // Resetea filtro
            } catch (error) {
                console.error("Error al obtener estudiantes:", error);
                setFeedback({ message: 'Error al cargar estudiantes.', type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchStudents();
    }, [isLinkListViewVisible]); // Se ejecuta cuando se abre la vista de vincular

    // *** INTERRUPTOR #2: Filtrar Estudiantes por Grupo (Localmente) ***
    useEffect(() => {
        if (selectedGroupFilter === 'all') {
            setFilteredStudents(allStudents);
        } else {
            const filtered = allStudents.filter(student => student.grupo === selectedGroupFilter);
            setFilteredStudents(filtered);
        }
        // --- TODO: API ---
        // Si tu API filtra, este useEffect desaparece y
        // selectedGroupFilter se añade como dependencia en useEffect #1.
    }, [selectedGroupFilter, allStudents]);

    // *** INTERRUPTOR #3: Guardar Nuevo Estudiante ***
    const handleSaveStudent = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setFeedback({ message: '', type: '' });
        const newStudentData = { nombre, matricula: matriculaAdd, grupo };
        console.log("API Call: Guardando nuevo estudiante:", newStudentData);
        // --- TODO: API POST /estudiantes ---
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simula
        const savedStudent = { ...newStudentData, id: `stu-${Date.now()}`, nfcId: null };
        // -----------------------------------
        setFeedback({ message: '¡Estudiante guardado! (Simulación)', type: 'success' });
        // Añade el nuevo estudiante a la lista local (por si el usuario va a vincularlo)
        setAllStudents(prev => [...prev, savedStudent]);
        clearFields();
        setIsSaving(false);
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

        const linkData = {
            studentId: studentToLink.id,
            nfcId: nfcId,
        };
        console.log("API Call: Vinculando NFC...", linkData);
        // --- TODO: API POST or PATCH /estudiantes/{studentId}/link-nfc ---
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simula API success
            // ----------------------------------------------------------------------
            // Muestra el feedback en la vista principal
            setFeedback({ message: `¡NFC vinculado a ${studentToLink.nombre}! (Simulación)`, type: 'success' });

            // Actualiza la lista local para reflejar el cambio (deshabilita el botón)
            setAllStudents(prevStudents => prevStudents.map(s =>
                s.id === studentToLink.id ? { ...s, nfcId: nfcId } : s
            ));
            // filteredStudents se actualizará automáticamente por useEffect #2

            closeLinkModal(); // Cierra el modal de vincular
        } catch (error) {
             console.error("Error al vincular NFC:", error);
             // Idealmente, LinkNfcModal manejaría su propio estado de error
             setFeedback({ message: `Error: ${error.message}`, type: 'error' });
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
                                    <label htmlFor="studentName">Nombre Completo:</label>
                                    <input type="text" id="studentName" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                                </div>
                                <div className="modal-input-group">
                                    <label htmlFor="studentMatriculaAdd">Matrícula:</label>
                                    <input type="text" id="studentMatriculaAdd" value={matriculaAdd} onChange={(e) => setMatriculaAdd(e.target.value)} required />
                                </div>
                                <div className="modal-input-group">
                                    <label htmlFor="studentGrupo">Grupo:</label>
                                    <input type="text" id="studentGrupo" value={grupo} onChange={(e) => setGrupo(e.target.value)} placeholder="Ej: 101, 305, 507" required />
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
                                semesters={MOCK_GROUPS} // Pasa los grupos disponibles
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
                                students={filteredStudents} // Pasa lista filtrada
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
                studentName={studentToLink?.nombre || ''} // Pasa el nombre del estudiante
                isSaving={isSaving} // Pasa el estado de guardado
            />
             {/* --- FIN MODAL --- */}
        </main>
    );
};

export default GestionEstudiantesPage;