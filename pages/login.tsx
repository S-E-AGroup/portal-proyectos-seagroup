// ============================================================
// LOGIN PAGE - SeaGroup Portal
// ============================================================

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { Droplets, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Credenciales incorrectas. Verifica tu email y contraseña.");
      return;
    }

    // Redirigir según rol
    const session = await getSession();
    if (session?.user?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <>
      <Head>
        <title>Iniciar Sesión — SeaGroup Portal</title>
      </Head>

      <div className="min-h-screen bg-[#0a1628] flex flex-col">
        {/* Background decorativo */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-8">
            <div className="bg-cyan-500 rounded-xl p-2">
              <Droplets size={24} className="text-white" />
            </div>
            <span className="font-bold text-white text-xl tracking-wide">
              SeaGroup
            </span>
          </Link>

          {/* Card */}
          <div className="w-full max-w-sm bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-white mb-1">
                Bienvenido al Portal
              </h1>
              <p className="text-slate-400 text-sm">
                Ingresa tus credenciales para acceder a tu proyecto
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@email.cl"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 pr-10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
                  <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
              >
                {loading ? "Ingresando..." : "Iniciar Sesión"}
              </button>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-6 p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-xs text-slate-400 font-medium mb-2">
                Credenciales de demostración:
              </p>
              <p className="text-xs text-slate-400">
                Admin: <span className="text-cyan-400">admin@seagroup.cl</span> /{" "}
                <span className="text-cyan-400">admin123</span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Cliente: <span className="text-cyan-400">cliente@mineranorte.cl</span> /{" "}
                <span className="text-cyan-400">cliente123</span>
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="mt-6 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Volver al sitio web
          </Link>
        </div>
      </div>
    </>
  );
}

// Redirigir si ya está autenticado
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (session) {
    const dest =
      session.user?.role === "admin" ? "/admin" : "/dashboard";
    return { redirect: { destination: dest, permanent: false } };
  }
  return { props: {} };
};
