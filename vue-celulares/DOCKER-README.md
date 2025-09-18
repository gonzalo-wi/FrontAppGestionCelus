# 🐳 Despliegue con Docker

Guía completa para desplegar la aplicación Vue Celulares usando Docker.

## 🚀 Despliegue Rápido

### Opción 1: Script Automatizado (Recomendado)
```bash
# Ejecutar el script de despliegue
./deploy.sh

# O especificar IP del servidor
./deploy.sh 192.168.0.250
```

### Opción 2: Comandos Manuales
```bash
# Construir y levantar
docker-compose up --build -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

## 📋 Requisitos

- Docker >= 20.10
- Docker Compose >= 2.0
- Puerto 5173 disponible

## 🔧 Configuración

### Variables de Entorno
El archivo `docker-compose.yml` incluye:
- `NODE_ENV=production`
- Puerto mapeado: `5173:80`

### Personalización de Puerto
Para cambiar el puerto, edita `docker-compose.yml`:
```yaml
ports:
  - "TU_PUERTO:80"  # Cambia TU_PUERTO
```

## 🏗️ Arquitectura

### Multi-Stage Build
1. **Stage 1 (build-stage)**: Node.js para build de Vue.js
2. **Stage 2 (production-stage)**: Nginx para servir archivos estáticos

### Optimizaciones Incluidas
- ✅ Nginx con compresión gzip
- ✅ Cache de archivos estáticos
- ✅ Headers de seguridad
- ✅ Support para Vue Router (History mode)
- ✅ Health check endpoint
- ✅ Imagen optimizada con Alpine Linux

## 🔍 Monitoreo

### Verificar Estado
```bash
# Estado del contenedor
docker-compose ps

# Logs en tiempo real
docker-compose logs -f vue-celulares-app

# Uso de recursos
docker stats vue-celulares-frontend

# Health check
curl http://192.168.0.250:5173/health
```

### Troubleshooting
```bash
# Reiniciar servicio
docker-compose restart

# Rebuild completo
docker-compose down
docker-compose up --build -d

# Limpiar todo y empezar de nuevo
docker-compose down --volumes --remove-orphans
docker system prune -f
./deploy.sh
```

## 📊 URLs Importantes

- **Aplicación**: http://192.168.0.250:5173
- **Health Check**: http://192.168.0.250:5173/health

## 🔐 Seguridad

La configuración incluye headers de seguridad:
- X-Frame-Options
- X-XSS-Protection  
- X-Content-Type-Options
- Content-Security-Policy

## 📦 Archivos Incluidos

- `Dockerfile` - Imagen multi-stage optimizada
- `docker-compose.yml` - Orchestración del servicio
- `nginx.conf` - Configuración Nginx para SPA
- `.dockerignore` - Exclusiones para build
- `deploy.sh` - Script de despliegue automatizado

## 🚨 Notas Importantes

1. **Puerto 5173**: Asegúrate que esté disponible en tu servidor
2. **Firewall**: Abre el puerto 5173 si usas firewall
3. **DNS**: Configura DNS si necesitas usar dominio
4. **SSL**: Para HTTPS, usa reverse proxy (nginx/traefik)

## ⚡ Comandos Útiles

```bash
# Ver tamaño de imagen
docker images vue-celulares-frontend

# Inspeccionar contenedor
docker inspect vue-celulares-frontend

# Ejecutar comando dentro del contenedor
docker exec -it vue-celulares-frontend sh

# Backup del contenedor (si fuera necesario)
docker commit vue-celulares-frontend vue-celulares-backup
```