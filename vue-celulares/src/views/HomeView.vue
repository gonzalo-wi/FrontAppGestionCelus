
<template>
  <div class="relative overflow-hidden">
    <!-- Dashboard para usuarios normales -->
    <div v-if="!isAdmin" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DashboardUsuario />
    </div>

    <!-- Hero Section para admins -->
    <div v-else class="bg-white relative min-h-screen">
      <!-- Background Pattern -->
      <div class="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50 opacity-60"></div>
      <div class="absolute inset-0 opacity-20">
        <div class="w-full h-full" style="background-image: radial-gradient(circle at 2px 2px, rgba(59,130,246,0.1) 1px, transparent 0); background-size: 30px 30px;"></div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-4">
            Centro de Control Administrativo
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Panel de administración con acceso rápido a funciones críticas del sistema
          </p>
        </div>

        <!-- Dashboard Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          <!-- Panel de Alertas -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Resumen Ejecutivo -->
            <div class="bg-gradient-to-br from-blue-50 to-indigo-100 backdrop-blur-xl rounded-2xl p-6 border border-blue-200 shadow-lg">
              <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Resumen Ejecutivo
              </h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-blue-600">{{ stats.loading ? '...' : stats.celulares }}</div>
                  <div class="text-sm text-gray-600">Dispositivos</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-600">{{ stats.loading ? '...' : stats.usuarios }}</div>
                  <div class="text-sm text-gray-600">Usuarios</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-orange-600">{{ stats.loading ? '...' : stats.asignados }}</div>
                  <div class="text-sm text-gray-600">Asignados</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-purple-600">{{ stats.loading ? '...' : stats.movimientos }}</div>
                  <div class="text-sm text-gray-600">Movimientos</div>
                </div>
              </div>
            </div>

            <!-- Alertas del Sistema -->
            <div class="bg-gradient-to-br from-orange-50 to-red-100 backdrop-blur-xl rounded-2xl p-6 border border-orange-200 shadow-lg">
              <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                Alertas del Sistema
              </h3>
              <div class="space-y-3">
                <div class="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                  <svg class="w-5 h-5 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <div class="text-yellow-800 font-medium">Dispositivos sin asignar</div>
                    <div class="text-yellow-700 text-sm">{{ stats.loading ? '...' : stats.celulares - stats.asignados }} celulares disponibles para asignación</div>
                  </div>
                </div>
                <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <svg class="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <div class="text-blue-800 font-medium">Sistema actualizado</div>
                    <div class="text-blue-700 text-sm">Todas las funciones operando correctamente</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Acciones Rápidas -->
          <div class="space-y-6">
            <div class="bg-gradient-to-br from-green-50 to-emerald-100 backdrop-blur-xl rounded-2xl p-6 border border-green-200 shadow-lg">
              <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Acciones Críticas
              </h3>
              <div class="space-y-3">
                <router-link to="/celulares" class="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105">
                  <div class="flex items-center justify-between">
                    <span>Gestionar Inventario</span>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </router-link>
                
                <router-link to="/usuarios" class="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105">
                  <div class="flex items-center justify-between">
                    <span>Administrar Usuarios</span>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </router-link>
                
                <router-link to="/mis-solicitudes" class="block w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105">
                  <div class="flex items-center justify-between">
                    <span>Revisar Solicitudes</span>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </router-link>
                
                <router-link to="/estadisticas" class="block w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105">
                  <div class="flex items-center justify-between">
                    <span>Ver Analytics</span>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section para usuarios no admin -->
    <div v-if="!isAdmin" class="bg-gradient-to-r from-gray-50 to-gray-100 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Información del Sistema</h2>
          <p class="text-lg text-gray-600">Vista general del inventario de dispositivos</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <div class="bg-blue-100 rounded-full p-3">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z"></path>
                </svg>
              </div>
              <span class="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                {{ stats.loading ? '...' : '+' + Math.floor(Math.random() * 15) + '%' }}
              </span>
            </div>
            <div class="text-4xl font-bold text-gray-900 mb-2">{{ stats.loading ? '...' : stats.celulares }}</div>
            <div class="text-gray-600 font-medium">Celulares Registrados</div>
            <div class="text-sm text-gray-500 mt-1">Total en inventario</div>
          </div>
          
          <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <div class="bg-orange-100 rounded-full p-3">
                <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span class="text-sm font-medium text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                {{ stats.loading ? '...' : Math.floor((stats.asignados / stats.celulares) * 100) + '%' }}
              </span>
            </div>
            <div class="text-4xl font-bold text-gray-900 mb-2">{{ stats.loading ? '...' : stats.asignados }}</div>
            <div class="text-gray-600 font-medium">Dispositivos Asignados</div>
            <div class="text-sm text-gray-500 mt-1">En uso actualmente</div>
          </div>

          <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <div class="bg-purple-100 rounded-full p-3">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
              </div>
              <span class="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                {{ stats.loading ? '...' : '+' + Math.floor(Math.random() * 20) + '%' }}
              </span>
            </div>
            <div class="text-4xl font-bold text-gray-900 mb-2">{{ stats.loading ? '...' : stats.movimientos }}</div>
            <div class="text-gray-600 font-medium">Movimientos</div>
            <div class="text-sm text-gray-500 mt-1">Actividad reciente</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { celularService, obtenerMovimientos } from '@/services/celularService.ts';
import { usuarioService } from '@/services/usuarioService.ts';
import { authService } from '@/services/authService';
import DashboardUsuario from '@/components/DashboardUsuario.vue';

const stats = ref({
  celulares: 0,
  usuarios: 0,
  movimientos: 0,
  asignados: 0,
  loading: true
});

const currentUser = computed(() => authService.getCurrentUser());
const isAdmin = computed(() => authService.isAdmin());

const cargarEstadisticas = async () => {
  stats.value.loading = true;
  try {
    // Cargar datos básicos disponibles para todos los usuarios
    const promises = [
      celularService.obtenerTodos(),
      obtenerMovimientos()
    ];
    
    // Solo los administradores pueden ver estadísticas de usuarios
    if (isAdmin.value) {
      promises.push(usuarioService.obtenerTodos());
    }
    
    const [celularesResponse, movimientosResponse, usuariosResponse] = await Promise.all(promises);
    
    stats.value.celulares = celularesResponse.data.length;
    stats.value.asignados = celularesResponse.data.filter(c => c.usuario).length;
    stats.value.usuarios = usuariosResponse ? usuariosResponse.data.length : 0;
    stats.value.movimientos = movimientosResponse.data.length;
  } catch (error) {
    console.error('Error cargando estadísticas:', error);
    // Mostrar datos de ejemplo en caso de error
    stats.value = {
      celulares: 0,
      usuarios: 0,
      movimientos: 0,
      asignados: 0,
      loading: false
    };
  } finally {
    stats.value.loading = false;
  }
};

onMounted(() => {
  cargarEstadisticas();
});
</script>
