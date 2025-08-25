import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import { authService } from './services/authService';

// Exponer helper para setear Basic Auth rápidamente desde la consola del navegador
(window as any).authService = authService;
(window as any).setBasic = (u: string, p: string) => authService.login(u, p);

// Helper para debug: limpiar sesión
(window as any).clearSession = () => {
  authService.logout();
  console.log('🧹 Sesión limpiada');
};

createApp(App).use(router).mount('#app')
