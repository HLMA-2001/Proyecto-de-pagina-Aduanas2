import React, { useState } from 'react';
import { UserCheck, Clock, FileText, CheckCircle2, XCircle, Landmark, ShieldCheck, HelpCircle, History, LandmarkIcon, PawPrint, AlertOctagon, HeartHandshake, Leaf, Key, AlertCircle, Info } from 'lucide-react';
import { PasajeroAduana, Mascota, EquipajeSAG } from '../types';

interface AduanaPortalProps {
  pasajeros: PasajeroAduana[];
  mascotas: Mascota[];
  equipajesSAG: EquipajeSAG[];
  onDecision: (pasajeroId: string, decision: 'Acceso Permitido' | 'Acceso Denegado', motivo?: string) => void;
}

export default function AduanaPortal({
  pasajeros,
  mascotas,
  equipajesSAG,
  onDecision
}: AduanaPortalProps) {
  // Login simulation state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Pre-seeded credentials for Aduana
  const DEFAULT_RUT = "11.222.333-4";
  const DEFAULT_PASS = "aduana1234";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (rut.trim() === DEFAULT_RUT && password === DEFAULT_PASS) || 
      (rut.trim().toLowerCase() === 'admin' || password === 'admin')
    ) {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Credenciales incorrectas. Pruebe con las indicadas en el cuadro informativo.');
    }
  };

  const handleQuickLogin = () => {
    setRut(DEFAULT_RUT);
    setPassword(DEFAULT_PASS);
    setIsLoggedIn(true);
    setLoginError('');
  };

  const [selectedPasajeroId, setSelectedPasajeroId] = useState<string>(pasajeros[0]?.id || '');
  
  // Interactive audit tabs for passenger data (HU-04 Esc 2)
  const [activeAuditTab, setActiveAuditTab] = useState<'viajes' | 'criminal' | 'divisas' | 'mascotas' | 'sag'>('viajes');
  
  // Decision Form State (HU-04 Esc 3)
  const [showDenyReasonInput, setShowDenyReasonInput] = useState(false);
  const [denyReason, setDenyReason] = useState('');

  const currentPasajero = pasajeros.find(p => p.id === selectedPasajeroId);

  // Search corresponding registered pet live (HU-01 integration)
  const matchingPets = currentPasajero
    ? mascotas.filter(m => m.rutDueno.replace(/\s/g, '').replace(/\./g, '').toLowerCase() === currentPasajero.rut.replace(/\s/g, '').replace(/\./g, '').toLowerCase())
    : [];

  // Search corresponding SAG bag declaration live (HU-05 integration)
  const matchingSAG = currentPasajero
    ? equipajesSAG.find(e => e.rut.replace(/\s/g, '').replace(/\./g, '').toLowerCase() === currentPasajero.rut.replace(/\s/g, '').replace(/\./g, '').toLowerCase())
    : null;

  const handleAuthorize = () => {
    if (!currentPasajero) return;
    onDecision(currentPasajero.id, 'Acceso Permitido');
    setShowDenyReasonInput(false);
    setDenyReason('');
  };

  const handleDenySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPasajero || !denyReason.trim()) return;
    onDecision(currentPasajero.id, 'Acceso Denegado', denyReason.trim());
    setShowDenyReasonInput(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="aduana-portal-root">
      
      {/* 1. NOT LOGGED IN STATE - SHOW FORM */}
      {!isLoggedIn ? (
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden" id="aduana-login-form">
          <div className="bg-[#002f6c] text-white p-6 text-center border-b border-amber-500/30">
            <div className="bg-amber-400 p-3 rounded-full w-14 h-14 mx-auto flex items-center justify-center text-blue-950 mb-3 shadow-md">
              <Landmark className="h-8 w-8 text-[#002f6c]" />
            </div>
            <h3 className="font-extrabold text-lg uppercase tracking-wider">Aduanas de Chile</h3>
            <p className="text-slate-300 text-xs mt-1">Servicio Nacional de Aduanas • Control de Divisas y Equipaje</p>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-4 text-left">
            <p className="text-slate-500 text-xs text-center">
              Ingrese sus credenciales de fiscalizador aduanero para procesar declaraciones juradas de equipaje, porte de divisas e historiales migratorios.
            </p>

            {loginError && (
              <div className="bg-red-50 text-red-800 text-xs p-3 rounded-lg border border-red-200 flex gap-2" id="aduana-login-error-alert">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <UserCheck className="h-3 w-3 text-[#002f6c]" />
                RUT del Fiscalizador Aduana
              </label>
              <input
                type="text"
                required
                placeholder="Ej: 11.222.333-4 o 'admin'"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                className="mt-1 w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002f6c]"
                id="aduana-input-rut"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <Key className="h-3 w-3 text-[#002f6c]" />
                Clave de Acceso Única
              </label>
              <input
                type="password"
                required
                placeholder="Ej: aduana1234 o 'admin'"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002f6c]"
                id="aduana-input-pass"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#002f6c] hover:bg-[#001f4d] text-white font-extrabold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              id="aduana-btn-ingresar"
            >
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              Autenticar Fiscalizador Aduana
            </button>

            <div className="border-t border-slate-100 pt-4 mt-2">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/50 space-y-2">
                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
                  <Info className="h-3.5 w-3.5 text-amber-500" />
                  <span>CREDENCIALES DE SIMULACIÓN</span>
                </div>
                <div className="text-[10px] text-slate-500 space-y-1 font-mono">
                  <p><strong>RUT:</strong> {DEFAULT_RUT}</p>
                  <p><strong>Clave:</strong> {DEFAULT_PASS}</p>
                </div>
                <button
                  type="button"
                  onClick={handleQuickLogin}
                  className="w-full mt-1.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-blue-950 font-black rounded-lg text-[10px] transition-colors cursor-pointer"
                  id="aduana-btn-quick-login"
                >
                  ⚡ Ingreso Rápido con 1 Clic
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* LEFT COLUMN: Queue of Passengers (HU-04 Escenario 1: Control y Verificación de datos) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div>
              <h3 className="font-extrabold text-[#002f6c] text-base flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#f2a900]" />
                Cola de Turnos Migratorios (HU-04 Esc 1)
              </h3>
              <p className="text-slate-500 text-xs mt-1">
                Pasajeros asignados en fila para control migratorio y fitozoosanitario en tiempo real.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm" id="passenger-queue-list">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center text-xs font-semibold text-slate-500">
              <span>TURNO / PASAJERO</span>
              <span>ESTADO</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
              {pasajeros.map((p) => (
                <div
                  key={p.id}
                  id={`queue-item-${p.id}`}
                  onClick={() => {
                    setSelectedPasajeroId(p.id);
                    setShowDenyReasonInput(false);
                    setDenyReason('');
                  }}
                  className={`p-4 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    selectedPasajeroId === p.id 
                      ? 'bg-blue-50/75 border-l-4 border-[#002f6c]' 
                      : 'hover:bg-slate-50/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {p.id}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {p.nacionalidad}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 text-sm mt-1">{p.nombre}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">RUT: {p.rut}</p>
                  </div>

                  <div>
                    {p.estadoPaso === 'Pendiente' ? (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                        Pendiente
                      </span>
                    ) : p.estadoPaso === 'Acceso Permitido' ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Permitido
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <XCircle className="h-3 w-3" /> Denegado
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Control Desk (HU-04) */}
        <div className="lg:col-span-8">
          {currentPasajero ? (
            <div className="space-y-6" id="customs-working-desk">
              
              {/* Traveler Basic Passport Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#002f6c] text-[#f2a900] text-xs font-extrabold px-2.5 py-0.5 rounded">
                        EXAMEN DE PASO FRONTERIZO
                      </span>
                      <span className="text-slate-400 text-xs font-mono">Turno: {currentPasajero.id}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mt-2">
                      {currentPasajero.nombre}
                    </h3>
                  </div>

                  {/* Current Status Badge large */}
                  <div className="text-right">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estado de Tránsito</span>
                    <strong className={`text-sm inline-block px-3 py-1 rounded-full font-bold uppercase mt-1 ${
                      currentPasajero.estadoPaso === 'Pendiente'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : currentPasajero.estadoPaso === 'Acceso Permitido'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {currentPasajero.estadoPaso}
                    </strong>
                  </div>
                </div>

                {/* Passport Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-700 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <h6 className="text-[10px] font-bold text-slate-400 uppercase">Documento Identidad (RUT)</h6>
                    <p className="font-bold text-slate-950 mt-0.5">{currentPasajero.rut}</p>
                  </div>
                  <div>
                    <h6 className="text-[10px] font-bold text-slate-400 uppercase">Nacionalidad</h6>
                    <p className="font-bold text-slate-950 mt-0.5">{currentPasajero.nacionalidad}</p>
                  </div>
                  <div>
                    <h6 className="text-[10px] font-bold text-slate-400 uppercase">Procedencia (Viaja desde)</h6>
                    <p className="font-bold text-slate-950 mt-0.5">{currentPasajero.viajaDesde}</p>
                  </div>
                  <div>
                    <h6 className="text-[10px] font-bold text-slate-400 uppercase">Destino (Viaja hacia)</h6>
                    <p className="font-bold text-slate-950 mt-0.5">{currentPasajero.viajaHacia}</p>
                  </div>
                </div>
              </div>

              {/* HU-04 Escenario 2: Interacción con Botones que Brindan Información Necesaria */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-[#002f6c]" />
                    Consola de Inspección de Antecedentes (HU-04 Escenario 2)
                  </h4>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Presione los botones interactivos a continuación para auditar las bases de datos de antecedentes del pasajero seleccionado.
                  </p>
                </div>

                {/* Audit Buttons Tab Controls */}
                <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3" id="aduana-audit-buttons">
                  <button
                    id="btn-audit-viajes"
                    onClick={() => setActiveAuditTab('viajes')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeAuditTab === 'viajes'
                        ? 'bg-[#002f6c] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <History className="h-3.5 w-3.5" />
                    Historial de Viajes
                  </button>

                  <button
                    id="btn-audit-criminal"
                    onClick={() => setActiveAuditTab('criminal')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeAuditTab === 'criminal'
                        ? 'bg-[#002f6c] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Antecedentes Penales / Alertas
                  </button>

                  <button
                    id="btn-audit-divisas"
                    onClick={() => setActiveAuditTab('divisas')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeAuditTab === 'divisas'
                        ? 'bg-[#002f6c] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <LandmarkIcon className="h-3.5 w-3.5" />
                    Declaración de Divisas
                  </button>

                  <button
                    id="btn-audit-mascotas"
                    onClick={() => setActiveAuditTab('mascotas')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeAuditTab === 'mascotas'
                        ? 'bg-[#002f6c] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <PawPrint className="h-3.5 w-3.5" />
                    Mascotas Relacionadas
                    {matchingPets.length > 0 && (
                      <span className="bg-amber-400 text-blue-950 rounded-full h-4 w-4 flex items-center justify-center text-[9px] font-bold">
                        {matchingPets.length}
                      </span>
                    )}
                  </button>

                  <button
                    id="btn-audit-sag"
                    onClick={() => setActiveAuditTab('sag')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeAuditTab === 'sag'
                        ? 'bg-[#002f6c] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Leaf className="h-3.5 w-3.5" />
                    Control SAG (Fitozoosanitario)
                    {matchingSAG && (
                      <span className={`rounded-full h-2 w-2 ${
                        matchingSAG.cumpleSAG === 'Cumple' 
                          ? 'bg-emerald-500' 
                          : matchingSAG.cumpleSAG === 'No Cumple' 
                          ? 'bg-red-500' 
                          : 'bg-amber-500 animate-pulse'
                      }`} />
                    )}
                  </button>
                </div>

                {/* Audit Tab Contents */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 min-h-36">
                  
                  {/* Historial Viajes Tab */}
                  {activeAuditTab === 'viajes' && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <h5 className="font-bold text-[#002f6c] text-xs">Historial de Viajes del Pasajero</h5>
                      <div className="space-y-2">
                        {currentPasajero.historialViajes.map((viaje, idx) => (
                          <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 flex justify-between items-center">
                            <div>
                              <p className="font-bold text-slate-800">{viaje.destino}</p>
                              <p className="text-[10px] text-slate-400">Motivo: {viaje.motivo}</p>
                            </div>
                            <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {viaje.fecha}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Antecedentes Penales Tab */}
                  {activeAuditTab === 'criminal' && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <h5 className="font-bold text-[#002f6c] text-xs">Certificado de Antecedentes y Alertas PDI</h5>
                      
                      {currentPasajero.historialCriminal.some(hist => hist.toLowerCase().includes("alerta") || hist.toLowerCase().includes("detención")) ? (
                        <div className="bg-red-50 text-red-900 border border-red-200 p-4 rounded-lg flex gap-3">
                          <AlertOctagon className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold">¡ALERTA DE ANTECEDENTES O REQUERIMIENTO ACTIVO!</p>
                            <p className="mt-1 text-slate-700">Se han detectado las siguientes incidencias en la base de datos nacional/internacional:</p>
                            <ul className="list-disc pl-4 mt-1.5 space-y-1 font-mono text-[11px]">
                              {currentPasajero.historialCriminal.map((crime, idx) => (
                                <li key={idx} className="text-red-800 font-semibold">{crime}</li>
                              ))}
                            </ul>
                            <p className="mt-2 text-[10px] text-red-600 font-bold">Consulte o retenga la documentación en coordinación con el módulo de la PDI.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 p-4 rounded-lg flex gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                          <div>
                            <p className="font-bold">PASAJERO SIN ANTECEDENTES PENALES VIGENTES</p>
                            <p className="mt-1 text-slate-700">El pasajero no cuenta con órdenes de aprehensión pendientes ni alertas de Interpol activas en el Registro Civil de Chile ni PDI.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Declaración de Divisas Tab */}
                  {activeAuditTab === 'divisas' && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <h5 className="font-bold text-[#002f6c] text-xs">Control de Ingreso de Divisas (Efectivo)</h5>
                      <div className="bg-white p-4 rounded-lg border border-slate-200 flex justify-between items-center">
                        <div>
                          <p className="text-slate-500 text-[10px]">Monto Declarado en Control de Ingreso:</p>
                          <p className="text-xl font-extrabold text-[#002f6c] mt-0.5">
                            USD ${currentPasajero.declaradoDinero.toLocaleString('es-CL')}
                          </p>
                        </div>
                        
                        {currentPasajero.declaradoDinero >= 10000 ? (
                          <span className="bg-red-50 text-red-800 font-bold px-3 py-1.5 rounded-lg border border-red-200 flex items-center gap-1">
                            <AlertOctagon className="h-4 w-4 text-red-600 shrink-0" /> Requiere Formulario F-101
                          </span>
                        ) : (
                          <span className="bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-lg border border-emerald-100">
                            Monto dentro del límite libre
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        * Toda suma superior a 10.000 dólares de EE.UU. o su equivalente en otras monedas debe declararse obligatoriamente bajo sanción de decomiso del 30% del excedente y multas de contrabando.
                      </p>
                    </div>
                  )}

                  {/* Mascotas Relacionadas Tab */}
                  {activeAuditTab === 'mascotas' && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <h5 className="font-bold text-[#002f6c] text-xs flex items-center gap-1">
                        <PawPrint className="h-4 w-4" />
                        Registros de Mascotas Vinculados al RUT del Pasajero
                      </h5>
                      
                      {matchingPets.length === 0 ? (
                        <div className="bg-white p-4 rounded-lg border border-slate-200 text-center text-slate-500">
                          No se registran solicitudes de transporte de mascotas para este pasajero en este control fronterizo.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {matchingPets.map((pet) => (
                            <div key={pet.id} className="bg-white p-3 rounded-lg border border-slate-200 flex justify-between items-center">
                              <div>
                                <p className="font-bold text-slate-800">{pet.nombreMascota} ({pet.especie} - {pet.raza})</p>
                                <p className="text-[10px] text-slate-400">Microchip: {pet.microchip} | F. Registro: {pet.fechaRegistro}</p>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                pet.estado === 'Aprobado' 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : pet.estado === 'Rechazado' 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {pet.estado}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Control SAG Tab */}
                  {activeAuditTab === 'sag' && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <h5 className="font-bold text-[#002f6c] text-xs flex items-center gap-1">
                        <Leaf className="h-4 w-4" />
                        Estado de Inspección del Servicio Agrícola y Ganadero (SAG)
                      </h5>
                      
                      {!matchingSAG ? (
                        <div className="bg-white p-4 rounded-lg border border-slate-200 text-center text-slate-500">
                          Este pasajero no registra un manifiesto de equipaje en el control SAG. Todo equipaje debe ser escaneado.
                        </div>
                      ) : (
                        <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                            <span className="font-mono text-[10px] text-slate-400">ID Declaración: {matchingSAG.id}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              matchingSAG.cumpleSAG === 'Cumple'
                                ? 'bg-emerald-100 text-emerald-800'
                                : matchingSAG.cumpleSAG === 'No Cumple'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800 animate-pulse'
                            }`}>
                              SAG: {matchingSAG.cumpleSAG}
                            </span>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-[11px] text-slate-500">Declaración de Artículos:</p>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {matchingSAG.articulos.map((art) => (
                                <span 
                                  key={art.id} 
                                  className={`px-2 py-0.5 rounded text-[10px] ${
                                    art.esRiesgo 
                                      ? 'bg-red-50 text-red-700 border border-red-200 font-semibold' 
                                      : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  {art.nombre} {art.esRiesgo && '⚠️'} {art.corregido && '(Corregido)'}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>

              {/* HU-04 Escenario 3: Interfaz de confirmación de Acceso o Negación de Ingreso */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <HeartHandshake className="h-4 w-4 text-[#002f6c]" />
                    Resolución y Decisión de Paso Fronterizo (HU-04 Escenario 3)
                  </h4>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Determine la conformidad del pasajero y otorgue o deniegue formalmente el acceso o salida de Chile con base en el análisis anterior.
                  </p>
                </div>

                {/* If already decided, show visual notification */}
                {currentPasajero.estadoPaso !== 'Pendiente' && (
                  <div className={`p-4 rounded-xl border ${
                    currentPasajero.estadoPaso === 'Acceso Permitido' 
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
                      : 'bg-red-50 text-red-900 border-red-200'
                  }`}>
                    <div className="flex gap-2 items-start">
                      {currentPasajero.estadoPaso === 'Acceso Permitido' ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-bold">RESOLUCIÓN EMITIDA: {currentPasajero.estadoPaso.toUpperCase()}</p>
                        {currentPasajero.estadoPaso === 'Acceso Denegado' && (
                          <p className="mt-1 text-xs text-slate-700">
                            <strong>Motivo registrado:</strong> {currentPasajero.motivoDenegacion}
                          </p>
                        )}
                        <p className="text-[10px] text-slate-400 mt-2">
                          Esta resolución ha sido despachada a la base de datos nacional y notificada al pasajero.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Decision Action Buttons */}
                <div className="flex gap-3">
                  <button
                    id="btn-autorizar-paso"
                    onClick={handleAuthorize}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Autorizar Ingreso / Salida (Aprobar)
                  </button>

                  <button
                    id="btn-denegar-paso"
                    onClick={() => {
                      setShowDenyReasonInput(true);
                      setDenyReason('');
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <XCircle className="h-4 w-4" />
                    Denegar Acceso al País (Rechazar)
                  </button>
                </div>

                {/* Inline Form to fill denial reason when clicking Denegar */}
                {showDenyReasonInput && (
                  <form onSubmit={handleDenySubmit} className="bg-red-50/50 p-4 rounded-xl border border-red-100 space-y-3 animate-in slide-in-from-top-3 duration-200">
                    <div>
                      <label className="block text-[11px] font-bold text-red-800 uppercase">
                        Especifique la Razón/Motivo Legal del Rechazo *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Alerta Interpol activa, Falta seguro obligatorio SOAPEX, Intento de ingresar artículos prohibidos no declarados..."
                        value={denyReason}
                        onChange={(e) => setDenyReason(e.target.value)}
                        className="mt-1.5 w-full bg-white border border-red-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                        id="input-motivo-denegacion"
                      />
                    </div>
                    <div className="flex justify-end gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setShowDenyReasonInput(false)}
                        className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg cursor-pointer"
                        id="btn-confirmar-denegar-paso"
                      >
                        Confirmar Denegación de Paso
                      </button>
                    </div>
                  </form>
                )}

              </div>

            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-16 text-center h-full flex flex-col items-center justify-center">
              <UserCheck className="h-10 w-10 text-slate-400 mb-2" />
              <p className="text-slate-700 font-bold">No hay pasajeros seleccionados</p>
              <p className="text-slate-400 text-xs mt-1">
                Seleccione un pasajero de la lista de turnos en el panel izquierdo para comenzar la auditoría de antecedentes y emitir resoluciones de ingreso.
              </p>
            </div>
          )}
        </div>

      </div>
      )}
    </div>
  );
}
