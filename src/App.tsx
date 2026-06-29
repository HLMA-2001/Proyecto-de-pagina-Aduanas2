import React, { useState, useEffect } from 'react';
import MegaMenu from './components/MegaMenu';
import HomePortal from './components/HomePortal';
import UserPortal from './components/UserPortal';
import PDIPortal from './components/PDIPortal';
import AduanaPortal from './components/AduanaPortal';
import SAGPortal from './components/SAGPortal';
import { Mascota, CasoPDI, PasajeroAduana, EquipajeSAG, ArticuloEquipaje } from './types';
import { 
  TRÁMITES_INICIALES, 
  MASCOTAS_INICIALES, 
  CASOS_PDI_INICIALES, 
  PASAJEROS_ADUANA_INICIALES, 
  EQUIPAJES_SAG_INICIALES 
} from './data/mockData';
import { Landmark, ShieldCheck, ArrowRight, HeartHandshake, BookOpen, RefreshCw } from 'lucide-react';

export default function App() {
  // Current Perspective (now defaults to 'home')
  const [currentRole, setCurrentRole] = useState<'home' | 'usuario' | 'pdi' | 'aduana' | 'sag'>('home');

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
            onStartSimulation={setCurrentRole}
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
          />
        )}

        {currentRole === 'pdi' && (
          <PDIPortal 
            casos={casosPDI}
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
            <div className="bg-white p-1 rounded">
              <Landmark className="h-8 w-8 text-blue-950" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Servicio Nacional de Aduanas • Gobierno de Chile</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Ministerio de Hacienda, República de Chile. Prototipo SGUH para control de frontera.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-center md:justify-end">
            <button
              onClick={handleResetSimulation}
              className="px-3.5 py-1.5 bg-red-950/40 hover:bg-red-900 text-red-400 hover:text-red-300 rounded-lg text-xs font-semibold border border-red-900/50 transition-colors cursor-pointer flex items-center gap-1.5"
              id="btn-reiniciar-simulador"
            >
              <RefreshCw className="h-3 w-3 animate-reverse" />
              Reiniciar Prototipo
            </button>
            <span className="text-[10px] bg-[#002f6c] text-[#f2a900] font-mono px-3 py-1 rounded border border-blue-900">
              Versión 1.4.0 (Vite + React)
            </span>
          </div>
        </div>

        <div className="bg-slate-950 text-center py-4 text-[10px] text-slate-600 border-t border-slate-900">
          © 2026 Servicio Nacional de Aduanas de Chile. Todos los derechos reservados de simulación. Desarrollo bajo Directrices de Diseño Consistente del Estado.
        </div>
      </footer>

    </div>
  );
}
