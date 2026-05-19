// API: /api/admin/proyectos/[id]/equipos
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { addEquipment, updateEquipment, deleteEquipment, getProjectById } from "@/lib/mock/store";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "admin") return res.status(401).json({ error: "No autorizado" });

  const { id } = req.query as { id: string };

  if (req.method === "GET") {
    const project = getProjectById(id);
    if (!project) return res.status(404).json({ error: "Proyecto no encontrado" });
    return res.status(200).json({ equipment: project.equipment });
  }

  if (req.method === "POST") {
    const { name, type, status, lastMaintenanceDate, observations } = req.body;
    if (!name || !type || !status) return res.status(400).json({ error: "Nombre, tipo y estado son requeridos" });
    const eq = addEquipment(id, { name, type, status, lastMaintenanceDate, observations });
    if (!eq) return res.status(404).json({ error: "Proyecto no encontrado" });
    return res.status(201).json({ equipment: eq });
  }

  if (req.method === "PUT") {
    const { eqId, ...data } = req.body;
    if (!eqId) return res.status(400).json({ error: "eqId requerido" });
    const eq = updateEquipment(id, eqId, data);
    if (!eq) return res.status(404).json({ error: "Equipo no encontrado" });
    return res.status(200).json({ equipment: eq });
  }

  if (req.method === "DELETE") {
    const { eqId } = req.body;
    if (!eqId) return res.status(400).json({ error: "eqId requerido" });
    const ok = deleteEquipment(id, eqId);
    if (!ok) return res.status(404).json({ error: "Equipo no encontrado" });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Método no permitido" });
}
