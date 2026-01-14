import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import { authService } from './services/authService';


async function initializeApp() {
  console.log('🚀 Inicializando aplicación...');
  
  await authService.waitForInitialization();
  console.log('✅ AuthService inicializado');
  
  const app = createApp(App);
  app.use(router);
  app.mount('#app');
  
  console.log('🎉 Aplicación montada exitosamente');
}

(window as any).authService = authService;
(window as any).setBasic = (u: string, p: string) => authService.login(u, p);


(window as any).clearSession = () => {
  authService.logout();
  console.log('🧹 Sesión limpiada');
};


initializeApp().catch(error => {
  console.error('❌ Error inicializando aplicación:', error);
  createApp(App).use(router).mount('#app');
});
