# MicroTech — KinePro

Scaffolding inicial para el proyecto **KinePro** (gestión de turnos del
centro kinesiológico KinePro) — equipo **MicroTech**, Ingeniería de
Software II, UNLP 2026.

> Este repo es **sólo el punto de partida**: una API NestJS vacía y un
> Next.js vacío conectados entre sí, sin lógica de negocio ni base de
> datos. La idea es que el equipo decida qué stack de persistencia y
> qué módulos sumar a medida que se implementan las HU.

## Stack

| Capa | Tecnología |
|------|------------|
| Backend | NestJS 10 + TypeScript |
| Frontend | Next.js 14 (App Router) + TailwindCSS |
| Tests | Jest |

Monorepo con npm workspaces (`apps/api` + `apps/web`).

## Requisitos

- **Node.js 20** o superior
- **npm 10** (viene con Node 20)
- Git

## Cómo arrancar

```bash
# 1) Clonar
git clone https://github.com/<organizacion>/MicroTech-KinePro.git
cd MicroTech-KinePro

# 2) Instalar dependencias (las dos apps)
npm install --workspaces

# 3) Configurar variables de entorno
#    Linux/Mac
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local
#    Windows (PowerShell o cmd)
copy apps\api\.env.example apps\api\.env
copy apps\web\.env.local.example apps\web\.env.local
```

### Levantar los servidores

En **dos terminales** distintas, ambas paradas en la raíz del repo:

```bash
# Terminal 1 - Backend NestJS
npm run dev:api      # http://localhost:4000/api

# Terminal 2 - Frontend Next.js
npm run dev:web      # http://localhost:3000
```

Al abrir `http://localhost:3000`, la landing consulta el endpoint
`GET /api/health` del backend y muestra **"OK ✅"** si todo levantó.

## Estructura

```
MicroTech-KinePro/
├── apps/
│   ├── api/                         # Backend NestJS
│   │   └── src/
│   │       ├── main.ts              # Bootstrap (CORS, ValidationPipe, prefix /api)
│   │       ├── app.module.ts        # Módulo raíz
│   │       └── health/              # GET /api/health (sanity check)
│   └── web/                         # Frontend Next.js
│       ├── tailwind.config.ts       # Paleta KinePro (azul/verde)
│       └── src/app/
│           ├── globals.css
│           ├── layout.tsx
│           └── page.tsx             # Landing con verificador de health
├── docs/
│   └── arquitectura.md
├── package.json                     # Workspaces + scripts globales
└── README.md
```

> Nota: la carpeta `apps/api/prisma/` y `apps/api/src/prisma/` quedan
> como **placeholder** vacío del scaffolding inicial. Si el equipo
> decide usar Prisma, ahí van los archivos. Si no, simplemente borren
> esas carpetas.

## Scripts (desde la raíz)

| Comando | Qué hace |
|---------|----------|
| `npm run dev:api` | Levanta el backend con watch (`nest start --watch`) |
| `npm run dev:web` | Levanta el frontend Next.js en modo dev |
| `npm run build:api` | Compila el backend a `apps/api/dist` |
| `npm run build:web` | Build de producción del frontend |

## Convenciones sugeridas

- **Branching**: `main` siempre verde. Feature branches con prefijo
  `feature/<#hu>-<slug>`, bugfix con `fix/<slug>`.
- **Commits**: usar prefijos tipo Conventional Commits
  (`feat:`, `fix:`, `docs:`, `refactor:`, …).
- **PR**: cada PR linkea la HU de Taiga y referencia el escenario que
  cubre. Incluir capturas si toca UI.
- **Tipado estricto**: `strict: true` en TS. No usar `any`.
- **Validación de DTOs**: usar `class-validator` (los DTOs viven en
  `<modulo>/<modulo>.dto.ts`).
- **Mensajes de error**: el texto debe coincidir **exacto** con el
  criterio de aceptación de la HU (incluyendo tildes).

## Próximos pasos

Cada miembro toma una épica en Taiga y arma el módulo correspondiente
siguiendo la estructura típica de NestJS:

```
apps/api/src/<modulo>/
├── <modulo>.module.ts
├── <modulo>.controller.ts
├── <modulo>.service.ts
└── <modulo>.dto.ts
```

Y cada pantalla en `apps/web/src/app/<ruta>/page.tsx`.

## Equipo

MicroTech · Cátedra Ingeniería de Software II · Facultad de Informática
· Universidad Nacional de La Plata.
