// ============================================================
// COMPONENTES UI REUTILIZABLES - SeaGroup Portal
// ============================================================

import React from "react";

// ------------------------------------------------------------
// Card
// ------------------------------------------------------------
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: CardProps) {
  return (
    <div className={`px-6 py-4 border-b border-slate-100 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }: CardProps) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

// ------------------------------------------------------------
// Badge
// ------------------------------------------------------------
interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  className?: string;
}

const badgeVariants = {
  default: "bg-slate-100 text-slate-800",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  error: "bg-red-100 text-red-800",
  info: "bg-cyan-100 text-cyan-800",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeVariants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

// ------------------------------------------------------------
// StatCard
// ------------------------------------------------------------
interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  description?: string;
  color?: "blue" | "cyan" | "green" | "amber" | "slate";
}

const statColors = {
  blue: "bg-blue-50 text-blue-600 border-blue-100",
  cyan: "bg-cyan-50 text-cyan-600 border-cyan-100",
  green: "bg-emerald-50 text-emerald-600 border-emerald-100",
  amber: "bg-amber-50 text-amber-600 border-amber-100",
  slate: "bg-slate-50 text-slate-600 border-slate-100",
};

export function StatCard({
  title,
  value,
  unit,
  icon,
  description,
  color = "cyan",
}: StatCardProps) {
  return (
    <Card className={`border ${statColors[color]}`}>
      <CardContent className="py-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
              {title}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-800">{value}</span>
              {unit && (
                <span className="text-sm text-slate-500 font-medium">{unit}</span>
              )}
            </div>
            {description && (
              <p className="text-xs text-slate-400 mt-1">{description}</p>
            )}
          </div>
          {icon && (
            <div className={`p-2 rounded-lg ${statColors[color]}`}>{icon}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ------------------------------------------------------------
// SectionTitle
// ------------------------------------------------------------
interface SectionTitleProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function SectionTitle({ title, subtitle, action }: SectionTitleProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ------------------------------------------------------------
// EmptyState
// ------------------------------------------------------------
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="text-slate-300 mb-3">{icon}</div>}
      <p className="text-sm font-medium text-slate-500">{title}</p>
      {description && (
        <p className="text-xs text-slate-400 mt-1 max-w-xs">{description}</p>
      )}
    </div>
  );
}

// ------------------------------------------------------------
// LoadingSpinner
// ------------------------------------------------------------
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
