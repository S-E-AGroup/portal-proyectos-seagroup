// ============================================================
// LANDING PAGE - SeaGroup
// ============================================================

import Head from "next/head";
import Link from "next/link";
import {
  Droplets,
  Shield,
  BarChart2,
  ClipboardList,
  CheckCircle,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

const services = [
  {
    icon: <Droplets size={24} className="text-cyan-500" />,
    title: "Tratamiento de Agua",
    description:
      "Diseño e implementación de sistemas de tratamiento para agua industrial, superficial y residual con tecnología de vanguardia.",
  },
  {
    icon: <BarChart2 size={24} className="text-cyan-500" />,
    title: "Monitoreo de Parámetros",
    description:
      "Control continuo de pH, caudal, turbidez, conductividad y sólidos suspendidos. Trazabilidad total de cada proyecto.",
  },
  {
    icon: <ClipboardList size={24} className="text-cyan-500" />,
    title: "Gestión Técnica",
    description:
      "Visitas a terreno, registros técnicos y reportes detallados que permiten tomar decisiones informadas en tiempo real.",
  },
  {
    icon: <Shield size={24} className="text-cyan-500" />,
    title: "Cumplimiento Normativo",
    description:
      "Acompañamiento para el cumplimiento de normativas ambientales vigentes. Informes y documentación técnica de respaldo.",
  },
];

const stats = [
  { value: "+50", label: "Proyectos ejecutados" },
  { value: "+8", label: "Años de experiencia" },
  { value: "100%", label: "Proyectos con trazabilidad" },
  { value: "+3", label: "Regiones con presencia" },
];

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>SeaGroup — Tratamiento y Gestión de Aguas</title>
        <meta
          name="description"
          content="SeaGroup: soluciones profesionales en tratamiento de agua, monitoreo técnico y gestión de proyectos ambientales en Chile."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-white font-sans">
        {/* ---- NAVBAR ---- */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628]/95 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2.5">
                <div className="bg-cyan-500 rounded-lg p-1.5">
                  <Droplets size={20} className="text-white" />
                </div>
                <span className="font-bold text-white text-lg tracking-wide">
                  SeaGroup
                </span>
              </div>
              <div className="hidden md:flex items-center gap-8">
                <a
                  href="#servicios"
                  className="text-slate-300 hover:text-white text-sm transition-colors"
                >
                  Servicios
                </a>
                <a
                  href="#nosotros"
                  className="text-slate-300 hover:text-white text-sm transition-colors"
                >
                  Nosotros
                </a>
                <a
                  href="#contacto"
                  className="text-slate-300 hover:text-white text-sm transition-colors"
                >
                  Contacto
                </a>
                <Link
                  href="/login"
                  className="bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Portal Clientes
                </Link>
              </div>
              <div className="md:hidden">
                <Link
                  href="/login"
                  className="bg-cyan-500 text-white text-sm font-medium px-4 py-2 rounded-lg"
                >
                  Portal
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* ---- HERO ---- */}
        <section className="relative bg-[#0a1628] pt-32 pb-24 overflow-hidden">
          {/* Decoración fondo */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="inline-block bg-cyan-500/20 text-cyan-400 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
                Gestión técnica de agua
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Tratamiento de agua con{" "}
                <span className="text-cyan-400">trazabilidad total</span> para
                cada proyecto
              </h1>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed max-w-2xl">
                SeaGroup ofrece soluciones integrales de tratamiento, monitoreo
                y gestión técnica del agua. Centralizamos toda la información de
                terreno en un portal profesional para nuestros clientes.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  Acceder al Portal
                  <ArrowRight size={16} />
                </Link>
                <a
                  href="#servicios"
                  className="inline-flex items-center gap-2 border border-white/20 text-white hover:bg-white/10 font-medium px-6 py-3 rounded-xl transition-colors"
                >
                  Ver Servicios
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ---- STATS ---- */}
        <section className="bg-[#0d1f3c] border-y border-white/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl font-bold text-cyan-400 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- SERVICIOS ---- */}
        <section id="servicios" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-3">
                Nuestros Servicios
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                Soluciones técnicas especializadas para el tratamiento,
                monitoreo y reportabilidad del agua en proyectos industriales y
                agrícolas.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, i) => (
                <div
                  key={i}
                  className="bg-slate-50 rounded-xl p-6 border border-slate-100 hover:border-cyan-200 hover:bg-cyan-50/30 transition-all"
                >
                  <div className="bg-white rounded-lg w-12 h-12 flex items-center justify-center shadow-sm mb-4">
                    {service.icon}
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- NOSOTROS ---- */}
        <section id="nosotros" className="py-20 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-cyan-600 text-xs font-semibold uppercase tracking-widest">
                  Acerca de SeaGroup
                </span>
                <h2 className="text-3xl font-bold text-slate-800 mt-2 mb-4">
                  Ingeniería aplicada al tratamiento del agua
                </h2>
                <p className="text-slate-500 leading-relaxed mb-6">
                  Somos una empresa especializada en soluciones de tratamiento
                  de agua para la industria minera, agrícola e industrial.
                  Combinamos experiencia en terreno con herramientas digitales
                  para ofrecer a nuestros clientes trazabilidad completa de cada
                  proyecto.
                </p>
                <ul className="space-y-3">
                  {[
                    "Visitas técnicas periódicas con registro digital",
                    "Monitoreo de parámetros fisicoquímicos en tiempo real",
                    "Informes técnicos detallados y documentados",
                    "Portal exclusivo para seguimiento de proyectos",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle
                        size={16}
                        className="text-cyan-500 mt-0.5 flex-shrink-0"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#0a1628] rounded-2xl p-8 text-white">
                <h3 className="font-semibold text-lg mb-4 text-cyan-400">
                  Portal de Seguimiento
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Nuestros clientes acceden a un portal privado donde pueden
                  visualizar el estado actualizado de su proyecto: parámetros
                  del agua, historial de visitas, gráficas de evolución y
                  reportes técnicos.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  Acceder al Portal
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ---- CONTACTO ---- */}
        <section id="contacto" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-800 mb-3">
                Contacto
              </h2>
              <p className="text-slate-500">
                ¿Tienes un proyecto de tratamiento de agua? Conversemos.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="bg-cyan-50 rounded-full p-3">
                  <Mail size={20} className="text-cyan-600" />
                </div>
                <span className="text-sm text-slate-600">contacto@seagroup.cl</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="bg-cyan-50 rounded-full p-3">
                  <Phone size={20} className="text-cyan-600" />
                </div>
                <span className="text-sm text-slate-600">+56 9 0000 0000</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="bg-cyan-50 rounded-full p-3">
                  <MapPin size={20} className="text-cyan-600" />
                </div>
                <span className="text-sm text-slate-600">Chile</span>
              </div>
            </div>
          </div>
        </section>

        {/* ---- FOOTER ---- */}
        <footer className="bg-[#0a1628] text-slate-400 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-cyan-500 rounded-lg p-1">
                <Droplets size={14} className="text-white" />
              </div>
              <span className="text-white font-semibold text-sm">SeaGroup</span>
            </div>
            <p className="text-xs text-center">
              © {new Date().getFullYear()} SeaGroup. Todos los derechos
              reservados.
            </p>
            <Link
              href="/login"
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Portal Clientes →
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
}
