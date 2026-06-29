import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Landmark, User, ShieldAlert, FileText, Leaf, Radio, ChevronDown, 
  Menu, X, ExternalLink, ShieldCheck, HeartHandshake, Info, BookOpen, ArrowRight
} from 'lucide-react';

interface MegaMenuProps {
  currentRole: 'home' | 'usuario' | 'pdi' | 'aduana' | 'sag';
  onChangeRole: (role: 'home' | 'usuario' | 'pdi' | 'aduana' | 'sag') => void;
  petCount: number;
  pendingAduanaCount: number;
  pendingSagCount: number;
}

export default function MegaMenu({
  currentRole,
  onChangeRole,
  petCount,
  pendingAduanaCount,
  pendingSagCount
}: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false); // Controls desktop Mega Dropdown
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Controls mobile drawer menu
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-[#002f6c] text-white shadow-lg w-full relative z-50" id="mega-menu-header">
      {/* Top Ministry Ribbon */}
      <div className="bg-[#d6012f] h-1.5 w-full" id="chilean-gov-ribbon-mega"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo and SGUH Title (Click to return Home) */}
          <div 
            onClick={() => { onChangeRole('home'); setIsOpen(false); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="bg-white p-2 rounded-lg flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-105">
              <Landmark className="h-7 w-7 text-[#002f6c]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
                  Aduana de Chile
                </span>
                <span className="text-[10px] bg-[#f2a900] text-blue-950 font-bold px-1.5 py-0.5 rounded tracking-wide uppercase flex items-center gap-1">
                  <Radio className="h-2.5 w-2.5 animate-pulse text-blue-950" /> SGUH
                </span>
              </div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
                SGUH <span className="text-xs font-normal text-slate-300 hidden md:inline">| Sistema de Gestión Unificado</span>
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2" id="desktop-nav">
            
            {/* Inicio Link */}
            <button
              onClick={() => { onChangeRole('home'); setIsOpen(false); }}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                currentRole === 'home'
                  ? 'bg-white/10 text-[#f2a900]'
                  : 'text-slate-200 hover:text-white hover:bg-white/5'
              }`}
            >
              Inicio
            </button>

            {/* MEGA MENU TRIGGER */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => setIsOpen(true)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 transition-all duration-200 cursor-pointer ${
                  isOpen || currentRole === 'usuario' || currentRole === 'sag'
                    ? 'bg-white/10 text-white'
                    : 'text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                Servicios y Trámites
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* MEGA MENU DROPDOWN */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    onMouseLeave={() => setIsOpen(false)}
                    className="absolute left-1/2 -translate-x-1/2 mt-3 w-[720px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left"
                    id="mega-menu-dropdown-desktop"
                  >
                    <div className="grid grid-cols-3 gap-6 p-6">
                      
                      {/* Column 1: Servicios y Trámites */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-extrabold text-[#002f6c] uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" /> Servicios de Viajero
                        </h4>
                        <ul className="space-y-2">
                          <li>
                            <button
                              onClick={() => { onChangeRole('usuario'); setIsOpen(false); }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-700 hover:text-blue-900 transition-colors flex items-center justify-between group"
                            >
                              <span>Portal del Viajero</span>
                              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => { onChangeRole('usuario'); setIsOpen(false); }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-xs text-slate-600 hover:text-blue-900 transition-colors flex items-center justify-between"
                            >
                              <span>Declaración de Trámites</span>
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => { onChangeRole('usuario'); setIsOpen(false); }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-xs text-slate-600 hover:text-blue-900 transition-colors flex items-center justify-between"
                            >
                              <span>Registro de Mascotas</span>
                              {petCount > 0 && (
                                <span className="bg-[#f2a900] text-blue-950 font-bold px-1.5 py-0.5 rounded-full text-[10px]">
                                  {petCount}
                                </span>
                              )}
                            </button>
                          </li>
                        </ul>
                      </div>

                      {/* Column 2: Recursos y Guías */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5" /> Recursos y Guías
                        </h4>
                        <ul className="space-y-2">
                          <li>
                            <button
                              onClick={() => { onChangeRole('usuario'); setIsOpen(false); }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-xs text-slate-600 hover:text-blue-900 transition-colors flex items-center justify-between"
                            >
                              <span>Normativa SAG Fitosanitaria</span>
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => { onChangeRole('usuario'); setIsOpen(false); }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-xs text-slate-600 hover:text-blue-900 transition-colors flex items-center justify-between"
                            >
                              <span>Ingreso de Divisas</span>
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => { onChangeRole('usuario'); setIsOpen(false); }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-xs text-slate-600 hover:text-blue-900 transition-colors flex items-center justify-between"
                            >
                              <span>Preguntas Frecuentes FAQ</span>
                            </button>
                          </li>
                        </ul>
                      </div>

                      {/* Column 3: Entidades de Control */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-extrabold text-red-700 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5" /> Control del Estado
                        </h4>
                        <ul className="space-y-2">
                          <li>
                            <button
                              onClick={() => { onChangeRole('aduana'); setIsOpen(false); }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-700 hover:text-blue-900 transition-colors flex items-center justify-between group"
                            >
                              <span className="flex items-center gap-1">
                                <FileText className="h-3.5 w-3.5 text-blue-800" /> Oficial Aduana
                              </span>
                              {pendingAduanaCount > 0 ? (
                                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                                  {pendingAduanaCount}
                                </span>
                              ) : (
                                <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => { onChangeRole('sag'); setIsOpen(false); }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-700 hover:text-blue-900 transition-colors flex items-center justify-between group"
                            >
                              <span className="flex items-center gap-1">
                                <Leaf className="h-3.5 w-3.5 text-emerald-700" /> Inspector SAG
                              </span>
                              {pendingSagCount > 0 ? (
                                <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                  {pendingSagCount}
                                </span>
                              ) : (
                                <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => { onChangeRole('pdi'); setIsOpen(false); }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-700 hover:text-blue-900 transition-colors flex items-center justify-between group"
                            >
                              <span className="flex items-center gap-1">
                                <ShieldAlert className="h-3.5 w-3.5 text-slate-700" /> Policía PDI
                              </span>
                              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          </li>
                        </ul>
                      </div>

                    </div>

                    <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Info className="h-3.5 w-3.5 text-[#002f6c]" />
                        Los datos se sincronizan entre todos los portales de manera bidireccional.
                      </span>
                      <span className="font-mono text-slate-400">Prototipo Integrado v1.4.0</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Access Buttons for Control Roles */}
            <div className="h-6 w-[1px] bg-white/10 mx-2"></div>

            <button
              onClick={() => { onChangeRole('aduana'); setIsOpen(false); }}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 transition-all duration-200 cursor-pointer ${
                currentRole === 'aduana'
                  ? 'bg-[#f2a900] text-blue-950 shadow-sm'
                  : 'text-slate-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Aduanas</span>
              {pendingAduanaCount > 0 && (
                <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                  {pendingAduanaCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { onChangeRole('sag'); setIsOpen(false); }}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 transition-all duration-200 cursor-pointer ${
                currentRole === 'sag'
                  ? 'bg-[#f2a900] text-blue-950 shadow-sm'
                  : 'text-slate-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Leaf className="h-4 w-4" />
              <span>SAG</span>
              {pendingSagCount > 0 && (
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {pendingSagCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { onChangeRole('pdi'); setIsOpen(false); }}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 transition-all duration-200 cursor-pointer ${
                currentRole === 'pdi'
                  ? 'bg-[#f2a900] text-blue-950 shadow-sm'
                  : 'text-slate-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldAlert className="h-4 w-4" />
              <span>PDI</span>
            </button>
          </nav>

          {/* Mobile Hamburger menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Abrir Menú"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE DRAWER MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden bg-[#001f4d] border-t border-slate-800 text-left overflow-hidden"
            id="mega-menu-mobile-drawer"
          >
            <div className="px-4 py-6 space-y-6">
              
              {/* Main Links */}
              <div className="space-y-2">
                <button
                  onClick={() => { onChangeRole('home'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm ${
                    currentRole === 'home' ? 'bg-[#f2a900] text-blue-950' : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  Inicio (Página Principal)
                </button>
              </div>

              {/* Column 1: Servicios Viajero */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-[#f2a900] uppercase tracking-wider px-4">
                  Servicios de Viajero
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => { onChangeRole('usuario'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-6 py-2.5 rounded-lg text-xs font-semibold ${
                      currentRole === 'usuario' ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    Portal del Viajero
                  </button>
                  <button
                    onClick={() => { onChangeRole('usuario'); setMobileMenuOpen(false); }}
                    className="w-full text-left px-6 py-2.5 rounded-lg text-xs text-slate-400 hover:bg-white/5"
                  >
                    Registro de Mascotas ({petCount})
                  </button>
                </div>
              </div>

              {/* Column 2: Control del Estado */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-[#f2a900] uppercase tracking-wider px-4">
                  Portales de Control Oficial
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => { onChangeRole('aduana'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-6 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                      currentRole === 'aduana' ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span>Oficial Aduana</span>
                    {pendingAduanaCount > 0 && (
                      <span className="bg-red-500 text-white font-bold px-1.5 py-0.5 rounded-full text-[10px]">
                        {pendingAduanaCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => { onChangeRole('sag'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-6 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                      currentRole === 'sag' ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span>Inspector SAG</span>
                    {pendingSagCount > 0 && (
                      <span className="bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded-full text-[10px]">
                        {pendingSagCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => { onChangeRole('pdi'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-6 py-2.5 rounded-lg text-xs font-semibold ${
                      currentRole === 'pdi' ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    Policía PDI
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simulation Info Ribbon */}
      <div className="bg-slate-900/60 border-t border-slate-800 text-center py-1.5 text-xs text-slate-300">
        Dispositivo de Simulación de Control de Frontera. Todos los datos ingresados interactúan en tiempo real entre los portales.
      </div>
    </header>
  );
}
