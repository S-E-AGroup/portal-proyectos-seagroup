// ============================================================
// HELPERS DE AUTENTICACIÓN Y UTILIDADES GENERALES
// ============================================================

import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

type RedirectResult = GetServerSidePropsResult<Record<string, never>>;
type AuthSuccess = { session: Session };
type AuthResult = RedirectResult | AuthSuccess;

// ------------------------------------------------------------
// Obtener sesión desde server side
// ------------------------------------------------------------
export async function getSession(ctx: GetServerSidePropsContext) {
  return await getServerSession(ctx.req, ctx.res, authOptions);
}

// ------------------------------------------------------------
// Proteger ruta: redirige a login si no hay sesión
// ------------------------------------------------------------
export async function requireAuth(ctx: GetServerSidePropsContext): Promise<AuthResult> {
  const session = await getSession(ctx);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return { session };
}

// ------------------------------------------------------------
// Proteger ruta: solo admin
// ------------------------------------------------------------
export async function requireAdmin(ctx: GetServerSidePropsContext): Promise<AuthResult> {
  const result = await requireAuth(ctx);
  if ("redirect" in result) return result;

  const { session } = result as AuthSuccess;
  if (session.user.role !== "admin") {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
  return { session };
}

// ------------------------------------------------------------
// Formatear fecha a español
// ------------------------------------------------------------
export function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// ------------------------------------------------------------
// Formatear fecha corta
// ------------------------------------------------------------
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ------------------------------------------------------------
// Color badge según status de proyecto
// ------------------------------------------------------------
export function getStatusColor(
  status: "activo" | "pausado" | "finalizado"
): string {
  const colors = {
    activo: "bg-emerald-100 text-emerald-800",
    pausado: "bg-amber-100 text-amber-800",
    finalizado: "bg-gray-100 text-gray-800",
  };
  return colors[status];
}

// ------------------------------------------------------------
// Color badge según status de equipo
// ------------------------------------------------------------
export function getEquipmentStatusColor(
  status: "operativo" | "mantencion" | "fuera_de_servicio"
): string {
  const colors = {
    operativo: "bg-emerald-100 text-emerald-800",
    mantencion: "bg-amber-100 text-amber-800",
    fuera_de_servicio: "bg-red-100 text-red-800",
  };
  return colors[status];
}

// ------------------------------------------------------------
// Label legible para tipo de agua
// ------------------------------------------------------------
export function getWaterTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    superficial: "Agua Superficial",
    subterranea: "Agua Subterránea",
    residual: "Agua Residual",
    industrial: "Agua Industrial",
    otro: "Otro",
  };
  return labels[type] ?? type;
}

// ------------------------------------------------------------
// Label legible para status de equipo
// ------------------------------------------------------------
export function getEquipmentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    operativo: "Operativo",
    mantencion: "En Mantención",
    fuera_de_servicio: "Fuera de Servicio",
  };
  return labels[status] ?? status;
}
