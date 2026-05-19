// ============================================================
// STORE EN MEMORIA - Gestión dinámica de proyectos y clientes
// En producción reemplazar con llamadas a Supabase/PostgreSQL
// ============================================================

import { MOCK_PROJECTS, MOCK_USERS, MOCK_CREDENTIALS } from "./data";
import { Project, User } from "@/types";

// Clonar datos iniciales para poder mutar en runtime
let projects: Project[] = JSON.parse(JSON.stringify(MOCK_PROJECTS));
let users: User[] = JSON.parse(JSON.stringify(MOCK_USERS));
let credentials: Record<string, string> = { ...MOCK_CREDENTIALS };

// ------------------------------------------------------------
// PROYECTOS
// ------------------------------------------------------------
export function getAllProjects(): Project[] {
  return projects;
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getProjectByClientId(clientId: string): Project | undefined {
  return projects.find((p) => p.clientId === clientId);
}

export function createProject(data: Omit<Project, "id" | "parameters" | "samples" | "visits" | "equipment" | "documents">): Project {
  const newProject: Project = {
    ...data,
    id: `p${Date.now()}`,
    parameters: [],
    samples: [],
    visits: [],
    equipment: [],
    documents: [],
  };
  projects.push(newProject);
  return newProject;
}

export function updateProject(id: string, data: Partial<Project>): Project | null {
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  projects[idx] = { ...projects[idx], ...data };
  return projects[idx];
}

// ------------------------------------------------------------
// USUARIOS / CLIENTES
// ------------------------------------------------------------
export function getAllUsers(): User[] {
  return users;
}

export function getUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email === email);
}

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function getClientUsers(): User[] {
  return users.filter((u) => u.role === "client");
}

export function createClientUser(data: {
  name: string;
  email: string;
  password: string;
  projectId?: string;
}): User {
  const newUser: User = {
    id: `u${Date.now()}`,
    name: data.name,
    email: data.email,
    role: "client",
    projectId: data.projectId,
  };
  users.push(newUser);
  credentials[data.email] = data.password;
  return newUser;
}

export function updateClientUser(id: string, data: Partial<User> & { password?: string }): User | null {
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  const { password, ...userData } = data;
  users[idx] = { ...users[idx], ...userData };
  if (password) {
    credentials[users[idx].email] = password;
  }
  return users[idx];
}

export function getCredentials(): Record<string, string> {
  return credentials;
}
