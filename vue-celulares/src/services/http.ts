import axios from 'axios';
import { authService } from '@/services/authService';
import router from '@/router';

// Axios compartido para toda la app
export const http = axios.create({
  // Usamos el proxy de Vite: /api -> http://localhost:8080
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

// Interceptor de respuesta: loguea 401/403 para debug
http.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      console.warn('Auth error', status, '->', err.config?.url);
      // 401 = no autenticado: limpiar sesión y enviar a login
      const currentPath = router.currentRoute.value.fullPath;
      authService.logout();
      if (router.currentRoute.value.name !== 'Login') {
        await router.replace({ name: 'Login', query: { redirect: currentPath } }).catch(() => {});
      }
    } else if (status === 403) {
      // 403 = autenticado pero sin permisos. No cerramos sesión.
      console.warn('Forbidden (403) ->', err.config?.url);
    }
    return Promise.reject(err);
  }
);

export default http;
