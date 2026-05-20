// ============================================================
// FORMULARIO NUEVO PROYECTO - Panel Administrador
// ============================================================

import { useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, SectionTitle } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { getClientUsers } from "@/lib/supabase-store";
import { User } from "@/types";

interface NuevoProyectoProps {
  clientes: Pick<User, "id" | "name" | "email">[];
}

const inputClass = "w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors";
const labelClass = "block text-xs font-medium text-slate-600 mb-1.5";

export default function NuevoProyecto({ clientes }: NuevoProyectoProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    clientId: "",
    location: "",
    startDate: "",
    status: "activo",
    description: "",
    waterType: "superficial",
    waterObservations: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/proyectos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al crear el proyecto");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push(`/admin/proyectos/${data.project.id}`), 2000);
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Nuevo Proyecto — SeaGroup Admin</title>
      </Head>

      <DashboardLayout>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-5 transition-colors"
        >
          <ArrowLeft size={15} />
          Volver al panel
        </Link>

        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <SectionTitle
                title="Nuevo Proyecto"
                subtitle="Registrar un nuevo proyecto de tratamiento de agua"
              />
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <CheckCircle size={48} className="text-emerald-500 mb-3" />
                  <p className="text-lg font-semibold text-slate-800">¡Proyecto creado!</p>
                  <p className="text-sm text-slate-500 mt-1">Redirigiendo al detalle...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Sección: Información general */}
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                      Información General
                    </p>
                    <div className="space-y-4">
                      {/* Nombre */}
                      <div>
                        <label className={labelClass}>Nombre del proyecto</label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          placeholder="Ej: Planta de Tratamiento Mina Cóndor"
                          className={inputClass + " text-slate-800"}
                        />
                      </div>

                      {/* Cliente */}
                      <div>
                        <label className={labelClass}>Cliente asignado</label>
                        <select
                          name="clientId"
                          value={form.clientId}
                          onChange={handleChange}
                          required
                          className={inputClass + " bg-white"}
                        >
                          <option value="">Seleccionar cliente...</option>
                          {clientes.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} — {c.email}
                            </option>
                          ))}
                        </select>
                        {clientes.length === 0 && (
                          <p className="text-xs text-amber-600 mt-1">
                            No hay clientes registrados.{" "}
                            <Link href="/admin/clientes/nuevo" className="underline">
                              Crear cliente primero
                            </Link>
                          </p>
                        )}
                      </div>

                      {/* Ubicación y fecha */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Ubicación</label>
                          <input
                            type="text"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            required
                            placeholder="Ej: Región de Atacama, Chile"
                            className={inputClass + " text-slate-800"}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Fecha de inicio</label>
                          <input
                            type="date"
                            name="startDate"
                            value={form.startDate}
                            onChange={handleChange}
                            required
                            className={inputClass + " text-slate-800"}
                          />
                        </div>
                      </div>

                      {/* Estado */}
                      <div>
                        <label className={labelClass}>Estado inicial</label>
                        <select
                          name="status"
                          value={form.status}
                          onChange={handleChange}
                          className={inputClass + " bg-white"}
                        >
                          <option value="activo">Activo</option>
                          <option value="pausado">Pausado</option>
                          <option value="finalizado">Finalizado</option>
                        </select>
                      </div>

                      {/* Descripción */}
                      <div>
                        <label className={labelClass}>Descripción general</label>
                        <textarea
                          name="description"
                          value={form.description}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Descripción del proyecto, objetivos y alcance..."
                          className={inputClass + " resize-none"}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sección: Agua */}
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                      Características del Agua
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className={labelClass}>Tipo de agua a tratar</label>
                        <select
                          name="waterType"
                          value={form.waterType}
                          onChange={handleChange}
                          className={inputClass + " bg-white"}
                        >
                          <option value="superficial">Agua Superficial</option>
                          <option value="subterranea">Agua Subterránea</option>
                          <option value="residual">Agua Residual</option>
                          <option value="industrial">Agua Industrial</option>
                          <option value="otro">Otro</option>
                        </select>
                      </div>

                      <div>
                        <label className={labelClass}>
                          Observaciones del agua{" "}
                          <span className="text-slate-400 font-normal">(opcional)</span>
                        </label>
                        <textarea
                          name="waterObservations"
                          value={form.waterObservations}
                          onChange={handleChange}
                          rows={2}
                          placeholder="Características físicas, nivel de contaminación, contexto..."
                          className={inputClass + " resize-none"}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                      <p className="text-xs text-red-600">{error}</p>
                    </div>
                  )}

                  {/* Botones */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                    >
                      {loading ? "Creando proyecto..." : "Crear Proyecto"}
                    </button>
                    <Link
                      href="/admin"
                      className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors"
                    >
                      Cancelar
                    </Link>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const result = await requireAdmin(ctx);
  if ("redirect" in result) return result as { redirect: { destination: string; permanent: boolean } };

  const clientes = (await getClientUsers()).map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
  }));

  return { props: { clientes } };
};
