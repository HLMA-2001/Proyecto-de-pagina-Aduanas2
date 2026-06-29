import React from 'react';
import { motion } from 'motion/react';
import { User, Leaf, Landmark, ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';

interface SeleccionPerfilProps {
  onSelectRole: (role: 'home' | 'usuario' | 'pdi' | 'aduana' | 'sag') => void;
  petCount: number;
  pendingAduanaCount: number;
  pendingSagCount: number;
}

export default function SeleccionPerfil({
  onSelectRole,
  petCount,
  pendingAduanaCount,
  pendingSagCount
}: SeleccionPerfilProps) {
  
  const perfiles = [
    {
      id: 'usuario' as const,
      titulo: 'Portal del Viajero',
      institucion: 'Trámites y Mascotas',
      color: 'border-blue-500/30 hover:border-blue-500 hover:shadow-blue-500/10',
      iconBg: 'bg-blue-50 text-blue-700',
      icon: User,
      imagen: '/src/assets/images/portal_viajero_mockup_1782351445368.jpg',
      badge: petCount > 0 ? `${petCount} Registradas` : null,
      badgeColor: 'bg-blue-600 text-white',
      descripcion: 'Declare efectos personales, dinero sobre US$10.000, y realice el registro sanitario de mascotas para el paso por frontera.'
    },
    {
      id: 'sag' as const,
      titulo: 'Inspector SAG',
      institucion: 'Servicio Agrícola y Ganadero',
      color: 'border-emerald-500/30 hover:border-emerald-500 hover:shadow-emerald-500/10',
      iconBg: 'bg-emerald-50 text-emerald-700',
      icon: Leaf,
      imagen: '/src/assets/images/control_sag_mockup_1782765370725.jpg',
      badge: pendingSagCount > 0 ? `${pendingSagCount} Pendientes` : null,
      badgeColor: 'bg-emerald-600 text-white',
      descripcion: 'Inspeccione equipaje y mercancías reguladas. Identifique riesgos fitozoosanitarios e ingrese correcciones o decomisos.'
    },
    {
      id: 'aduana' as const,
      titulo: 'Oficial de Aduana',
      institucion: 'Servicio Nacional de Aduanas',
      color: 'border-amber-500/30 hover:border-amber-500 hover:shadow-amber-500/10',
      iconBg: 'bg-amber-50 text-amber-700',
      icon: Landmark,
      imagen: '/src/assets/images/dashboard_aduana_mockup_1782351458963.jpg',
      badge: pendingAduanaCount > 0 ? `${pendingAduanaCount} en Cola` : null,
      badgeColor: 'bg-red-500 text-white animate-pulse',
      descripcion: 'Efectúe la auditoría documental del viajero. Revise el historial, declaraciones financieras y autorice o deniegue el acceso al país.'
    },
    {
      id: 'pdi' as const,
      titulo: 'Policía de Investigaciones',
      institucion: 'Migración y Seguridad PDI',
      color: 'border-slate-500/30 hover:border-slate-500 hover:shadow-slate-500/10',
      iconBg: 'bg-slate-100 text-slate-800',
      icon: ShieldAlert,
      imagen: '/src/assets/images/control_pdi_mockup_1782765383198.jpg',
      badge: null,
      badgeColor: '',
      descripcion: 'Acceda a expedientes confidenciales y alertas migratorias de pasajeros bajo sospecha o con requerimientos especiales de fiscalía.'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 text-left space-y-10"
      id="portal-selection-container"
    >
      {/* Navigation breadcrumb back home */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-5">
        <button
          onClick={() => onSelectRole('home')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Inicio
        </button>
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          PORTALES DE CONTROL FRONTERIZO
        </span>
      </div>

      <div className="space-y-3 max-w-3xl">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">
          Iniciar Sesión en los Portales del Sistema
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          Seleccione su perfil correspondiente para ingresar al sistema de control unificado. Los datos y estados de inspección se comparten automáticamente en tiempo real entre todas las entidades reguladoras de frontera.
        </p>
      </div>

      {/* Grid of Roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {perfiles.map((p, index) => {
          const IconComponent = p.icon;
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className={`bg-white rounded-3xl border ${p.color} overflow-hidden shadow-sm flex flex-col justify-between group transition-all duration-300 hover:shadow-xl`}
            >
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={p.imagen}
                  alt={p.titulo}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                  <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">
                    {p.institucion}
                  </span>
                  <h3 className="text-white font-extrabold text-xl mt-1 flex items-center gap-2">
                    {p.titulo}
                  </h3>
                </div>
                {p.badge && (
                  <span className={`absolute top-4 right-4 ${p.badgeColor} font-bold text-[10px] px-2.5 py-1 rounded-full shadow-md`}>
                    {p.badge}
                  </span>
                )}
              </div>

              {/* Description Section */}
              <div className="p-6 md:p-8 space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`${p.iconBg} p-2 rounded-xl`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                      Acceso Autorizado
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed font-light">
                    {p.descripcion}
                  </p>
                </div>

                <button
                  onClick={() => onSelectRole(p.id)}
                  className="w-full mt-4 py-3 bg-[#002f6c] hover:bg-[#001f4d] text-white hover:text-amber-400 text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow group/btn cursor-pointer"
                >
                  <span>Ingresar a este Portal</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
