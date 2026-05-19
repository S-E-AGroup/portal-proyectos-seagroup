// API: /api/admin/proyectos/[id]/visitas
// GET → listar | POST → crear | PUT → editar | DELETE → eliminar

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { addVisit, updateVisit, deleteVisit, getProjectById } from "@/lib/mock/store";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "admin") return res.status(401).json({ error: "No autorizado" });

  const { id } = req.query as { id: string };

  if (req.method === "GET") {
    const project = getProjectById(id);
    if (!project) return res.status(404).json({ error: "Proyecto no encontrado" });
    return res.status(200).json({ visits: project.visits });
  }

  if (req.method === "POST") {
    const { date, responsible, technicalComments, actionsPerformed, recommendations } = req.body;
    if (!date || !responsible || !technicalComments || !actionsPerformed)
      return res.status(400).json({ error: "Fecha, responsable, comentarios y acciones son requeridos" });
    const visit = addVisit(id, { date, responsible, technicalComments, actionsPerformed, recommendations });
    if (!visit) return res.status(404).json({ error: "Proyecto no encontrado" });
    return res.status(201).json({ visit });
  }

  if (req.method === "PUT") {
    const { visitId, ...data } = req.body;
    if (!visitId) return res.status(400).json({ error: "visitId requerido" });
    const visit = updateVisit(id, visitId, data);
    if (!visit) return res.status(404).json({ error: "Visita no encontrada" });
    return res.status(200).json({ visit });
  }

  if (req.method === "DELETE") {
    const { visitId } = req.body;
    if (!visitId) return res.status(400).json({ error: "visitId requerido" });
    const ok = deleteVisit(id, visitId);
    if (!ok) return res.status(404).json({ error: "Visita no encontrada" });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Método no permitido" });
}
