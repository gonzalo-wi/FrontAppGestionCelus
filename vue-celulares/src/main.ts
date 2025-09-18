import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import { authService } from './services/authService';

// Función para inicializar la aplicación
async function initializeApp() {
  console.log('🚀 Inicializando aplicación...');
  
  // Esperar a que el authService termine su inicialización
  await authService.waitForInitialization();
  console.log('✅ AuthService inicializado');
  
  // Crear y montar la aplicación
  const app = createApp(App);
  app.use(router);
  app.mount('#app');
  
  console.log('🎉 Aplicación montada exitosamente');
}

// Exponer helper para setear Basic Auth rápidamente desde la consola del navegador
(window as any).authService = authService;
(window as any).setBasic = (u: string, p: string) => authService.login(u, p);

// Helper para debug: limpiar sesión
(window as any).clearSession = () => {
  authService.logout();
  console.log('🧹 Sesión limpiada');
};

// Inicializar la aplicación
initializeApp().catch(error => {
  console.error('❌ Error inicializando aplicación:', error);
  // En caso de error, montar la aplicación de todas formas
  createApp(App).use(router).mount('#app');
});
