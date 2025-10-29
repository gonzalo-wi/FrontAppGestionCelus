#!/bin/bash

echo "🚀 Reconstruyendo aplicación sin caché..."

# Limpiar build anterior
echo "🗑️ Limpiando build anterior..."
rm -rf dist/

# Reconstruir aplicación
echo "📦 Reconstruyendo aplicación..."
npm run build

# Reconstruir imagen Docker sin caché
echo "🐳 Reconstruyendo imagen Docker sin caché..."
docker build --no-cache -t celulares-frontend .

# Parar contenedor existente
echo "🛑 Parando contenedor existente..."
docker stop celulares-frontend 2>/dev/null || true
docker rm celulares-frontend 2>/dev/null || true

# Iniciar nuevo contenedor
echo "🔄 Iniciando nuevo contenedor..."
docker run -d --name celulares-frontend -p 5173:80 celulares-frontend

echo "✅ Reconstrucción completada!"
echo "🌐 Frontend disponible en: http://192.168.0.55:5173"

# Mostrar logs
echo "📝 Logs del contenedor:"
docker logs celulares-frontend