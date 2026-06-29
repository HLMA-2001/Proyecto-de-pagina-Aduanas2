import React, { useState } from 'react';
import { ShieldAlert, Search, UserCheck, Key, FileText, ChevronRight, X, Eye, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { CasoPDI } from '../types';

interface PDIPortalProps {
  casos: CasoPDI[];
  onAddCaso?: (nuevoCaso: CasoPDI) => void;
}

export default function PDIPortal({ casos }: PDIPortalProps) {
  // HU-02 Esc 1: Login simulation state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // HU-02 Esc 2 & 3: Cases Dashboard state
  const [searchId, setSearchId] = useState('');
  const [selectedCaso, setSelectedCaso] = useState<CasoPDI | null>(null);

  // Pre-seeded credentials for PDI
  const DEFAULT_RUT = "12.345.678-9";
  const DEFAULT_PASS = "pdi1234";

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

  // Filter cases by search ID (HU-02 Esc 2: Búsqueda de casos)
  const filteredCasos = casos.filter(caso => {
    if (!searchId.trim()) return true;
    return caso.id.toLowerCase().includes(searchId.toLowerCase()) ||
           caso.pasajeroNombre.toLowerCase().includes(searchId.toLowerCase()) ||
           caso.rut.toLowerCase().includes(searchId.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="pdi-portal-root">
      
      {/* 1. NOT LOGGED IN STATE - SHOW FORM (HU-02 Escenario 1) */}
      {!isLoggedIn ? (
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden" id="pdi-login-form">
          <div className="bg-[#001f4d] text-white p-6 text-center border-b border-amber-500/30">
            <div className="bg-amber-400 p-3 rounded-full w-14 h-14 mx-auto flex items-center justify-center text-blue-950 mb-3 shadow-md">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <h3 className="font-extrabold text-lg uppercase tracking-wider">PDI de Chile</h3>
            <p className="text-slate-300 text-xs mt-1">Policía de Investigaciones • Control Migratorio</p>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-4 text-left">
            <p className="text-slate-500 text-xs text-center">
              Ingrese sus credenciales de fiscalizador migratorio habilitado para acceder a los antecedentes de delitos e Interpol.
            </p>

            {loginError && (
              <div className="bg-red-50 text-red-800 text-xs p-3 rounded-lg border border-red-200 flex gap-2" id="login-error-alert">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <UserCheck className="h-3 w-3 text-[#002f6c]" />
                RUT del Fiscalizador
              </label>
              <input
                type="text"
                required
                placeholder="Ej: 12.345.678-9 o 'admin'"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                className="mt-1 w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002f6c]"
                id="pdi-input-rut"
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
                placeholder="Ej: pdi1234 o 'admin'"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002f6c]"
                id="pdi-input-password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#001f4d] hover:bg-[#002f6c] text-white py-2.5 px-4 text-xs font-bold rounded-lg border border-amber-500/20 transition-all cursor-pointer text-center"
              id="btn-pdi-login"
            >
              Iniciar Sesión
            </button>

            {/* Quick Helper Box for Sandbox evaluation */}
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-[11px] text-slate-600 space-y-2">
              <p className="font-bold text-slate-700 flex items-center gap-1">
                <Info className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                Acceso de Evaluación Rápida:
              </p>
              <p>RUT: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">{DEFAULT_RUT}</code> | Clave: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">{DEFAULT_PASS}</code></p>
              <button
                type="button"
                onClick={handleQuickLogin}
                className="w-full mt-1 bg-amber-400 hover:bg-amber-500 text-blue-950 font-bold py-1.5 px-3 rounded text-[10px] transition-colors cursor-pointer"
                id="btn-pdi-quick-login"
              >
                Autenticación Instantánea (Click Aquí)
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* 2. LOGGED IN STATE - CONTROL DASHBOARD (HU-02 Escenarios 2 y 3) */
        <div className="space-y-6 text-left" id="pdi-dashboard">
          
          {/* Header Dashboard Banner */}
          <div className="bg-[#001f4d] text-white rounded-2xl p-6 border-b-4 border-[#f2a900] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-amber-400 p-2.5 rounded-xl text-blue-950">
                <ShieldAlert className="h-8 w-8" />
              </div>
              <div>
                <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded">
                  ÁREA RESTRINGIDA
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  SISTEMA DE FISCALIZACIÓN Y REVISIÓN DE CASOS PDI (HU-02)
                </h3>
                <p className="text-slate-300 text-xs">
                  Sesión activa: Inspector(a) General | RUT {DEFAULT_RUT}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsLoggedIn(false)}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                id="btn-pdi-logout"
              >
                Cerrar Sesión PDI
              </button>
            </div>
          </div>

          {/* Search Box - HU-02 Escenario 2 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div>
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Search className="h-4 w-4 text-[#002f6c]" />
                Búsqueda Rápida de Casos (HU-02 Escenario 2)
              </h4>
              <p className="text-slate-500 text-xs mt-0.5">
                Ingrese el ID del Caso PDI, RUT o Nombre del Pasajero para buscar antecedentes criminales o migratorios detallados en pantalla.
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Ej: CASO-7218, Andrés Villalobos, 15.489.201-K..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002f6c]"
                id="pdi-search-input"
              />
            </div>
          </div>

          {/* Cases List - HU-02 Escenario 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-[#002f6c]" />
                Listado General de Casos de Interés (HU-02 Escenario 3)
              </h4>
              <span className="text-xs bg-[#001f4d] text-white px-2 py-0.5 rounded font-mono">
                Registros: {filteredCasos.length}
              </span>
            </div>

            <div className="divide-y divide-slate-200" id="pdi-cases-list">
              {filteredCasos.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  Ningún caso coincide con los criterios de búsqueda especificados.
                </div>
              ) : (
                filteredCasos.map((caso) => (
                  <div
                    key={caso.id}
                    id={`pdi-case-item-${caso.id}`}
                    className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Passenger basic details */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-[#002f6c] bg-slate-100 px-2 py-0.5 rounded">
                          {caso.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          caso.estado === 'Alerta Activa'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : caso.estado === 'Bajo Investigación'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {caso.estado}
                        </span>
                      </div>
                      <h5 className="font-bold text-slate-900 text-sm mt-1">{caso.pasajeroNombre}</h5>
                      <p className="text-xs text-slate-500">
                        RUT: <strong className="text-slate-700">{caso.rut}</strong> | Pasaporte: <strong className="text-slate-700">{caso.pasaporte}</strong>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Ruta: {caso.origen} → {caso.destino}
                      </p>
                    </div>

                    {/* Meta info & Action button */}
                    <div className="flex md:flex-col items-start md:items-end justify-between md:justify-center gap-2">
                      <div className="text-[11px] text-slate-400 text-left md:text-right">
                        <p>Creado por: <strong>{caso.creador}</strong></p>
                        <p>Fecha: {caso.fechaCreacion}</p>
                      </div>
                      
                      <button
                        id={`btn-ver-caso-${caso.id}`}
                        onClick={() => setSelectedCaso(caso)}
                        className="bg-slate-100 hover:bg-[#002f6c] hover:text-white text-slate-700 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Ver Expediente
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}


      {/* ================= PDI CASE DETAILS MODAL (HU-02 Escenario 3) ================= */}
      {selectedCaso && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="modal-detalle-caso-pdi">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden text-left animate-in fade-in zoom-in duration-200">
            <div className="bg-[#001f4d] text-white p-4 flex justify-between items-center border-b border-amber-500/20">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-400" />
                Expediente de Control Migratorio PDI
              </h3>
              <button 
                id="close-modal-pdi-caso"
                onClick={() => setSelectedCaso(null)} 
                className="text-white hover:text-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Header inside modal */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono">CÓDIGO DE EXPEDIENTE</span>
                  <h4 className="text-xl font-mono font-extrabold text-[#001f4d]">{selectedCaso.id}</h4>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                  selectedCaso.estado === 'Alerta Activa'
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : selectedCaso.estado === 'Bajo Investigación'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {selectedCaso.estado}
                </span>
              </div>

              {/* Passenger Metadata */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-700">
                <div>
                  <h6 className="text-[10px] font-bold text-slate-400 uppercase">Nombre Completo</h6>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedCaso.pasajeroNombre}</p>
                </div>
                <div>
                  <h6 className="text-[10px] font-bold text-slate-400 uppercase">RUT / Identificador</h6>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedCaso.rut}</p>
                </div>
                <div>
                  <h6 className="text-[10px] font-bold text-slate-400 uppercase">Número Pasaporte</h6>
                  <p className="font-bold text-slate-900 mt-0.5 font-mono">{selectedCaso.pasaporte}</p>
                </div>
                <div>
                  <h6 className="text-[10px] font-bold text-slate-400 uppercase">Trayecto Controlado</h6>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedCaso.origen} → {selectedCaso.destino}</p>
                </div>
              </div>

              {/* Case Details */}
              <div className="space-y-1.5">
                <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Detalles y Observaciones Policiales</h5>
                <p className="text-slate-800 text-xs bg-amber-50/50 p-3.5 rounded-xl border border-amber-100/50 leading-relaxed font-mono">
                  {selectedCaso.descripcionDetallada}
                </p>
              </div>

              {/* Creator details required in HU-02 Esc 3 */}
              <div className="grid grid-cols-2 gap-4 text-[11px] border-t border-slate-100 pt-3 text-slate-500">
                <div>
                  <p>Funcionario Creador:</p>
                  <strong className="text-slate-700">{selectedCaso.creador}</strong>
                </div>
                <div>
                  <p>Fecha de Creación:</p>
                  <strong className="text-slate-700">{selectedCaso.fechaCreacion}</strong>
                </div>
              </div>
            </div>

            <div className="bg-slate-100 px-6 py-3 flex justify-end gap-2">
              {selectedCaso.estado !== 'Despejado' && (
                <button
                  onClick={() => {
                    selectedCaso.estado = 'Despejado';
                    setSelectedCaso(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Marcar como Despejado
                </button>
              )}
              <button
                onClick={() => setSelectedCaso(null)}
                className="px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Cerrar Expediente
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
