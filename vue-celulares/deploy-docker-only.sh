#!/bin/bash

# Script de despliegue para Vue Celulares App (Solo Docker)
# Uso: ./deploy-docker-only.sh [servidor_ip]

set -e  # Exit on any error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
APP_NAME="vue-celulares-app"
DOCKER_IMAGE="vue-celulares-frontend"
CONTAINER_NAME="vue-celulares-container"
PORT="5173"
SERVER_IP="${1:-192.168.0.250}"

echo -e "${BLUE}🚀 Iniciando despliegue de Vue Celulares App (Solo Docker)${NC}"
echo -e "${BLUE}📡 Servidor destino: ${SERVER_IP}:${PORT}${NC}"

# Función para mostrar mensajes
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ] || [ ! -f "Dockerfile" ]; then
    log_error "Este script debe ejecutarse desde el directorio raíz del proyecto Vue.js"
    exit 1
fi

log_info "Verificando dependencias..."

# Verificar Docker
if ! command -v docker &> /dev/null; then
    log_error "Docker no está instalado"
    exit 1
fi

log_success "Docker encontrado"

# Detener y eliminar contenedor existente
log_info "Deteniendo contenedor existente..."
docker stop $CONTAINER_NAME 2>/dev/null || log_warning "No hay contenedor ejecutándose"
docker rm $CONTAINER_NAME 2>/dev/null || log_warning "No hay contenedor que eliminar"

# Limpiar imagen antigua
log_info "Limpiando imagen antigua..."
docker rmi $DOCKER_IMAGE 2>/dev/null || log_warning "No hay imagen antigua que limpiar"

# Build de la imagen
log_info "Construyendo imagen Docker..."
if docker build -t $DOCKER_IMAGE . --no-cache; then
    log_success "Imagen construida exitosamente"
else
    log_error "Error al construir la imagen"
    exit 1
fi

# Ejecutar el contenedor
log_info "Iniciando contenedor..."
if docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT:80 \
    --restart unless-stopped \
    -e NODE_ENV=production \
    $DOCKER_IMAGE; then
    log_success "Contenedor iniciado exitosamente"
else
    log_error "Error al iniciar el contenedor"
    exit 1
fi

# Esperar a que el servicio esté listo
log_info "Esperando a que el servicio esté disponible..."
sleep 5

# Verificar que el servicio está funcionando
if curl -f -s "http://localhost:${PORT}/health" > /dev/null; then
    log_success "Servicio respondiendo correctamente en puerto ${PORT}"
else
    log_warning "No se pudo verificar el health check, pero el contenedor está ejecutándose"
fi

# Mostrar información final
echo ""
echo -e "${GREEN}🎉 ¡Despliegue completado exitosamente!${NC}"
echo ""
echo -e "${BLUE}📋 Información del despliegue:${NC}"
echo -e "   🌐 URL: http://${SERVER_IP}:${PORT}"
echo -e "   🐳 Contenedor: ${CONTAINER_NAME}"
echo -e "   📊 Estado: $(docker ps --filter name=${CONTAINER_NAME} --format "table {{.Status}}" | tail -n +2)"
echo ""
echo -e "${BLUE}📋 Comandos útiles:${NC}"
echo -e "   📊 Ver logs: ${YELLOW}docker logs -f ${CONTAINER_NAME}${NC}"
echo -e "   🔄 Reiniciar: ${YELLOW}docker restart ${CONTAINER_NAME}${NC}"
echo -e "   🛑 Detener: ${YELLOW}docker stop ${CONTAINER_NAME}${NC}"
echo -e "   📈 Monitorear: ${YELLOW}docker stats ${CONTAINER_NAME}${NC}"
echo -e "   🗑️  Eliminar: ${YELLOW}docker rm -f ${CONTAINER_NAME}${NC}"
echo ""

# Mostrar logs finales
log_info "Mostrando logs recientes..."
docker logs --tail=20 $CONTAINER_NAME

echo -e "${GREEN}✨ ¡La aplicación Vue Celulares está lista!${NC}"