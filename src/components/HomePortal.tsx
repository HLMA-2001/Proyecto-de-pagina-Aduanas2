import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Landmark, ArrowRight, ShieldCheck, Leaf, Search, ShieldAlert, 
  HeartHandshake, CheckCircle2, User, Globe, HelpCircle, FileText, CheckCircle,
  PawPrint, Coins, Clock
} from 'lucide-react';

interface HomePortalProps {
  onStartSimulation: (
    role: 'home' | 'usuario' | 'pdi' | 'aduana' | 'sag' | 'seleccion-perfil',
    extra?: { tab?: 'tramites' | 'mascotas'; modal?: 'register' | 'query' | 'delete' | null }
  ) => void;
  petCount: number;
  pendingAduanaCount: number;
  pendingSagCount: number;
}

const bannerImages = [
  {
    url: "/src/assets/images/portal_viajero_mockup_1782351445368.jpg",
    title: "Control Integrado de Fronteras",
    subtitle: "Paso Fronterizo Los Libertadores, Chile"
  },
  {
    url: "/src/assets/images/control_sag_mockup_1782765370725.jpg",
    title: "Sanidad y Protección Silvoagropecuaria",
    subtitle: "Revisiones oficiales y decomiso de riesgos por inspectores del SAG"
  },
  {
    url: "/src/assets/images/dashboard_aduana_mockup_1782351458963.jpg",
    title: "Auditoría Aduanera y de Divisas",
    subtitle: "Control fiscal, equipajes y declaración legal de porte de capital"
  },
  {
    url: "/src/assets/images/control_pdi_mockup_1782765383198.jpg",
    title: "Seguridad y Control Migratorio de Frontera",
    subtitle: "Verificación de antecedentes penales y alertas de Interpol por la PDI"
  }
];

export default function HomePortal({
  onStartSimulation,
  petCount,
  pendingAduanaCount,
  pendingSagCount
}: HomePortalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatic slide shift
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, []);

  const [searchResults, setSearchResults] = useState<{ 
    title: string; 
    category: string; 
    description: string; 
    role: 'usuario' | 'sag' | 'aduana' | 'pdi' | 'seleccion-perfil' | 'home'; 
    extra?: { tab?: 'tramites' | 'mascotas'; modal?: 'register' | 'query' | 'delete' | null } 
  }[]>([]);

  // Search regulations data
  const regulaciones = [
    {
      title: 'Registro de Mascotas (Perros, Gatos, Hurones)',
      category: 'SAG / Sanidad Animal',
      description: 'Obligatorio certificar vacunas antirrábicas vigentes y certificado sanitario oficial para ingresar con mascotas a Chile.',
      role: 'usuario' as const,
      extra: { tab: 'mascotas' as const, modal: 'register' as const }
    },
    {
      title: 'Declaración de Dinero y Divisas (sobre US$ 10.000)',
      category: 'Aduanas / Control Financiero',
      description: 'Cualquier portador de monedas o divisas en efectivo que exceda los US$ 10.000 (o equivalente) debe declararlo ante el Oficial de Aduanas.',
      role: 'usuario' as const,
      extra: { tab: 'tramites' as const }
    },
    {
      title: 'Ingreso de Alimentos, Frutas y Plantas',
      category: 'SAG / Sanidad Vegetal',
      description: 'Prohibido el ingreso de productos de origen vegetal o animal crudos sin declarar. El SAG revisará el equipaje para mitigar plagas.',
      role: 'sag' as const
    },
    {
      title: 'Control de Pasaporte e Historial Migratorio',
      category: 'PDI / Policía Internacional',
      description: 'Todos los chilenos y extranjeros deben someterse a la revisión de antecedentes criminales e identidad ante oficiales de la PDI.',
      role: 'pdi' as const
    },
    {
      title: 'Franquicia de Equipaje de Viajeros',
      category: 'Aduanas / Franquicia',
      description: 'Los viajeros pueden ingresar libre de aranceles artículos de uso personal nuevos hasta por un valor acumulado de US$ 500.',
      role: 'aduana' as const
    },
    {
      title: 'Decomisos y Multas por Declaración Falsa',
      category: 'SAG / Fiscalización',
      description: 'Omitir declarar mercancías reguladas por el SAG conlleva multas severas y decomiso inmediato del producto orgánico.',
      role: 'sag' as const
    }
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const filtered = regulaciones.filter(
      r => 
        r.title.toLowerCase().includes(query.toLowerCase()) || 
        r.description.toLowerCase().includes(query.toLowerCase()) ||
        r.category.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 text-left space-y-12"
      id="home-portal-container"
    >
      
      {/* MINIMALIST HERO BREADCRUMB */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Globe className="h-3.5 w-3.5 text-[#002f6c]" />
        <span>Gobierno de Chile</span>
        <span>•</span>
        <span>Ministerio de Hacienda</span>
        <span>•</span>
        <span className="text-[#002f6c] font-bold">Servicio Nacional de Aduanas</span>
      </div>

      {/* ADUANAS DE CHILE PREMIUM HERO SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#000e20] to-[#011e3b] rounded-3xl text-white p-8 md:p-12 shadow-2xl border border-slate-800/60 flex items-center">
        {/* Sliding images background with fade transitions */}
        <div className="absolute inset-0 z-0">
          {bannerImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-30 scale-100' : 'opacity-0 scale-105'
              }`}
              style={{ backgroundImage: `url(${img.url})`, transitionProperty: 'opacity, transform' }}
            />
          ))}
          {/* Subtle elegant pattern grid and deep color mask for optimal readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#000d1d]/90 via-[#001c3c]/85 to-[#000a18]/90 pointer-events-none"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        </div>

        {/* Ambient sliding indicators in the corner */}
        <div className="absolute bottom-5 right-8 z-10 flex items-center gap-2">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                index === currentSlide ? 'w-6 bg-amber-400' : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
              title={`Ver diapositiva ${index + 1}`}
            />
          ))}
        </div>

        {/* Caption overlay for what is active */}
        <div className="absolute top-5 right-8 z-10 bg-slate-950/50 border border-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-slate-300 hidden md:block">
          Frontera: <strong className="text-amber-400">{bannerImages[currentSlide].title}</strong>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 w-full">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#f2a900] animate-pulse"></span>
              <span className="text-[10px] font-black tracking-widest uppercase text-amber-400">
                Paso Fronterizo Integrado Digital • Chile
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Aduanas de Chile <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-sky-300">
                Sistema Integrado de Control
              </span>
            </h2>

            <p className="text-slate-200 text-xs md:text-sm leading-relaxed max-w-xl font-normal opacity-90">
              Plataforma estatal para la declaración, inspección fitozoosanitaria y control migratorio. Diseñado para simplificar los trámites de ingreso de los viajeros y optimizar las tareas de los inspectores en frontera.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => onStartSimulation('usuario')}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-[#f2a900] hover:from-amber-500 hover:to-amber-600 text-[#00152f] font-black rounded-xl text-xs transition-all duration-300 shadow-md flex items-center gap-2 cursor-pointer group scale-100 hover:scale-[1.02]"
                id="cta-viajero"
              >
                Trámites del Viajero
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </button>
              
              <button
                onClick={() => onStartSimulation('seleccion-perfil')}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl text-xs transition-all duration-300 border border-white/20 flex items-center gap-2 cursor-pointer hover:border-white/35 backdrop-blur-xs"
                id="cta-funcionarios"
              >
                Acceso Funcionarios (SAG/PDI/Aduana)
              </button>
            </div>

            {/* Embedded Live Indicator Stats */}
            <div className="pt-2">
              <div className="p-4 bg-slate-950/40 backdrop-blur-md rounded-2xl border border-white/10 grid grid-cols-3 gap-3 text-center max-w-md">
                <div className="space-y-0.5">
                  <span className="block text-xl md:text-2xl font-black text-amber-400">{petCount}</span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-300 font-bold block">Mascotas Reg.</span>
                </div>
                <div className="border-x border-white/10 space-y-0.5">
                  <span className="block text-xl md:text-2xl font-black text-emerald-400">{pendingSagCount}</span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-300 font-bold block">Alertas SAG</span>
                </div>
                <div className="space-y-0.5">
                  <span className="block text-xl md:text-2xl font-black text-sky-400">{pendingAduanaCount}</span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-300 font-bold block">Fila Aduana</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: SEARCH BAR INSPIRED BY OFFICIAL PORTAL */}
          <div className="lg:col-span-5 bg-slate-950/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Search className="h-4 w-4 text-amber-400" />
              Buscador de Normativa y Trámites
            </h3>
            <p className="text-[11px] text-slate-300 font-light leading-relaxed">
              Busque requisitos de ingreso de forma rápida (ej. "mascotas", "dinero", "frutas"):
            </p>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Escriba su consulta aquí..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 placeholder-slate-400 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium shadow-md"
              />
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>

            {/* Live Search Results */}
            <div className="relative">
              <AnimatePresence>
                {searchQuery.trim() !== '' && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute z-20 left-0 right-0 bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden text-slate-800 text-left max-h-[220px] overflow-y-auto divide-y divide-slate-100"
                  >
                    {searchResults.length > 0 ? (
                      searchResults.map((res, idx) => (
                        <div
                          key={idx}
                          onClick={() => onStartSimulation(res.role, res.extra)}
                          className="p-3 hover:bg-slate-50 cursor-pointer transition-colors space-y-1"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                              {res.category}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">Ir al portal →</span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900">{res.title}</h4>
                          <p className="text-[10px] text-slate-500 font-light leading-relaxed">{res.description}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-400 font-light">
                        No se encontraron resultados para su búsqueda.
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-300 pt-1">
              <span>Frecuentes: 🐕 Mascotas, 💵 Dinero, 🍏 SAG</span>
              <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
            </div>
          </div>

        </div>
      </div>

      {/* QUICK INTEREST SERVICES BAR (Minimalist shortcuts from official page) */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-3 border-r border-slate-100 last:border-0 pr-2">
          <div className="bg-red-50 text-red-600 p-2 rounded-xl">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-900">Franquicia Viajero</h5>
            <p className="text-[10px] text-slate-400 mt-0.5">Franquicia de US$ 500</p>
          </div>
        </div>
        <div className="flex items-center gap-3 border-r border-slate-100 last:border-0 pr-2">
          <div className="bg-amber-50 text-amber-700 p-2 rounded-xl">
            <Landmark className="h-4 w-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-900">Ingreso de Divisas</h5>
            <p className="text-[10px] text-slate-400 mt-0.5">Declare sobre US$10.000</p>
          </div>
        </div>
        <div className="flex items-center gap-3 border-r border-slate-100 last:border-0 pr-2">
          <div className="bg-emerald-50 text-emerald-700 p-2 rounded-xl">
            <Leaf className="h-4 w-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-900">Fitosanitario SAG</h5>
            <p className="text-[10px] text-slate-400 mt-0.5">Control silvoagropecuario</p>
          </div>
        </div>
        <div className="flex items-center gap-3 last:border-0">
          <div className="bg-slate-100 text-slate-700 p-2 rounded-xl">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-900">Policía Internacional</h5>
            <p className="text-[10px] text-slate-400 mt-0.5">PDI control migratorio</p>
          </div>
        </div>
      </div>

      {/* SECTION: TRÁMITES MÁS REALIZADOS */}
      <div className="space-y-6" id="section-tramites-mas-realizados">
        <div className="text-left border-b border-slate-200 pb-3 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-950 tracking-tight flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-amber-500" />
              Trámites más Realizados en el Portal
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Acceda de forma directa a las declaraciones obligatorias, registros fitosanitarios y consultas de estado en frontera.
            </p>
          </div>
          <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 font-bold px-3 py-1 rounded-full uppercase tracking-wider hidden sm:inline">
            ACCESOS DIRECTOS ACTIVOS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Trámite 1: Pre-registro de Mascotas (SAG) */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-300 group flex flex-col justify-between overflow-hidden text-left"
          >
            <div>
              <div className="relative h-28 bg-slate-100 overflow-hidden">
                <img 
                  src="/src/assets/images/mascota_registro_1782770663453.jpg" 
                  alt="Pre-registro de Mascotas" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-2 right-2 text-[9px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Digital / SAG
                </span>
              </div>
              <div className="p-4 space-y-2">
                <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5 group-hover:text-emerald-800 transition-colors">
                  <PawPrint className="h-4 w-4 text-emerald-600" />
                  Pre-registro de Mascotas
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal font-light">
                  Registra perros, gatos o hurones antes de viajar a Chile para agilizar el control sanitario de ingreso.
                </p>
              </div>
            </div>
            <div className="p-4 pt-0">
              <button
                onClick={() => onStartSimulation('usuario', { tab: 'mascotas', modal: 'register' })}
                className="w-full py-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-[10px] rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                id="btn-tramite-registro-mascota"
              >
                Comenzar Registro ➔
              </button>
            </div>
          </motion.div>

          {/* Trámite 2: Declaración Jurada de Equipaje */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white border border-slate-200 hover:border-blue-500 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-300 group flex flex-col justify-between overflow-hidden text-left"
          >
            <div>
              <div className="relative h-28 bg-slate-100 overflow-hidden">
                <img 
                  src="/src/assets/images/equipaje_inspeccion_1782770674947.jpg" 
                  alt="Declaración Jurada de Equipaje" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-2 right-2 text-[9px] font-extrabold bg-blue-600 text-white px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Obligatorio
                </span>
              </div>
              <div className="p-4 space-y-2">
                <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5 group-hover:text-blue-800 transition-colors">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Declaración de Equipaje (Aduana)
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal font-light">
                  Completa el manifiesto de artículos nuevos, obsequios o mercancías fitozoosanitarias reguladas.
                </p>
              </div>
            </div>
            <div className="p-4 pt-0">
              <button
                onClick={() => onStartSimulation('usuario', { tab: 'tramites' })}
                className="w-full py-2 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-[10px] rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                id="btn-tramite-declarar-equipaje"
              >
                Declarar Equipaje ➔
              </button>
            </div>
          </motion.div>

          {/* Trámite 3: Consulta Estado de Registro Veterinario */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white border border-slate-200 hover:border-amber-500 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-300 group flex flex-col justify-between overflow-hidden text-left"
          >
            <div>
              <div className="relative h-28 bg-slate-100 overflow-hidden">
                <img 
                  src="/src/assets/images/consulta_estado_1782770686271.jpg" 
                  alt="Consulta Estado de Trámite" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-2 right-2 text-[9px] font-extrabold bg-amber-500 text-amber-950 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Verificar Estado
                </span>
              </div>
              <div className="p-4 space-y-2">
                <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5 group-hover:text-amber-800 transition-colors">
                  <Clock className="h-4 w-4 text-amber-600" />
                  Consulta de Trámite Mascota
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal font-light">
                  Verifica si el pre-registro de tu mascota ya fue ingresado o validado usando el RUT del tutor.
                </p>
              </div>
            </div>
            <div className="p-4 pt-0">
              <button
                onClick={() => onStartSimulation('usuario', { tab: 'mascotas', modal: 'query' })}
                className="w-full py-2 bg-amber-50 hover:bg-amber-500 text-amber-950 hover:text-[#00152f] font-bold text-[10px] rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                id="btn-tramite-consultar-mascota"
              >
                Consultar Estado ➔
              </button>
            </div>
          </motion.div>

          {/* Trámite 4: Declaración de Dinero / Divisas */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white border border-slate-200 hover:border-indigo-500 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-300 group flex flex-col justify-between overflow-hidden text-left"
          >
            <div>
              <div className="relative h-28 bg-slate-100 overflow-hidden">
                <img 
                  src="/src/assets/images/divisas_declaracion_1782770696790.jpg" 
                  alt="Porte de Divisas sobre US$10.000" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-2 right-2 text-[9px] font-extrabold bg-indigo-600 text-white px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Obligatorio
                </span>
              </div>
              <div className="p-4 space-y-2">
                <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5 group-hover:text-indigo-800 transition-colors">
                  <Coins className="h-4 w-4 text-indigo-600" />
                  Porte de Divisas sobre US$10.000
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal font-light">
                  Declaración jurada obligatoria de porte de dinero o instrumentos que superen los 10 mil dólares en efectivo.
                </p>
              </div>
            </div>
            <div className="p-4 pt-0">
              <button
                onClick={() => onStartSimulation('usuario', { tab: 'tramites' })}
                className="w-full py-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-bold text-[10px] rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                id="btn-tramite-declaracion-divisas"
              >
                Declarar Divisas ➔
              </button>
            </div>
          </motion.div>

        </div>
      </div>

      {/* SECTIONS GRID WITH REAL IMAGES */}
      <div className="space-y-6">
        <div className="text-left border-b border-slate-200 pb-3 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-950 tracking-tight flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-800" />
              Módulos Interactivos de Fiscalización y Trámites
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Acceda a cada una de las dependencias que componen el control integrado de aduanas.
            </p>
          </div>
          <span className="text-[10px] font-bold text-slate-400 font-mono hidden sm:inline">
            4 PORTALES ACTIVOS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: VIAJERO */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:shadow-md hover:border-blue-300"
          >
            <div>
              <div className="relative h-32 bg-slate-100 overflow-hidden">
                <img 
                  src="/src/assets/images/portal_viajero_mockup_1782351445368.jpg" 
                  alt="Portal del Viajero" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-bold">Portal Ciudadano</span>
                </div>
                {petCount > 0 && (
                  <span className="absolute top-2 right-2 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    {petCount} Mascotas
                  </span>
                )}
              </div>
              <div className="p-5 space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <User className="h-4 w-4 text-blue-700" />
                  Portal del Viajero
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                  Módulo de autodeclaración para ciudadanos. Registre mascotas de inmediato y verifique trámites de forma directa en frontera.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0 mt-auto">
              <button
                onClick={() => onStartSimulation('usuario')}
                className="w-full py-2 bg-slate-50 hover:bg-blue-900 hover:text-white text-slate-700 text-[11px] font-bold rounded-lg transition-colors border border-slate-200 hover:border-blue-900 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Ingresar Trámites
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>

          {/* Card 2: SAG */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:shadow-md hover:border-emerald-300"
          >
            <div>
              <div className="relative h-32 bg-slate-100 overflow-hidden">
                <img 
                  src="/src/assets/images/control_sag_mockup_1782765370725.jpg" 
                  alt="Inspector SAG" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-bold">Sanidad Silvoagropecuaria</span>
                </div>
                {pendingSagCount > 0 && (
                  <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    {pendingSagCount} Pendientes
                  </span>
                )}
              </div>
              <div className="p-5 space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Leaf className="h-4 w-4 text-emerald-700" />
                  Inspector SAG
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                  Control fitosanitario y de sanidad animal de equipajes. Decomise productos de riesgo no declarados en tiempo real.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0 mt-auto">
              <button
                onClick={() => onStartSimulation('sag')}
                className="w-full py-2 bg-slate-50 hover:bg-emerald-700 hover:text-white text-slate-700 text-[11px] font-bold rounded-lg transition-colors border border-slate-200 hover:border-emerald-700 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Acceder a SAG
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>

          {/* Card 3: ADUANA */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:shadow-md hover:border-amber-300"
          >
            <div>
              <div className="relative h-32 bg-slate-100 overflow-hidden">
                <img 
                  src="/src/assets/images/dashboard_aduana_mockup_1782351458963.jpg" 
                  alt="Oficial de Aduana" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-bold">Aduanas de Chile</span>
                </div>
                {pendingAduanaCount > 0 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                    {pendingAduanaCount} Fila
                  </span>
                )}
              </div>
              <div className="p-5 space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Landmark className="h-4 w-4 text-amber-700" />
                  Oficial de Aduana
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                  Auditoría de manifiesto, verificación de divisas e historial migratorio del pasajero. Apruebe o deniegue ingresos.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0 mt-auto">
              <button
                onClick={() => onStartSimulation('aduana')}
                className="w-full py-2 bg-slate-50 hover:bg-[#002f6c] hover:text-white text-slate-700 text-[11px] font-bold rounded-lg transition-colors border border-slate-200 hover:border-[#002f6c] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Acceder a Aduana
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>

          {/* Card 4: PDI */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:shadow-md hover:border-slate-400"
          >
            <div>
              <div className="relative h-32 bg-slate-100 overflow-hidden">
                <img 
                  src="/src/assets/images/control_pdi_mockup_1782765383198.jpg" 
                  alt="Policía PDI" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-bold">Investigaciones Policiales</span>
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-slate-800" />
                  Policía PDI
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                  Módulo confidencial de investigaciones y expedientes migratorios. Consulte alertas migratorias internacionales activas.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0 mt-auto">
              <button
                onClick={() => onStartSimulation('pdi')}
                className="w-full py-2 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-700 text-[11px] font-bold rounded-lg transition-colors border border-slate-200 hover:border-slate-900 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Acceder a PDI
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>

        </div>
      </div>

      {/* COHESIVE STEP WORKFLOW */}
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
