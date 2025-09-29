# Dockerfile multi-stage para aplicación Vue.js
# Etapa 1: Build de la aplicación
FROM node:20-alpine AS build-stage

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies para el build)
# Usamos npm install en lugar de npm ci para tolerar cambios de package.json si el lockfile no está sincronizado
RUN npm install

# Copiar código fuente
COPY . .

# Build de producción
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:stable-alpine AS production-stage

# Copiar archivos built desde la etapa anterior
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 5173

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]