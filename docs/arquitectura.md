# Arquitectura — KinePro (v0.1)

## Vista general

```
        ┌────────────────────┐       HTTP / JSON       ┌──────────────────────┐
        │  Next.js (web)     │  ──────────────────▶    │   NestJS (api)       │
        │  - App Router      │                          │   /api/health        │
        │  - Tailwind CSS    │ ◀──────────────────     │   /api/<modulos>     │
        └────────────────────┘                          └──────────────────────┘
                                                                   │
                                                                   ▼
                                                           ┌──────────────┐
                                                           │ Persistencia │
                                                           │  (a definir) │
                                                           └──────────────┘
```

## Decisiones tomadas

- **Monorepo con npm workspaces**: front y back juntos en el mismo
  repo para versionar contratos (DTOs, tipos) con un solo `git pull`.
- **NestJS** para el back: arquitectura modular, inyección de
  dependencias, ValidationPipe global y `class-validator`.
- **Next.js 14 App Router** para el front: cada ruta es una carpeta
  con `page.tsx`.
- **TailwindCSS** con la paleta KinePro extendida en `tailwind.config.ts`.

## Decisiones pendientes (a tomar entre todos)

- ORM y motor de base de datos (Prisma + SQLite/Postgres / TypeORM / Sequelize / …).
- Autenticación (JWT, sessions, cookies …).
- CI/CD (GitHub Actions, GitLab CI …).
- Deploy (Vercel, Railway, Render, server propio …).

## Convención de módulos (back)

```
apps/api/src/<modulo>/
├── <modulo>.module.ts        # @Module(...)
├── <modulo>.controller.ts    # endpoints REST
├── <modulo>.service.ts       # lógica de negocio
└── <modulo>.dto.ts           # DTOs con class-validator
```

## Convención de pantallas (front)

```
apps/web/src/app/<ruta>/page.tsx
apps/web/src/components/<Componente>.tsx
apps/web/src/lib/api.ts        # wrapper de fetch
```

## Roles del sistema

| Rol | Permisos |
|-----|----------|
| `PACIENTE` | Reservar / cancelar / reprogramar sus turnos, ver sus pagos |
| `ADMINISTRATIVO` | ABM de actividades y turnos, registrar pagos presenciales |
| `OWNER` | Todo lo anterior + reportes + configuración global |
