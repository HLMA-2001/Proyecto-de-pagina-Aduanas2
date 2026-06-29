import React, { useState } from 'react';
import { Leaf, Check, AlertTriangle, ShieldCheck, ChevronRight, HelpCircle, XCircle, FileText, AlertCircle, RefreshCw } from 'lucide-react';
import { EquipajeSAG, ArticuloEquipaje } from '../types';
import { ELEMENTOS_PROHIBIDOS_SAG } from '../data/mockData';

interface SAGPortalProps {
  equipajes: EquipajeSAG[];
  onUpdateEquipaje: (equipajeId: string, updatedArticulos: ArticuloEquipaje[], cumple: 'Pendiente' | 'Cumple' | 'No Cumple', comentarios?: string) => void;
}

export default function SAGPortal({ equipajes, onUpdateEquipaje }: SAGPortalProps) {
  const [selectedEquipajeId, setSelectedEquipajeId] = useState<string>(equipajes[0]?.id || '');
  
  // Selected items for correction (HU-05 Esc 2)
  const [selectedArticuloIds, setSelectedArticuloIds] = useState<string[]>([]);
  const [correctionText, setCorrectionText] = useState('');
  
  // Inspector comment state (HU-05 Esc 3)
  const [inspectorComment, setInspectorComment] = useState('');

  // Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const currentEquipaje = equipajes.find(e => e.id === selectedEquipajeId);

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
                        <div className="flex items-center">
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
    </div>
  );
}
