export interface Mascota {
  id: string;
  rutDueno: string;
  nombreDueno: string;
  nombreMascota: string;
  especie: string;
  raza: string;
  edad: number;
  microchip: string;
  vacunaAntirrabica: boolean;
  certificadoSanitario: boolean;
  fechaRegistro: string;
  estado: 'Pendiente' | 'Aprobado' | 'Rechazado';
}

export interface Tramite {
  id: string;
  titulo: string;
  descripcion: string;
  requisitos: string[];
  enLinea: boolean;
  categoria: string;
  costo: string;
}

export interface CasoPDI {
  id: string;
  pasajeroNombre: string;
  rut: string;
  pasaporte: string;
  creador: string;
  fechaCreacion: string;
  estado: 'Bajo Investigación' | 'Despejado' | 'Alerta Activa';
  descripcionDetallada: string;
  origen: string;
  destino: string;
}

export interface Viaje {
  fecha: string;
  destino: string;
  motivo: string;
}

export interface PasajeroAduana {
  id: string; // Turno, e.g. "T-102"
  nombre: string;
  rut: string;
  nacionalidad: string;
  viajaDesde: string;
  viajaHacia: string;
  historialViajes: Viaje[];
  historialCriminal: string[];
  declaradoDinero: number;
  declaradoMercancias: boolean;
  estadoPaso: 'Pendiente' | 'Acceso Permitido' | 'Acceso Denegado';
  motivoDenegacion?: string;
  fechaTurno: string;
}

export interface ArticuloEquipaje {
  id: string;
  nombre: string;
  esRiesgo: boolean;
  corregido: boolean;
  motivoCorreccion?: string;
}

export interface EquipajeSAG {
  id: string;
  pasajeroNombre: string;
  rut: string;
  articulos: ArticuloEquipaje[];
  cumpleSAG: 'Pendiente' | 'Cumple' | 'No Cumple';
  comentariosInspector?: string;
  fechaDeclaracion: string;
}
