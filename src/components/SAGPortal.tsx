import React, { useState } from 'react';
import { Leaf, Check, AlertTriangle, ShieldCheck, ChevronRight, HelpCircle, XCircle, FileText, AlertCircle, RefreshCw, PawPrint, Landmark, Mail, Calendar, User, Info, CheckCircle2, Key, UserCheck } from 'lucide-react';
import { EquipajeSAG, ArticuloEquipaje, Mascota } from '../types';
import { ELEMENTOS_PROHIBIDOS_SAG } from '../data/mockData';

interface SAGPortalProps {
  equipajes: EquipajeSAG[];
  mascotas: Mascota[];
  onUpdateEquipaje: (equipajeId: string, updatedArticulos: ArticuloEquipaje[], cumple: 'Pendiente' | 'Cumple' | 'No Cumple', comentarios?: string) => void;
}

export default function SAGPortal({ equipajes, mascotas, onUpdateEquipaje }: SAGPortalProps) {
  // Login simulation state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Pre-seeded credentials for SAG
  const DEFAULT_RUT = "23.456.789-0";
  const DEFAULT_PASS = "sag1234";

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

  const [selectedEquipajeId, setSelectedEquipajeId] = useState<string>(equipajes[0]?.id || '');
  
  // State for popup modal showing detailed information (mascota/producto)
  const [selectedItemDetail, setSelectedItemDetail] = useState<{
    type: 'articulo' | 'mascota';
    name: string;
    id?: string;
    esRiesgo?: boolean;
    corregido?: boolean;
    motivoCorreccion?: string;
    petData?: Mascota;
  } | null>(null);
  
  // Selected items for correction (HU-05 Esc 2)
  const [selectedArticuloIds, setSelectedArticuloIds] = useState<string[]>([]);
  const [correctionText, setCorrectionText] = useState('');
  
  // Inspector comment state (HU-05 Esc 3)
  const [inspectorComment, setInspectorComment] = useState('');

  // Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const currentEquipaje = equipajes.find(e => e.id === selectedEquipajeId);

  const passengerPet = currentEquipaje && mascotas
    ? mascotas.find(m => m.rutDueno.replace(/\s/g, '').replace(/\./g, '').toLowerCase() === currentEquipaje.rut.replace(/\s/g, '').replace(/\./g, '').toLowerCase())
    : undefined;

  // Helper to check if an item name contains any of SAG's prohibited keyword list (HU-05 Esc 1)
  const checkIsAutomaticRisk = (itemName: string): boolean => {
    const normalized = itemName.toLowerCase().trim();
    return ELEMENTOS_PROHIBIDOS_SAG.some(keyword => normalized.includes(keyword));
  };

  const toggleArticuloSelection = (artId: string) => {
    if (selectedArticuloIds.includes(artId)) {
      setSelectedArticuloIds(selectedArticuloIds.filter(id => id !== artId));
    } else {
      setSelectedArticuloIds([...selectedArticuloIds, artId]);
    }
  };

  // Submit Corrections for selected items (HU-05 Esc 2)
  const handleSendCorrections = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEquipaje || selectedArticuloIds.length === 0 || !correctionText.trim()) return;

    // Update the articles inside the current baggage
    const updatedArticulos = currentEquipaje.articulos.map(art => {
      if (selectedArticuloIds.includes(art.id)) {
        return {
          ...art,
          corregido: true,
          motivoCorreccion: correctionText
        };
      }
      return art;
    });

    onUpdateEquipaje(currentEquipaje.id, updatedArticulos, currentEquipaje.cumpleSAG, currentEquipaje.comentariosInspector);
    
    // Clear state
    setToastMsg(`Se aplicó la corrección a ${selectedArticuloIds.length} elementos. Se ha notificado al pasajero y personal de frontera.`);
    setTimeout(() => setToastMsg(null), 6000);
    setSelectedArticuloIds([]);
    setCorrectionText('');
  };

  // Confirm final check of baggage (HU-05 Esc 3)
  const handleFinalCompliance = (status: 'Cumple' | 'No Cumple') => {
    if (!currentEquipaje) return;

    onUpdateEquipaje(
      currentEquipaje.id,
      currentEquipaje.articulos,
      status,
      inspectorComment.trim() || undefined
    );

    setToastMsg(`Equipaje ${currentEquipaje.id} evaluado como [${status === 'Cumple' ? 'CUMPLE ESTÁNDAR' : 'NO CUMPLE ESTÁNDAR'}].`);
    setTimeout(() => setToastMsg(null), 6000);
    setInspectorComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="sag-portal-root">
      
      {/* 1. NOT LOGGED IN STATE - SHOW FORM */}
      {!isLoggedIn ? (
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden" id="sag-login-form">
          <div className="bg-[#004b23] text-white p-6 text-center border-b border-amber-500/30">
            <div className="bg-amber-400 p-3 rounded-full w-14 h-14 mx-auto flex items-center justify-center text-emerald-950 mb-3 shadow-md">
              <Leaf className="h-8 w-8 text-emerald-900" />
            </div>
            <h3 className="font-extrabold text-lg uppercase tracking-wider">Servicio Agrícola y Ganadero</h3>
            <p className="text-slate-300 text-xs mt-1">SAG • Control Fitozoosanitario de Frontera</p>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-4 text-left">
            <p className="text-slate-500 text-xs text-center">
              Ingrese sus credenciales de inspector SAG habilitado para realizar revisiones silvoagropecuarias y decomisos en frontera.
            </p>

            {loginError && (
              <div className="bg-red-50 text-red-800 text-xs p-3 rounded-lg border border-red-200 flex gap-2" id="sag-login-error-alert">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <UserCheck className="h-3 w-3 text-[#004b23]" />
                RUT del Inspector SAG
              </label>
              <input
                type="text"
                required
                placeholder="Ej: 23.456.789-0 o 'admin'"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                className="mt-1 w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004b23]"
                id="sag-input-rut"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <Key className="h-3 w-3 text-[#004b23]" />
                Clave de Acceso Única
              </label>
              <input
                type="password"
                required
                placeholder="Ej: sag1234 o 'admin'"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004b23]"
                id="sag-input-pass"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#004b23] hover:bg-[#003b1c] text-white font-extrabold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              id="sag-btn-ingresar"
            >
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              Autenticar Inspector SAG
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
                  id="sag-btn-quick-login"
                >
                  ⚡ Ingreso Rápido con 1 Clic
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <>
          {/* Toast Notification */}
          {toastMsg && (
            <div 
              id="sag-toast"
              className="fixed bottom-5 right-5 z-50 max-w-md p-4 rounded-xl shadow-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-start gap-3 transition-all duration-300 transform translate-y-0"
            >
              <Leaf className="h-5 w-5 shrink-0 text-emerald-600 animate-spin" />
              <div>
                <p className="font-bold text-sm">Control Fitozoosanitario SAG</p>
                <p className="text-xs mt-0.5">{toastMsg}</p>
              </div>
              <button onClick={() => setToastMsg(null)} className="ml-auto text-slate-400 hover:text-slate-600">
                <Check className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* LEFT COLUMN: List of declared bags (HU-05: Apartado Especial de equipajes) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-sm space-y-2">
            <h3 className="font-extrabold text-[#004b23] text-base flex items-center gap-2">
              <Leaf className="h-5 w-5 text-emerald-600" />
              Inspecciones SAG (HU-05)
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Apartado especial para el control sanitario de productos silvoagropecuarios ingresados en equipaje de pasajeros.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm" id="sag-baggage-list">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center text-xs font-semibold text-slate-500">
              <span>MANIFIESTO / PASAJERO</span>
              <span>RESOLUCIÓN</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[450px] overflow-y-auto">
              {equipajes.map((eq) => (
                <div
                  key={eq.id}
                  id={`sag-item-${eq.id}`}
                  onClick={() => {
                    setSelectedEquipajeId(eq.id);
                    setSelectedArticuloIds([]);
                    setCorrectionText('');
                    setInspectorComment(eq.comentariosInspector || '');
                  }}
                  className={`p-4 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    selectedEquipajeId === eq.id 
                      ? 'bg-emerald-50/70 border-l-4 border-emerald-600' 
                      : 'hover:bg-slate-50/50'
                  }`}
                >
                  <div>
                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {eq.id}
                    </span>
                    <p className="font-bold text-slate-900 text-sm mt-1">{eq.pasajeroNombre}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">RUT: {eq.rut}</p>
                  </div>

                  <div>
                    {eq.cumpleSAG === 'Pendiente' ? (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
                        Pendiente
                      </span>
                    ) : eq.cumpleSAG === 'Cumple' ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-0.5">
                        <Check className="h-3 w-3" /> Cumple
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-0.5">
                        <XCircle className="h-3 w-3" /> No Cumple
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive review panel (HU-05 Escenarios 1, 2, 3) */}
        <div className="lg:col-span-8">
          {currentEquipaje ? (
            <div className="space-y-6" id="sag-workspace">
              
              {/* Workspace Header */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                      Control Fitofarmacológico & Zoosanitario SAG
                    </span>
                    <h4 className="text-xl font-bold text-slate-900 mt-2">
                      Declaración Jurada del Pasajero: {currentEquipaje.pasajeroNombre}
                    </h4>
                    <p className="text-slate-500 text-xs">
                      RUT: <strong>{currentEquipaje.rut}</strong> | Identificador de Manifiesto: <strong>{currentEquipaje.id}</strong>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estado de Evaluación</span>
                    <strong className={`text-xs inline-block px-3 py-1 rounded-full font-extrabold uppercase mt-1 ${
                      currentEquipaje.cumpleSAG === 'Pendiente'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : currentEquipaje.cumpleSAG === 'Cumple'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {currentEquipaje.cumpleSAG}
                    </strong>
                  </div>
                </div>

                {/* Info about risks comparison list (HU-05 Esc 1) */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-600 leading-relaxed">
                    <strong>Algoritmo de Control Automatizado (Criterio HU-05 Esc 1):</strong> El sistema compara los elementos declarados con un listado nacional de especies prohibidas (frutas, plantas, tierras, carnes crudas, lácteos artesanales). Los elementos sospechosos o prohibidos se destacan con alertas rojas automáticas de riesgo biológico.
                  </div>
                </div>

                {passengerPet && (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-xs text-blue-950">
                      <PawPrint className="h-5 w-5 text-blue-800 shrink-0" />
                      <div>
                        <p className="font-bold">Mascota Registrada por el Pasajero: <span className="text-blue-800 font-extrabold">{passengerPet.nombreMascota}</span> ({passengerPet.especie})</p>
                        <p className="text-[10px] text-slate-500 font-light mt-0.5">RUT Tutor: {passengerPet.rutDueno} | ID: {passengerPet.id} | Email: {passengerPet.emailDueno || 'No registrado'}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedItemDetail({
                          type: 'mascota',
                          name: `Mascota: ${passengerPet.nombreMascota} (${passengerPet.especie})`,
                          petData: passengerPet
                        });
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-lg cursor-pointer shrink-0 transition-all flex items-center gap-1 shadow-xs"
                    >
                      Ver Ficha de Mascota ➔
                    </button>
                  </div>
                )}
              </div>

              {/* Declared items list and check (HU-05 Esc 1 & Esc 2) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h5 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-emerald-700" />
                    Manifiesto de Artículos e Inspección Física (HU-05 Esc 1)
                  </h5>
                  <span className="text-[11px] text-slate-400 italic">Seleccione elementos para realizar correcciones sanitarias</span>
                </div>

                {/* Items grid */}
                <div className="space-y-3" id="declared-items-inspected-list">
                  {currentEquipaje.articulos.map((art) => {
                    const isSystemRisk = checkIsAutomaticRisk(art.nombre);
                    const isAnyRisk = art.esRiesgo || isSystemRisk;

                    return (
                      <div 
                        key={art.id} 
                        id={`item-row-${art.id}`}
                        className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between gap-4 transition-all ${
                          selectedArticuloIds.includes(art.id)
                            ? 'bg-emerald-50/40 border-emerald-400 ring-1 ring-emerald-200'
                            : isAnyRisk && !art.corregido
                            ? 'bg-red-50/30 border-red-200'
                            : 'bg-slate-50/50 border-slate-200'
                        }`}
                      >
                        {/* Checkbox selector for correction & text */}
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selectedArticuloIds.includes(art.id)}
                            onChange={() => toggleArticuloSelection(art.id)}
                            className="mt-1.5 rounded text-emerald-600 focus:ring-emerald-500 h-4.5 w-4.5 cursor-pointer"
                            id={`check-select-item-${art.id}`}
                          />
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{art.nombre}</p>
                            <div className="flex flex-wrap gap-2 mt-1.5">
                              {/* Automatic Risk highlight (HU-05 Esc 1) */}
                              {isSystemRisk && !art.corregido && (
                                <span className="bg-red-100 text-red-800 text-[10px] font-extrabold px-2 py-0.5 rounded flex items-center gap-0.5">
                                  <AlertCircle className="h-3 w-3 text-red-700" /> Alerta de Riesgo Biológico (Detectado Automáticamente)
                                </span>
                              )}
                              
                              {/* Original Risk tag if pre-flagged */}
                              {art.esRiesgo && !isSystemRisk && !art.corregido && (
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-0.5">
                                  <AlertTriangle className="h-3 w-3" /> Riesgo Declarado
                                </span>
                              )}

                              {/* Correction Tag (HU-05 Esc 2) */}
                              {art.corregido && (
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded flex items-center gap-0.5">
                                  <Check className="h-3 w-3" /> Corregido & Decomisado / Tratado
                                </span>
                              )}
                            </div>

                            {art.corregido && art.motivoCorreccion && (
                              <p className="text-[11px] text-emerald-700 mt-2 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                                <strong>Detalle de Corrección:</strong> {art.motivoCorreccion}
                              </p>
                            )}
                          </div>
                        </div>

                         {/* Status Label on right */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              const lowerName = art.nombre.toLowerCase();
                              const isPetItem = lowerName.includes('mascota') || lowerName.includes('perro') || lowerName.includes('gato') || lowerName.includes('hurón');
                              setSelectedItemDetail({
                                type: isPetItem ? 'mascota' : 'articulo',
                                name: art.nombre,
                                id: art.id,
                                esRiesgo: isAnyRisk,
                                corregido: art.corregido,
                                motivoCorreccion: art.motivoCorreccion,
                                petData: isPetItem ? passengerPet : undefined
                              });
                            }}
                            className="px-2.5 py-1 text-[10px] font-bold text-emerald-800 hover:text-white bg-emerald-50 hover:bg-emerald-700 rounded-md border border-emerald-200 transition-colors cursor-pointer"
                          >
                            Ver Detalle
                          </button>
                          {art.corregido ? (
                            <span className="text-emerald-700 font-bold text-xs">Cumple Normativa (Corregido)</span>
                          ) : isAnyRisk ? (
                            <span className="text-red-700 font-bold text-xs flex items-center gap-1">
                              <AlertTriangle className="h-4 w-4" /> Retención Pendiente
                            </span>
                          ) : (
                            <span className="text-slate-500 font-medium text-xs">Libre Paso Autorizado</span>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* HU-05 Escenario 2: Corrección de Productos y Equipajes (Formulario de Envío) */}
                {selectedArticuloIds.length > 0 && (
                  <form onSubmit={handleSendCorrections} className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 space-y-3 animate-in slide-in-from-top-3 duration-200">
                    <div className="flex gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-xs text-amber-900">Corregir/Decomisar elementos seleccionados ({selectedArticuloIds.length})</p>
                        <p className="text-slate-600 text-[11px] mt-0.5">
                          Indique la acción de corrección fitozoosanitaria y el porqué. Esto informará al pasajero y se integrará al expediente de paso.
                        </p>
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Producto fresco decomisado para incineración por riesgo biológico / Se aplica tratamiento químico..."
                        value={correctionText}
                        onChange={(e) => setCorrectionText(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        id="input-motivo-correccion"
                      />
                    </div>

                    <div className="flex justify-end gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setSelectedArticuloIds([])}
                        className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
                        id="btn-enviar-correccion-articulos"
                      >
                        Enviar Corrección SAG
                      </button>
                    </div>
                  </form>
                )}

              </div>

              {/* HU-05 Escenario 3: Confirmar Paso del Equipaje y Productos */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div>
                  <h5 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-700" />
                    Resolución de Equipaje Completo (HU-05 Escenario 3)
                  </h5>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Utilice los controles a continuación para certificar si el equipaje cumple con los estándares fitozoosanitarios del SAG para su ingreso legal a Chile.
                  </p>
                </div>

                {/* Inspector comments input */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase">
                    Comentarios Adicionales del Inspector SAG
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ej. Se inspeccionaron todas las maletas físicamente. Se retuvieron 3 elementos de riesgo biológico. Libre de plagas."
                    value={inspectorComment}
                    onChange={(e) => setInspectorComment(e.target.value)}
                    className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                    id="input-comentarios-sag"
                  />
                </div>

                {/* Current Compliance Status Display if already solved */}
                {currentEquipaje.cumpleSAG !== 'Pendiente' && (
                  <div className={`p-4 rounded-xl border ${
                    currentEquipaje.cumpleSAG === 'Cumple'
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      : 'bg-red-50 text-red-900 border-red-200'
                  }`}>
                    <p className="font-bold text-xs uppercase">
                      DIAGNÓSTICO CERTIFICADO: EQUIPAJE {currentEquipaje.cumpleSAG === 'Cumple' ? 'APROBADO' : 'RECHAZADO'}
                    </p>
                    {currentEquipaje.comentariosInspector && (
                      <p className="text-xs text-slate-700 mt-1">
                        <strong>Comentarios registrados:</strong> {currentEquipaje.comentariosInspector}
                      </p>
                    )}
                  </div>
                )}

                {/* Final certification buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    id="btn-confirmar-cumple-sag"
                    onClick={() => handleFinalCompliance('Cumple')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <Check className="h-4 w-4" />
                    Confirmar: CUMPLE Requisitos SAG (Paso de Equipaje)
                  </button>

                  <button
                    id="btn-confirmar-no-cumple-sag"
                    onClick={() => handleFinalCompliance('No Cumple')}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <XCircle className="h-4 w-4" />
                    Rechazar: NO CUMPLE Estándares SAG
                  </button>
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-16 text-center h-full flex flex-col items-center justify-center">
              <Leaf className="h-10 w-10 text-slate-400 mb-2" />
              <p className="text-slate-700 font-bold">No hay manifiestos de equipaje seleccionados</p>
              <p className="text-slate-400 text-xs mt-1">
                Seleccione una declaración jurada en el panel izquierdo para escanear y aplicar correcciones fitozoosanitarias obligatorias de ingreso.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* VENTANA EMERGENTE: DETALLE DE PRODUCTO O MASCOTA */}
      {selectedItemDetail && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="modal-detalle-sag">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden text-left animate-in fade-in zoom-in duration-200">
            <div className="bg-[#004b23] text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                {selectedItemDetail.type === 'mascota' ? (
                  <PawPrint className="h-5 w-5 text-amber-400" />
                ) : (
                  <Leaf className="h-5 w-5 text-amber-400" />
                )}
                Detalle Técnico del Elemento Seleccionado
              </h3>
              <button
                onClick={() => setSelectedItemDetail(null)}
                className="text-white hover:text-slate-200 transition-colors cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              
              {/* Common Header */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Nombre del Elemento Declarado</span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">{selectedItemDetail.name}</h4>
                {selectedItemDetail.id && (
                  <p className="text-[10px] text-slate-400 font-mono">ID de Artículo: {selectedItemDetail.id}</p>
                )}
              </div>

              {/* PET DETAIL */}
              {selectedItemDetail.type === 'mascota' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl space-y-2.5">
                    <h5 className="text-xs font-bold text-blue-900 uppercase flex items-center gap-1.5 border-b border-blue-200/60 pb-1">
                      <PawPrint className="h-4 w-4 text-blue-800" />
                      Ficha Oficial Sanitaria de Mascota
                    </h5>
                    
                    {selectedItemDetail.petData ? (
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs text-slate-700">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Nombre de Mascota</p>
                          <p className="font-bold text-slate-900">{selectedItemDetail.petData.nombreMascota}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Especie / Raza</p>
                          <p className="font-bold text-slate-900">{selectedItemDetail.petData.especie} ({selectedItemDetail.petData.raza})</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Edad de la Mascota</p>
                          <p className="font-bold text-slate-900">{selectedItemDetail.petData.edad} Años</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Código Microchip</p>
                          <p className="font-bold text-slate-900 font-mono text-[11px]">{selectedItemDetail.petData.microchip}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Nombre de Dueño</p>
                          <p className="font-bold text-slate-900">{selectedItemDetail.petData.nombreDueno}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">RUT de Dueño</p>
                          <p className="font-bold text-slate-900 font-mono text-[11px]">{selectedItemDetail.petData.rutDueno}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Correo de Contacto (Notificaciones)</p>
                          <p className="font-bold text-slate-900 text-xs flex items-center gap-1 mt-0.5">
                            <Mail className="h-3.5 w-3.5 text-slate-500" />
                            {selectedItemDetail.petData.emailDueno || 'No registrado'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">ID de Trámite</p>
                          <p className="font-mono text-xs font-bold text-blue-700">{selectedItemDetail.petData.id}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Fecha de Registro</p>
                          <p className="font-bold text-slate-900">{selectedItemDetail.petData.fechaRegistro}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 text-center text-xs text-slate-500 italic bg-white rounded-lg border border-slate-200">
                        No se encontró ficha digital de pre-registro bajo el RUT del pasajero. 
                        Es obligatorio que el tutor registre la mascota en el Portal de Trámites antes de continuar.
                      </div>
                    )}
                  </div>

                  {selectedItemDetail.petData && (
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
                      <p className="font-bold text-slate-900">Validaciones Sanitarias Requeridas:</p>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-100">
                          <span className={`h-2.5 w-2.5 rounded-full ${selectedItemDetail.petData.vacunaAntirrabica ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                          <span>Vacuna Antirrábica: <strong>{selectedItemDetail.petData.vacunaAntirrabica ? 'SÍ' : 'NO'}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-100">
                          <span className={`h-2.5 w-2.5 rounded-full ${selectedItemDetail.petData.certificadoSanitario ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                          <span>Certificado Oficial: <strong>{selectedItemDetail.petData.certificadoSanitario ? 'SÍ' : 'NO'}</strong></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ARTICLE / PRODUCT DETAIL */}
              {selectedItemDetail.type === 'articulo' && (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-slate-700 space-y-2">
                    <h5 className="font-bold text-amber-900 uppercase flex items-center gap-1.5 border-b border-amber-200/50 pb-1">
                      <AlertTriangle className="h-4 w-4 text-amber-700" />
                      Evaluación de Riesgo Fitozoosanitario SAG
                    </h5>
                    
                    <p className="leading-relaxed mt-1">
                      {(() => {
                        const name = selectedItemDetail.name.toLowerCase();
                        if (name.includes('manzana') || name.includes('fruta') || name.includes('naranja') || name.includes('platano')) {
                          return "Categoría: Frutas Frescas. Alto riesgo de introducción de la Mosca de la Fruta (Ceratitis capitata) y otras plagas agrícolas ausentes en Chile. Esta fruta fresca requiere decomiso e incineración inmediata según la resolución exenta N° 3.120.";
                        } else if (name.includes('planta') || name.includes('tierra') || name.includes('semilla') || name.includes('flor')) {
                          return "Categoría: Especies Vegetales / Semillas. Riesgo de hongos patógenos, bacterias, viroides y malezas cuarentenarias. El ingreso de material de propagación vegetal sin previa autorización de importación del SAG está estrictamente prohibido.";
                        } else if (name.includes('carne') || name.includes('embutido') || name.includes('jamon') || name.includes('pollo')) {
                          return "Categoría: Productos Cárnicos crudos o subproductos de origen animal. Riesgo crítico de vehiculización de virus de alta gravedad como la Fiebre Aftosa, Peste Porcina Africana o Influenza Aviar de alta patogenicidad.";
                        } else if (name.includes('queso') || name.includes('leche') || name.includes('lacteo')) {
                          return "Categoría: Lácteos de elaboración artesanal. Riesgo de Brucelosis y Tuberculosis bovina por ausencia de pasteurización técnica certificada.";
                        } else {
                          return "Categoría: Equipajes de Viajero en General. Artículo bajo fiscalización del SAG. En caso de detectarse materias orgánicas silvoagropecuarias no procesadas industrialmente, se debe instruir tratamiento, retención o devolución al país de procedencia.";
                        }
                      })()}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
                    <p><strong>Clasificación del Elemento:</strong> {selectedItemDetail.esRiesgo ? '🚨 Elemento de Riesgo Biológico' : '✓ Libre Paso Autorizado'}</p>
                    <p><strong>Estado Actual:</strong> {selectedItemDetail.corregido ? '🟢 Corregido / Tratado / Decomisado' : '🟡 Pendiente de Fiscalización'}</p>
                    {selectedItemDetail.corregido && selectedItemDetail.motivoCorreccion && (
                      <p className="mt-1 p-2 bg-white rounded border border-slate-200 text-emerald-800">
                        <strong>Motivo de corrección registrado:</strong> {selectedItemDetail.motivoCorreccion}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* General SAG Legal warning */}
              <div className="p-3 bg-red-50 text-red-900 rounded-xl border border-red-100 flex gap-2.5">
                <Info className="h-4 w-4 text-red-700 shrink-0 mt-0.5" />
                <p className="text-[10px] leading-relaxed">
                  <strong>Artículo 3° Ley N° 17.213:</strong> Omitir declarar productos regulados al ingresar a Chile conlleva una multa inmediata de 3 a 15 UTM, además del decomiso y destrucción de los productos para resguardar el patrimonio ecológico y silvoagropecuario del país.
                </p>
              </div>

            </div>

            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedItemDetail(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cerrar Ventana
              </button>
            </div>
          </div>
        </div>
      )}
      </>)}
    </div>
  );
}
