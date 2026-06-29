import React, { useState, useEffect } from 'react';
import MegaMenu from './components/MegaMenu';
import HomePortal from './components/HomePortal';
import UserPortal from './components/UserPortal';
import PDIPortal from './components/PDIPortal';
import AduanaPortal from './components/AduanaPortal';
import SAGPortal from './components/SAGPortal';
import SeleccionPerfil from './components/SeleccionPerfil';
import { Mascota, CasoPDI, PasajeroAduana, EquipajeSAG, ArticuloEquipaje } from './types';
import { 
  TRÁMITES_INICIALES, 
  MASCOTAS_INICIALES, 
  CASOS_PDI_INICIALES, 
  PASAJEROS_ADUANA_INICIALES, 
  EQUIPAJES_SAG_INICIALES 
} from './data/mockData';
import { Landmark, ShieldCheck, ArrowRight, HeartHandshake, BookOpen, RefreshCw, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function App() {
  // Current Perspective (now defaults to 'home')
  const [currentRole, setCurrentRole] = useState<'home' | 'usuario' | 'pdi' | 'aduana' | 'sag' | 'seleccion-perfil'>('home');

  // Navigation helpers for direct links
  const [userActiveTab, setUserActiveTab] = useState<'tramites' | 'mascotas'>('tramites');
  const [userActiveModal, setUserActiveModal] = useState<'register' | 'query' | 'delete' | null>(null);

  const handleStartSimulation = (
    role: 'home' | 'usuario' | 'pdi' | 'aduana' | 'sag' | 'seleccion-perfil',
    extra?: { tab?: 'tramites' | 'mascotas'; modal?: 'register' | 'query' | 'delete' | null }
  ) => {
    if (extra) {
      if (extra.tab) setUserActiveTab(extra.tab);
      if (extra.modal !== undefined) setUserActiveModal(extra.modal);
    }
    setCurrentRole(role);
  };

  // Shared application states (persisted via LocalStorage for high-fidelity evaluation)
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [pasajerosAduana, setPasajerosAduana] = useState<PasajeroAduana[]>([]);
  const [equipajesSAG, setEquipajesSAG] = useState<EquipajeSAG[]>([]);
  const [casosPDI, setCasosPDI] = useState<CasoPDI[]>([]);

  // Initialize data on mount
  useEffect(() => {
    const savedPets = localStorage.getItem('sgu_mascotas');
    const savedPasajeros = localStorage.getItem('sgu_pasajeros');
    const savedEquipajes = localStorage.getItem('sgu_equipajes');
    const savedCasos = localStorage.getItem('sgu_casos');

    if (savedPets) {
      setMascotas(JSON.parse(savedPets));
    } else {
      setMascotas(MASCOTAS_INICIALES);
      localStorage.setItem('sgu_mascotas', JSON.stringify(MASCOTAS_INICIALES));
    }

    if (savedPasajeros) {
      setPasajerosAduana(JSON.parse(savedPasajeros));
    } else {
      setPasajerosAduana(PASAJEROS_ADUANA_INICIALES);
      localStorage.setItem('sgu_pasajeros', JSON.stringify(PASAJEROS_ADUANA_INICIALES));
    }

    if (savedEquipajes) {
      setEquipajesSAG(JSON.parse(savedEquipajes));
    } else {
      setEquipajesSAG(EQUIPAJES_SAG_INICIALES);
      localStorage.setItem('sgu_equipajes', JSON.stringify(EQUIPAJES_SAG_INICIALES));
    }

    if (savedCasos) {
      setCasosPDI(JSON.parse(savedCasos));
    } else {
      setCasosPDI(CASOS_PDI_INICIALES);
      localStorage.setItem('sgu_casos', JSON.stringify(CASOS_PDI_INICIALES));
    }
  }, []);

  // Sync callbacks with LocalStorage
  const handleAddPet = (newPet: Mascota) => {
    const updated = [newPet, ...mascotas];
    setMascotas(updated);
    localStorage.setItem('sgu_mascotas', JSON.stringify(updated));

    // Automatically create a corresponding SAG baggage declaration for simulation completeness
    const existingSAG = equipajesSAG.find(e => e.rut === newPet.rutDueno);
    if (!existingSAG) {
      const newEquipaje: EquipajeSAG = {
        id: `E-${Math.floor(410 + Math.random() * 90)}`,
        pasajeroNombre: newPet.nombreDueno,
        rut: newPet.rutDueno,
        articulos: [
          { id: 'M1', nombre: `Mascota: ${newPet.nombreMascota} (${newPet.especie})`, esRiesgo: true, corregido: false },
          { id: 'M2', nombre: "Efectos de viaje y maletas", esRiesgo: false, corregido: false }
        ],
        cumpleSAG: 'Pendiente',
        fechaDeclaracion: new Date().toISOString().split('T')[0]
      };
      const updatedSAG = [newEquipaje, ...equipajesSAG];
      setEquipajesSAG(updatedSAG);
      localStorage.setItem('sgu_equipajes', JSON.stringify(updatedSAG));
    }

    // Automatically create a Passenger entry in queue too if they don't exist
    const existingPassenger = pasajerosAduana.find(p => p.rut === newPet.rutDueno);
    if (!existingPassenger) {
      const newPassenger: PasajeroAduana = {
        id: `T-${Math.floor(105 + Math.random() * 50)}`,
        nombre: newPet.nombreDueno,
        rut: newPet.rutDueno,
        nacionalidad: "Chilena",
        viajaDesde: "Mendoza, Argentina",
        viajaHacia: "Santiago, Chile",
        historialViajes: [
          { fecha: new Date().toISOString().split('T')[0], destino: "Argentina", motivo: "Turismo" }
        ],
        historialCriminal: ["Ninguno"],
        declaradoDinero: 500,
        declaradoMercancias: false,
        estadoPaso: 'Pendiente',
        fechaTurno: new Date().toISOString().split('T')[0]
      };
      const updatedPasajeros = [...pasajerosAduana, newPassenger];
      setPasajerosAduana(updatedPasajeros);
      localStorage.setItem('sgu_pasajeros', JSON.stringify(updatedPasajeros));
    }
  };

  const handleDeletePet = (petId: string, rut: string): boolean => {
    // Normalize RUTs for matching
    const normalize = (r: string) => r.replace(/\s/g, '').replace(/\./g, '').toLowerCase();
    const targetRut = normalize(rut);

    const exists = mascotas.some(m => m.id === petId && normalize(m.rutDueno) === targetRut);
    if (!exists) return false;

    const filtered = mascotas.filter(m => !(m.id === petId && normalize(m.rutDueno) === targetRut));
    setMascotas(filtered);
    localStorage.setItem('sgu_mascotas', JSON.stringify(filtered));
    return true;
  };

  const handleUpdateCasoPDI = (casoId: string, resolucion: 'Aceptado' | 'Denegado' | 'Pendiente', motivo: string) => {
    const updated = casosPDI.map(c => {
      if (c.id === casoId) {
        return {
          ...c,
          resolucionPDI: resolucion,
          motivoResolucion: motivo,
          estado: resolucion === 'Aceptado' ? 'Despejado' as const : resolucion === 'Denegado' ? 'Alerta Activa' as const : c.estado
        };
      }
      return c;
    });
    setCasosPDI(updated);
    localStorage.setItem('sgu_casos', JSON.stringify(updated));
  };

  const handleAduanaDecision = (pasajeroId: string, decision: 'Acceso Permitido' | 'Acceso Denegado', motivo?: string) => {
    const updated = pasajerosAduana.map(p => {
      if (p.id === pasajeroId) {
        return {
          ...p,
          estadoPaso: decision,
          motivoDenegacion: motivo
        };
      }
      return p;
    });
    setPasajerosAduana(updated);
    localStorage.setItem('sgu_pasajeros', JSON.stringify(updated));
  };

  const handleUpdateEquipaje = (
    equipajeId: string, 
    updatedArticulos: ArticuloEquipaje[], 
    cumple: 'Pendiente' | 'Cumple' | 'No Cumple', 
    comentarios?: string
  ) => {
    const updated = equipajesSAG.map(eq => {
      if (eq.id === equipajeId) {
        return {
          ...eq,
          articulos: updatedArticulos,
          cumpleSAG: cumple,
          comentariosInspector: comentarios
        };
      }
      return eq;
    });
    setEquipajesSAG(updated);
    localStorage.setItem('sgu_equipajes', JSON.stringify(updated));

    // Real-time integration: If SAG compliance is set to 'No Cumple' and not corrected,
    // automatically alert corresponding Customs Passenger queue item for simulation fidelity.
    const currentEq = equipajesSAG.find(e => e.id === equipajeId);
    if (currentEq && cumple === 'No Cumple') {
      const passenger = pasajerosAduana.find(p => p.rut === currentEq.rut);
      if (passenger && passenger.estadoPaso === 'Pendiente') {
        const updatedPasajeros = pasajerosAduana.map(p => {
          if (p.rut === currentEq.rut) {
            return {
              ...p,
              historialCriminal: [...p.historialCriminal, "ALERTA SAG: Equipaje declarado no cumple estándar fitozoosanitario."]
            };
          }
          return p;
        });
        setPasajerosAduana(updatedPasajeros);
        localStorage.setItem('sgu_pasajeros', JSON.stringify(updatedPasajeros));
      }
    }
  };

  // Reset simulation to factory default seeds
  const handleResetSimulation = () => {
    if (window.confirm("¿Está seguro de reiniciar todo el prototipo? Esto borrará los cambios locales.")) {
      localStorage.removeItem('sgu_mascotas');
      localStorage.removeItem('sgu_pasajeros');
      localStorage.removeItem('sgu_equipajes');
      localStorage.removeItem('sgu_casos');
      setMascotas(MASCOTAS_INICIALES);
      setPasajerosAduana(PASAJEROS_ADUANA_INICIALES);
      setEquipajesSAG(EQUIPAJES_SAG_INICIALES);
      setCasosPDI(CASOS_PDI_INICIALES);
      setCurrentRole('home');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800" id="sgu-app-root">
      
      {/* Top Ministry Ribbon / Responsive Mega Menu Bar */}
      <MegaMenu 
        currentRole={currentRole} 
        onChangeRole={setCurrentRole} 
        petCount={mascotas.length}
        pendingAduanaCount={pasajerosAduana.filter(p => p.estadoPaso === 'Pendiente').length}
        pendingSagCount={equipajesSAG.filter(e => e.cumpleSAG === 'Pendiente').length}
      />

      {/* Main Sandbox Interactive workspace */}
      <main className="flex-1 w-full pb-12">
        {currentRole === 'home' && (
          <HomePortal
            onStartSimulation={handleStartSimulation}
            petCount={mascotas.length}
            pendingAduanaCount={pasajerosAduana.filter(p => p.estadoPaso === 'Pendiente').length}
            pendingSagCount={equipajesSAG.filter(e => e.cumpleSAG === 'Pendiente').length}
          />
        )}

        {currentRole === 'seleccion-perfil' && (
          <SeleccionPerfil
            onSelectRole={setCurrentRole}
            petCount={mascotas.length}
            pendingAduanaCount={pasajerosAduana.filter(p => p.estadoPaso === 'Pendiente').length}
            pendingSagCount={equipajesSAG.filter(e => e.cumpleSAG === 'Pendiente').length}
          />
        )}

        {currentRole === 'usuario' && (
          <UserPortal 
            tramites={TRÁMITES_INICIALES} 
            mascotas={mascotas}
            onAddPet={handleAddPet}
            onDeletePet={handleDeletePet}
            initialTab={userActiveTab}
            onChangeTab={setUserActiveTab}
            initialModal={userActiveModal}
            onChangeModal={setUserActiveModal}
          />
        )}

        {currentRole === 'pdi' && (
          <PDIPortal 
            casos={casosPDI}
            onUpdateCaso={handleUpdateCasoPDI}
          />
        )}

        {currentRole === 'aduana' && (
          <AduanaPortal 
            pasajeros={pasajerosAduana}
            mascotas={mascotas}
            equipajesSAG={equipajesSAG}
            onDecision={handleAduanaDecision}
          />
        )}

        {currentRole === 'sag' && (
          <SAGPortal 
            equipajes={equipajesSAG}
            mascotas={mascotas}
            onUpdateEquipaje={handleUpdateEquipaje}
          />
        )}
      </main>

      {/* Footer styled as Chile Government Agency Portal */}
      <footer className="bg-[#00152f] text-slate-400 text-xs border-t border-slate-800" id="official-gov-footer">
        
        {/* Quick sandbox flow help cards */}
        <div className="bg-[#00224d] py-8 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            <div>
              <h5 className="text-amber-400 font-bold uppercase tracking-wider text-xs flex items-center gap-1">
                <BookOpen className="h-4 w-4" /> GUÍA DE REVISIÓN
              </h5>
              <p className="mt-2 text-slate-300 leading-relaxed text-[11px]">
                Siga estos flujos de simulación interactivos para verificar el 100% de los criterios y las 5 Historias de Usuario descritas en los diagramas.
              </p>
            </div>

            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800">
              <span className="text-[#f2a900] font-bold text-[10px] block">FLUJO 1: MASCOTAS Y TRÁMITES (HU-01, HU-03)</span>
              <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                En el portal de <strong>Público/Viajero</strong>, busque trámites, filtre por categoría, cree un registro de mascota ("Rocco", etc.), verifique su estado con el RUT del dueño y elimínelo si lo desea.
              </p>
            </div>

            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800">
              <span className="text-[#f2a900] font-bold text-[10px] block">FLUJO 2: EXPEDIENTES PDI (HU-02)</span>
              <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                Inicie sesión como PDI utilizando las credenciales indicadas. Busque casos por ID (ej: <code className="bg-slate-800 text-amber-300 px-1 rounded">CASO-7218</code>) o navegue por la grilla y abra expedientes migratorios.
              </p>
            </div>

            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800">
              <span className="text-[#f2a900] font-bold text-[10px] block">FLUJO 3: ADUANA Y SAG (HU-04, HU-05)</span>
              <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                Inspeccione equipaje en el <strong>Portal SAG</strong> (destaca riesgo automáticamente). Corrija elementos con justificación y califique. Luego, pase al <strong>Portal de Aduanas</strong> para autorizar o denegar el paso del viajero.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="bg-white p-1.5 rounded-lg shadow-sm">
              <Landmark className="h-8 w-8 text-[#00152f]" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Servicio Nacional de Aduanas • Gobierno de Chile</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Ministerio de Hacienda, República de Chile. Prototipo oficial simplificado para la integración fronteriza.</p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3">
            {/* Redes Sociales Oficiales */}
            <div className="flex items-center gap-4" id="social-links-footer">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">SÍGUENOS:</span>
              <a href="https://www.facebook.com/aduana.chile" target="_blank" rel="noopener noreferrer" className="p-1.5 bg-slate-900/40 hover:bg-[#1877f2]/20 hover:text-[#1877f2] rounded-full text-slate-400 transition-all border border-slate-800" title="Facebook">
                <Facebook className="h-4.5 w-4.5" />
              </a>
              <a href="https://twitter.com/AduanasDeChile" target="_blank" rel="noopener noreferrer" className="p-1.5 bg-slate-900/40 hover:bg-[#1da1f2]/20 hover:text-[#1da1f2] rounded-full text-slate-400 transition-all border border-slate-800" title="Twitter / X">
                <Twitter className="h-4.5 w-4.5" />
              </a>
              <a href="https://www.instagram.com/aduanasdechile" target="_blank" rel="noopener noreferrer" className="p-1.5 bg-slate-900/40 hover:bg-[#e1306c]/20 hover:text-[#e1306c] rounded-full text-slate-400 transition-all border border-slate-800" title="Instagram">
                <Instagram className="h-4.5 w-4.5" />
              </a>
              <a href="https://www.youtube.com/user/AduanasdeChile" target="_blank" rel="noopener noreferrer" className="p-1.5 bg-slate-900/40 hover:bg-[#ff0000]/20 hover:text-[#ff0000] rounded-full text-slate-400 transition-all border border-slate-800" title="YouTube">
                <Youtube className="h-4.5 w-4.5" />
              </a>
            </div>

            <div className="flex flex-wrap gap-3 items-center mt-1">
              <button
                onClick={handleResetSimulation}
                className="px-3.5 py-1.5 bg-red-950/40 hover:bg-red-900 text-red-400 hover:text-red-300 rounded-lg text-xs font-semibold border border-red-900/50 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                id="btn-reiniciar-simulador"
              >
                <RefreshCw className="h-3 w-3 animate-reverse" />
                Reiniciar Prototipo
              </button>
              <span className="text-[10px] bg-[#002f6c] text-[#f2a900] font-mono px-3 py-1.5 rounded-lg border border-blue-900">
                Versión 1.4.0 (Vite + React)
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 text-center py-4 text-[10px] text-slate-600 border-t border-slate-900">
          © 2026 Servicio Nacional de Aduanas de Chile. Todos los derechos reservados de simulación. Desarrollo bajo Directrices de Diseño Consistente del Estado.
        </div>
      </footer>

    </div>
  );
}
