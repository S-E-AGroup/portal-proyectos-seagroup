// ============================================================
// COMPONENTES DE GRÁFICAS - Recharts
// ============================================================

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { WaterParameters } from "@/types";
import { formatDateShort } from "@/lib/auth";

// ------------------------------------------------------------
// Tooltip personalizado
// ------------------------------------------------------------
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs">
        <p className="font-medium text-slate-700 mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }}>
            {entry.name}: <span className="font-semibold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ------------------------------------------------------------
// Gráfico de Caudal Acumulado
// ------------------------------------------------------------
interface FlowChartProps {
  parameters: WaterParameters[];
}

export function FlowChart({ parameters }: FlowChartProps) {
  const data = parameters
    .filter((p) => p.flowAccumulated !== undefined)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((p) => ({
      fecha: formatDateShort(p.date),
      "Caudal Acumulado (m³)": p.flowAccumulated,
      "Caudal Instantáneo (m³/h)": p.flowInstant,
    }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
        Sin datos de caudal disponibles
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="fecha"
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={{ stroke: "#e2e8f0" }}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="Caudal Acumulado (m³)"
          stroke="#0891b2"
          strokeWidth={2}
          fill="url(#flowGrad)"
          dot={{ r: 3, fill: "#0891b2" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ------------------------------------------------------------
// Gráfico de pH en el tiempo
// ------------------------------------------------------------
interface PhChartProps {
  parameters: WaterParameters[];
}

export function PhChart({ parameters }: PhChartProps) {
  const data = parameters
    .filter((p) => p.ph !== undefined)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((p) => ({
      fecha: formatDateShort(p.date),
      pH: p.ph,
    }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
        Sin datos de pH disponibles
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="fecha"
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={{ stroke: "#e2e8f0" }}
        />
        <YAxis
          domain={[5, 9]}
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        {/* Referencia visual rango neutro pH 6.5-8.5 */}
        <Line
          type="monotone"
          dataKey="pH"
          stroke="#10b981"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
          activeDot={{ r: 6, fill: "#10b981" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ------------------------------------------------------------
// Gráfico multi-parámetro (turbidez + conductividad)
// ------------------------------------------------------------
interface MultiParamChartProps {
  parameters: WaterParameters[];
}

export function MultiParamChart({ parameters }: MultiParamChartProps) {
  const data = parameters
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((p) => ({
      fecha: formatDateShort(p.date),
      "Turbidez (NTU)": p.turbidity,
      "Conductividad (µS/cm)": p.conductivity,
    }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
        Sin datos disponibles
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="fecha"
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={{ stroke: "#e2e8f0" }}
        />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="Turbidez (NTU)"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="Conductividad (µS/cm)"
          stroke="#6366f1"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
