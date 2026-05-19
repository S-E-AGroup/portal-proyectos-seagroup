// ============================================================
// STORE EN MEMORIA - Gestión dinámica completa CRUD
// En producción reemplazar con llamadas a Supabase/PostgreSQL
// ============================================================

import { MOCK_PROJECTS, MOCK_USERS, MOCK_CREDENTIALS } from "./data";
import { Project, User, Visit, WaterParameters, Sample, Equipment } from "@/types";

let projects: Project[] = JSON.parse(JSON.stringify(MOCK_PROJECTS));
let users: User[] = JSON.parse(JSON.stringify(MOCK_USERS));
let credentials: Record<string, string> = { ...MOCK_CREDENTIALS };

// ------------------------------------------------------------
// PROYECTOS
// ------------------------------------------------------------
export function getAllProjects(): Project[] { return projects; }
export function getProjectById(id: string): Project | undefined { return projects.find(p => p.id === id); }
export function getProjectByClientId(clientId: string): Project | undefined { return projects.find(p => p.clientId === clientId); }

export function createProject(data: Omit<Project, "id"|"parameters"|"samples"|"visits"|"equipment"|"documents">): Project {
  const p: Project = { ...data, id: `p${Date.now()}`, parameters: [], samples: [], visits: [], equipment: [], documents: [] };
  projects.push(p);
  return p;
}

export function updateProject(id: string, data: Partial<Project>): Project | null {
  const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) return null;
  projects[idx] = { ...projects[idx], ...data };
  return projects[idx];
}

// ------------------------------------------------------------
// VISITAS
// ------------------------------------------------------------
export function addVisit(projectId: string, data: Omit<Visit, "id"|"projectId">): Visit | null {
  const idx = projects.findIndex(p => p.id === projectId);
  if (idx === -1) return null;
  const visit: Visit = { ...data, id: `v${Date.now()}`, projectId };
  projects[idx].visits.push(visit);
  return visit;
}

export function updateVisit(projectId: string, visitId: string, data: Partial<Visit>): Visit | null {
  const pidx = projects.findIndex(p => p.id === projectId);
  if (pidx === -1) return null;
  const vidx = projects[pidx].visits.findIndex(v => v.id === visitId);
  if (vidx === -1) return null;
  projects[pidx].visits[vidx] = { ...projects[pidx].visits[vidx], ...data };
  return projects[pidx].visits[vidx];
}

export function deleteVisit(projectId: string, visitId: string): boolean {
  const pidx = projects.findIndex(p => p.id === projectId);
  if (pidx === -1) return false;
  const before = projects[pidx].visits.length;
  projects[pidx].visits = projects[pidx].visits.filter(v => v.id !== visitId);
  return projects[pidx].visits.length < before;
}

// ------------------------------------------------------------
// PARÁMETROS
// ------------------------------------------------------------
export function addParameter(projectId: string, data: Omit<WaterParameters, "id"|"projectId">): WaterParameters | null {
  const idx = projects.findIndex(p => p.id === projectId);
  if (idx === -1) return null;
  const param: WaterParameters = { ...data, id: `w${Date.now()}`, projectId };
  projects[idx].parameters.push(param);
  return param;
}

export function updateParameter(projectId: string, paramId: string, data: Partial<WaterParameters>): WaterParameters | null {
  const pidx = projects.findIndex(p => p.id === projectId);
  if (pidx === -1) return null;
  const widx = projects[pidx].parameters.findIndex(w => w.id === paramId);
  if (widx === -1) return null;
  projects[pidx].parameters[widx] = { ...projects[pidx].parameters[widx], ...data };
  return projects[pidx].parameters[widx];
}

export function deleteParameter(projectId: string, paramId: string): boolean {
  const pidx = projects.findIndex(p => p.id === projectId);
  if (pidx === -1) return false;
  const before = projects[pidx].parameters.length;
  projects[pidx].parameters = projects[pidx].parameters.filter(w => w.id !== paramId);
  return projects[pidx].parameters.length < before;
}

// ------------------------------------------------------------
// MUESTRAS
// ------------------------------------------------------------
export function addSample(projectId: string, data: Omit<Sample, "id"|"projectId">): Sample | null {
  const idx = projects.findIndex(p => p.id === projectId);
  if (idx === -1) return null;
  const sample: Sample = { ...data, id: `s${Date.now()}`, projectId };
  projects[idx].samples.push(sample);
  return sample;
}

export function updateSample(projectId: string, sampleId: string, data: Partial<Sample>): Sample | null {
  const pidx = projects.findIndex(p => p.id === projectId);
  if (pidx === -1) return null;
  const sidx = projects[pidx].samples.findIndex(s => s.id === sampleId);
  if (sidx === -1) return null;
  projects[pidx].samples[sidx] = { ...projects[pidx].samples[sidx], ...data };
  return projects[pidx].samples[sidx];
}

export function deleteSample(projectId: string, sampleId: string): boolean {
  const pidx = projects.findIndex(p => p.id === projectId);
  if (pidx === -1) return false;
  const before = projects[pidx].samples.length;
  projects[pidx].samples = projects[pidx].samples.filter(s => s.id !== sampleId);
  return projects[pidx].samples.length < before;
}

// ------------------------------------------------------------
// EQUIPOS
// ------------------------------------------------------------
export function addEquipment(projectId: string, data: Omit<Equipment, "id"|"projectId">): Equipment | null {
  const idx = projects.findIndex(p => p.id === projectId);
  if (idx === -1) return null;
  const eq: Equipment = { ...data, id: `eq${Date.now()}`, projectId };
  projects[idx].equipment.push(eq);
  return eq;
}

export function updateEquipment(projectId: string, eqId: string, data: Partial<Equipment>): Equipment | null {
  const pidx = projects.findIndex(p => p.id === projectId);
  if (pidx === -1) return null;
  const eidx = projects[pidx].equipment.findIndex(e => e.id === eqId);
  if (eidx === -1) return null;
  projects[pidx].equipment[eidx] = { ...projects[pidx].equipment[eidx], ...data };
  return projects[pidx].equipment[eidx];
}

export function deleteEquipment(projectId: string, eqId: string): boolean {
  const pidx = projects.findIndex(p => p.id === projectId);
  if (pidx === -1) return false;
  const before = projects[pidx].equipment.length;
  projects[pidx].equipment = projects[pidx].equipment.filter(e => e.id !== eqId);
  return projects[pidx].equipment.length < before;
}

// ------------------------------------------------------------
// USUARIOS
// ------------------------------------------------------------
export function getAllUsers(): User[] { return users; }
export function getUserByEmail(email: string): User | undefined { return users.find(u => u.email === email); }
export function getUserById(id: string): User | undefined { return users.find(u => u.id === id); }
export function getClientUsers(): User[] { return users.filter(u => u.role === "client"); }
export function getCredentials(): Record<string, string> { return credentials; }

export function createClientUser(data: { name: string; email: string; password: string; projectId?: string }): User {
  const user: User = { id: `u${Date.now()}`, name: data.name, email: data.email, role: "client", projectId: data.projectId };
  users.push(user);
  credentials[data.email] = data.password;
  return user;
}

export function updateClientUser(id: string, data: Partial<User> & { password?: string }): User | null {
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  const { password, ...userData } = data;
  users[idx] = { ...users[idx], ...userData };
  if (password) credentials[users[idx].email] = password;
  return users[idx];
}
