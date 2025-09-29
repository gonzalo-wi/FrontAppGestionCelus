# 🚀 Despliegue en Producción - Frontend Gestión Celulares

## 📋 Configuración de Producción

### URLs de Producción:
- **Frontend**: `http://192.168.0.55:5173`
- **Backend**: `http://192.168.0.55:8082`

## 🐳 Despliegue con Docker

### Opción 1: Script Automático (Recomendado)
```bash
# Ejecutar desde el directorio vue-celulares/
./deploy-prod.sh
```

### Opción 2: Docker Compose
```bash
# Ejecutar desde el directorio vue-celulares/
docker-compose -f docker-compose.prod.yml up -d --build
```

### Opción 3: Comandos Docker Manuales
```bash
# 1. Construir imagen
docker build -t celulares-frontend:latest .

# 2. Ejecutar contenedor
docker run -d \
  --name celulares-frontend \
  --restart unless-stopped \
  -p 192.168.0.55:5173:5173 \
  celulares-frontend:latest
```

## 🔧 Configuración

### Nginx
- **Puerto**: 5173
- **Proxy Backend**: http://192.168.0.55:8082
- **Archivos estáticos**: Servidos con cache de 1 año
- **SPA Routing**: Configurado para Vue Router

### Docker
- **Imagen base**: nginx:stable-alpine
- **Multi-stage build**: Node.js para build + Nginx para serving
- **Puerto expuesto**: 5173
- **Red**: bridge (celulares-network)

## 📊 Monitoreo

### Ver logs del contenedor:
```bash
docker logs celulares-frontend
```

### Ver logs en tiempo real:
```bash
docker logs -f celulares-frontend
```

### Verificar estado del contenedor:
```bash
docker ps | grep celulares-frontend
```

### Health check:
```bash
curl http://192.168.0.55:5173/health
```

## 🛠️ Comandos Útiles

### Parar el contenedor:
```bash
docker stop celulares-frontend
```

### Reiniciar el contenedor:
```bash
docker restart celulares-frontend
```

### Eliminar contenedor:
```bash
docker stop celulares-frontend
docker rm celulares-frontend
```

### Actualizar aplicación:
```bash
# Rebuild y redeploy
./deploy-prod.sh
```

## 🔒 Seguridad

### Headers configurados:
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Content-Security-Policy configurado

### Proxy seguro:
- Headers de autorización preservados
- Timeouts configurados
- Límite de tamaño de request: 10MB

## 🚨 Troubleshooting

### Si el frontend no carga:
1. Verificar que el contenedor esté ejecutándose: `docker ps`
2. Verificar logs: `docker logs celulares-frontend`
3. Verificar puerto: `netstat -tlnp | grep 5173`

### Si las APIs no funcionan:
1. Verificar que el backend esté ejecutándose en `192.168.0.55:8082`
2. Verificar configuración de proxy en nginx.conf
3. Verificar CORS en el backend

### Para debugging:
```bash
# Entrar al contenedor
docker exec -it celulares-frontend sh

# Ver configuración de nginx
docker exec celulares-frontend cat /etc/nginx/conf.d/default.conf
```

## 📝 Notas Importantes

1. **Backend**: Debe estar ejecutándose en `192.168.0.55:8082`
2. **CORS**: El backend debe permitir requests desde `http://192.168.0.55:5173`
3. **Firewall**: Asegurar que el puerto 5173 esté abierto
4. **DNS/Host**: Verificar que `192.168.0.55` sea accesible desde los clientes