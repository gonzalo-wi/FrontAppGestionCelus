#!/bin/bash

# Script para desplegar el frontend en producción
# Ejecutar con: ./deploy-prod.sh

set -e

echo "🚀 Iniciando despliegue en producción..."

# Variables de configuración
CONTAINER_NAME="celulares-frontend"
IMAGE_NAME="celulares-frontend:latest"

echo "📦 Construyendo imagen Docker..."
docker build -t $IMAGE_NAME .

echo "🛑 Parando contenedor existente si existe..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

echo "🔄 Iniciando nuevo contenedor..."
docker run -d \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  -p 192.168.0.55:5173:5173 \
  $IMAGE_NAME

echo "✅ Despliegue completado!"
echo "🌐 Frontend disponible en: http://192.168.0.55:5173"
echo "🔗 Backend configurado para: http://192.168.0.55:8082"

# Mostrar logs del contenedor
echo "📝 Logs del contenedor:"
docker logs $CONTAINER_NAME

echo ""
echo "Para ver logs en tiempo real: docker logs -f $CONTAINER_NAME"
echo "Para parar el contenedor: docker stop $CONTAINER_NAME"