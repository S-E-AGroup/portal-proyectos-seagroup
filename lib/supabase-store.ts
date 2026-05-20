// ============================================================
// SUPABASE STORE - Reemplaza lib/mock/store.ts
// Todas las operaciones CRUD contra Supabase
// ============================================================

import { supabaseAdmin } from "@/lib/supabase";
import { Project, User, Visit, WaterParameters, Sample, Equipment } from "@/types";
import bcrypt from "bcryptjs";

// ------------------------------------------------------------
// Helpers de mapeo (snake_case DB → camelCase TS)
// ------------------------------------------------------------
function mapProject(row: any): Project {
  return {
    id: row.id,
    name: row.name,
    clientId: row.client_id,
    clientName: row.client_name,
    location: row.location,
    startDate: row.start_date,
    status: row.status,
    description: row.description || "",
    waterType: row.water_type,
    waterObservations: row.water_observations || "",
    parameters: (row.water_parameters || []).map(mapParameter),
    samples: (row.samples || []).map(mapSample),
    visits: (row.visits || []).map(mapVisit),
    equipment: (row.equipment || []).map(mapEquipment),
    documents: [],
  };
}

function mapParameter(row: any): WaterParameters {
  return {
    id: row.id,
    projectId: row.project_id,
    date: row.date,
    ph: row.ph,
    temperature: row.temperature,
    turbidity: row.turbidity,
    conductivity: row.conductivity,
    suspendedSolids: row.suspended_solids,
    flowInstant: row.flow_instant,
    flowAccumulated: row.flow_accumulated,
    physicalCharacteristics: row.physical_characteristics,
    observations: row.observations,
  };
}

function mapVisit(row: any): Visit {
  return {
    id: row.id,
    projectId: row.project_id,
    date: row.date,
    responsible: row.responsible,
    technicalComments: row.technical_comments,
    actionsPerformed: row.actions_performed,
    recommendations: row.recommendations,
  };
}

function mapSample(row: any): Sample {
  return {
    id: row.id,
    projectId: row.project_id,
    date: row.date,
    responsible: row.responsible,
    results: row.results,
    observations: row.observations,
  };
}

function mapEquipment(row: any): Equipment {
  return {
    id: row.id,
    projectId: row.project_id,
    name: row.name,
    type: row.type,
    status: row.status,
    lastMaintenanceDate: row.last_maintenance_date,
    observations: row.observations,
  };
}

function mapUser(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    projectId: row.project_id,
  };
}

// ------------------------------------------------------------
// PROYECTOS
// ------------------------------------------------------------
export async function getAllProjects(): Promise<Project[]> {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select(`*, water_parameters(*), samples(*), visits(*), equipment(*)`)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapProject);
}

export async function getProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select(`*, water_parameters(*), samples(*), visits(*), equipment(*)`)
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return mapProject(data);
}

export async function getProjectByClientId(clientId: string): Promise<Project | null> {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select(`*, water_parameters(*), samples(*), visits(*), equipment(*)`)
    .eq("client_id", clientId)
    .single();
  if (error || !data) return null;
  return mapProject(data);
}

export async function createProject(input: Omit<Project, "id"|"parameters"|"samples"|"visits"|"equipment"|"documents">): Promise<Project> {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .insert({
      name: input.name,
      client_id: input.clientId,
      client_name: input.clientName,
      location: input.location,
      start_date: input.startDate,
      status: input.status,
      description: input.description,
      water_type: input.waterType,
      water_observations: input.waterObservations,
    })
    .select()
    .single();
  if (error) throw error;
  return mapProject({ ...data, water_parameters: [], samples: [], visits: [], equipment: [] });
}

export async function updateProject(id: string, input: Partial<Project>): Promise<Project | null> {
  const updates: any = {};
  if (input.name) updates.name = input.name;
  if (input.clientId) updates.client_id = input.clientId;
  if (input.clientName) updates.client_name = input.clientName;
  if (input.location) updates.location = input.location;
  if (input.startDate) updates.start_date = input.startDate;
  if (input.status) updates.status = input.status;
  if (input.description !== undefined) updates.description = input.description;
  if (input.waterType) updates.water_type = input.waterType;
  if (input.waterObservations !== undefined) updates.water_observations = input.waterObservations;

  const { error } = await supabaseAdmin.from("projects").update(updates).eq("id", id);
  if (error) throw error;
  return getProjectById(id);
}

// ------------------------------------------------------------
// VISITAS
// ------------------------------------------------------------
export async function addVisit(projectId: string, data: Omit<Visit, "id"|"projectId">): Promise<Visit> {
  const { data: row, error } = await supabaseAdmin
    .from("visits")
    .insert({ project_id: projectId, date: data.date, responsible: data.responsible, technical_comments: data.technicalComments, actions_performed: data.actionsPerformed, recommendations: data.recommendations })
    .select().single();
  if (error) throw error;
  return mapVisit(row);
}

export async function updateVisit(projectId: string, visitId: string, data: Partial<Visit>): Promise<Visit | null> {
  const updates: any = {};
  if (data.date) updates.date = data.date;
  if (data.responsible) updates.responsible = data.responsible;
  if (data.technicalComments) updates.technical_comments = data.technicalComments;
  if (data.actionsPerformed) updates.actions_performed = data.actionsPerformed;
  if (data.recommendations !== undefined) updates.recommendations = data.recommendations;
  const { data: row, error } = await supabaseAdmin.from("visits").update(updates).eq("id", visitId).eq("project_id", projectId).select().single();
  if (error) throw error;
  return mapVisit(row);
}

export async function deleteVisit(projectId: string, visitId: string): Promise<boolean> {
  const { error } = await supabaseAdmin.from("visits").delete().eq("id", visitId).eq("project_id", projectId);
  return !error;
}

// ------------------------------------------------------------
// PARÁMETROS
// ------------------------------------------------------------
export async function addParameter(projectId: string, data: Omit<WaterParameters, "id"|"projectId">): Promise<WaterParameters> {
  const { data: row, error } = await supabaseAdmin
    .from("water_parameters")
    .insert({ project_id: projectId, date: data.date, ph: data.ph, temperature: data.temperature, turbidity: data.turbidity, conductivity: data.conductivity, suspended_solids: data.suspendedSolids, flow_instant: data.flowInstant, flow_accumulated: data.flowAccumulated, physical_characteristics: data.physicalCharacteristics, observations: data.observations })
    .select().single();
  if (error) throw error;
  return mapParameter(row);
}

export async function updateParameter(projectId: string, paramId: string, data: Partial<WaterParameters>): Promise<WaterParameters | null> {
  const updates: any = {};
  if (data.date) updates.date = data.date;
  if (data.ph !== undefined) updates.ph = data.ph;
  if (data.temperature !== undefined) updates.temperature = data.temperature;
  if (data.turbidity !== undefined) updates.turbidity = data.turbidity;
  if (data.conductivity !== undefined) updates.conductivity = data.conductivity;
  if (data.suspendedSolids !== undefined) updates.suspended_solids = data.suspendedSolids;
  if (data.flowInstant !== undefined) updates.flow_instant = data.flowInstant;
  if (data.flowAccumulated !== undefined) updates.flow_accumulated = data.flowAccumulated;
  if (data.physicalCharacteristics !== undefined) updates.physical_characteristics = data.physicalCharacteristics;
  if (data.observations !== undefined) updates.observations = data.observations;
  const { data: row, error } = await supabaseAdmin.from("water_parameters").update(updates).eq("id", paramId).eq("project_id", projectId).select().single();
  if (error) throw error;
  return mapParameter(row);
}

export async function deleteParameter(projectId: string, paramId: string): Promise<boolean> {
  const { error } = await supabaseAdmin.from("water_parameters").delete().eq("id", paramId).eq("project_id", projectId);
  return !error;
}

// ------------------------------------------------------------
// MUESTRAS
// ------------------------------------------------------------
export async function addSample(projectId: string, data: Omit<Sample, "id"|"projectId">): Promise<Sample> {
  const { data: row, error } = await supabaseAdmin
    .from("samples")
    .insert({ project_id: projectId, date: data.date, responsible: data.responsible, results: data.results, observations: data.observations })
    .select().single();
  if (error) throw error;
  return mapSample(row);
}

export async function updateSample(projectId: string, sampleId: string, data: Partial<Sample>): Promise<Sample | null> {
  const updates: any = {};
  if (data.date) updates.date = data.date;
  if (data.responsible) updates.responsible = data.responsible;
  if (data.results) updates.results = data.results;
  if (data.observations !== undefined) updates.observations = data.observations;
  const { data: row, error } = await supabaseAdmin.from("samples").update(updates).eq("id", sampleId).eq("project_id", projectId).select().single();
  if (error) throw error;
  return mapSample(row);
}

export async function deleteSample(projectId: string, sampleId: string): Promise<boolean> {
  const { error } = await supabaseAdmin.from("samples").delete().eq("id", sampleId).eq("project_id", projectId);
  return !error;
}

// ------------------------------------------------------------
// EQUIPOS
// ------------------------------------------------------------
export async function addEquipment(projectId: string, data: Omit<Equipment, "id"|"projectId">): Promise<Equipment> {
  const { data: row, error } = await supabaseAdmin
    .from("equipment")
    .insert({ project_id: projectId, name: data.name, type: data.type, status: data.status, last_maintenance_date: data.lastMaintenanceDate || null, observations: data.observations })
    .select().single();
  if (error) throw error;
  return mapEquipment(row);
}

export async function updateEquipment(projectId: string, eqId: string, data: Partial<Equipment>): Promise<Equipment | null> {
  const updates: any = {};
  if (data.name) updates.name = data.name;
  if (data.type) updates.type = data.type;
  if (data.status) updates.status = data.status;
  if (data.lastMaintenanceDate !== undefined) updates.last_maintenance_date = data.lastMaintenanceDate || null;
  if (data.observations !== undefined) updates.observations = data.observations;
  const { data: row, error } = await supabaseAdmin.from("equipment").update(updates).eq("id", eqId).eq("project_id", projectId).select().single();
  if (error) throw error;
  return mapEquipment(row);
}

export async function deleteEquipment(projectId: string, eqId: string): Promise<boolean> {
  const { error } = await supabaseAdmin.from("equipment").delete().eq("id", eqId).eq("project_id", projectId);
  return !error;
}

// ------------------------------------------------------------
// USUARIOS
// ------------------------------------------------------------
export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabaseAdmin.from("users").select("*");
  if (error) throw error;
  return (data || []).map(mapUser);
}

export async function getClientUsers(): Promise<User[]> {
  const { data, error } = await supabaseAdmin.from("users").select("*").eq("role", "client");
  if (error) throw error;
  return (data || []).map(mapUser);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin.from("users").select("*").eq("email", email).single();
  if (error || !data) return null;
  return mapUser(data);
}

export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin.from("users").select("*").eq("id", id).single();
  if (error || !data) return null;
  return mapUser(data);
}

export async function verifyUserPassword(email: string, password: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin.from("users").select("*").eq("email", email).single();
  if (error || !data) return null;
  const valid = await bcrypt.compare(password, data.password_hash);
  if (!valid) return null;
  return mapUser(data);
}

export async function createClientUser(input: { name: string; email: string; password: string; projectId?: string }): Promise<User> {
  const hash = await bcrypt.hash(input.password, 10);
  const { data, error } = await supabaseAdmin
    .from("users")
    .insert({ name: input.name, email: input.email, password_hash: hash, role: "client", project_id: input.projectId || null })
    .select().single();
  if (error) throw error;
  return mapUser(data);
}

export async function updateClientUser(id: string, input: Partial<User> & { password?: string }): Promise<User | null> {
  const updates: any = {};
  if (input.name) updates.name = input.name;
  if (input.projectId !== undefined) updates.project_id = input.projectId;
  if (input.password) updates.password_hash = await bcrypt.hash(input.password, 10);
  const { data, error } = await supabaseAdmin.from("users").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return mapUser(data);
}

// Crear admin inicial (ejecutar una sola vez)
export async function createAdminIfNotExists(): Promise<void> {
  const existing = await getUserByEmail("admin@seagroup.cl");
  if (existing) return;
  const hash = await bcrypt.hash("admin123", 10);
  await supabaseAdmin.from("users").insert({ name: "Administrador SeaGroup", email: "admin@seagroup.cl", password_hash: hash, role: "admin" });
}
