import axios from 'axios';
import { authService } from '@/services/authService';
import router from '@/router';

// Axios compartido para toda la app
export const http = axios.create({
  // Usamos el proxy de Vite: /api -> http://localhost:8082
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: agrega Authorization: Basic <token> si existe en localStorage
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth');
    if (token) {
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Basic ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta: maneja errores de autenticación
http.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      console.warn('Auth error', status, '->', err.config?.url);
      // 401 = no autenticado: limpiar sesión y enviar a login
      const currentPath = router.currentRoute.value.fullPath;
      
      // Solo hacer logout y redireccionar si no estamos ya en login
      if (router.currentRoute.value.name !== 'Login') {
        authService.logout();
        await router.replace({ name: 'Login', query: { redirect: currentPath } }).catch(() => {});
      }
      
      // Rechazar el error sin mostrar alertas adicionales
      return Promise.reject(new Error('Usuario no autenticado'));
    } else if (status === 403) {
      // 403 = autenticado pero sin permisos. No cerramos sesión.
      console.warn('Forbidden (403) ->', err.config?.url);
    }
    return Promise.reject(err);
  }
);

export default http;
