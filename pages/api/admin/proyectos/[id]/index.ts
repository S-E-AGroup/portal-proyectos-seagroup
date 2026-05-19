// API: /api/admin/proyectos/[id] — GET proyecto por ID
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getProjectById } from "@/lib/mock/store";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "admin") return res.status(401).json({ error: "No autorizado" });

  const { id } = req.query as { id: string };

  if (req.method === "GET") {
    const project = getProjectById(id);
    if (!project) return res.status(404).json({ error: "Proyecto no encontrado" });
    return res.status(200).json({ project });
  }

  return res.status(405).json({ error: "Método no permitido" });
}
