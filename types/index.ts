// ============================================================
// TIPOS PRINCIPALES - SeaGroup Portal
// ============================================================

export type UserRole = "admin" | "client";

export type ProjectStatus = "activo" | "pausado" | "finalizado";

export type WaterType =
  | "superficial"
  | "subterranea"
  | "residual"
  | "industrial"
  | "otro";

// ------------------------------------------------------------
// Usuario
// ------------------------------------------------------------
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  projectId?: string; // Solo para clientes
  avatar?: string;
}

// ------------------------------------------------------------
// Parámetros de agua
// ------------------------------------------------------------
export interface WaterParameters {
  id: string;
  projectId: string;
  date: string;
  ph?: number;
  temperature?: number; // °C
  turbidity?: number; // NTU
  conductivity?: number; // µS/cm
  suspendedSolids?: number; // mg/L
  flowInstant?: number; // m³/h
  flowAccumulated?: number; // m³
  physicalCharacteristics?: string;
  observations?: string;
}

// ------------------------------------------------------------
// Muestra
// ------------------------------------------------------------
export interface Sample {
  id: string;
  projectId: string;
  date: string;
  responsible: string;
  results: string;
  observations?: string;
}

// ------------------------------------------------------------
// Visita a terreno
// ------------------------------------------------------------
export interface Visit {
  id: string;
  projectId: string;
  date: string;
  responsible: string;
  technicalComments: string;
  actionsPerformed: string;
  recommendations?: string;
  photos?: string[]; // URLs (módulo preparado, no implementado completo)
}

// ------------------------------------------------------------
// Equipo / Filtro
// ------------------------------------------------------------
export interface Equipment {
  id: string;
  projectId: string;
  name: string;
  type: string; // "filtro", "frile", "bomba", etc.
  status: "operativo" | "mantencion" | "fuera_de_servicio";
  lastMaintenanceDate?: string;
  observations?: string;
}

// ------------------------------------------------------------
// Proyecto principal
// ------------------------------------------------------------
export interface Project {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  location: string;
  startDate: string;
  status: ProjectStatus;
  description: string;
  waterType: WaterType;
  waterObservations?: string;

  // Relaciones
  parameters: WaterParameters[];
  samples: Sample[];
  visits: Visit[];
  equipment: Equipment[];

  // Documentos (módulo preparado)
  documents?: string[];
}

// ------------------------------------------------------------
// Sesión NextAuth extendida
// ------------------------------------------------------------
export interface ExtendedSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    projectId?: string;
  };
  expires: string;
}
