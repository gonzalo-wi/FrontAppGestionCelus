# 🚀 Guía de Deployment - Frontend Vue Celulares

## 📋 Configuración del Servidor

- **Host**: 192.168.0.250
- **Puerto Frontend**: 5178
- **Puerto Backend**: 8094
- **URL Frontend**: http://192.168.0.250:5178
- **URL Backend API**: http://192.168.0.250:8094/api

## 🐳 Deployment con Docker

### Prerequisitos

1. Docker y Docker Compose instalados en el servidor
2. Acceso al servidor 192.168.0.250
3. Backend corriendo en el puerto 8094

### Opción 1: Deployment Rápido (Recomendado)

#### En Windows:
```bash
deploy-server.bat
```

#### En Linux/Mac:
```bash
chmod +x deploy-server.sh
./deploy-server.sh
```

### Opción 2: Deployment Manual

1. **Navegar al directorio del proyecto:**
   ```bash
   cd vue-celulares
   ```

2. **Detener contenedores anteriores:**
   ```bash
   docker-compose down
   ```

3. **Construir la imagen (con rebuild completo):**
   ```bash
   docker-compose build --no-cache
   ```

4. **Levantar el contenedor:**
   ```bash
   docker-compose up -d
   ```

5. **Verificar que está corriendo:**
   ```bash
   docker-compose ps
   ```

6. **Ver logs en tiempo real:**
   ```bash
   docker-compose logs -f
   ```

## 🔧 Comandos Útiles

### Ver estado del contenedor
```bash
docker-compose ps
```

### Ver logs
```bash
docker-compose logs -f
```

### Reiniciar el contenedor
```bash
docker-compose restart
```

### Detener el contenedor
```bash
docker-compose down
```

### Reconstruir y reiniciar
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Acceder al contenedor
```bash
docker exec -it vue-celulares-frontend sh
```

### Ver logs de Nginx dentro del contenedor
```bash
docker exec vue-celulares-frontend cat /var/log/nginx/error.log
docker exec vue-celulares-frontend cat /var/log/nginx/access.log
```

## 🔍 Verificación del Deployment

1. **Verificar que el contenedor está corriendo:**
   ```bash
   docker ps | grep vue-celulares-frontend
   ```

2. **Probar la aplicación:**
   - Abrir navegador en: http://192.168.0.250:5178
   - Verificar que carga la página de login

3. **Verificar conexión con backend:**
   - Intentar hacer login
   - Los requests deberían ir a http://192.168.0.250:8094/api

4. **Revisar logs si hay problemas:**
   ```bash
   docker-compose logs --tail=50
   ```

## 🛠️ Troubleshooting

### El contenedor no inicia
```bash
# Ver logs completos
docker-compose logs

# Verificar que el puerto 5178 no esté en uso
netstat -ano | findstr :5178  # Windows
lsof -i :5178                 # Linux/Mac
```

### Error de conexión al backend
```bash
# Verificar que el backend está corriendo
curl http://192.168.0.250:8094/api/health

# Desde dentro del contenedor
docker exec vue-celulares-frontend wget -O- http://192.168.0.250:8094/api
```

### Error 502 Bad Gateway
- Verificar que el backend está corriendo en el puerto 8094
- Verificar la configuración de nginx.conf
- Revisar logs de Nginx

### Cambios no se reflejan
```bash
# Limpiar todo y reconstruir
docker-compose down
docker system prune -f
docker-compose build --no-cache
docker-compose up -d
```

## 📁 Estructura de Archivos Docker

```
vue-celulares/
├── Dockerfile              # Definición de la imagen Docker
├── docker-compose.yml      # Configuración de Docker Compose
├── nginx.conf             # Configuración de Nginx
├── deploy-server.sh       # Script de deployment (Linux/Mac)
├── deploy-server.bat      # Script de deployment (Windows)
└── DEPLOYMENT.md          # Este archivo
```

## 🔐 Configuración de Nginx

El archivo `nginx.conf` está configurado para:
- Escuchar en el puerto 80 (mapeado a 5178 externamente)
- Hacer proxy de `/api/*` a `http://192.168.0.250:8094`
- Servir archivos estáticos de Vue
- Soportar Vue Router en modo history
- Compresión gzip activada
- Headers de seguridad configurados

## 📝 Notas Importantes

1. **Puerto interno vs externo:**
   - Nginx escucha en el puerto 80 dentro del contenedor
   - Docker mapea el puerto 80 interno al 5178 externo
   - Acceso externo: http://192.168.0.250:5178

2. **Backend:**
   - Debe estar corriendo en http://192.168.0.250:8094
   - Todas las rutas `/api/*` se proxean al backend
   - El backend debe tener CORS configurado si es necesario

3. **Actualizar código:**
   - Después de cambios en el código, ejecutar deployment completo
   - O usar: `docker-compose build --no-cache && docker-compose up -d`

4. **Persistencia:**
   - El contenedor está configurado con `restart: unless-stopped`
   - Se reiniciará automáticamente si el servidor se reinicia

## 🔄 Actualización de la Aplicación

Para actualizar a una nueva versión:

1. Hacer pull de los cambios del repositorio
2. Ejecutar el script de deployment:
   ```bash
   ./deploy-server.sh  # o deploy-server.bat
   ```

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs: `docker-compose logs -f`
2. Verifica que el backend esté corriendo
3. Verifica conectividad de red entre frontend y backend
4. Revisa los logs de Nginx dentro del contenedor
