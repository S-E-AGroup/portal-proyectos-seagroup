// ============================================================
// DETALLE DE PROYECTO - Panel Admin con CRUD completo
// ============================================================
import { useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Trash2, Calendar, FlaskConical, Droplets, Wrench, Activity } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, SectionTitle, StatCard } from "@/components/ui";
import Modal from "@/components/ui/Modal";
import { FlowChart, PhChart, MultiParamChart } from "@/components/charts/WaterCharts";
import { Project, Visit, WaterParameters, Sample, Equipment } from "@/types";
import { requireAdmin, formatDate, formatDateShort, getStatusColor, getEquipmentStatusColor, getEquipmentStatusLabel, getWaterTypeLabel } from "@/lib/auth";
import { getProjectById } from "@/lib/mock/store";

interface Props { project: Project; }

const inputClass = "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors";
const labelClass = "block text-xs font-medium text-slate-600 mb-1";

export default function ProjectDetail({ project: initial }: Props) {
  const [project, setProject] = useState<Project>(initial);
  const [modal, setModal] = useState<string | null>(null);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const closeModal = () => { setModal(null); setEditing(null); setError(""); };

  const refetch = async () => {
    const res = await fetch(`/api/admin/proyectos/${project.id}`);
    if (res.ok) { const data = await res.json(); setProject(data.project); }
  };

  // --- VISITAS ---
  const [visitForm, setVisitForm] = useState({ date: "", responsible: "", technicalComments: "", actionsPerformed: "", recommendations: "" });

  const openVisitModal = (v?: Visit) => {
    setEditing(v || null);
    setVisitForm(v ? { date: v.date, responsible: v.responsible, technicalComments: v.technicalComments, actionsPerformed: v.actionsPerformed, recommendations: v.recommendations || "" } : { date: "", responsible: "", technicalComments: "", actionsPerformed: "", recommendations: "" });
    setModal("visita");
  };

  const saveVisit = async () => {
    setLoading(true); setError("");
    const method = editing ? "PUT" : "POST";
    const body = editing ? { visitId: editing.id, ...visitForm } : visitForm;
    const res = await fetch(`/api/admin/proyectos/${project.id}/visitas`, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    if (editing) { setProject(p => ({ ...p, visits: p.visits.map(v => v.id === editing.id ? data.visit : v) })); }
    else { setProject(p => ({ ...p, visits: [...p.visits, data.visit] })); }
    setLoading(false); closeModal();
  };

  const deleteVisit = async (visitId: string) => {
    if (!confirm("¿Eliminar esta visita?")) return;
    await fetch(`/api/admin/proyectos/${project.id}/visitas`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ visitId }) });
    setProject(p => ({ ...p, visits: p.visits.filter(v => v.id !== visitId) }));
  };

  // --- PARÁMETROS ---
  const [paramForm, setParamForm] = useState({ date: "", ph: "", temperature: "", turbidity: "", conductivity: "", suspendedSolids: "", flowInstant: "", flowAccumulated: "", physicalCharacteristics: "", observations: "" });

  const openParamModal = (w?: WaterParameters) => {
    setEditing(w || null);
    setParamForm(w ? { date: w.date, ph: w.ph?.toString() || "", temperature: w.temperature?.toString() || "", turbidity: w.turbidity?.toString() || "", conductivity: w.conductivity?.toString() || "", suspendedSolids: w.suspendedSolids?.toString() || "", flowInstant: w.flowInstant?.toString() || "", flowAccumulated: w.flowAccumulated?.toString() || "", physicalCharacteristics: w.physicalCharacteristics || "", observations: w.observations || "" } : { date: "", ph: "", temperature: "", turbidity: "", conductivity: "", suspendedSolids: "", flowInstant: "", flowAccumulated: "", physicalCharacteristics: "", observations: "" });
    setModal("parametro");
  };

  const saveParam = async () => {
    setLoading(true); setError("");
    const method = editing ? "PUT" : "POST";
    const body = editing ? { paramId: editing.id, ...paramForm } : paramForm;
    const res = await fetch(`/api/admin/proyectos/${project.id}/parametros`, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    if (editing) { setProject(p => ({ ...p, parameters: p.parameters.map(w => w.id === editing.id ? data.param : w) })); }
    else { setProject(p => ({ ...p, parameters: [...p.parameters, data.param] })); }
    setLoading(false); closeModal();
  };

  const deleteParam = async (paramId: string) => {
    if (!confirm("¿Eliminar este registro?")) return;
    await fetch(`/api/admin/proyectos/${project.id}/parametros`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paramId }) });
    setProject(p => ({ ...p, parameters: p.parameters.filter(w => w.id !== paramId) }));
  };

  // --- MUESTRAS ---
  const [sampleForm, setSampleForm] = useState({ date: "", responsible: "", results: "", observations: "" });

  const openSampleModal = (s?: Sample) => {
    setEditing(s || null);
    setSampleForm(s ? { date: s.date, responsible: s.responsible, results: s.results, observations: s.observations || "" } : { date: "", responsible: "", results: "", observations: "" });
    setModal("muestra");
  };

  const saveSample = async () => {
    setLoading(true); setError("");
    const method = editing ? "PUT" : "POST";
    const body = editing ? { sampleId: editing.id, ...sampleForm } : sampleForm;
    const res = await fetch(`/api/admin/proyectos/${project.id}/muestras`, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    if (editing) { setProject(p => ({ ...p, samples: p.samples.map(s => s.id === editing.id ? data.sample : s) })); }
    else { setProject(p => ({ ...p, samples: [...p.samples, data.sample] })); }
    setLoading(false); closeModal();
  };

  const deleteSample = async (sampleId: string) => {
    if (!confirm("¿Eliminar esta muestra?")) return;
    await fetch(`/api/admin/proyectos/${project.id}/muestras`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sampleId }) });
    setProject(p => ({ ...p, samples: p.samples.filter(s => s.id !== sampleId) }));
  };

  // --- EQUIPOS ---
  const [eqForm, setEqForm] = useState({ name: "", type: "", status: "operativo", lastMaintenanceDate: "", observations: "" });

  const openEqModal = (e?: Equipment) => {
    setEditing(e || null);
    setEqForm(e ? { name: e.name, type: e.type, status: e.status, lastMaintenanceDate: e.lastMaintenanceDate || "", observations: e.observations || "" } : { name: "", type: "", status: "operativo", lastMaintenanceDate: "", observations: "" });
    setModal("equipo");
  };

  const saveEq = async () => {
    setLoading(true); setError("");
    const method = editing ? "PUT" : "POST";
    const body = editing ? { eqId: editing.id, ...eqForm } : eqForm;
    const res = await fetch(`/api/admin/proyectos/${project.id}/equipos`, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    if (editing) { setProject(p => ({ ...p, equipment: p.equipment.map(e => e.id === editing.id ? data.equipment : e) })); }
    else { setProject(p => ({ ...p, equipment: [...p.equipment, data.equipment] })); }
    setLoading(false); closeModal();
  };

  const deleteEq = async (eqId: string) => {
    if (!confirm("¿Eliminar este equipo?")) return;
    await fetch(`/api/admin/proyectos/${project.id}/equipos`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ eqId }) });
    setProject(p => ({ ...p, equipment: p.equipment.filter(e => e.id !== eqId) }));
  };

  const lastParams = project.parameters[project.parameters.length - 1];

  return (
    <>
      <Head><title>{project.name} — SeaGroup Admin</title></Head>
      <DashboardLayout>
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-5 transition-colors">
          <ArrowLeft size={15} /> Volver al panel
        </Link>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">{project.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span>{project.clientName}</span>
              <span>·</span><span>{project.location}</span>
              <span>·</span><span>{formatDate(project.startDate)}</span>
              <span>·</span><span>{getWaterTypeLabel(project.waterType)}</span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(project.status)}`}>{project.status}</span>
        </div>

        {project.description && (
          <Card className="mb-6"><CardContent className="py-4"><p className="text-sm text-slate-600">{project.description}</p>{project.waterObservations && <p className="text-xs text-slate-400 mt-1 italic">{project.waterObservations}</p>}</CardContent></Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="pH Actual" value={lastParams?.ph ?? "—"} icon={<Droplets size={18} />} color="cyan" />
          <StatCard title="Caudal Acumulado" value={lastParams?.flowAccumulated ?? "—"} unit="m³" icon={<Activity size={18} />} color="blue" />
          <StatCard title="Visitas" value={project.visits.length} icon={<Calendar size={18} />} color="green" />
          <StatCard title="Muestras" value={project.samples.length} icon={<FlaskConical size={18} />} color="amber" />
        </div>

        {/* Gráficas */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card><CardHeader><SectionTitle title="Caudal Acumulado (m³)" /></CardHeader><CardContent><FlowChart parameters={project.parameters} /></CardContent></Card>
          <Card><CardHeader><SectionTitle title="pH en el Tiempo" /></CardHeader><CardContent><PhChart parameters={project.parameters} /></CardContent></Card>
        </div>

        {/* ---- PARÁMETROS ---- */}
        <Card className="mb-6">
          <CardHeader>
            <SectionTitle title="Registros de Parámetros" subtitle={`${project.parameters.length} registros`}
              action={<button onClick={() => openParamModal()} className="inline-flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-800 font-medium"><Plus size={13} /> Agregar</button>} />
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-100">{["Fecha","pH","Temp (°C)","Turbidez","Conductividad","Caudal Ac.","Observaciones",""].map(h => <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-2 whitespace-nowrap">{h}</th>)}</tr></thead>
              <tbody>
                {project.parameters.slice().reverse().map(p => (
                  <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-4 py-2.5 whitespace-nowrap text-slate-700">{formatDateShort(p.date)}</td>
                    <td className="px-4 py-2.5 text-slate-700">{p.ph ?? "—"}</td>
                    <td className="px-4 py-2.5 text-slate-700">{p.temperature ?? "—"}</td>
                    <td className="px-4 py-2.5 text-slate-700">{p.turbidity ?? "—"}</td>
                    <td className="px-4 py-2.5 text-slate-700">{p.conductivity ?? "—"}</td>
                    <td className="px-4 py-2.5 text-slate-700">{p.flowAccumulated ?? "—"} m³</td>
                    <td className="px-4 py-2.5 text-slate-500 text-xs max-w-xs truncate">{p.observations ?? "—"}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openParamModal(p)} className="text-slate-400 hover:text-cyan-600 transition-colors"><Pencil size={13} /></button>
                        <button onClick={() => deleteParam(p.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {project.parameters.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-400">Sin registros aún</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>

        {/* ---- VISITAS ---- */}
        <Card className="mb-6">
          <CardHeader>
            <SectionTitle title="Visitas a Terreno" subtitle={`${project.visits.length} visitas`}
              action={<button onClick={() => openVisitModal()} className="inline-flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-800 font-medium"><Plus size={13} /> Agregar</button>} />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {project.visits.slice().reverse().map(v => (
                <div key={v.id} className="border border-slate-100 rounded-lg p-4 hover:border-slate-200 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-800">{formatDate(v.date)}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500">{v.responsible}</span>
                      <button onClick={() => openVisitModal(v)} className="text-slate-400 hover:text-cyan-600 transition-colors"><Pencil size={13} /></button>
                      <button onClick={() => deleteVisit(v.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div><p className="text-xs font-medium text-slate-400 mb-0.5">Comentarios técnicos</p><p className="text-xs text-slate-600">{v.technicalComments}</p></div>
                    <div><p className="text-xs font-medium text-slate-400 mb-0.5">Acciones realizadas</p><p className="text-xs text-slate-600">{v.actionsPerformed}</p></div>
                    {v.recommendations && <div><p className="text-xs font-medium text-slate-400 mb-0.5">Recomendaciones</p><p className="text-xs text-cyan-600">{v.recommendations}</p></div>}
                  </div>
                </div>
              ))}
              {project.visits.length === 0 && <p className="text-center text-sm text-slate-400 py-6">Sin visitas registradas</p>}
            </div>
          </CardContent>
        </Card>

        {/* ---- MUESTRAS ---- */}
        <Card className="mb-6">
          <CardHeader>
            <SectionTitle title="Toma de Muestras" subtitle={`${project.samples.length} muestras`}
              action={<button onClick={() => openSampleModal()} className="inline-flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-800 font-medium"><Plus size={13} /> Agregar</button>} />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {project.samples.slice().reverse().map(s => (
                <div key={s.id} className="border border-slate-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-800">{formatDate(s.date)}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500">{s.responsible}</span>
                      <button onClick={() => openSampleModal(s)} className="text-slate-400 hover:text-cyan-600 transition-colors"><Pencil size={13} /></button>
                      <button onClick={() => deleteSample(s.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mb-1"><span className="font-medium">Resultados:</span> {s.results}</p>
                  {s.observations && <p className="text-xs text-slate-400 italic">{s.observations}</p>}
                </div>
              ))}
              {project.samples.length === 0 && <p className="text-center text-sm text-slate-400 py-6">Sin muestras registradas</p>}
            </div>
          </CardContent>
        </Card>

        {/* ---- EQUIPOS ---- */}
        <Card>
          <CardHeader>
            <SectionTitle title="Equipos y Filtros" subtitle={`${project.equipment.length} equipos`}
              action={<button onClick={() => openEqModal()} className="inline-flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-800 font-medium"><Plus size={13} /> Agregar</button>} />
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {project.equipment.map(eq => (
                <div key={eq.id} className="border border-slate-100 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium text-slate-800">{eq.name}</p>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openEqModal(eq)} className="text-slate-400 hover:text-cyan-600 transition-colors"><Pencil size={13} /></button>
                      <button onClick={() => deleteEq(eq.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getEquipmentStatusColor(eq.status)}`}>{getEquipmentStatusLabel(eq.status)}</span>
                  <p className="text-xs text-slate-500 capitalize mt-2">Tipo: {eq.type}</p>
                  {eq.lastMaintenanceDate && <p className="text-xs text-slate-400">Mantención: {formatDateShort(eq.lastMaintenanceDate)}</p>}
                  {eq.observations && <p className="text-xs text-slate-400 mt-1 italic">{eq.observations}</p>}
                </div>
              ))}
              {project.equipment.length === 0 && <p className="text-sm text-slate-400 py-4">Sin equipos registrados</p>}
            </div>
          </CardContent>
        </Card>

        {/* ---- MODALS ---- */}

        {/* Modal Visita */}
        {modal === "visita" && (
          <Modal title={editing ? "Editar Visita" : "Nueva Visita"} onClose={closeModal}>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>Fecha</label><input type="date" className={inputClass} value={visitForm.date} onChange={e => setVisitForm(f => ({...f, date: e.target.value}))} /></div>
                <div><label className={labelClass}>Responsable</label><input type="text" className={inputClass} placeholder="Ing. Nombre" value={visitForm.responsible} onChange={e => setVisitForm(f => ({...f, responsible: e.target.value}))} /></div>
              </div>
              <div><label className={labelClass}>Comentarios técnicos</label><textarea rows={2} className={inputClass + " resize-none"} value={visitForm.technicalComments} onChange={e => setVisitForm(f => ({...f, technicalComments: e.target.value}))} /></div>
              <div><label className={labelClass}>Acciones realizadas</label><textarea rows={2} className={inputClass + " resize-none"} value={visitForm.actionsPerformed} onChange={e => setVisitForm(f => ({...f, actionsPerformed: e.target.value}))} /></div>
              <div><label className={labelClass}>Recomendaciones <span className="text-slate-400 font-normal">(opcional)</span></label><textarea rows={2} className={inputClass + " resize-none"} value={visitForm.recommendations} onChange={e => setVisitForm(f => ({...f, recommendations: e.target.value}))} /></div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div className="flex gap-2 pt-1">
                <button onClick={saveVisit} disabled={loading} className="flex-1 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 text-white text-sm font-medium py-2 rounded-lg transition-colors">{loading ? "Guardando..." : "Guardar"}</button>
                <button onClick={closeModal} className="px-4 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors">Cancelar</button>
              </div>
            </div>
          </Modal>
        )}

        {/* Modal Parámetro */}
        {modal === "parametro" && (
          <Modal title={editing ? "Editar Parámetro" : "Nuevo Registro de Parámetros"} onClose={closeModal}>
            <div className="space-y-3">
              <div><label className={labelClass}>Fecha</label><input type="date" className={inputClass} value={paramForm.date} onChange={e => setParamForm(f => ({...f, date: e.target.value}))} /></div>
              <div className="grid grid-cols-2 gap-3">
                {[["pH","ph"],["Temperatura (°C)","temperature"],["Turbidez (NTU)","turbidity"],["Conductividad (µS/cm)","conductivity"],["Sólidos Susp. (mg/L)","suspendedSolids"],["Caudal Instant. (m³/h)","flowInstant"],["Caudal Acum. (m³)","flowAccumulated"]].map(([label, key]) => (
                  <div key={key}><label className={labelClass}>{label}</label><input type="number" step="0.01" className={inputClass} value={(paramForm as any)[key]} onChange={e => setParamForm(f => ({...f, [key]: e.target.value}))} /></div>
                ))}
              </div>
              <div><label className={labelClass}>Características físicas</label><textarea rows={2} className={inputClass + " resize-none"} value={paramForm.physicalCharacteristics} onChange={e => setParamForm(f => ({...f, physicalCharacteristics: e.target.value}))} /></div>
              <div><label className={labelClass}>Observaciones</label><textarea rows={2} className={inputClass + " resize-none"} value={paramForm.observations} onChange={e => setParamForm(f => ({...f, observations: e.target.value}))} /></div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div className="flex gap-2 pt-1">
                <button onClick={saveParam} disabled={loading} className="flex-1 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 text-white text-sm font-medium py-2 rounded-lg transition-colors">{loading ? "Guardando..." : "Guardar"}</button>
                <button onClick={closeModal} className="px-4 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors">Cancelar</button>
              </div>
            </div>
          </Modal>
        )}

        {/* Modal Muestra */}
        {modal === "muestra" && (
          <Modal title={editing ? "Editar Muestra" : "Nueva Muestra"} onClose={closeModal}>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>Fecha</label><input type="date" className={inputClass} value={sampleForm.date} onChange={e => setSampleForm(f => ({...f, date: e.target.value}))} /></div>
                <div><label className={labelClass}>Responsable</label><input type="text" className={inputClass} placeholder="Ing. Nombre" value={sampleForm.responsible} onChange={e => setSampleForm(f => ({...f, responsible: e.target.value}))} /></div>
              </div>
              <div><label className={labelClass}>Resultados</label><textarea rows={3} className={inputClass + " resize-none"} placeholder="pH, turbidez, coliformes, etc." value={sampleForm.results} onChange={e => setSampleForm(f => ({...f, results: e.target.value}))} /></div>
              <div><label className={labelClass}>Observaciones <span className="text-slate-400 font-normal">(opcional)</span></label><textarea rows={2} className={inputClass + " resize-none"} value={sampleForm.observations} onChange={e => setSampleForm(f => ({...f, observations: e.target.value}))} /></div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div className="flex gap-2 pt-1">
                <button onClick={saveSample} disabled={loading} className="flex-1 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 text-white text-sm font-medium py-2 rounded-lg transition-colors">{loading ? "Guardando..." : "Guardar"}</button>
                <button onClick={closeModal} className="px-4 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors">Cancelar</button>
              </div>
            </div>
          </Modal>
        )}

        {/* Modal Equipo */}
        {modal === "equipo" && (
          <Modal title={editing ? "Editar Equipo" : "Nuevo Equipo"} onClose={closeModal}>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>Nombre</label><input type="text" className={inputClass} placeholder="Filtro de Arena" value={eqForm.name} onChange={e => setEqForm(f => ({...f, name: e.target.value}))} /></div>
                <div><label className={labelClass}>Tipo</label><input type="text" className={inputClass} placeholder="filtro, bomba, frile..." value={eqForm.type} onChange={e => setEqForm(f => ({...f, type: e.target.value}))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>Estado</label>
                  <select className={inputClass + " bg-white"} value={eqForm.status} onChange={e => setEqForm(f => ({...f, status: e.target.value as any}))}>
                    <option value="operativo">Operativo</option>
                    <option value="mantencion">En Mantención</option>
                    <option value="fuera_de_servicio">Fuera de Servicio</option>
                  </select>
                </div>
                <div><label className={labelClass}>Último mantenimiento</label><input type="date" className={inputClass} value={eqForm.lastMaintenanceDate} onChange={e => setEqForm(f => ({...f, lastMaintenanceDate: e.target.value}))} /></div>
              </div>
              <div><label className={labelClass}>Observaciones</label><textarea rows={2} className={inputClass + " resize-none"} value={eqForm.observations} onChange={e => setEqForm(f => ({...f, observations: e.target.value}))} /></div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div className="flex gap-2 pt-1">
                <button onClick={saveEq} disabled={loading} className="flex-1 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 text-white text-sm font-medium py-2 rounded-lg transition-colors">{loading ? "Guardando..." : "Guardar"}</button>
                <button onClick={closeModal} className="px-4 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors">Cancelar</button>
              </div>
            </div>
          </Modal>
        )}

      </DashboardLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const result = await requireAdmin(ctx);
  if ("redirect" in result) return result as { redirect: { destination: string; permanent: boolean } };
  const { id } = ctx.params as { id: string };
  const project = getProjectById(id);
  if (!project) return { notFound: true };
  return { props: { project: JSON.parse(JSON.stringify(project)) } };
};
