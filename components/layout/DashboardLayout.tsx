// ============================================================
// LAYOUT PRINCIPAL - Portal SeaGroup
// ============================================================

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  FolderOpen,
  LogOut,
  Menu,
  X,
  Droplets,
  Settings,
  ChevronRight,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function DashboardLayout({
  children,
  title,
}: DashboardLayoutProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = session?.user?.role === "admin";

  const adminNavItems = [
    {
      href: "/admin",
      label: "Panel Principal",
      icon: <LayoutDashboard size={18} />,
    },
    {
      href: "/admin/proyectos",
      label: "Proyectos",
      icon: <FolderOpen size={18} />,
    },
  ];

  const clientNavItems = [
    {
      href: "/dashboard",
      label: "Mi Proyecto",
      icon: <LayoutDashboard size={18} />,
    },
  ];

  const navItems = isAdmin ? adminNavItems : clientNavItems;

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-[#0a1628] text-white w-64 min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="bg-cyan-500 rounded-lg p-1.5">
          <Droplets size={20} className="text-white" />
        </div>
        <div>
          <span className="font-bold text-white text-sm tracking-wide">
            SeaGroup
          </span>
          <p className="text-xs text-slate-400">Portal de Proyectos</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = router.pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? "bg-cyan-600 text-white font-medium"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
              {active && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* User info + logout */}
      <div className="border-t border-white/10 px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-cyan-600 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
            {session?.user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">
              {session?.user?.name}
            </p>
            <p className="text-xs text-slate-400 capitalize">
              {isAdmin ? "Administrador" : "Cliente"}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-red-400 transition-colors w-full px-1 py-1"
        >
          <LogOut size={14} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar desktop */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-slate-500 hover:text-slate-700"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            {title && (
              <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:block">
              {session?.user?.email}
            </span>
            {isAdmin && (
              <span className="bg-cyan-100 text-cyan-800 text-xs px-2 py-0.5 rounded-full font-medium">
                Admin
              </span>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
