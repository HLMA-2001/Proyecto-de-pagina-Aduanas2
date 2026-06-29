import React from 'react';
import { motion } from 'motion/react';
import { Landmark, ArrowRight, ShieldCheck, Leaf, Search, ShieldAlert, HeartHandshake, CheckCircle2 } from 'lucide-react';

interface HomePortalProps {
  onStartSimulation: (role: 'usuario' | 'pdi' | 'aduana' | 'sag') => void;
  petCount: number;
  pendingAduanaCount: number;
  pendingSagCount: number;
}

export default function HomePortal({
  onStartSimulation,
  petCount,
  pendingAduanaCount,
  pendingSagCount
}: HomePortalProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 text-left space-y-16"
      id="home-portal-container"
    >
      {/* HERO SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#001f4d] via-[#002f6c] to-[#0a3a75] rounded-3xl text-white p-8 md:p-14 shadow-xl border border-slate-700/40">
        {/* Subtle decorative background lights */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-3xl relative z-10 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10"
          >
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#f2a900]">
              Servicio Nacional de Aduanas de Chile
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Paso Fronterizo Inteligente <br className="hidden md:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f2a900] to-amber-300">
              Sistema de Gestión Unificado (SGUH)
            </span>
          </h2>

          <p className="text-slate-200 text-sm md:text-base leading-relaxed max-w-2xl font-light">
            Bienvenido a la plataforma integrada de control fronterizo del Gobierno de Chile. Este simulador conecta de forma interactiva y en tiempo real a viajeros, inspectores de sanidad silvoagropecuaria, personal de aduanas y fiscalizadores de seguridad migratoria.
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <button
              onClick={() => onStartSimulation('usuario')}
              className="px-6 py-3.5 bg-[#f2a900] hover:bg-[#d49400] text-blue-950 font-bold rounded-xl text-sm transition-all duration-300 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer group"
              id="cta-viajero"
            >
              Iniciar como Viajero
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('features-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-sm transition-all duration-300 border border-white/20 hover:border-white/40 flex items-center gap-2 cursor-pointer"
              id="cta-explorar"
            >
              Explorar Portales
            </button>
          </div>
        </div>
      </div>

      {/* THREE CARDS SECTION: KEY FEATURES */}
      <div className="space-y-6" id="features-section">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center justify-center md:justify-start gap-2">
            <ShieldCheck className="h-6 w-6 text-[#002f6c]" />
            Módulos de Gestión e Inspección Fronteriza
          </h3>
          <p className="text-slate-500 text-sm mt-1">
            Seleccione una de las siguientes áreas para comenzar el flujo de fiscalización en tiempo real.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: SAG */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between group transition-shadow hover:shadow-md hover:border-emerald-200"
          >
            <div className="p-6 md:p-8 space-y-4">
              <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl w-fit transition-colors group-hover:bg-emerald-100">
                <Leaf className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                  Inspección SAG (Fitosanidad)
                  {pendingSagCount > 0 && (
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {pendingSagCount} Pend.
                    </span>
                  )}
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed font-light">
                  Control fitozoosanitario de equipajes y mercancías. Detecta automáticamente riesgos biológicos según la lista de prohibición del Estado de Chile, permitiendo realizar decomisos y correcciones sanitarias de inmediato.
                </p>
              </div>
            </div>
            <div className="p-6 md:p-8 pt-0 mt-auto">
              <button
                onClick={() => onStartSimulation('sag')}
                className="w-full py-2.5 bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white text-slate-700 text-xs font-bold rounded-lg transition-all duration-300 border border-slate-200 group-hover:border-emerald-600 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Acceder como SAG
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>

          {/* Card 2: ADUANA */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between group transition-shadow hover:shadow-md hover:border-blue-200"
          >
            <div className="p-6 md:p-8 space-y-4">
              <div className="bg-blue-50 text-blue-700 p-3 rounded-xl w-fit transition-colors group-hover:bg-blue-100">
                <Landmark className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                  Control Aduanero (Oficial)
                  {pendingAduanaCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                      {pendingAduanaCount} Fila
                    </span>
                  )}
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed font-light">
                  Oficina de control aduanero y de divisas. Permite auditar el manifiesto del viajero, historial migratorio, antecedentes criminales, correspondencia de mascotas registradas, declaraciones de dinero y autorizar o denegar accesos al territorio nacional.
                </p>
              </div>
            </div>
            <div className="p-6 md:p-8 pt-0 mt-auto">
              <button
                onClick={() => onStartSimulation('aduana')}
                className="w-full py-2.5 bg-slate-50 group-hover:bg-[#002f6c] group-hover:text-white text-slate-700 text-xs font-bold rounded-lg transition-all duration-300 border border-slate-200 group-hover:border-[#002f6c] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Acceder como Aduana
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>

          {/* Card 3: PDI */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between group transition-shadow hover:shadow-md hover:border-slate-300"
          >
            <div className="p-6 md:p-8 space-y-4">
              <div className="bg-slate-100 text-slate-800 p-3 rounded-xl w-fit transition-colors group-hover:bg-slate-200">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-slate-900">
                  Fiscalía y Policía (PDI)
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed font-light">
                  Módulo de control de policía y seguridad migratoria nacional. Requiere de autenticación segura para acceder al expediente de casos bajo sospecha o alerta especial, facilitando búsquedas por ID de caso para resguardar la soberanía del país.
                </p>
              </div>
            </div>
            <div className="p-6 md:p-8 pt-0 mt-auto">
              <button
                onClick={() => onStartSimulation('pdi')}
                className="w-full py-2.5 bg-slate-50 group-hover:bg-slate-900 group-hover:text-white text-slate-700 text-xs font-bold rounded-lg transition-all duration-300 border border-slate-200 group-hover:border-slate-950 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Acceder como PDI
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>

        </div>
      </div>

      {/* SUB-SECTION: SIMULATOR WORKFLOW */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 md:p-8 text-slate-600 text-xs leading-relaxed">
        <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
          <HeartHandshake className="h-4 w-4 text-[#d6012f]" />
          Flujo de Trabajo Cohesivo e Interconectado en Tiempo Real
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
          <div className="space-y-1">
            <span className="font-extrabold text-[#002f6c] block">Paso 1: Declaración</span>
            <p className="font-light">El viajero registra su mascota o declara equipajes desde el portal público.</p>
          </div>
          <div className="space-y-1">
            <span className="font-extrabold text-emerald-700 block">Paso 2: Sanidad SAG</span>
            <p className="font-light">El inspector SAG revisa de forma inmediata el equipaje y procesa alertas fitozoosanitarias.</p>
          </div>
          <div className="space-y-1">
            <span className="font-extrabold text-[#d6012f] block">Paso 3: Oficial Aduana</span>
            <p className="font-light">El oficial de aduanas consulta la alerta del SAG, inspecciona y decide autorizar o denegar el paso.</p>
          </div>
          <div className="space-y-1">
            <span className="font-extrabold text-slate-900 block">Paso 4: Auditoría PDI</span>
            <p className="font-light">La policía de aduanas investiga los casos sospechosos en su base de datos confidencial.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
