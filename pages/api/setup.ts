// POST /api/setup - Crear admin inicial en Supabase
// Ejecutar UNA SOLA VEZ después del deploy
import { NextApiRequest, NextApiResponse } from "next";
import { createAdminIfNotExists } from "@/lib/supabase-store";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  
  // Clave de seguridad para evitar uso no autorizado
  if (req.body?.setupKey !== process.env.SETUP_KEY) {
    return res.status(401).json({ error: "No autorizado" });
  }

  try {
    await createAdminIfNotExists();
    return res.status(200).json({ success: true, message: "Admin creado o ya existía" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
