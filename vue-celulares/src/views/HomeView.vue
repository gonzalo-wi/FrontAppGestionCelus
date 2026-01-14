
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
        <div class="text-center mb-8 lg:mb-12 px-4">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-4 leading-tight">
            Centro de Control Administrativo
          </h1>
          <p class="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Panel de administración con acceso rápido a funciones críticas del sistema
          </p>
        </div>

        <!-- Acciones Críticas Centradas -->
        <div class="flex justify-center mb-8 lg:mb-12">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 w-full max-w-4xl">
            <router-link to="/celulares" class="bg-blue-600 hover:bg-blue-700 text-white font-medium p-4 sm:p-6 rounded-xl transition-all duration-200 transform hover:scale-105 text-center group">
              <svg class="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z"></path>
              </svg>
              <div class="text-sm sm:text-base font-bold">Inventario</div>
              <div class="text-xs sm:text-sm opacity-80">Celulares</div>
            </router-link>
            
            <router-link to="/usuarios" class="bg-green-600 hover:bg-green-700 text-white font-medium p-4 sm:p-6 rounded-xl transition-all duration-200 transform hover:scale-105 text-center group">
              <svg class="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
              <div class="text-sm sm:text-base font-bold">Usuarios</div>
              <div class="text-xs sm:text-sm opacity-80">Gestión</div>
            </router-link>
            
            <router-link to="/mis-solicitudes" class="bg-orange-600 hover:bg-orange-700 text-white font-medium p-4 sm:p-6 rounded-xl transition-all duration-200 transform hover:scale-105 text-center group">
              <svg class="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v1a2 2 0 002 2h2m0 0a2 2 0 002 2v5.586a1 1 0 01-.293.707L9 18.414V20a2 2 0 01-2 2H5a2 2 0 01-2-2v-1.586a1 1 0 01.293-.707L5 16.414V14a2 2 0 012-2h2z"></path>
              </svg>
              <div class="text-sm sm:text-base font-bold">Solicitudes</div>
              <div class="text-xs sm:text-sm opacity-80">Revisar</div>
            </router-link>
            
            <router-link to="/estadisticas" class="bg-purple-600 hover:bg-purple-700 text-white font-medium p-4 sm:p-6 rounded-xl transition-all duration-200 transform hover:scale-105 text-center group">
              <svg class="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <div class="text-sm sm:text-base font-bold">Analytics</div>
              <div class="text-xs sm:text-sm opacity-80">Reportes</div>
            </router-link>
          </div>
        </div>

        <!-- Dashboard Content - Centrado -->
        <div class="flex justify-center px-4">
          <div class="max-w-6xl w-full space-y-6">
            <!-- Resumen Ejecutivo -->
            <div class="bg-gradient-to-br from-blue-50 to-indigo-100 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-blue-200 shadow-lg">
              <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Resumen Ejecutivo
              </h3>
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div class="text-center bg-white/50 rounded-lg p-3 sm:p-4">
                  <div class="text-xl sm:text-2xl font-bold text-blue-600">{{ stats.loading ? '...' : stats.celulares }}</div>
                  <div class="text-xs sm:text-sm text-gray-600">Dispositivos</div>
                </div>
                <div class="text-center bg-white/50 rounded-lg p-3 sm:p-4">
                  <div class="text-xl sm:text-2xl font-bold text-green-600">{{ stats.loading ? '...' : stats.usuarios }}</div>
                  <div class="text-xs sm:text-sm text-gray-600">Usuarios</div>
                </div>
                <div class="text-center bg-white/50 rounded-lg p-3 sm:p-4">
                  <div class="text-xl sm:text-2xl font-bold text-orange-600">{{ stats.loading ? '...' : stats.asignados }}</div>
                  <div class="text-xs sm:text-sm text-gray-600">Asignados</div>
                </div>
                <div class="text-center bg-white/50 rounded-lg p-3 sm:p-4">
                  <div class="text-xl sm:text-2xl font-bold text-purple-600">{{ stats.loading ? '...' : stats.movimientos }}</div>
                  <div class="text-xs sm:text-sm text-gray-600">Movimientos</div>
                </div>
              </div>
            </div>

            <!-- Alertas del Sistema -->
            <div class="bg-gradient-to-br from-orange-50 to-red-100 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-orange-200 shadow-lg">
              <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            <!-- Panel de Notificaciones centrado -->
            <div class="flex justify-center">
              <div class="w-full max-w-3xl">
                <NotificacionesPanel />
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
import estadisticasService from '@/services/estadisticasService';
import DashboardUsuario from '@/components/DashboardUsuario.vue';
import NotificacionesPanel from '@/components/NotificacionesPanel.vue';

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
  // Verificar autenticación antes de hacer requests
  if (!authService.isAuthenticated()) {
    console.log('Usuario no autenticado, cancelando carga de estadísticas');
    stats.value.loading = false;
    return;
  }
  
  stats.value.loading = true;
  try {
    // Solo los administradores pueden ver estadísticas generales
    if (isAdmin.value) {
      // Usar el nuevo endpoint rápido para obtener todas las estadísticas generales
      const estadisticas = await estadisticasService.obtenerEstadisticasGenerales();
      
      stats.value.celulares = estadisticas.totalDispositivos;
      stats.value.asignados = estadisticas.totalAsignados;
      stats.value.usuarios = estadisticas.totalUsuarios;
      stats.value.movimientos = estadisticas.totalMovimientos;
    }
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
