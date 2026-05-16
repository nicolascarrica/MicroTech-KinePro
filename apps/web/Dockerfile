# Etapa 1: Construcción (Builder)
FROM node:20-alpine AS builder
WORKDIR /app

# Copiamos dependencias
COPY package*.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/

RUN npm install

# Copiamos el código y compilamos Next.js
COPY . .
RUN npm run build:web

# Etapa 2: Producción (Runner)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copiamos dependencias de producción
COPY package*.json ./
COPY apps/web/package.json ./apps/web/
RUN npm install --omit=dev

# Copiamos los archivos estáticos y el build de Next
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000

# Arrancamos Next.js usando el workspace
CMD ["npm", "run", "start", "--workspace=apps/web"]