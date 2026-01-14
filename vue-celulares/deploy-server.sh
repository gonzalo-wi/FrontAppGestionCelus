#!/bin/bash

# Script de deployment para servidor 192.168.0.250:5178
# Backend: 192.168.0.250:8094

echo "🚀 Iniciando deployment del frontend Vue Celulares..."
echo "📍 Servidor: 192.168.0.250:5178"
echo "🔗 Backend: 192.168.0.250:8094"
echo ""

# Detener y eliminar contenedores anteriores
echo "🛑 Deteniendo contenedores anteriores..."
docker-compose down

# Eliminar imágenes antiguas (opcional, descomenta si quieres limpiar)
# docker rmi vue-celulares-vue-celulares-app 2>/dev/null || true

# Rebuild y levantar contenedor
echo "🔨 Construyendo imagen Docker..."
docker-compose build --no-cache

echo "🚀 Levantando contenedor..."
docker-compose up -d

# Esperar unos segundos para que el contenedor inicie
echo "⏳ Esperando que el contenedor inicie..."
sleep 5

# Verificar estado del contenedor
echo ""
echo "📊 Estado del contenedor:"
docker-compose ps

# Mostrar logs
echo ""
echo "📝 Últimas líneas del log:"
docker-compose logs --tail=20

echo ""
echo "✅ Deployment completado!"
echo "🌐 La aplicación debería estar disponible en: http://192.168.0.250:5178"
echo ""
echo "Comandos útiles:"
echo "  - Ver logs: docker-compose logs -f"
echo "  - Reiniciar: docker-compose restart"
echo "  - Detener: docker-compose down"
echo "  - Estado: docker-compose ps"
