// ============================================================
// DETALLE DE PROYECTO - Panel Administrador
// ============================================================

import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Droplets,
  Activity,
  FlaskConical,
  Wrench,
  ClipboardList,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  StatCard,
  SectionTitle,
} from "@/components/ui";
import { FlowChart, PhChart, MultiParamChart } from "@/components/charts/WaterCharts";
import { Project } from "@/types";
import { requireAdmin } from "@/lib/auth";
import { getProjectById } from "@/lib/mock/store";
import {
  formatDate,
  formatDateShort,
  getStatusColor,
  getEquipmentStatusColor,
  getEquipmentStatusLabel,
  getWaterTypeLabel,
} from "@/lib/auth";

interface ProjectDetailProps {
  project: Project;
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const lastParams = project.parameters[project.parameters.length - 1];

  return (
    <>
      <Head>
        <title>{project.name} — SeaGroup Admin</title>
      </Head>

      <DashboardLayout>
        {/* Back */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-5 transition-colors"
        >
          <ArrowLeft size={15} />
          Volver al panel
        </Link>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">
              {project.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <User size={13} />
                {project.clientName}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={13} />
                {project.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={13} />
                {formatDate(project.startDate)}
              </span>
              <span className="flex items-center gap-1">
                <Droplets size={13} />
                {getWaterTypeLabel(project.waterType)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                project.status
              )}`}
            >
              {project.status}
            </span>
            <Link
              href={`/admin/proyectos/${project.id}/editar`}
              className="bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              Editar proyecto
            </Link>
          </div>
        </div>

        {/* Descripción */}
        {project.description && (
          <Card className="mb-6">
            <CardContent className="py-4">
              <p className="text-sm text-slate-600">{project.description}</p>
              {project.waterObservations && (
                <p className="text-xs text-slate-400 mt-2 italic">
                  Agua: {project.waterObservations}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="pH Actual"
            value={lastParams?.ph ?? "—"}
            icon={<Droplets size={18} />}
            color="cyan"
          />
          <StatCard
            title="Caudal Acumulado"
            value={lastParams?.flowAccumulated ?? "—"}
            unit="m³"
            icon={<Activity size={18} />}
            color="blue"
          />
          <StatCard
            title="Visitas"
            value={project.visits.length}
            icon={<Calendar size={18} />}
            color="green"
          />
          <StatCard
            title="Muestras"
            value={project.samples.length}
            icon={<FlaskConical size={18} />}
            color="amber"
          />
        </div>

        {/* Gráficas */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <SectionTitle title="Caudal Acumulado (m³)" />
            </CardHeader>
            <CardContent>
              <FlowChart parameters={project.parameters} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <SectionTitle title="pH en el Tiempo" />
            </CardHeader>
            <CardContent>
              <PhChart parameters={project.parameters} />
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <SectionTitle
              title="Turbidez y Conductividad"
              subtitle="Evolución de parámetros secundarios"
            />
          </CardHeader>
          <CardContent>
            <MultiParamChart parameters={project.parameters} />
          </CardContent>
        </Card>

        {/* Tabla de registros de parámetros */}
        <Card className="mb-6">
          <CardHeader>
            <SectionTitle
              title="Registros de Parámetros"
              subtitle={`${project.parameters.length} registros`}
              action={
                <Link
                  href={`/admin/proyectos/${project.id}/parametros/nuevo`}
                  className="text-xs text-cyan-600 hover:text-cyan-800 font-medium"
                >
                  + Agregar registro
                </Link>
              }
            />
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Fecha", "pH", "Temp (°C)", "Turbidez (NTU)", "Conductividad", "Caudal Ac.", "Observaciones"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left text-xs font-medium text-slate-400 px-4 py-2 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {project.parameters
                  .slice()
                  .reverse()
                  .map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-slate-50 hover:bg-slate-50/50"
                    >
                      <td className="px-4 py-2.5 text-slate-700 whitespace-nowrap">
                        {formatDateShort(p.date)}
                      </td>
                      <td className="px-4 py-2.5 text-slate-700">
                        {p.ph ?? "—"}
                      </td>
                      <td className="px-4 py-2.5 text-slate-700">
                        {p.temperature ?? "—"}
                      </td>
                      <td className="px-4 py-2.5 text-slate-700">
                        {p.turbidity ?? "—"}
                      </td>
                      <td className="px-4 py-2.5 text-slate-700">
                        {p.conductivity ?? "—"}
                      </td>
                      <td className="px-4 py-2.5 text-slate-700">
                        {p.flowAccumulated ?? "—"} m³
                      </td>
                      <td className="px-4 py-2.5 text-slate-500 text-xs max-w-xs truncate">
                        {p.observations ?? "—"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Visitas */}
        <Card className="mb-6">
          <CardHeader>
            <SectionTitle
              title="Visitas a Terreno"
              subtitle={`${project.visits.length} visitas registradas`}
              action={
                <Link
                  href={`/admin/proyectos/${project.id}/visitas/nueva`}
                  className="text-xs text-cyan-600 hover:text-cyan-800 font-medium"
                >
                  + Nueva visita
                </Link>
              }
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {project.visits
                .slice()
                .reverse()
                .map((visit) => (
                  <div
                    key={visit.id}
                    className="border border-slate-100 rounded-lg p-4 hover:border-slate-200 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-800">
                        {formatDate(visit.date)}
                      </span>
                      <span className="text-xs text-slate-500">
                        {visit.responsible}
                      </span>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs font-medium text-slate-400 mb-0.5">
                          Comentarios técnicos
                        </p>
                        <p className="text-xs text-slate-600">
                          {visit.technicalComments}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-400 mb-0.5">
                          Acciones realizadas
                        </p>
                        <p className="text-xs text-slate-600">
                          {visit.actionsPerformed}
                        </p>
                      </div>
                      {visit.recommendations && (
                        <div>
                          <p className="text-xs font-medium text-slate-400 mb-0.5">
                            Recomendaciones
                          </p>
                          <p className="text-xs text-cyan-600">
                            {visit.recommendations}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Muestras */}
        <Card className="mb-6">
          <CardHeader>
            <SectionTitle
              title="Toma de Muestras"
              subtitle={`${project.samples.length} muestras registradas`}
              action={
                <Link
                  href={`/admin/proyectos/${project.id}/muestras/nueva`}
                  className="text-xs text-cyan-600 hover:text-cyan-800 font-medium"
                >
                  + Nueva muestra
                </Link>
              }
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {project.samples.map((sample) => (
                <div
                  key={sample.id}
                  className="border border-slate-100 rounded-lg p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-medium text-slate-800">
                      {formatDate(sample.date)}
                    </span>
                    <span className="text-xs text-slate-500">
                      Responsable: {sample.responsible}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-1">
                    <span className="font-medium">Resultados:</span>{" "}
                    {sample.results}
                  </p>
                  {sample.observations && (
                    <p className="text-xs text-slate-400 italic">
                      {sample.observations}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Equipos */}
        <Card>
          <CardHeader>
            <SectionTitle
              title="Estado de Equipos"
              subtitle="Filtros, friles y equipos del sistema"
            />
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {project.equipment.map((eq) => (
                <div key={eq.id} className="border border-slate-100 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium text-slate-800">{eq.name}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${getEquipmentStatusColor(
                        eq.status
                      )}`}
                    >
                      {getEquipmentStatusLabel(eq.status)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 capitalize mb-1">
                    Tipo: {eq.type}
                  </p>
                  {eq.lastMaintenanceDate && (
                    <p className="text-xs text-slate-400">
                      Mantención: {formatDateShort(eq.lastMaintenanceDate)}
                    </p>
                  )}
                  {eq.observations && (
                    <p className="text-xs text-slate-400 mt-1 italic">
                      {eq.observations}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const result = await requireAdmin(ctx);
  if ("redirect" in result) return result as { redirect: { destination: string; permanent: boolean } };

  const { id } = ctx.params as { id: string };
  const project = getProjectById(id);

  if (!project) {
    return { notFound: true };
  }

  return {
    props: { project: JSON.parse(JSON.stringify(project)) },
  };
};
