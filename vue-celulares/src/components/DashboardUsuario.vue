<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 p-6">
    <div class="w-full space-y-8">
      <!-- Header con gradiente mejorado -->
      <div class="relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl overflow-hidden">
        <div class="absolute inset-0 bg-black opacity-10"></div>
        <div class="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-white opacity-10 rounded-full"></div>
        <div class="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-white opacity-5 rounded-full"></div>
        
        <div class="relative flex items-center justify-between">
          <div>
            <h2 class="text-4xl font-bold mb-2">Dashboard Analytics</h2>
            <p class="text-blue-100 text-lg mb-1">
              Región {{ estadisticas.region || '...' }}
            </p>
            <p class="text-blue-200 text-sm font-medium">
              {{ periodoActual === 'mes' ? '📊 Estadísticas del mes actual' : '📈 Estadísticas de todo el año' }}
            </p>
          </div>
          <div class="flex items-center gap-4">
            <!-- Selector de período mejorado -->
            <div class="bg-white/20 backdrop-blur-lg rounded-2xl p-1 flex">
              <button @click="periodoActual = 'todo'; cargarEstadisticas()"
                      :class="[
                        'px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
                        periodoActual === 'todo' 
                          ? 'bg-white text-blue-600 shadow-lg' 
                          : 'text-white hover:bg-white/20'
                      ]">
                Todo el año
              </button>
              <button @click="periodoActual = 'mes'; cargarEstadisticas()"
                      :class="[
                        'px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
                        periodoActual === 'mes' 
                          ? 'bg-white text-blue-600 shadow-lg' 
                          : 'text-white hover:bg-white/20'
                      ]">
                Este mes
              </button>
            </div>
            
            <button @click="cargarEstadisticas" 
                    class="bg-white/20 backdrop-blur-lg hover:bg-white/30 px-6 py-3 rounded-2xl transition-all flex items-center gap-2 text-white font-medium transform hover:scale-105">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Actualizar
            </button>
          </div>
        </div>
        
        <!-- Indicador de período activo mejorado -->
        <div class="relative mt-6 bg-white/20 backdrop-blur-lg rounded-2xl p-4">
          <div class="flex items-center gap-2 text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-4 0v4m-4 0h8m0 0V3m0 4h.01"></path>
            </svg>
            <span v-if="estadisticas.fechaDesde && estadisticas.fechaHasta" class="font-medium">
              Período: {{ formatearFecha(estadisticas.fechaDesde) }} - {{ formatearFecha(estadisticas.fechaHasta) }}
            </span>
            <span v-else class="font-medium">Cargando período...</span>
          </div>
        </div>
      </div>

      <!-- Loading State mejorado -->
      <div v-if="loading" class="flex justify-center py-16">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 rounded-full mb-6 animate-pulse">
            <svg class="animate-spin w-10 h-10 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Cargando Analytics</h3>
          <p class="text-gray-600 font-medium">Obteniendo estadísticas de tu región...</p>
          <div class="mt-4 flex justify-center">
            <div class="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div v-else class="space-y-8">
        <!-- Métricas principales mejoradas -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total Usuarios -->
          <div class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 p-8 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div class="flex items-center justify-between mb-6">
              <div class="p-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl shadow-lg">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <span class="text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                ✓ Activos
              </span>
            </div>
            <div>
              <div class="text-4xl font-bold text-gray-900 mb-2">{{ estadisticas.totalUsuarios || 0 }}</div>
              <div class="text-gray-700 font-semibold text-lg mb-1">Total Usuarios</div>
              <div class="text-gray-500 text-sm">Registrados en tu región</div>
            </div>
          </div>

          <!-- Total Solicitudes -->
          <div class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 p-8 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div class="flex items-center justify-between mb-6">
              <div class="p-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl shadow-lg">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <span class="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                📊 Total
              </span>
            </div>
            <div>
              <div class="text-4xl font-bold text-gray-900 mb-2">{{ estadisticas.totalSolicitudes || 0 }}</div>
              <div class="text-gray-700 font-semibold text-lg mb-1">Solicitudes</div>
              <div class="text-gray-500 text-sm">Historial completo</div>
            </div>
          </div>

          <!-- Promedio Celulares Rotos -->
          <div class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 p-8 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div class="flex items-center justify-between mb-6">
              <div class="p-4 bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl shadow-lg">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <span class="text-sm font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">
                📱 Promedio
              </span>
            </div>
            <div>
              <div class="text-4xl font-bold text-gray-900 mb-2">{{ estadisticas.promedioCelularesRotos?.toFixed(2) || '0.00' }}</div>
              <div class="text-gray-700 font-semibold text-lg mb-1">Cel. Rotos</div>
              <div class="text-gray-500 text-sm">Por usuario</div>
            </div>
          </div>

          <!-- Solicitudes Pendientes -->
          <div class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 p-8 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div class="flex items-center justify-between mb-6">
              <div class="p-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl shadow-lg">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span class="text-sm font-bold text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
                ⏳ Pendientes
              </span>
            </div>
            <div>
              <div class="text-4xl font-bold text-gray-900 mb-2">{{ calcularSolicitudesPendientes() }}</div>
              <div class="text-gray-700 font-semibold text-lg mb-1">Pendientes</div>
              <div class="text-gray-500 text-sm">Por resolver</div>
            </div>
          </div>
        </div>

        <!-- Gráficos y detalles mejorados -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Estado de Solicitudes -->
          <div class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 p-8">
            <div class="flex items-center gap-3 mb-8">
              <div class="p-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900">Estado de Solicitudes</h3>
                <p class="text-gray-600">Distribución por estado</p>
              </div>
            </div>
            
            <div class="space-y-6">
              <div v-for="(cantidad, estado) in estadisticas.solicitudesPorEstado" :key="estado" 
                   class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div :class="[
                      'w-4 h-4 rounded-full shadow-lg',
                      getEstadoColor(estado)
                    ]"></div>
                    <div>
                      <span class="font-bold text-gray-800 text-lg">{{ formatearEstado(estado) }}</span>
                      <div class="text-sm text-gray-500">{{ calcularPorcentaje(cantidad, estadisticas.totalSolicitudes) }}% del total</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-3xl font-bold text-gray-900">{{ cantidad }}</div>
                    <div class="text-sm text-gray-500">solicitudes</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Barra de progreso visual mejorada -->
            <div class="mt-8">
              <div class="flex h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div 
                  v-if="estadisticas.solicitudesPorEstado?.RESUELTA" 
                  :style="{ width: calcularPorcentaje(estadisticas.solicitudesPorEstado.RESUELTA, estadisticas.totalSolicitudes) + '%' }"
                  class="bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                  :title="`${estadisticas.solicitudesPorEstado.RESUELTA} resueltas`"
                ></div>
                <div 
                  v-if="estadisticas.solicitudesPorEstado?.EN_PROCESO" 
                  :style="{ width: calcularPorcentaje(estadisticas.solicitudesPorEstado.EN_PROCESO, estadisticas.totalSolicitudes) + '%' }"
                  class="bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-500"
                  :title="`${estadisticas.solicitudesPorEstado.EN_PROCESO} en proceso`"
                ></div>
                <div 
                  v-if="estadisticas.solicitudesPorEstado?.PENDIENTE" 
                  :style="{ width: calcularPorcentaje(estadisticas.solicitudesPorEstado.PENDIENTE, estadisticas.totalSolicitudes) + '%' }"
                  class="bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                  :title="`${estadisticas.solicitudesPorEstado.PENDIENTE} pendientes`"
                ></div>
                <div 
                  v-if="estadisticas.solicitudesPorEstado?.APROBADA" 
                  :style="{ width: calcularPorcentaje(estadisticas.solicitudesPorEstado.APROBADA, estadisticas.totalSolicitudes) + '%' }"
                  class="bg-gradient-to-r from-green-500 to-teal-500 transition-all duration-500"
                  :title="`${estadisticas.solicitudesPorEstado.APROBADA} aprobadas`"
                ></div>
                <div 
                  v-if="estadisticas.solicitudesPorEstado?.RECHAZADA" 
                  :style="{ width: calcularPorcentaje(estadisticas.solicitudesPorEstado.RECHAZADA, estadisticas.totalSolicitudes) + '%' }"
                  class="bg-gradient-to-r from-red-400 to-pink-500 transition-all duration-500"
                  :title="`${estadisticas.solicitudesPorEstado.RECHAZADA} rechazadas`"
                ></div>
              </div>
            </div>
          </div>

          <!-- Top Usuarios con Celulares Rotos -->
          <div class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 p-8">
            <div class="flex items-center gap-3 mb-8">
              <div class="p-3 bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900">Celulares Rotos</h3>
                <p class="text-gray-600">Top usuarios por incidencias</p>
              </div>
            </div>
            
            <div class="space-y-4">
              <div v-for="([usuario, cantidad], index) in topCelularesRotosPaginados" :key="usuario" 
                   class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 transform hover:scale-105 transition-all duration-200">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="relative">
                      <div :class="[
                        'w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg',
                        'bg-gradient-to-r from-blue-400 to-blue-600'
                      ]">
                        {{ (currentPageFlota - 1) * itemsPerPageFlota + index + 1 }}
                      </div>
                      <div v-if="((currentPageFlota - 1) * itemsPerPageFlota + index) < 3" class="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <svg class="w-3 h-3 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <div class="font-bold text-gray-800 text-lg">Usuario {{ usuario }}</div>
                      <div class="text-sm text-gray-500">Reportes de incidencias</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div :class="[
                      'text-3xl font-bold',
                      cantidad > 3 ? 'text-red-600' : cantidad > 1 ? 'text-yellow-600' : 'text-green-600'
                    ]">
                      {{ cantidad }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ cantidad === 1 ? 'roto' : 'rotos' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Paginación para Mi Flota -->
            <div v-if="topCelularesRotos.length > itemsPerPageFlota" class="mt-6">
              <Pagination
                :current-page="currentPageFlota"
                :total-pages="totalPagesFlota"
                :items-per-page="itemsPerPageFlota"
                :total-items="topCelularesRotos.length"
                @page-changed="onPageChangedFlota"
                @items-per-page-changed="onItemsPerPageChangedFlota"
              />
            </div>
            
            <div v-if="Object.keys(estadisticas.celularesRotosPorUsuario || {}).length === 0" class="text-center py-12">
              <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full mb-4">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-900 mb-2">¡Excelente!</h4>
              <p class="text-gray-600">No hay datos de celulares rotos en el período seleccionado</p>
            </div>
          </div>
        </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { obtenerEstadisticasMiRegion } from '@/services/usuarioService';
import Pagination from './Pagination.vue';

// Estado
const loading = ref(false);
const periodoActual = ref('todo'); // 'todo' o 'mes'
const estadisticas = ref({
  region: '',
  totalUsuarios: 0,
  totalSolicitudes: 0,
  solicitudesPorEstado: {},
  celularesRotosPorUsuario: {},
  promedioCelularesRotos: 0,
  fechaDesde: '',
  fechaHasta: '',
  solicitudesPorMes: {}
});

// Paginación para "Mi Flota" (Top Usuarios con Celulares Rotos)
const currentPageFlota = ref(1);
const itemsPerPageFlota = ref(5);

// Computed
const topCelularesRotos = computed(() => {
  const data = estadisticas.value.celularesRotosPorUsuario || {};
  return Object.entries(data)
    .sort(([,a], [,b]) => b - a); // Todos los datos, sin slice para la paginación
});

// Computed para paginación de Mi Flota
const totalPagesFlota = computed(() => {
  return Math.ceil(topCelularesRotos.value.length / itemsPerPageFlota.value);
});

const topCelularesRotosPaginados = computed(() => {
  const inicio = (currentPageFlota.value - 1) * itemsPerPageFlota.value;
  const fin = inicio + itemsPerPageFlota.value;
  return topCelularesRotos.value.slice(inicio, fin);
});

// Métodos
const cargarEstadisticas = async () => {
  try {
    loading.value = true;
    console.log('Cargando estadísticas de mi región con período:', periodoActual.value);
    
    // Calcular fechas según el período seleccionado
    const fechas = calcularFechas(periodoActual.value);
    
    const response = await obtenerEstadisticasMiRegion(fechas.desde, fechas.hasta);
    
    estadisticas.value = response.data;
    
    console.log('Estadísticas cargadas:', estadisticas.value);
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
    // Mantener datos por defecto en caso de error
  } finally {
    loading.value = false;
  }
};

const calcularFechas = (periodo) => {
  const ahora = new Date();
  const año = ahora.getFullYear();
  
  if (periodo === 'mes') {
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const primerDia = new Date(año, ahora.getMonth(), 1);
    const ultimoDia = new Date(año, ahora.getMonth() + 1, 0);
    
    return {
      desde: `${año}-${mes}-01`,
      hasta: `${año}-${mes}-${String(ultimoDia.getDate()).padStart(2, '0')}`
    };
  } else {
    return {
      desde: `${año}-01-01`,
      hasta: `${año}-12-31`
    };
  }
};

const formatearEstado = (estado) => {
  switch (estado) {
    case 'PENDIENTE': return 'Pendiente';
    case 'EN_PROCESO': return 'En Proceso';
    case 'RESUELTA': return 'Resuelta';
    case 'APROBADA': return 'Aprobada';
    case 'RECHAZADA': return 'Rechazada';
    default: return estado;
  }
};

const getEstadoColor = (estado) => {
  switch (estado) {
    case 'PENDIENTE': return 'bg-yellow-500';
    case 'EN_PROCESO': return 'bg-blue-500';
    case 'RESUELTA': return 'bg-green-500';
    case 'APROBADA': return 'bg-green-500';
    case 'RECHAZADA': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

// Métodos de paginación para Mi Flota
const onPageChangedFlota = (newPage) => {
  currentPageFlota.value = newPage;
};

const onItemsPerPageChangedFlota = (newItemsPerPage) => {
  itemsPerPageFlota.value = newItemsPerPage;
  currentPageFlota.value = 1; // Reset a la primera página
};

const calcularPorcentaje = (cantidad, total) => {
  if (!total || total === 0) return 0;
  return Math.round((cantidad / total) * 100);
};

const formatearFecha = (fecha) => {
  if (!fecha) return '';
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const calcularSolicitudesPendientes = () => {
  const estados = estadisticas.value.solicitudesPorEstado || {};
  return estados.PENDIENTE || 0;
};

// Lifecycle
onMounted(() => {
  cargarEstadisticas();
});
</script>
