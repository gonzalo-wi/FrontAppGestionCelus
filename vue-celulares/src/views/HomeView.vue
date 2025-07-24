
<template>
  <div class="relative overflow-hidden">
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative">
      <!-- Background Pattern -->
      <div class="absolute inset-0 bg-black opacity-10"></div>
      <div class="absolute inset-0 opacity-30">
        <div class="w-full h-full" style="background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0); background-size: 20px 20px;"></div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        <div class="text-center">
          <div class="mb-8">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6">
              <img src="@/assets/LogoCellControl.png" alt="Logo CellControl" class="w-16 h-16 object-contain" />
            </div>
          </div>
          <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            CellControl
            <span class="block text-3xl md:text-4xl lg:text-5xl font-normal text-blue-100 mt-2">
              Sistema de Gestión Inteligente
            </span>
          </h1>
          <p class="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
            Plataforma completa para la administración de inventario de celulares, 
            control de usuarios y seguimiento de movimientos en tiempo real
          </p>
          <div class="flex flex-col sm:flex-row gap-6 justify-center">
            <router-link 
              to="/celulares" 
              class="group inline-flex items-center px-8 py-4 text-lg font-semibold rounded-xl text-blue-700 bg-white hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg class="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z"></path>
              </svg>
              Gestionar Celulares
              <svg class="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </router-link>
            <router-link 
              to="/usuarios" 
              class="group inline-flex items-center px-8 py-4 text-lg font-semibold rounded-xl text-white border-2 border-white hover:bg-white hover:text-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg class="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              Gestionar Usuarios
              <svg class="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </router-link>
          </div>
        </div>
      </div>
      
      <!-- Wave Separator -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-6">Características Principales</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">Lo necesario para gestionar el inventario de manera eficiente</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <!-- Feature 1 -->
          <div class="group text-center hover:scale-105 transition-all duration-300">
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:from-blue-600 group-hover:to-blue-700 transition-all">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Gestión de Celulares</h3>
            <p class="text-gray-600 leading-relaxed mb-6">Crea, edita y administra el inventario completo de dispositivos móviles con control de estados y asignaciones</p>
            <div class="flex flex-wrap gap-2 justify-center">
              <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">CRUD Completo</span>
              <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Control Estados</span>
              <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Asignaciones</span>
            </div>
          </div>
          
          <!-- Feature 2 -->
          <div class="group text-center hover:scale-105 transition-all duration-300">
            <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:from-green-600 group-hover:to-green-700 transition-all">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Control de Usuarios</h3>
            <p class="text-gray-600 leading-relaxed mb-6">Administra usuarios por región y zona, asigna dispositivos y controla el acceso según el reparto correspondiente</p>
            <div class="flex flex-wrap gap-2 justify-center">
              <span class="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Por Región</span>
              <span class="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Por Zona</span>
              <span class="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Asignación</span>
            </div>
          </div>
          
          <!-- Feature 3 -->
          <div class="group text-center hover:scale-105 transition-all duration-300">
            <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:from-purple-600 group-hover:to-purple-700 transition-all">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Seguimiento Completo</h3>
            <p class="text-gray-600 leading-relaxed mb-6">Rastrea todos los movimientos, cambios de estado y historial completo de cada dispositivo en tiempo real</p>
            <div class="flex flex-wrap gap-2 justify-center">
              <span class="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">Historial</span>
              <span class="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">Tiempo Real</span>
              <span class="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">Auditoría</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="bg-gradient-to-r from-gray-50 to-gray-100 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Estadísticas en Tiempo Real</h2>
          <p class="text-lg text-gray-600">Panel de control con métricas principales del sistema</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
              <div class="bg-green-100 rounded-full p-3">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <span class="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                {{ stats.loading ? '...' : '+' + Math.floor(Math.random() * 8) + '%' }}
              </span>
            </div>
            <div class="text-4xl font-bold text-gray-900 mb-2">{{ stats.loading ? '...' : stats.usuarios }}</div>
            <div class="text-gray-600 font-medium">Usuarios Activos</div>
            <div class="text-sm text-gray-500 mt-1">Repartidores registrados</div>
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
            <div class="text-sm text-gray-500 mt-1">Registros históricos</div>
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
        </div>
      </div>
    </div>

    <!-- Quick Actions Section -->
    <div class="bg-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
          <p class="text-lg text-gray-600">Accede directamente a las funciones más utilizadas</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <router-link to="/celulares" class="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 hover:border-blue-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <div class="bg-blue-600 rounded-xl w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-blue-700 transition-colors">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Agregar Celular</h3>
            <p class="text-gray-600 mb-4">Registra un nuevo dispositivo en el inventario</p>
            <span class="text-blue-600 font-medium group-hover:text-blue-700">Ir a formulario →</span>
          </router-link>
          
          <router-link to="/usuarios" class="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100 hover:border-green-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <div class="bg-green-600 rounded-xl w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-green-700 transition-colors">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Registrar Usuario</h3>
            <p class="text-gray-600 mb-4">Agrega un nuevo usuario al sistema</p>
            <span class="text-green-600 font-medium group-hover:text-green-700">Ir a formulario →</span>
          </router-link>
          
          <div class="group bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-100 hover:border-purple-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer" @click="cargarEstadisticas">
            <div class="bg-purple-600 rounded-xl w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-purple-700 transition-colors">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Actualizar Datos</h3>
            <p class="text-gray-600 mb-4">Refresca las estadísticas del sistema</p>
            <span class="text-purple-600 font-medium group-hover:text-purple-700">Actualizar →</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { celularService, obtenerMovimientos } from '@/services/celularService.ts';
import { usuarioService } from '@/services/usuarioService.ts';

const stats = ref({
  celulares: 0,
  usuarios: 0,
  movimientos: 0,
  asignados: 0,
  loading: true
});

const cargarEstadisticas = async () => {
  stats.value.loading = true;
  try {
    // Cargar datos en paralelo para mejor performance
    const [celularesResponse, usuariosResponse, movimientosResponse] = await Promise.all([
      celularService.obtenerTodos(),
      usuarioService.obtenerTodos(),
      obtenerMovimientos()
    ]);
    
    stats.value.celulares = celularesResponse.data.length;
    stats.value.asignados = celularesResponse.data.filter(c => c.usuario).length;
    stats.value.usuarios = usuariosResponse.data.length;
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
