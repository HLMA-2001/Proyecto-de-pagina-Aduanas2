import { Tramite, CasoPDI, PasajeroAduana, EquipajeSAG, Mascota } from '../types';

export const TRÁMITES_INICIALES: Tramite[] = [
  {
    id: "T-01",
    titulo: "Declaración Jurada Conjunta Aduana-SAG",
    descripcion: "Declaración obligatoria para todo viajero mayor de 18 años que ingrese a Chile, donde se debe informar el porte de mercancías, productos de origen animal o vegetal, o dinero en efectivo sobre 10.000 USD.",
    requisitos: [
      "Documento de identidad o pasaporte vigente",
      "Listado de productos de origen animal/vegetal portados",
      "Declarar si porta más de USD 10.000 (o su equivalente)"
    ],
    enLinea: true,
    categoria: "Equipaje",
    costo: "Gratuito"
  },
  {
    id: "T-02",
    titulo: "Ingreso Temporal de Vehículos Extranjeros",
    descripcion: "Permite el ingreso temporal de vehículos particulares extranjeros a territorio nacional para fines turísticos por un plazo máximo de 90 días.",
    requisitos: [
      "Padrón o título de propiedad del vehículo",
      "Seguro obligatorio para vehículos extranjeros (SOAPEX)",
      "Cédula de identidad o pasaporte del conductor"
    ],
    enLinea: true,
    categoria: "Vehículos",
    costo: "Gratuito"
  },
  {
    id: "T-03",
    titulo: "Ingreso de Mascotas a Chile (Perros, Gatos, Hurones)",
    descripcion: "Regula la entrada de animales de compañía al país, bajo control estricto del SAG para evitar el ingreso de enfermedades como la rabia.",
    requisitos: [
      "Certificado Sanitario Oficial expedido por la autoridad del país de origen",
      "Vacuna antirrábica vigente (aplicada al menos 21 días antes del viaje)",
      "Tratamiento antiparasitario interno y externo certificado"
    ],
    enLinea: false,
    categoria: "Mascotas",
    costo: "Gratuito"
  },
  {
    id: "T-04",
    titulo: "Franquicia del Viajero y Equipaje Libre de Impuestos",
    descripcion: "Define los artículos que los viajeros pueden ingresar al país libres de derechos de aduana e IVA, tales como prendas de vestir, artículos de tocador, y obsequios hasta un monto de USD 300.",
    requisitos: [
      "Los bienes deben ser para uso personal o regalos sin carácter comercial",
      "Límite máximo de licores (2.5 litros) y cigarrillos (400 unidades) por adulto",
      "Boletas de compra para acreditar el valor de mercancías adicionales"
    ],
    enLinea: false,
    categoria: "Franquicias",
    costo: "Sujeto a tope"
  },
  {
    id: "T-05",
    titulo: "Declaración de Porte de Moneda Extranjera e Instrumentos",
    descripcion: "Trámite obligatorio para toda persona que ingrese o salga del país portando moneda en efectivo o documentos negociables al portador por un valor igual o superior a 10.000 dólares de los Estados Unidos de América o su equivalente en otras monedas.",
    requisitos: [
      "Formulario F-101 de Aduanas completado",
      "Acreditación de origen lícito de los fondos (si es requerido)",
      "Cédula o pasaporte"
    ],
    enLinea: true,
    categoria: "Monedas",
    costo: "Gratuito"
  }
];

export const MASCOTAS_INICIALES: Mascota[] = [
  {
    id: "REG-PET-402",
    rutDueno: "18.322.405-2",
    nombreDueno: "Sofía Martínez",
    nombreMascota: "Rocco",
    especie: "Perro",
    raza: "Golden Retriever",
    edad: 3,
    microchip: "900115000213456",
    vacunaAntirrabica: true,
    certificadoSanitario: true,
    fechaRegistro: "2026-06-20",
    estado: "Aprobado"
  },
  {
    id: "REG-PET-591",
    rutDueno: "11.394.882-9",
    nombreDueno: "Carlos Salazar",
    nombreMascota: "Luna",
    especie: "Gato",
    raza: "Siamés",
    edad: 2,
    microchip: "900115000789123",
    vacunaAntirrabica: true,
    certificadoSanitario: false,
    fechaRegistro: "2026-06-24",
    estado: "Pendiente"
  }
];

export const CASOS_PDI_INICIALES: CasoPDI[] = [
  {
    id: "CASO-7218",
    pasajeroNombre: "Andrés Villalobos",
    rut: "15.489.201-K",
    pasaporte: "CH192831",
    creador: "Subcomisario R. Muñoz (PDI)",
    fechaCreacion: "2026-06-23",
    estado: "Bajo Investigación",
    origen: "Tacna, Perú",
    destino: "Arica, Chile",
    descripcionDetallada: "Se detectaron posibles alteraciones físicas en los sellos migratorios anteriores en su pasaporte. Se requiere peritaje documental y cruzar datos con el consulado emisor antes de otorgar visación de reingreso."
  },
  {
    id: "CASO-9382",
    pasajeroNombre: "Elena Rostova",
    rut: "27.104.992-3",
    pasaporte: "RU849204",
    creador: "Inspectora S. Gómez (PDI)",
    fechaCreacion: "2026-06-24",
    estado: "Alerta Activa",
    origen: "Mendoza, Argentina",
    destino: "Santiago, Chile",
    descripcionDetallada: "Alerta roja de Interpol por presunta participación en redes internacionales de lavado de activos y fraude electrónico. Sujeto de alta prioridad, retener documentación y coordinar de inmediato con la oficina central nacional."
  },
  {
    id: "CASO-1049",
    pasajeroNombre: "Juan Carlos Pérez",
    rut: "12.842.109-8",
    pasaporte: "CH940391",
    creador: "Comisario J. Valenzuela (PDI)",
    fechaCreacion: "2026-06-20",
    estado: "Despejado",
    origen: "Oruro, Bolivia",
    destino: "Iquique, Chile",
    descripcionDetallada: "Control de homonimia y verificación de órdenes pendientes por presunto delito menor de contrabando en la zona franca. Una vez revisada la base de datos nacional, se constató que no corresponde al sujeto requerido. Caso cerrado."
  }
];

export const PASAJEROS_ADUANA_INICIALES: PasajeroAduana[] = [
  {
    id: "T-101",
    nombre: "Sofía Martínez",
    rut: "18.322.405-2",
    nacionalidad: "Chilena",
    viajaDesde: "La Paz, Bolivia",
    viajaHacia: "Iquique, Chile",
    historialViajes: [
      { fecha: "2026-05-12", destino: "Bolivia", motivo: "Turismo" },
      { fecha: "2025-11-20", destino: "Perú", motivo: "Negocios" }
    ],
    historialCriminal: ["Ninguno"],
    declaradoDinero: 1200,
    declaradoMercancias: false,
    estadoPaso: "Pendiente",
    fechaTurno: "2026-06-24 17:45"
  },
  {
    id: "T-102",
    nombre: "Carlos Salazar",
    rut: "11.394.882-9",
    nacionalidad: "Colombiana (Residente)",
    viajaDesde: "Mendoza, Argentina",
    viajaHacia: "Los Andes, Chile",
    historialViajes: [
      { fecha: "2026-02-15", destino: "Argentina", motivo: "Trabajo" },
      { fecha: "2025-08-10", destino: "Colombia", motivo: "Visita Familiar" }
    ],
    historialCriminal: ["Ninguno"],
    declaradoDinero: 8500,
    declaradoMercancias: true,
    estadoPaso: "Pendiente",
    fechaTurno: "2026-06-24 17:55"
  },
  {
    id: "T-103",
    nombre: "Rodrigo Lira",
    rut: "14.281.903-K",
    nacionalidad: "Chilena",
    viajaDesde: "Tacna, Perú",
    viajaHacia: "Arica, Chile",
    historialViajes: [
      { fecha: "2026-06-10", destino: "Perú", motivo: "Compras" },
      { fecha: "2026-05-25", destino: "Perú", motivo: "Compras" },
      { fecha: "2026-04-18", destino: "Perú", motivo: "Compras" }
    ],
    historialCriminal: ["Detención menor por conducción bajo la influencia del alcohol (2021)"],
    declaradoDinero: 15500,
    declaradoMercancias: true,
    estadoPaso: "Pendiente",
    fechaTurno: "2026-06-24 18:02"
  },
  {
    id: "T-104",
    nombre: "Elena Rostova",
    rut: "27.104.992-3",
    nacionalidad: "Rusa",
    viajaDesde: "Mendoza, Argentina",
    viajaHacia: "Santiago, Chile",
    historialViajes: [
      { fecha: "2026-06-01", destino: "Argentina", motivo: "Turismo" }
    ],
    historialCriminal: ["Alerta Roja Interpol #RF-99201 por fraude financiero"],
    declaradoDinero: 9000,
    declaradoMercancias: false,
    estadoPaso: "Pendiente",
    fechaTurno: "2026-06-24 18:05"
  }
];

export const EQUIPAJES_SAG_INICIALES: EquipajeSAG[] = [
  {
    id: "E-401",
    pasajeroNombre: "Carlos Salazar",
    rut: "11.394.882-9",
    articulos: [
      { id: "A1", nombre: "Manzanas frescas", esRiesgo: true, corregido: false },
      { id: "A2", nombre: "Ropa usada y efectos personales", esRiesgo: false, corregido: false },
      { id: "A3", nombre: "Queso artesanal de cabra sin rotulación", esRiesgo: true, corregido: false }
    ],
    cumpleSAG: "Pendiente",
    fechaDeclaracion: "2026-06-24 17:55"
  },
  {
    id: "E-402",
    pasajeroNombre: "Sofía Martínez",
    rut: "18.322.405-2",
    articulos: [
      { id: "B1", nombre: "Chocolate industrial en barra (sellado)", esRiesgo: false, corregido: false },
      { id: "B2", nombre: "Semillas de girasol/maravilla a granel", esRiesgo: true, corregido: false },
      { id: "B3", nombre: "Libros impresos", esRiesgo: false, corregido: false }
    ],
    cumpleSAG: "Pendiente",
    fechaDeclaracion: "2026-06-24 17:45"
  },
  {
    id: "E-403",
    pasajeroNombre: "Marta Godoy",
    rut: "16.402.193-4",
    articulos: [
      { id: "C1", nombre: "Vino embotellado y etiquetado (sellado)", esRiesgo: false, corregido: false },
      { id: "C2", nombre: "Artesanías talladas en madera rústica con corteza", esRiesgo: true, corregido: false }
    ],
    cumpleSAG: "Pendiente",
    fechaDeclaracion: "2026-06-24 18:10"
  }
];

// List of words that represent agricultural/livestock risks according to SAG Chile standards.
export const ELEMENTOS_PROHIBIDOS_SAG = [
  "manzana",
  "platano",
  "pera",
  "uva",
  "fruta",
  "verdura",
  "tomate",
  "semilla",
  "planta",
  "queso",
  "carne",
  "embutido",
  "salame",
  "madera",
  "tierra",
  "insecto",
  "miel",
  "salmón fresco",
  "lácteo",
  "naranja",
  "limón",
  "peltre",
  "flores"
];
