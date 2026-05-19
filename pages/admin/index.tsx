// ============================================================
// PANEL ADMINISTRADOR - Vista de todos los proyectos
// ============================================================

import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  FolderOpen,
  Users,
  Activity,
  MapPin,
  Calendar,
  ArrowRight,
  Plus,
  UserPlus,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, SectionTitle, StatCard } from "@/components/ui";
import { Project, User } from "@/types";
import { requireAdmin, formatDate, getStatusColor } from "@/lib/auth";
import { getAllProjects, getClientUsers } from "@/lib/mock/store";

interface AdminPanelProps {
  projects: Project[];
  totalClients: number;
}

export default function AdminPanel({ projects, totalClients }: AdminPanelProps) {
  const activeProjects = projects.filter((p) => p.status === "activo").length;
  const totalVisits = projects.reduce((acc, p) => acc + p.visits.length, 0);
  const totalSamples = projects.reduce((acc, p) => acc + p.samples.length, 0);

  return (
    <>
      <Head>
        <title>Panel Administrador — SeaGroup</title>
      </Head>

      <DashboardLayout title="Panel Administrador">
        {/* Stats generales */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Proyectos"
            value={projects.length}
            icon={<FolderOpen size={18} />}
            color="blue"
            description="Proyectos en sistema"
          />
          <StatCard
            title="Proyectos Activos"
            value={activeProjects}
            icon={<Activity size={18} />}
            color="green"
            description="En ejecución"
          />
          <StatCard
            title="Clientes Registrados"
            value={totalClients}
            icon={<Users size={18} />}
            color="cyan"
            description="Con acceso al portal"
          />
          <StatCard
            title="Visitas Realizadas"
            value={totalVisits}
            icon={<Calendar size={18} />}
            color="amber"
            description="Total acumulado"
          />
        </div>

        {/* Acciones rápidas */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Link
            href="/admin/proyectos/nuevo"
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Nuevo Proyecto
          </Link>
          <Link
            href="/admin/clientes/nuevo"
            className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <UserPlus size={16} />
            Nuevo Cliente
          </Link>
        </div>

        {/* Lista de proyectos */}
        <Card>
          <CardHeader>
            <SectionTitle
              title="Proyectos"
              subtitle={`${projects.length} proyectos en el sistema`}
            />
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {projects.map((project) => {
                const lastVisit = project.visits[project.visits.length - 1];
                const lastParams =
                  project.parameters[project.parameters.length - 1];

                return (
                  <div
                    key={project.id}
                    className="px-6 py-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-sm font-semibold text-slate-800 truncate">
                            {project.name}
                          </h3>
                          <span
                            className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                              project.status
                            )}`}
                          >
                            {project.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Users size={11} />
                            {project.clientName}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={11} />
                            {project.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={11} />
                            Inicio: {formatDate(project.startDate)}
                          </span>
                        </div>

                        {/* Mini stats */}
                        <div className="flex flex-wrap gap-3 mt-2">
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {project.visits.length} visitas
                          </span>
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {project.parameters.length} registros
                          </span>
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {project.samples.length} muestras
                          </span>
                          {lastParams?.ph && (
                            <span className="text-xs bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded">
                              pH: {lastParams.ph}
                            </span>
                          )}
                          {lastVisit && (
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                              Última visita: {formatDate(lastVisit.date)}
                            </span>
                          )}
                        </div>
                      </div>

                      <Link
                        href={`/admin/proyectos/${project.id}`}
                        className="flex-shrink-0 flex items-center gap-1 text-xs font-medium text-cyan-600 hover:text-cyan-800 transition-colors"
                      >
                        Ver detalle
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                );
              })}
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

  return {
    props: {
      projects: JSON.parse(JSON.stringify(getAllProjects())),
      totalClients: getClientUsers().length,
    },
  };
};
