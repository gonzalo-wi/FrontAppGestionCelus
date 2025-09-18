#!/bin/bash

# Script de despliegue para Vue Celulares App
# Uso: ./deploy.sh [servidor_ip]

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
PORT="5173"
SERVER_IP="${1:-192.168.0.250}"

echo -e "${BLUE}🚀 Iniciando despliegue de Vue Celulares App${NC}"
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

# Verificar Docker Compose
if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose no está instalado"
    exit 1
fi

log_success "Dependencias verificadas"

# Detener contenedores existentes
log_info "Deteniendo contenedores existentes..."
docker-compose down --remove-orphans || log_warning "No hay contenedores ejecutándose"

# Limpiar imágenes antiguas
log_info "Limpiando imágenes antiguas..."
docker rmi $(docker images ${DOCKER_IMAGE} -q) 2>/dev/null || log_warning "No hay imágenes antiguas que limpiar"

# Build de la imagen
log_info "Construyendo imagen Docker..."
if docker-compose build --no-cache; then
    log_success "Imagen construida exitosamente"
else
    log_error "Error al construir la imagen"
    exit 1
fi

# Levantar el servicio
log_info "Levantando servicio..."
if docker-compose up -d; then
    log_success "Servicio iniciado exitosamente"
else
    log_error "Error al iniciar el servicio"
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
echo -e "   🐳 Contenedor: ${DOCKER_IMAGE}"
echo -e "   🔧 Estado: $(docker-compose ps --services --filter status=running)"
echo ""
echo -e "${BLUE}📋 Comandos útiles:${NC}"
echo -e "   📊 Ver logs: ${YELLOW}docker-compose logs -f${NC}"
echo -e "   🔄 Reiniciar: ${YELLOW}docker-compose restart${NC}"
echo -e "   🛑 Detener: ${YELLOW}docker-compose down${NC}"
echo -e "   📈 Monitorear: ${YELLOW}docker stats ${DOCKER_IMAGE}${NC}"
echo ""

# Mostrar logs finales
log_info "Mostrando logs recientes..."
docker-compose logs --tail=20

echo -e "${GREEN}✨ ¡La aplicación Vue Celulares está lista!${NC}"