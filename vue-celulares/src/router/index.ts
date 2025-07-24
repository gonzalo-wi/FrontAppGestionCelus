import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import CelularesView from '@/views/CelularesView.vue';
import UsuariosView from '@/views/UsuariosView.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/celulares', name: 'Celulares', component: CelularesView },
  { path: '/usuarios', name: 'Usuarios', component: UsuariosView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;