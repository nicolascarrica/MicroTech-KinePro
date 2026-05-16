# Etapa 1: Construcción (Builder)
FROM node:20-alpine AS builder
WORKDIR /app

# Copiamos los package.json (root y de los workspaces)
COPY package*.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/

# Instalamos todas las dependencias
RUN npm install

# Copiamos el resto del código y compilamos la API
COPY . .
RUN npm run build:api

# Etapa 2: Producción (Runner)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copiamos dependencias y archivos necesarios del builder
COPY package*.json ./
COPY apps/api/package.json ./apps/api/
RUN npm install --omit=dev

# Copiamos el build generado
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Exponemos el puerto del backend
EXPOSE 4000

# Arrancamos compilado directo con node (es más rápido en prod que usar npm)
CMD ["node", "apps/api/dist/main.js"]