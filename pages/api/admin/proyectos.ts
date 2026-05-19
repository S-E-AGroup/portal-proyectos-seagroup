// ============================================================
// API - Gestión de proyectos
// POST /api/admin/proyectos → crear proyecto
// GET  /api/admin/proyectos → listar proyectos
// ============================================================

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { createProject, getAllProjects, getUserById } from "@/lib/mock/store";
import { WaterType, ProjectStatus } from "@/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "admin") {
    return res.status(401).json({ error: "No autorizado" });
  }

  // GET - listar proyectos
  if (req.method === "GET") {
    return res.status(200).json({ projects: getAllProjects() });
  }

  // POST - crear proyecto
  if (req.method === "POST") {
    const {
      name,
      clientId,
      location,
      startDate,
      status,
      description,
      waterType,
      waterObservations,
    } = req.body;

    if (!name || !clientId || !location || !startDate) {
      return res.status(400).json({ error: "Nombre, cliente, ubicación y fecha de inicio son requeridos" });
    }

    // Obtener nombre del cliente
    const clientUser = getUserById(clientId);
    if (!clientUser) {
      return res.status(400).json({ error: "Cliente no encontrado" });
    }

    const project = createProject({
      name,
      clientId,
      clientName: clientUser.name,
      location,
      startDate,
      status: (status as ProjectStatus) || "activo",
      description: description || "",
      waterType: (waterType as WaterType) || "superficial",
      waterObservations: waterObservations || "",
    });

    return res.status(201).json({ project });
  }

  return res.status(405).json({ error: "Método no permitido" });
}
