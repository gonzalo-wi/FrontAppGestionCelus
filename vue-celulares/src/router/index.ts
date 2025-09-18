import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import CelularesView from '@/views/CelularesView.vue';
import UsuariosView from '@/views/UsuariosView.vue';
import SolicitudesView from '@/views/SolicitudesView.vue';
import SolicitudUsuarioView from '@/views/SolicitudUsuarioView.vue';
import EstadisticasView from '@/views/EstadisticasView.vue';
import AdminUsuariosView from '@/views/AdminUsuariosView.vue';
import LoginView from '@/views/LoginView.vue';
import ProveedoresView from '@/views/ProveedoresView.vue';
import OrdenesReparacionView from '@/views/OrdenesReparacionView.vue';
import { authService } from '@/services/authService';

const routes = [
  { 
    path: '/login', 
    name: 'Login', 
    component: LoginView,
    meta: { requiresAuth: false }
  },
  { 
    path: '/', 
    name: 'Home', 
    component: HomeView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/celulares', 
    name: 'Celulares', 
    component: CelularesView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  { 
    path: '/usuarios', 
    name: 'Usuarios', 
    component: UsuariosView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  { 
    path: '/solicitudes', 
    name: 'Solicitudes', 
    component: SolicitudesView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  { 
    path: '/mis-solicitudes', 
    name: 'MisSolicitudes', 
    component: SolicitudUsuarioView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/estadisticas', 
    name: 'Estadisticas', 
    component: EstadisticasView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  { 
    path: '/admin/usuarios', 
    name: 'AdminUsuarios', 
    component: AdminUsuariosView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  { 
    path: '/proveedores', 
    name: 'Proveedores', 
    component: ProveedoresView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  { 
    path: '/ordenes-reparacion', 
    name: 'OrdenesReparacion', 
    component: OrdenesReparacionView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard de navegación para autenticación
router.beforeEach(async (to, _from, next) => {
  console.log(`🧭 Navegando a: ${to.path}`);
  
  // Si aún está inicializando (por alguna razón), esperar
  if (authService.isInitializing()) {
    console.log('⏳ Esperando inicialización de authService...');
    await authService.waitForInitialization();
    console.log('✅ Inicialización completa');
  }
  
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();
  
  console.log(`👤 Autenticado: ${isAuthenticated}, Admin: ${isAdmin}, Ruta: ${to.path}`);
  
  // Si la ruta requiere autenticación y no está autenticado
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('🚫 Redirigiendo a login - sin autenticación');
    next('/login');
    return;
  }
  
  // Si la ruta requiere permisos de admin y no los tiene
  if (to.meta.requiresAdmin && !isAdmin) {
    console.log('🚫 Redirigiendo a mis-solicitudes - sin permisos admin');
    next('/mis-solicitudes');
    return;
  }
  
  // Si está autenticado e intenta ir a login
  if (to.name === 'Login' && isAuthenticated) {
    console.log('🔄 Usuario autenticado en login - redirigiendo a home');
    const destination = isAdmin ? '/' : '/mis-solicitudes';
    next(destination);
    return;
  }
  
  console.log('✅ Navegación permitida');
  next();
});

export default router;