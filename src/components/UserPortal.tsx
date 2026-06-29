import React, { useState } from 'react';
import { Search, Filter, PawPrint, FileText, Info, HelpCircle, CheckCircle, AlertTriangle, Trash2, PlusCircle, Check, X, ShieldAlert, Landmark } from 'lucide-react';
import { Tramite, Mascota } from '../types';

interface UserPortalProps {
  tramites: Tramite[];
  mascotas: Mascota[];
  onAddPet: (pet: Mascota) => void;
  onDeletePet: (petId: string, rut: string) => boolean;
}

export default function UserPortal({ tramites, mascotas, onAddPet, onDeletePet }: UserPortalProps) {
  // HU-03 State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedOnlineStatus, setSelectedOnlineStatus] = useState('Todos'); // 'Todos' | 'Online' | 'Presencial'
  const [activeTramiteId, setActiveTramiteId] = useState<string | null>(null);

  // HU-01 State & Modals
  const [activeTab, setActiveTab] = useState<'tramites' | 'mascotas'>('tramites');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form states for Pet Registration
  const [petForm, setPetForm] = useState({
    rutDueno: '',
    nombreDueno: '',
    nombreMascota: '',
    especie: 'Perro',
    raza: '',
    edad: '',
    microchip: '',
    vacunaAntirrabica: true,
    certificadoSanitario: true
  });

  // Query State
  const [queryRut, setQueryRut] = useState('');
  const [queryResults, setQueryResults] = useState<Mascota[] | null>(null);
  const [hasQueried, setHasQueried] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState('');
  const [deleteRut, setDeleteRut] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState<boolean | null>(null);
  const [deleteMessage, setDeleteMessage] = useState('');

  // Notifications
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Categories list derived from initial tramites
  const categories = ['Todos', ...Array.from(new Set(tramites.map(t => t.categoria)))];

  // HU-03 Filter and Search logic
  const filteredTramites = tramites.filter(t => {
    const matchesSearch = t.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.requisitos.some(r => r.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'Todos' || t.categoria === selectedCategory;
    const matchesOnline = selectedOnlineStatus === 'Todos' || 
                          (selectedOnlineStatus === 'Online' && t.enLinea) || 
                          (selectedOnlineStatus === 'Presencial' && !t.enLinea);
    return matchesSearch && matchesCategory && matchesOnline;
  });

  // Handle Pet Registration submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petForm.rutDueno || !petForm.nombreDueno || !petForm.nombreMascota) {
      alert("Por favor complete los campos obligatorios (RUT, Nombre Dueño, Nombre Mascota).");
      return;
    }

    const newPetId = `REG-PET-${Math.floor(100 + Math.random() * 900)}`;
    const newPet: Mascota = {
      id: newPetId,
      rutDueno: petForm.rutDueno,
      nombreDueno: petForm.nombreDueno,
      nombreMascota: petForm.nombreMascota,
      especie: petForm.especie,
      raza: petForm.raza || "No especificada",
      edad: Number(petForm.edad) || 1,
      microchip: petForm.microchip || "No posee / No ingresado",
      vacunaAntirrabica: petForm.vacunaAntirrabica,
      certificadoSanitario: petForm.certificadoSanitario,
      fechaRegistro: new Date().toISOString().split('T')[0],
      estado: 'Pendiente'
    };

    onAddPet(newPet);
    setIsRegisterModalOpen(false);
    
    // Clear form
    setPetForm({
      rutDueno: '',
      nombreDueno: '',
      nombreMascota: '',
      especie: 'Perro',
      raza: '',
      edad: '',
      microchip: '',
      vacunaAntirrabica: true,
      certificadoSanitario: true
    });

    setNotification({
      message: `¡Registro exitoso! Guarde su ID de registro: ${newPetId} para consultas futuras.`,
      type: 'success'
    });
    setTimeout(() => setNotification(null), 8000);
  };

  // Handle Pet Query
  const handlePetQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryRut.trim()) return;
    
    // Search in current state mascotas
    const found = mascotas.filter(m => m.rutDueno.replace(/\s/g, '').replace(/\./g, '').toLowerCase() === queryRut.replace(/\s/g, '').replace(/\./g, '').toLowerCase());
    setQueryResults(found);
    setHasQueried(true);
  };

  // Handle Pet Deletion
  const handlePetDeleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteId.trim() || !deleteRut.trim()) return;

    const wasDeleted = onDeletePet(deleteId.trim(), deleteRut.trim());
    if (wasDeleted) {
      setDeleteSuccess(true);
      setDeleteMessage(`El registro con ID ${deleteId} ha sido eliminado de forma permanente de la base de datos de aduana.`);
      // Clear fields
      setDeleteId('');
      setDeleteRut('');
    } else {
      setDeleteSuccess(false);
      setDeleteMessage("No se encontró ningún registro que coincida exactamente con el ID y RUT de dueño ingresados, o bien el registro no pudo ser borrado.");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="user-portal-root">
      
      {/* Toast Notification */}
      {notification && (
        <div 
          id="toast-notification"
          className={`fixed bottom-5 right-5 z-50 max-w-md p-4 rounded-xl shadow-2xl flex items-start gap-3 border transition-all duration-300 transform translate-y-0 ${
            notification.type === 'success' 
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          <CheckCircle className={`h-5 w-5 shrink-0 ${notification.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`} />
          <div>
            <p className="font-bold text-sm">Notificación del Sistema</p>
            <p className="text-xs mt-0.5">{notification.message}</p>
          </div>
          <button onClick={() => setNotification(null)} className="ml-auto text-slate-400 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-[#002f6c] to-[#0a4d9a] text-white rounded-3xl p-6 md:p-10 shadow-lg relative overflow-hidden" id="user-hero-banner">
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-12 -translate-y-12">
          <Landmark className="h-96 w-96 text-white" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="bg-[#f2a900] text-blue-950 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Portal de Trámites al Viajero
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-3 tracking-tight">
            Bienvenido al Control de Fronteras de Chile
          </h2>
          <p className="text-slate-200 text-sm md:text-base mt-2 leading-relaxed">
            Aquí puede buscar trámites obligatorios para entrar o salir de Chile, registrar mascotas para transporte fitozoosanitario e informarse sobre las normativas vigentes del Servicio de Aduanas y el SAG.
          </p>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setActiveTab('tramites')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                activeTab === 'tramites'
                  ? 'bg-[#f2a900] text-blue-950 shadow-md scale-105'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              id="btn-tab-tramites"
            >
              <FileText className="inline h-4 w-4 mr-2" />
              Guía de Trámites y Requisitos
            </button>
            <button
              onClick={() => setActiveTab('mascotas')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                activeTab === 'mascotas'
                  ? 'bg-[#f2a900] text-blue-950 shadow-md scale-105'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              id="btn-tab-mascotas"
            >
              <PawPrint className="inline h-4 w-4 mr-2" />
              Ingreso de Mascotas (HU-01)
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content 1: TRÁMITES E INFORMACIÓN (HU-03) */}
      {activeTab === 'tramites' && (
        <div className="space-y-6" id="panel-tramites">
          {/* Header & Interactive Filters */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="text-[#002f6c] h-5 w-5" />
                  Buscador Oficial de Trámites de Frontera (HU-03)
                </h3>
                <p className="text-slate-500 text-xs">
                  Ingrese palabras clave o seleccione los filtros desplegables para ver requisitos y canales de atención.
                </p>
              </div>

              {/* Stats badge */}
              <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs text-slate-600 flex items-center gap-2 self-start md:self-auto">
                <span>Resultados:</span>
                <strong className="text-[#002f6c] font-bold text-sm">{filteredTramites.length}</strong>
              </div>
            </div>

            {/* Search and Filters Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Search input (HU-03 Esc 2) */}
              <div className="relative md:col-span-6">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar trámite por nombre, palabras clave (ej. vehículo, equipaje, dinero, SAG)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002f6c] focus:bg-white"
                  id="input-busqueda-tramites"
                />
              </div>

              {/* Category Filter Dropdown (HU-03 Esc 3) */}
              <div className="relative md:col-span-3">
                <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Filter className="h-4 w-4" />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#002f6c] focus:bg-white appearance-none"
                  id="select-filtro-categoria"
                >
                  <option disabled value="">Filtrar Categoría</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat === 'Todos' ? 'Todas las Categorías' : cat}</option>
                  ))}
                </select>
              </div>

              {/* Online/Presencial Filter Dropdown (HU-03 Esc 3) */}
              <div className="relative md:col-span-3">
                <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Info className="h-4 w-4" />
                </div>
                <select
                  value={selectedOnlineStatus}
                  onChange={(e) => setSelectedOnlineStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#002f6c] focus:bg-white appearance-none"
                  id="select-filtro-modalidad"
                >
                  <option value="Todos">Todas las Modalidades</option>
                  <option value="Online">Realizable en línea (Sí)</option>
                  <option value="Presencial">Solo Presencial / Oficina</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid of Tramites */}
          {filteredTramites.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-12 text-center" id="no-tramites-found">
              <HelpCircle className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-700 font-semibold text-lg">No se encontraron trámites</p>
              <p className="text-slate-500 text-xs mt-1">
                Intente modificar el término de búsqueda o restablecer los filtros para volver a ver los trámites.
              </p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('Todos'); setSelectedOnlineStatus('Todos'); }}
                className="mt-4 px-4 py-2 bg-[#002f6c] text-white text-xs font-semibold rounded-lg hover:bg-[#0a4d9a] cursor-pointer"
              >
                Limpiar Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="tramites-results-grid">
              {/* List of Tramites Cards */}
              <div className="lg:col-span-5 space-y-3">
                {filteredTramites.map((tramite) => (
                  <div
                    key={tramite.id}
                    id={`tramite-card-${tramite.id}`}
                    onClick={() => setActiveTramiteId(tramite.id)}
                    className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer text-left ${
                      activeTramiteId === tramite.id
                        ? 'bg-blue-50/80 border-[#002f6c] ring-2 ring-blue-100'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm shadow-2xs'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[10px] font-bold text-[#002f6c] uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                        {tramite.categoria}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        tramite.enLinea ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {tramite.enLinea ? '✓ En Línea' : '• Presencial'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mt-2 hover:text-[#002f6c]">
                      {tramite.titulo}
                    </h4>
                    <p className="text-slate-500 text-xs mt-1 line-clamp-2">
                      {tramite.descripcion}
                    </p>
                    <div className="mt-3 flex justify-between items-center text-[11px] text-slate-400">
                      <span>Costo: <strong className="text-slate-600">{tramite.costo}</strong></span>
                      <span className="text-[#002f6c] font-semibold flex items-center gap-1">
                        Ver requisitos →
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Detail view of selected Tramite */}
              <div className="lg:col-span-7">
                {activeTramiteId ? (
                  (() => {
                    const selected = tramites.find(t => t.id === activeTramiteId);
                    if (!selected) return null;
                    return (
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-6 space-y-6 text-left" id="tramite-details-panel">
                        <div className="border-b border-slate-100 pb-4">
                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="bg-[#002f6c] text-white text-[10px] font-bold px-2.5 py-0.5 rounded">
                              {selected.categoria}
                            </span>
                            <span className="text-slate-400 text-xs">ID: {selected.id}</span>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mt-2">
                            {selected.titulo}
                          </h3>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Descripción del Trámite</h5>
                            <p className="text-slate-700 text-sm mt-1 leading-relaxed">
                              {selected.descripcion}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div>
                              <h6 className="text-[10px] font-bold text-slate-400 uppercase">¿Se puede realizar en línea?</h6>
                              <div className="mt-1 flex items-center gap-2">
                                <span className={`h-2.5 w-2.5 rounded-full ${selected.enLinea ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                <strong className="text-sm text-slate-800">{selected.enLinea ? 'Sí, trámite 100% digital' : 'No, requiere trámite físico en frontera'}</strong>
                              </div>
                            </div>
                            <div>
                              <h6 className="text-[10px] font-bold text-slate-400 uppercase">Costo Asociado</h6>
                              <p className="mt-1 text-sm font-bold text-slate-800">{selected.costo}</p>
                            </div>
                          </div>

                          <div>
                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                              <Check className="h-4 w-4 text-emerald-600" />
                              Requisitos para la presentación (Criterio HU-03)
                            </h5>
                            <ul className="mt-2.5 space-y-2 text-sm text-slate-700">
                              {selected.requisitos.map((req, idx) => (
                                <li key={idx} className="flex gap-2.5 items-start bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                                  <span className="bg-[#002f6c] text-white rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                                    {idx + 1}
                                  </span>
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="bg-blue-50/40 p-4 rounded-xl border border-blue-100/60 flex gap-3">
                          <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                          <div className="text-xs text-slate-600 leading-relaxed">
                            <strong>Nota importante de Aduanas:</strong> Los antecedentes declarados falsos o no declarados constituyen delito de contrabando según el artículo 168 de la Ordenanza de Aduanas y serán sancionados penalmente.
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-16 text-center h-full flex flex-col items-center justify-center">
                    <Info className="h-10 w-10 text-slate-400 mb-2" />
                    <p className="text-slate-700 font-bold">Seleccione un trámite de la lista</p>
                    <p className="text-slate-400 text-xs mt-1">
                      Haga click sobre cualquier trámite del panel izquierdo para desplegar sus requisitos, costos y modalidades de atención detalladas.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: CONTROL DE MASCOTAS (HU-01) */}
      {activeTab === 'mascotas' && (
        <div className="space-y-6 text-left" id="panel-mascotas">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <PawPrint className="text-[#002f6c] h-5 w-5" />
                  Registro de Viaje para Mascotas (HU-01)
                </h3>
                <p className="text-slate-500 text-xs">
                  Para ingresar o salir de Chile con animales de compañía (perros, gatos, hurones), debe obligatoriamente registrar su viaje y certificar el estado sanitario oficial.
                </p>
              </div>

              {/* Quick Status Count */}
              <div className="bg-[#002f6c]/5 px-3 py-1.5 rounded-lg border border-[#002f6c]/10 text-xs text-[#002f6c] font-medium flex items-center gap-2">
                <span>Total Registros en el Sistema:</span>
                <span className="bg-[#002f6c] text-white font-bold text-xs px-2 py-0.5 rounded">
                  {mascotas.length}
                </span>
              </div>
            </div>

            {/* Grid of the 3 key actions requested in HU-01 (Escenarios 1, 2, 3) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8" id="mascota-actions-grid">
              
              {/* Card 1: Registrar Mascota (HU-01 Escenario 1) */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:border-blue-300 transition-colors" id="card-action-registrar">
                <div>
                  <div className="bg-blue-100 p-3 rounded-xl w-12 h-12 flex items-center justify-center text-[#002f6c] mb-4">
                    <PlusCircle className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-base text-slate-950">1. Crear Registro</h4>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    Inicie la solicitud de viaje para su mascota completando el formulario obligatorio con microchip, vacunas y datos del tutor.
                  </p>
                </div>
                <button
                  id="btn-abrir-registrar-mascota"
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="mt-5 w-full bg-[#002f6c] text-white py-2 px-4 text-xs font-bold rounded-lg hover:bg-[#0a4d9a] hover:shadow transition-all cursor-pointer text-center"
                >
                  Registrar Mascota
                </button>
              </div>

              {/* Card 2: Consultar Estado (HU-01 Escenario 2) */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:border-yellow-400 transition-colors" id="card-action-consultar">
                <div>
                  <div className="bg-amber-100 p-3 rounded-xl w-12 h-12 flex items-center justify-center text-amber-800 mb-4">
                    <Search className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-base text-slate-950">2. Consultar Estado de Registro</h4>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    Consulte el estado sanitario y aprobación fitozoosanitaria del viaje de su mascota ingresando el RUT del tutor.
                  </p>
                </div>
                <button
                  id="btn-abrir-consultar-mascota"
                  onClick={() => {
                    setIsQueryModalOpen(true);
                    setHasQueried(false);
                    setQueryRut('');
                    setQueryResults(null);
                  }}
                  className="mt-5 w-full bg-slate-200 text-slate-800 py-2 px-4 text-xs font-bold rounded-lg hover:bg-slate-300 transition-all cursor-pointer text-center"
                >
                  Ver estado de mi Registro
                </button>
              </div>

              {/* Card 3: Eliminar Registro (HU-01 Escenario 3) */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:border-red-300 transition-colors" id="card-action-eliminar">
                <div>
                  <div className="bg-red-50 p-3 rounded-xl w-12 h-12 flex items-center justify-center text-red-700 mb-4">
                    <Trash2 className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-base text-slate-950">3. Eliminar Registro</h4>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    Si desistió de viajar con la mascota o requiere corregir datos, elimine definitivamente el registro con su RUT e ID de registro.
                  </p>
                </div>
                <button
                  id="btn-abrir-eliminar-mascota"
                  onClick={() => {
                    setIsDeleteModalOpen(true);
                    setDeleteSuccess(null);
                    setDeleteMessage('');
                    setDeleteId('');
                    setDeleteRut('');
                  }}
                  className="mt-5 w-full bg-red-50 text-red-700 hover:bg-red-100 py-2 px-4 text-xs font-bold rounded-lg border border-red-200 transition-all cursor-pointer text-center"
                >
                  Eliminar registro
                </button>
              </div>

            </div>
          </div>

          {/* Quick Informational Section on Pet Travel requirements */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row gap-5 items-center">
            <div className="bg-[#002f6c]/10 text-[#002f6c] p-4 rounded-full">
              <PawPrint className="h-8 w-8 text-[#002f6c]" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Requisitos Sanitarios Cruciales (SAG Chile)</h4>
              <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                El Servicio Agrícola y Ganadero (SAG) exige que toda mascota que entre a Chile posea un Certificado de Salud oficial emitido por la entidad veterinaria estatal del país de procedencia, vacuna antirrábica vigente (mínimo 21 días de antigüedad) y desparasitaciones dentro de los 30 días previos. Los registros con estados de "Pendiente" deben ser aprobados por inspectores SAG en frontera.
              </p>
            </div>
          </div>
        </div>
      )}


      {/* ================= MODAL 1: REGISTRAR MASCOTA (HU-01 Escenario 1) ================= */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="modal-registrar-mascota">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden text-left animate-in fade-in zoom-in duration-200">
            <div className="bg-[#002f6c] text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-base flex items-center gap-2">
                <PawPrint className="h-5 w-5 text-[#f2a900]" />
                Formulario de Registro de Mascota
              </h3>
              <button 
                id="close-modal-registrar"
                onClick={() => setIsRegisterModalOpen(false)} 
                className="text-white hover:text-slate-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4">
              <p className="text-slate-500 text-xs border-b border-slate-100 pb-2">
                Ingrese la información obligatoria de la mascota y del tutor de viaje para generar el código de tránsito.
              </p>

              {/* Tutor Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">RUT Tutor *</label>
                  <input
                    type="text"
                    required
                    placeholder="12.345.678-9"
                    value={petForm.rutDueno}
                    onChange={(e) => setPetForm({ ...petForm, rutDueno: e.target.value })}
                    className="mt-1 w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#002f6c]"
                    id="input-pet-rut"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Juan Pérez Silva"
                    value={petForm.nombreDueno}
                    onChange={(e) => setPetForm({ ...petForm, nombreDueno: e.target.value })}
                    className="mt-1 w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#002f6c]"
                    id="input-pet-tutor-nombre"
                  />
                </div>
              </div>

              {/* Pet Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Nombre de Mascota *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Rocco"
                    value={petForm.nombreMascota}
                    onChange={(e) => setPetForm({ ...petForm, nombreMascota: e.target.value })}
                    className="mt-1 w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#002f6c]"
                    id="input-pet-nombre"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Especie</label>
                  <select
                    value={petForm.especie}
                    onChange={(e) => setPetForm({ ...petForm, especie: e.target.value })}
                    className="mt-1 w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-700 focus:outline-none focus:border-[#002f6c]"
                    id="input-pet-especie"
                  >
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                    <option value="Hurón">Hurón</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Raza</label>
                  <input
                    type="text"
                    placeholder="Ej. Poodle, Mestizo"
                    value={petForm.raza}
                    onChange={(e) => setPetForm({ ...petForm, raza: e.target.value })}
                    className="mt-1 w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#002f6c]"
                    id="input-pet-raza"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Edad (Años)</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    placeholder="Ej. 2"
                    value={petForm.edad}
                    onChange={(e) => setPetForm({ ...petForm, edad: e.target.value })}
                    className="mt-1 w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#002f6c]"
                    id="input-pet-edad"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase">Número de Microchip (15 dígitos)</label>
                <input
                  type="text"
                  placeholder="Ej. 900115000213456"
                  value={petForm.microchip}
                  onChange={(e) => setPetForm({ ...petForm, microchip: e.target.value })}
                  className="mt-1 w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#002f6c]"
                  id="input-pet-microchip"
                />
              </div>

              {/* Checklist */}
              <div className="bg-slate-50 p-3 rounded-lg space-y-2 border border-slate-100">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Declaración de Documentos Oficiales</label>
                
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={petForm.vacunaAntirrabica}
                    onChange={(e) => setPetForm({ ...petForm, vacunaAntirrabica: e.target.checked })}
                    className="rounded text-[#002f6c] focus:ring-[#002f6c]"
                    id="check-pet-antirrabica"
                  />
                  <span>Posee Vacuna Antirrábica al día (Obligatorio)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={petForm.certificadoSanitario}
                    onChange={(e) => setPetForm({ ...petForm, certificadoSanitario: e.target.checked })}
                    className="rounded text-[#002f6c] focus:ring-[#002f6c]"
                    id="check-pet-certificado"
                  />
                  <span>Posee Certificado Sanitario Oficial (SAG / País origen)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
                  id="btn-confirmar-registrar"
                >
                  <Check className="h-4 w-4" />
                  Crear Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ================= MODAL 2: CONSULTAR ESTADO (HU-01 Escenario 2) ================= */}
      {isQueryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="modal-consultar-mascota">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden text-left animate-in fade-in zoom-in duration-200">
            <div className="bg-amber-600 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Search className="h-5 w-5 text-white" />
                Consulta de Registro Sanitario de Mascota
              </h3>
              <button 
                id="close-modal-consultar"
                onClick={() => setIsQueryModalOpen(false)} 
                className="text-white hover:text-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <form onSubmit={handlePetQuery} className="space-y-3">
                <label className="block text-[11px] font-bold text-slate-500 uppercase">Ingrese el RUT del Propietario/Tutor *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Ej. 18.322.405-2"
                    value={queryRut}
                    onChange={(e) => setQueryRut(e.target.value)}
                    className="flex-1 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-600"
                    id="input-consultar-rut"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg cursor-pointer shrink-0"
                    id="btn-confirmar-consulta"
                  >
                    Buscar Registros
                  </button>
                </div>
              </form>

              {hasQueried && (
                <div className="border-t border-slate-100 pt-4 space-y-3" id="resultados-consulta-mascotas">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resultados de Búsqueda</h4>
                  
                  {queryResults === null || queryResults.length === 0 ? (
                    <div className="bg-red-50 text-red-800 text-xs p-4 rounded-xl border border-red-200 flex gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>No se encontraron mascotas registradas.</strong> Verifique que haya ingresado el RUT exactamente igual a como lo registró, incluyendo puntos y guion.
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {queryResults.map((pet) => (
                        <div key={pet.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
                          <div className="flex justify-between items-center border-b border-slate-200/50 pb-1.5">
                            <span className="font-mono text-slate-400">ID: <strong className="text-slate-800 font-bold">{pet.id}</strong></span>
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                              pet.estado === 'Aprobado' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : pet.estado === 'Rechazado' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-amber-100 text-amber-800 animate-pulse'
                            }`}>
                              Estado: {pet.estado}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            <p><strong>Mascota:</strong> {pet.nombreMascota} ({pet.especie})</p>
                            <p><strong>Raza:</strong> {pet.raza}</p>
                            <p><strong>Edad:</strong> {pet.edad} años</p>
                            <p><strong>Microchip:</strong> {pet.microchip}</p>
                            <p className="col-span-2"><strong>Tutor:</strong> {pet.nombreDueno} ({pet.rutDueno})</p>
                            <p><strong>F. Registro:</strong> {pet.fechaRegistro}</p>
                          </div>
                          <div className="border-t border-slate-200/50 pt-1.5 mt-1 grid grid-cols-2 gap-2 text-[10px]">
                            <span className={pet.vacunaAntirrabica ? 'text-emerald-700' : 'text-red-700'}>
                              {pet.vacunaAntirrabica ? '✓ Vacuna Antirrábica' : '✗ Sin Vacuna Antirrábica'}
                            </span>
                            <span className={pet.certificadoSanitario ? 'text-emerald-700' : 'text-red-700'}>
                              {pet.certificadoSanitario ? '✓ Certificado Sanitario' : '✗ Sin Certificado Sanitario'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="bg-slate-100 px-6 py-3 flex justify-end">
              <button
                onClick={() => setIsQueryModalOpen(false)}
                className="px-4 py-1.5 bg-slate-500 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cerrar Ventana
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ================= MODAL 3: ELIMINAR REGISTRO (HU-01 Escenario 3) ================= */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="modal-eliminar-mascota">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden text-left animate-in fade-in zoom-in duration-200">
            <div className="bg-red-700 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-white animate-bounce" />
                Eliminar Registro de Mascota
              </h3>
              <button 
                id="close-modal-eliminar"
                onClick={() => setIsDeleteModalOpen(false)} 
                className="text-white hover:text-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePetDeleteSubmit} className="p-6 space-y-4">
              <div className="bg-red-50 text-red-900 border border-red-200 p-4 rounded-xl text-xs flex gap-2">
                <ShieldAlert className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong>¡Advertencia importante!</strong> Esta acción es irreversible y removerá la mascota de las listas de control del SAG y del Servicio de Aduanas de manera permanente.
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">RUT del Tutor *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 18.322.405-2"
                    value={deleteRut}
                    onChange={(e) => setDeleteRut(e.target.value)}
                    className="mt-1 w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-600"
                    id="input-eliminar-rut"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">ID del Registro de Mascota *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. REG-PET-402"
                    value={deleteId}
                    onChange={(e) => setDeleteId(e.target.value)}
                    className="mt-1 w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-600"
                    id="input-eliminar-id"
                  />
                </div>
              </div>

              {deleteSuccess !== null && (
                <div className={`p-4 rounded-xl text-xs border ${
                  deleteSuccess 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`} id="resultado-eliminar-mascota">
                  {deleteSuccess ? (
                    <div className="flex gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                      <span>{deleteMessage}</span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                      <span>{deleteMessage}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
                  id="btn-confirmar-eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar permanentemente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
