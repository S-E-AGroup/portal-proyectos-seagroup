// ============================================================
// MOCK DATA - SeaGroup Portal MVP
// Reemplazar con llamadas a Supabase / PostgreSQL en producción
// ============================================================

import {
  User,
  Project,
  WaterParameters,
  Sample,
  Visit,
  Equipment,
} from "@/types";

// ------------------------------------------------------------
// Usuarios mock
// ------------------------------------------------------------
export const MOCK_USERS: User[] = [
  {
    id: "u1",
    name: "Administrador SeaGroup",
    email: "admin@seagroup.cl",
    role: "admin",
  },
  {
    id: "u2",
    name: "Empresa Minera Norte",
    email: "cliente@mineranorte.cl",
    role: "client",
    projectId: "p1",
  },
  {
    id: "u3",
    name: "Agrícola Del Valle",
    email: "cliente@agricoladelvalle.cl",
    role: "client",
    projectId: "p2",
  },
];

// Credenciales mock (solo para MVP — en producción usar hashing real)
export const MOCK_CREDENTIALS: Record<string, string> = {
  "admin@seagroup.cl": "admin123",
  "cliente@mineranorte.cl": "cliente123",
  "cliente@agricoladelvalle.cl": "cliente456",
};

// ------------------------------------------------------------
// Parámetros de agua — Proyecto 1
// ------------------------------------------------------------
const PARAMS_P1: WaterParameters[] = [
  {
    id: "w1-1",
    projectId: "p1",
    date: "2024-01-10",
    ph: 7.2,
    temperature: 14.5,
    turbidity: 12.3,
    conductivity: 450,
    suspendedSolids: 8.2,
    flowInstant: 3.4,
    flowAccumulated: 1200,
    physicalCharacteristics: "Agua turbia con leve coloración amarillenta",
    observations: "Parámetros dentro de rangos normales",
  },
  {
    id: "w1-2",
    projectId: "p1",
    date: "2024-02-10",
    ph: 7.5,
    temperature: 15.1,
    turbidity: 9.8,
    conductivity: 460,
    suspendedSolids: 6.5,
    flowInstant: 3.6,
    flowAccumulated: 2450,
    physicalCharacteristics: "Agua con menor turbidez respecto al mes anterior",
    observations: "Mejora notable en calidad tras ajuste de filtros",
  },
  {
    id: "w1-3",
    projectId: "p1",
    date: "2024-03-10",
    ph: 7.1,
    temperature: 13.8,
    turbidity: 14.1,
    conductivity: 470,
    suspendedSolids: 9.1,
    flowInstant: 3.2,
    flowAccumulated: 3600,
    physicalCharacteristics: "Leve aumento de turbidez por lluvias",
    observations: "Se recomienda revisión del prefiltro",
  },
  {
    id: "w1-4",
    projectId: "p1",
    date: "2024-04-10",
    ph: 7.3,
    temperature: 12.9,
    turbidity: 10.5,
    conductivity: 455,
    suspendedSolids: 7.0,
    flowInstant: 3.5,
    flowAccumulated: 4800,
    physicalCharacteristics: "Agua estabilizada",
    observations: "Sistema operando con normalidad",
  },
  {
    id: "w1-5",
    projectId: "p1",
    date: "2024-05-10",
    ph: 7.4,
    temperature: 11.5,
    turbidity: 8.9,
    conductivity: 448,
    suspendedSolids: 5.8,
    flowInstant: 3.7,
    flowAccumulated: 6050,
    physicalCharacteristics: "Agua clara, buena calidad",
    observations: "Parámetros óptimos",
  },
  {
    id: "w1-6",
    projectId: "p1",
    date: "2024-06-10",
    ph: 7.6,
    temperature: 10.2,
    turbidity: 7.2,
    conductivity: 440,
    suspendedSolids: 4.9,
    flowInstant: 3.8,
    flowAccumulated: 7350,
    physicalCharacteristics: "Excelente claridad del agua",
    observations: "Filtros operando al 100%",
  },
];

// ------------------------------------------------------------
// Parámetros de agua — Proyecto 2
// ------------------------------------------------------------
const PARAMS_P2: WaterParameters[] = [
  {
    id: "w2-1",
    projectId: "p2",
    date: "2024-02-15",
    ph: 6.8,
    temperature: 18.2,
    turbidity: 22.5,
    conductivity: 620,
    flowInstant: 5.1,
    flowAccumulated: 800,
    physicalCharacteristics: "Agua con alta carga orgánica",
    observations: "Requiere tratamiento intensivo inicial",
  },
  {
    id: "w2-2",
    projectId: "p2",
    date: "2024-03-15",
    ph: 7.0,
    temperature: 19.1,
    turbidity: 18.3,
    conductivity: 598,
    flowInstant: 5.3,
    flowAccumulated: 2100,
    physicalCharacteristics: "Mejora progresiva tras primer tratamiento",
    observations: "Continuar con plan de tratamiento",
  },
  {
    id: "w2-3",
    projectId: "p2",
    date: "2024-04-15",
    ph: 7.2,
    temperature: 20.0,
    turbidity: 15.1,
    conductivity: 575,
    flowInstant: 5.5,
    flowAccumulated: 3500,
    physicalCharacteristics: "Tendencia positiva en calidad",
    observations: "Sistema respondiendo bien al tratamiento",
  },
];

// ------------------------------------------------------------
// Muestras
// ------------------------------------------------------------
const SAMPLES_P1: Sample[] = [
  {
    id: "s1-1",
    projectId: "p1",
    date: "2024-01-15",
    responsible: "Ing. Carlos Rojas",
    results:
      "Coliformes totales: <1 UFC/100mL. Arsénico: 0.002 mg/L. Resultados dentro de norma NCh409.",
    observations: "Muestra tomada en punto de salida del sistema",
  },
  {
    id: "s1-2",
    projectId: "p1",
    date: "2024-03-15",
    responsible: "Ing. María Fuentes",
    results:
      "pH: 7.1. Turbidez: 13.8 NTU. Conductividad: 468 µS/cm. Conforme a normativa.",
    observations: "Muestra tomada post-lluvia, leve aumento de turbidez",
  },
];

const SAMPLES_P2: Sample[] = [
  {
    id: "s2-1",
    projectId: "p2",
    date: "2024-02-20",
    responsible: "Ing. Carlos Rojas",
    results:
      "DBO5: 45 mg/L. DQO: 120 mg/L. Sólidos suspendidos: 35 mg/L. Requiere ajuste.",
    observations: "Muestra inicial para línea base del proyecto",
  },
];

// ------------------------------------------------------------
// Visitas
// ------------------------------------------------------------
const VISITS_P1: Visit[] = [
  {
    id: "v1-1",
    projectId: "p1",
    date: "2024-01-10",
    responsible: "Ing. Carlos Rojas",
    technicalComments:
      "Instalación completada y sistema puesto en marcha. Todos los equipos funcionando correctamente.",
    actionsPerformed:
      "Instalación de filtros principales, calibración de sensores, prueba de caudal.",
    recommendations:
      "Revisión de filtros a los 30 días de operación. Monitoreo semanal de pH y turbidez.",
  },
  {
    id: "v1-2",
    projectId: "p1",
    date: "2024-02-10",
    responsible: "Ing. María Fuentes",
    technicalComments:
      "Sistema operando dentro de parámetros normales. Se realizó limpieza de prefiltros.",
    actionsPerformed:
      "Limpieza y retrolavado de filtros. Verificación de sellos y conexiones.",
    recommendations: "Mantener frecuencia de retrolavado cada 2 semanas.",
  },
  {
    id: "v1-3",
    projectId: "p1",
    date: "2024-03-10",
    responsible: "Ing. Carlos Rojas",
    technicalComments:
      "Aumento de turbidez relacionado con período de lluvias. Se ajustó dosificación de coagulante.",
    actionsPerformed:
      "Ajuste de dosis de coagulante. Revisión de filtros. Limpieza de sensores.",
    recommendations:
      "En período de lluvias intensas, aumentar frecuencia de monitoreo a diario.",
  },
  {
    id: "v1-4",
    projectId: "p1",
    date: "2024-04-10",
    responsible: "Ing. María Fuentes",
    technicalComments:
      "Parámetros estabilizados. Sistema operando de manera óptima.",
    actionsPerformed:
      "Mantenimiento preventivo general. Lubricación de componentes mecánicos.",
    recommendations: "Continuar con monitoreo mensual.",
  },
];

const VISITS_P2: Visit[] = [
  {
    id: "v2-1",
    projectId: "p2",
    date: "2024-02-15",
    responsible: "Ing. Carlos Rojas",
    technicalComments:
      "Primera visita de evaluación. Se identifican cargas orgánicas elevadas.",
    actionsPerformed:
      "Diagnóstico inicial, toma de muestras, instalación de equipos de medición.",
    recommendations:
      "Implementar sistema de pretratamiento antes del filtro principal.",
  },
  {
    id: "v2-2",
    projectId: "p2",
    date: "2024-03-15",
    responsible: "Ing. María Fuentes",
    technicalComments: "Mejora progresiva en calidad del agua tratada.",
    actionsPerformed:
      "Instalación de pretratamiento. Ajuste de parámetros operacionales.",
    recommendations: "Próxima visita en 30 días para evaluar evolución.",
  },
];

// ------------------------------------------------------------
// Equipos
// ------------------------------------------------------------
const EQUIPMENT_P1: Equipment[] = [
  {
    id: "eq1-1",
    projectId: "p1",
    name: "Filtro de Arena Principal",
    type: "filtro",
    status: "operativo",
    lastMaintenanceDate: "2024-04-10",
    observations: "Operando correctamente. Próximo retrolavado en 2 semanas.",
  },
  {
    id: "eq1-2",
    projectId: "p1",
    name: "Prefiltro de Malla",
    type: "frile",
    status: "operativo",
    lastMaintenanceDate: "2024-03-10",
    observations: "Limpiado en última visita. En buen estado.",
  },
  {
    id: "eq1-3",
    projectId: "p1",
    name: "Bomba Dosificadora",
    type: "bomba",
    status: "operativo",
    lastMaintenanceDate: "2024-02-10",
    observations: "Calibrada y funcionando dentro de especificaciones.",
  },
];

const EQUIPMENT_P2: Equipment[] = [
  {
    id: "eq2-1",
    projectId: "p2",
    name: "Sistema de Pretratamiento",
    type: "filtro",
    status: "operativo",
    lastMaintenanceDate: "2024-03-15",
    observations: "Recién instalado. Monitoreando rendimiento.",
  },
  {
    id: "eq2-2",
    projectId: "p2",
    name: "Filtro Carbón Activado",
    type: "filtro",
    status: "mantencion",
    lastMaintenanceDate: "2024-04-01",
    observations: "En mantenimiento preventivo programado.",
  },
];

// ------------------------------------------------------------
// Proyectos completos
// ------------------------------------------------------------
export const MOCK_PROJECTS: Project[] = [
  {
    id: "p1",
    name: "Planta de Tratamiento Mina Cóndor",
    clientId: "u2",
    clientName: "Empresa Minera Norte",
    location: "Región de Atacama, Chile",
    startDate: "2024-01-10",
    status: "activo",
    description:
      "Instalación y operación de sistema de tratamiento de aguas de proceso minero. El sistema incluye filtración, sedimentación y control de parámetros fisicoquímicos para cumplimiento normativo.",
    waterType: "industrial",
    waterObservations:
      "Agua con presencia de metales pesados en niveles bajos, alta conductividad típica de ambiente minero.",
    parameters: PARAMS_P1,
    samples: SAMPLES_P1,
    visits: VISITS_P1,
    equipment: EQUIPMENT_P1,
    documents: [],
  },
  {
    id: "p2",
    name: "Sistema de Riego Tecnificado Agrícola Valle",
    clientId: "u3",
    clientName: "Agrícola Del Valle",
    location: "Región de Coquimbo, Chile",
    startDate: "2024-02-15",
    status: "activo",
    description:
      "Tratamiento de aguas superficiales para uso en riego tecnificado. El sistema busca mejorar la calidad del agua eliminando cargas orgánicas y ajustando parámetros para optimizar el rendimiento de cultivos.",
    waterType: "superficial",
    waterObservations:
      "Agua superficial con carga orgánica elevada, influenciada por actividad agrícola del sector.",
    parameters: PARAMS_P2,
    samples: SAMPLES_P2,
    visits: VISITS_P2,
    equipment: EQUIPMENT_P2,
    documents: [],
  },
];

// ------------------------------------------------------------
// Helper: obtener proyecto por ID de cliente
// ------------------------------------------------------------
export function getProjectByClientId(clientId: string): Project | undefined {
  return MOCK_PROJECTS.find((p) => p.clientId === clientId);
}

// ------------------------------------------------------------
// Helper: obtener proyecto por ID de proyecto
// ------------------------------------------------------------
export function getProjectById(projectId: string): Project | undefined {
  return MOCK_PROJECTS.find((p) => p.id === projectId);
}

// ------------------------------------------------------------
// Helper: obtener usuario por email
// ------------------------------------------------------------
export function getUserByEmail(email: string): User | undefined {
  return MOCK_USERS.find((u) => u.email === email);
}
