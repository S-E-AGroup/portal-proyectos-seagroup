# 🌊 Portal de Proyectos SeaGroup

Portal web para la gestión técnica y seguimiento de proyectos de tratamiento de agua. Permite a SeaGroup cargar información técnica de cada proyecto y a sus clientes visualizar el estado actualizado de su proyecto desde un dashboard privado.

---

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Configuración](#instalación-y-configuración)
- [Variables de Entorno](#variables-de-entorno)
- [Usuarios y Roles](#usuarios-y-roles)
- [Páginas y Vistas](#páginas-y-vistas)
- [Migración a Base de Datos Real](#migración-a-base-de-datos-real)
- [Deploy en Vercel](#deploy-en-vercel)
- [Estrategia de Ramas (Gitflow)](#estrategia-de-ramas-gitflow)

---

## Descripción

SeaGroup Portal centraliza toda la información técnica recopilada en terreno y la transforma en vistas claras, ordenadas y profesionales para cada cliente. El sistema maneja:

- **Administrador SeaGroup**: crea y gestiona proyectos, registra visitas, parámetros del agua, muestras y estado de equipos.
- **Cliente**: accede a su dashboard privado para revisar el estado de su proyecto, parámetros, gráficas, historial de visitas y equipos.

---

## Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **Next.js 15** (Pages Router) | Framework principal |
| **TypeScript** | Tipado estático |
| **Tailwind CSS** | Estilos |
| **NextAuth.js** | Autenticación con roles |
| **Recharts** | Gráficas de parámetros |
| **Lucide React** | Iconos |
| **Mock Data** | MVP inicial (reemplazable por Supabase/PostgreSQL) |

---

## Estructura del Proyecto

```
portal-proyectos-seagroup/
├── components/
│   ├── charts/          # Gráficas Recharts (caudal, pH, multi-parámetro)
│   ├── layout/          # DashboardLayout con sidebar y navbar
│   └── ui/              # Componentes reutilizables (Card, Badge, StatCard...)
├── lib/
│   ├── mock/
│   │   └── data.ts      # Datos mock del MVP
│   └── auth.ts          # Helpers de autenticación y utilidades
├── pages/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth].ts   # Configuración NextAuth
│   ├── admin/
│   │   ├── index.tsx              # Panel administrador
│   │   └── proyectos/
│   │       └── [id].tsx           # Detalle de proyecto (admin)
│   ├── _app.tsx                   # SessionProvider
│   ├── index.tsx                  # Landing page pública
│   ├── login.tsx                  # Página de login
│   └── dashboard.tsx              # Dashboard del cliente
├── types/
│   └── index.ts         # Tipos TypeScript del dominio
├── .env.example         # Plantilla de variables de entorno
└── README.md
```

---

## Instalación y Configuración

### Requisitos previos
- Node.js >= 18
- npm >= 9

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/seagroup/portal-proyectos-seagroup.git
cd portal-proyectos-seagroup

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores reales

# 4. Ejecutar en desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

---

## Variables de Entorno

Copiar `.env.example` como `.env.local` y completar:

| Variable | Descripción | Requerida |
|---|---|---|
| `NEXTAUTH_SECRET` | Clave secreta JWT (generar con `openssl rand -base64 32`) | ✅ Sí |
| `NEXTAUTH_URL` | URL base de la aplicación | ✅ Sí |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase | 🔜 Futuro |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima Supabase | 🔜 Futuro |
| `DATABASE_URL` | Conexión PostgreSQL directa | 🔜 Futuro |

> ⚠️ **Nunca subir `.env.local` al repositorio.** Está incluido en `.gitignore`.

---

## Usuarios y Roles

### MVP (Mock Data)

| Email | Contraseña | Rol | Proyecto |
|---|---|---|---|
| `admin@seagroup.cl` | `admin123` | Administrador | Todos |
| `cliente@mineranorte.cl` | `cliente123` | Cliente | Mina Cóndor |
| `cliente@agricoladelvalle.cl` | `cliente456` | Cliente | Agrícola Valle |

### Roles del sistema

- **`admin`**: Accede a `/admin` — ve y gestiona todos los proyectos.
- **`client`**: Accede a `/dashboard` — ve solo su proyecto asignado.

---

## Páginas y Vistas

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | Público | Landing page SeaGroup |
| `/login` | Público | Inicio de sesión |
| `/dashboard` | Cliente | Dashboard con estado del proyecto, gráficas, visitas, equipos |
| `/admin` | Admin | Panel con todos los proyectos |
| `/admin/proyectos/[id]` | Admin | Detalle completo de proyecto |

---

## Migración a Base de Datos Real

Los puntos de integración están marcados con comentarios `TODO` en el código.

### Pasos principales:

1. Crear proyecto en Supabase (o configurar PostgreSQL).
2. Crear tablas según los tipos en `types/index.ts`.
3. Reemplazar las funciones en `lib/mock/data.ts` por consultas reales.
4. Actualizar `pages/api/auth/[...nextauth].ts` para autenticar contra la BD.
5. Agregar hashing de contraseñas con `bcrypt`.
6. Configurar variables de entorno de Supabase.

---

## Deploy en Vercel

```bash
npm i -g vercel
vercel
```

Configurar en Vercel Dashboard → Settings → Environment Variables:
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (URL de producción)

---

## Estrategia de Ramas (Gitflow)

```
main          ← Producción estable
develop       ← Integración continua
feature/*     ← Nuevas funcionalidades
hotfix/*      ← Correcciones urgentes
```

---

## 📄 Licencia

MIT © SeaGroup
