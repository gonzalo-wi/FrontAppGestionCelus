import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import CelularesView from '@/views/CelularesView.vue';
import UsuariosView from '@/views/UsuariosView.vue';
import SolicitudesView from '@/views/SolicitudesView.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/celulares', name: 'Celulares', component: CelularesView },
  { path: '/usuarios', name: 'Usuarios', component: UsuariosView },
  { path: '/solicitudes', name: 'Solicitudes', component: SolicitudesView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;