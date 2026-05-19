// API: /api/admin/proyectos/[id]/parametros
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { addParameter, updateParameter, deleteParameter, getProjectById } from "@/lib/mock/store";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "admin") return res.status(401).json({ error: "No autorizado" });

  const { id } = req.query as { id: string };

  if (req.method === "GET") {
    const project = getProjectById(id);
    if (!project) return res.status(404).json({ error: "Proyecto no encontrado" });
    return res.status(200).json({ parameters: project.parameters });
  }

  if (req.method === "POST") {
    const { date, ph, temperature, turbidity, conductivity, suspendedSolids, flowInstant, flowAccumulated, physicalCharacteristics, observations } = req.body;
    if (!date) return res.status(400).json({ error: "La fecha es requerida" });
    const param = addParameter(id, { date, ph: ph ? Number(ph) : undefined, temperature: temperature ? Number(temperature) : undefined, turbidity: turbidity ? Number(turbidity) : undefined, conductivity: conductivity ? Number(conductivity) : undefined, suspendedSolids: suspendedSolids ? Number(suspendedSolids) : undefined, flowInstant: flowInstant ? Number(flowInstant) : undefined, flowAccumulated: flowAccumulated ? Number(flowAccumulated) : undefined, physicalCharacteristics, observations });
    if (!param) return res.status(404).json({ error: "Proyecto no encontrado" });
    return res.status(201).json({ param });
  }

  if (req.method === "PUT") {
    const { paramId, ...raw } = req.body;
    if (!paramId) return res.status(400).json({ error: "paramId requerido" });
    const data = { ...raw, ph: raw.ph ? Number(raw.ph) : undefined, temperature: raw.temperature ? Number(raw.temperature) : undefined, turbidity: raw.turbidity ? Number(raw.turbidity) : undefined, conductivity: raw.conductivity ? Number(raw.conductivity) : undefined, suspendedSolids: raw.suspendedSolids ? Number(raw.suspendedSolids) : undefined, flowInstant: raw.flowInstant ? Number(raw.flowInstant) : undefined, flowAccumulated: raw.flowAccumulated ? Number(raw.flowAccumulated) : undefined };
    const param = updateParameter(id, paramId, data);
    if (!param) return res.status(404).json({ error: "Parámetro no encontrado" });
    return res.status(200).json({ param });
  }

  if (req.method === "DELETE") {
    const { paramId } = req.body;
    if (!paramId) return res.status(400).json({ error: "paramId requerido" });
    const ok = deleteParameter(id, paramId);
    if (!ok) return res.status(404).json({ error: "Parámetro no encontrado" });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Método no permitido" });
}
