// ============================================================
// DASHBOARD CLIENTE - Vista de proyecto propio
// ============================================================

import { GetServerSideProps } from "next";
import Head from "next/head";
import {
  Droplets,
  Activity,
  FlaskConical,
  Calendar,
  Wrench,
  MapPin,
  Clock,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  StatCard,
  SectionTitle,
  Badge,
} from "@/components/ui";
import { FlowChart, PhChart } from "@/components/charts/WaterCharts";
import { Project } from "@/types";
import { requireAuth } from "@/lib/auth";
import { getProjectByClientId, getProjectById } from "@/lib/mock/store";
import {
  formatDate,
  formatDateShort,
  getStatusColor,
  getEquipmentStatusColor,
  getEquipmentStatusLabel,
  getWaterTypeLabel,
} from "@/lib/auth";

interface DashboardProps {
  project: Project;
}

export default function ClientDashboard({ project }: DashboardProps) {
  const lastParams = project.parameters[project.parameters.length - 1];
  const lastVisit = project.visits[project.visits.length - 1];
  const operativeEquipment = project.equipment.filter(
    (e) => e.status === "operativo"
  ).length;

  return (
    <>
      <Head>
        <title>{project.name} — SeaGroup Portal</title>
      </Head>

      <DashboardLayout title="Mi Proyecto">
        {/* Header del proyecto */}
        <div className="mb-6">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
            <div>
              <h2 className="text-xl font-bold text-slate-800">{project.name}</h2>
              <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                <MapPin size={13} />
                <span>{project.location}</span>
                <span>·</span>
                <span>Inicio: {formatDate(project.startDate)}</span>
              </div>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                project.status
              )}`}
            >
              {project.status}
            </span>
          </div>
          <p className="text-sm text-slate-500 max-w-2xl">{project.description}</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="pH Actual"
            value={lastParams?.ph ?? "—"}
            description="Última medición"
            icon={<Droplets size={18} />}
            color="cyan"
          />
          <StatCard
            title="Caudal Acumulado"
            value={lastParams?.flowAccumulated ?? "—"}
            unit="m³"
            description="Volumen total tratado"
            icon={<Activity size={18} />}
            color="blue"
          />
          <StatCard
            title="Visitas Realizadas"
            value={project.visits.length}
            description="Total de visitas técnicas"
            icon={<Calendar size={18} />}
            color="green"
          />
          <StatCard
            title="Equipos Operativos"
            value={`${operativeEquipment}/${project.equipment.length}`}
            description="Estado de equipos"
            icon={<Wrench size={18} />}
            color="amber"
          />
        </div>

        {/* Gráficas */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <SectionTitle
                title="Caudal Acumulado"
                subtitle="Evolución del volumen tratado (m³)"
              />
            </CardHeader>
            <CardContent>
              <FlowChart parameters={project.parameters} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <SectionTitle
                title="pH en el Tiempo"
                subtitle="Evolución del pH del agua tratada"
              />
            </CardHeader>
            <CardContent>
              <PhChart parameters={project.parameters} />
            </CardContent>
          </Card>
        </div>

        {/* Parámetros recientes + Última visita */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Parámetros recientes */}
          <Card>
            <CardHeader>
              <SectionTitle
                title="Últimos Parámetros"
                subtitle={
                  lastParams
                    ? `Registro del ${formatDate(lastParams.date)}`
                    : "Sin datos"
                }
              />
            </CardHeader>
            <CardContent>
              {lastParams ? (
                <div className="space-y-3">
                  {[
                    { label: "pH", value: lastParams.ph, unit: "" },
                    { label: "Temperatura", value: lastParams.temperature, unit: "°C" },
                    { label: "Turbidez", value: lastParams.turbidity, unit: "NTU" },
                    {
                      label: "Conductividad",
                      value: lastParams.conductivity,
                      unit: "µS/cm",
                    },
                    {
                      label: "Caudal Instantáneo",
                      value: lastParams.flowInstant,
                      unit: "m³/h",
                    },
                  ]
                    .filter((p) => p.value !== undefined)
                    .map((param) => (
                      <div
                        key={param.label}
                        className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                      >
                        <span className="text-sm text-slate-500">
                          {param.label}
                        </span>
                        <span className="text-sm font-semibold text-slate-800">
                          {param.value}
                          {param.unit && (
                            <span className="text-slate-400 font-normal ml-1 text-xs">
                              {param.unit}
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  {lastParams.observations && (
                    <p className="text-xs text-slate-400 pt-1 italic">
                      {lastParams.observations}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-400">Sin registros disponibles</p>
              )}
            </CardContent>
          </Card>

          {/* Última visita */}
          <Card>
            <CardHeader>
              <SectionTitle
                title="Última Visita a Terreno"
                subtitle={
                  lastVisit
                    ? `${formatDate(lastVisit.date)}`
                    : "Sin visitas registradas"
                }
              />
            </CardHeader>
            <CardContent>
              {lastVisit ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock size={14} className="text-slate-400" />
                    <span>{lastVisit.responsible}</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">
                      Comentarios técnicos
                    </p>
                    <p className="text-sm text-slate-700">
                      {lastVisit.technicalComments}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">
                      Acciones realizadas
                    </p>
                    <p className="text-sm text-slate-700">
                      {lastVisit.actionsPerformed}
                    </p>
                  </div>
                  {lastVisit.recommendations && (
                    <div className="bg-cyan-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-cyan-700 mb-1">
                        Recomendaciones
                      </p>
                      <p className="text-xs text-cyan-600">
                        {lastVisit.recommendations}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-400">Sin visitas registradas</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Historial de visitas */}
        <Card className="mb-6">
          <CardHeader>
            <SectionTitle
              title="Historial de Visitas"
              subtitle={`${project.visits.length} visitas registradas`}
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {project.visits
                .slice()
                .reverse()
                .map((visit, i) => (
                  <div
                    key={visit.id}
                    className="flex gap-4 pb-5 last:pb-0 relative"
                  >
                    {/* Timeline line */}
                    {i < project.visits.length - 1 && (
                      <div className="absolute left-4 top-8 bottom-0 w-px bg-slate-100" />
                    )}
                    {/* Dot */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-100 border-2 border-cyan-400 flex items-center justify-center z-10">
                      <Calendar size={12} className="text-cyan-600" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-slate-800">
                          {formatDate(visit.date)}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500">
                          {visit.responsible}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-1">
                        {visit.technicalComments}
                      </p>
                      {visit.recommendations && (
                        <p className="text-xs text-cyan-600 bg-cyan-50 inline-block px-2 py-0.5 rounded">
                          {visit.recommendations}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Estado de equipos */}
        <Card>
          <CardHeader>
            <SectionTitle
              title="Estado de Equipos"
              subtitle="Filtros, friles y equipos asociados al sistema"
            />
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {project.equipment.map((eq) => (
                <div
                  key={eq.id}
                  className="border border-slate-100 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium text-slate-800">
                      {eq.name}
                    </p>
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
                      Último mantenimiento:{" "}
                      {formatDateShort(eq.lastMaintenanceDate)}
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
  const result = await requireAuth(ctx);
  if ("redirect" in result) return result as { redirect: { destination: string; permanent: boolean } };

  const { session } = result as { session: { user: { role: string; id: string; projectId?: string } } };

  // Admin redirige a su panel
  if (session.user.role === "admin") {
    return { redirect: { destination: "/admin", permanent: false } };
  }

  // Cliente: busca su proyecto
  const project = session.user.projectId
    ? getProjectById(session.user.projectId)
    : getProjectByClientId(session.user.id);

  if (!project) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  return { props: { project: JSON.parse(JSON.stringify(project)) } };
};
