// ============================================================
// API - Gestión de clientes
// POST /api/admin/clientes → crear cliente
// GET  /api/admin/clientes → listar clientes
// ============================================================

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { createClientUser, getClientUsers, getUserByEmail } from "@/lib/mock/store";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "admin") {
    return res.status(401).json({ error: "No autorizado" });
  }

  // GET - listar clientes
  if (req.method === "GET") {
    return res.status(200).json({ users: getClientUsers() });
  }

  // POST - crear cliente
  if (req.method === "POST") {
    const { name, email, password, projectId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Nombre, email y contraseña son requeridos" });
    }

    // Verificar que el email no esté en uso
    const existing = getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: "Ya existe un usuario con ese email" });
    }

    const user = createClientUser({ name, email, password, projectId });
    return res.status(201).json({ user });
  }

  return res.status(405).json({ error: "Método no permitido" });
}
