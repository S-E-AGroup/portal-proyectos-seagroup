// ============================================================
// FORMULARIO NUEVO CLIENTE - Panel Administrador
// ============================================================

import { useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { ArrowLeft, User, Mail, Lock, FolderOpen, Eye, EyeOff, CheckCircle } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, SectionTitle } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { getAllProjects } from "@/lib/mock/store";
import { Project } from "@/types";

interface NuevoClienteProps {
  proyectos: Pick<Project, "id" | "name">[];
}

export default function NuevoCliente({ proyectos }: NuevoClienteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    projectId: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al crear el cliente");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/admin"), 2000);
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Nuevo Cliente — SeaGroup Admin</title>
      </Head>

      <DashboardLayout>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-5 transition-colors"
        >
          <ArrowLeft size={15} />
          Volver al panel
        </Link>

        <div className="max-w-lg">
          <Card>
            <CardHeader>
              <SectionTitle
                title="Nuevo Cliente"
                subtitle="Crear acceso para un cliente al portal"
              />
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <CheckCircle size={48} className="text-emerald-500 mb-3" />
                  <p className="text-lg font-semibold text-slate-800">¡Cliente creado!</p>
                  <p className="text-sm text-slate-500 mt-1">Redirigiendo al panel...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nombre */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Nombre completo o empresa
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Ej: Empresa Minera Norte"
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors" style={{color:"#1e293b",backgroundColor:"#ffffff"}}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="cliente@empresa.cl"
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors" style={{color:"#1e293b",backgroundColor:"#ffffff"}}
                      />
                    </div>
                  </div>

                  {/* Contraseña */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Contraseña de acceso
                    </label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors" style={{color:"#1e293b",backgroundColor:"#ffffff"}}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Esta será la clave que usará el cliente para ingresar al portal.
                    </p>
                  </div>

                  {/* Proyecto asignado */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Proyecto asignado{" "}
                      <span className="text-slate-400 font-normal">(opcional)</span>
                    </label>
                    <div className="relative">
                      <FolderOpen size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select
                        name="projectId"
                        value={form.projectId}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors bg-white appearance-none" style={{color:"#1e293b",backgroundColor:"#ffffff"}}
                      >
                        <option value="">Sin proyecto asignado aún</option>
                        {proyectos.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      También puedes asignarlo después desde el detalle del proyecto.
                    </p>
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
                      {loading ? "Creando..." : "Crear Cliente"}
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

  const proyectos = getAllProjects().map((p) => ({ id: p.id, name: p.name }));

  return { props: { proyectos } };
};
