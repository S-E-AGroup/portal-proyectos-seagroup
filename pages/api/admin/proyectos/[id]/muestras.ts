// API: /api/admin/proyectos/[id]/muestras
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { addSample, updateSample, deleteSample, getProjectById } from "@/lib/supabase-store";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "admin") return res.status(401).json({ error: "No autorizado" });

  const { id } = req.query as { id: string };

  if (req.method === "GET") {
    const project = await getProjectById(id);
    if (!project) return res.status(404).json({ error: "Proyecto no encontrado" });
    return res.status(200).json({ samples: project.samples });
  }

  if (req.method === "POST") {
    const { date, responsible, results, observations } = req.body;
    if (!date || !responsible || !results) return res.status(400).json({ error: "Fecha, responsable y resultados son requeridos" });
    const sample = addSample(id, { date, responsible, results, observations });
    if (!sample) return res.status(404).json({ error: "Proyecto no encontrado" });
    return res.status(201).json({ sample });
  }

  if (req.method === "PUT") {
    const { sampleId, ...data } = req.body;
    if (!sampleId) return res.status(400).json({ error: "sampleId requerido" });
    const sample = updateSample(id, sampleId, data);
    if (!sample) return res.status(404).json({ error: "Muestra no encontrada" });
    return res.status(200).json({ sample });
  }

  if (req.method === "DELETE") {
    const { sampleId } = req.body;
    if (!sampleId) return res.status(400).json({ error: "sampleId requerido" });
    const ok = deleteSample(id, sampleId);
    if (!ok) return res.status(404).json({ error: "Muestra no encontrada" });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Método no permitido" });
}
