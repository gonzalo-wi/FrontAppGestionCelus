<template>
  <div class="relative">
    <!-- Botón de alertas -->
    <button
      @click="toggleAlertas"
      class="relative p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
      :class="{ 'animate-pulse': alertasNoLeidas.length > 0 }"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-3.5-3.5a.5.5 0 010-.707l.5-.5a.5.5 0 000-.707L15 10V9a6 6 0 10-12 0v1L1.5 11.5a.5.5 0 000 .707l.5.5a.5.5 0 010 .707L5 17h5m5 0v1a3 3 0 11-6 0v-1m6 0H9"/>
      </svg>
      
      <!-- Badge de contador -->
      <span
        v-if="alertasNoLeidas.length > 0"
        class="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full animate-bounce"
      >
        {{ alertasNoLeidas.length > 99 ? '99+' : alertasNoLeidas.length }}
      </span>
    </button>

    <!-- Panel desplegable de alertas -->
    <div
      v-show="mostrarPanel"
      class="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 transform transition-all duration-300"
      :class="mostrarPanel ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
    >
      <!-- Header del panel -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          Alertas
          <span v-if="alertasNoLeidas.length > 0" class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
            {{ alertasNoLeidas.length }}
          </span>
        </h3>
        <div class="flex items-center gap-2">
          <button
            v-if="alertasNoLeidas.length > 0"
            @click="marcarTodasComoLeidas"
            class="text-xs bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Marcar todas como leídas
          </button>
          <button
            @click="cerrarPanel"
            class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Toggle de vistas -->
      <div class="px-4 py-2 border-b border-gray-100">
        <div class="flex items-center justify-center">
          <div class="flex bg-gray-100 rounded-lg p-1">
            <button
              @click="cambiarVista('no-leidas')"
              :class="[
                'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                vistaActual === 'no-leidas' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              No leídas ({{ alertasNoLeidas.length }})
            </button>
            <button
              @click="cambiarVista('todas')"
              :class="[
                'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                vistaActual === 'todas' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              Historial
            </button>
          </div>
        </div>
      </div>

      <!-- Lista de alertas -->
      <div class="max-h-96 overflow-y-auto">
        <div v-if="loading" class="p-4 text-center">
          <div class="inline-flex items-center px-4 py-2 text-sm text-gray-600">
            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando alertas...
          </div>
        </div>

        <div v-else-if="alertasAMostrar.length === 0" class="p-6 text-center text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p>No hay alertas pendientes</p>
        </div>

        <div v-else class="divide-y divide-gray-100">
          <div
            v-for="alerta in alertasAMostrar"
            :key="alerta.id"
            class="p-4 hover:bg-gray-50 transition-colors relative"
            :class="{ 'bg-red-50': !alerta.leida }"
          >
            <!-- Indicador de no leída -->
            <div
              v-if="!alerta.leida"
              class="absolute left-2 top-6 w-2 h-2 bg-red-500 rounded-full"
            ></div>

            <div class="ml-4">
              <!-- Mensaje de alerta -->
              <div class="flex items-start justify-between">
                <p class="text-sm font-medium text-gray-900 mb-2">
                  {{ alerta.mensaje }}
                </p>
                <div class="flex items-center gap-1 ml-2">
                  <button
                    v-if="!alerta.leida"
                    @click="marcarComoLeida(alerta.id)"
                    class="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Marcar como leída"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </button>
                  <button
                    @click="eliminarAlerta(alerta.id)"
                    class="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Eliminar alerta"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Información de la solicitud -->
              <div class="bg-white rounded-lg p-3 border border-gray-200">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-semibold text-blue-600">
                    Solicitud: {{ alerta.solicitud.id }}
                  </span>
                  <span
                    class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                    :class="{
                      'bg-yellow-100 text-yellow-800': alerta.solicitud.estado === 'PENDIENTE',
                      'bg-blue-100 text-blue-800': alerta.solicitud.estado === 'EN_PROCESO',
                      'bg-green-100 text-green-800': alerta.solicitud.estado === 'COMPLETADA',
                      'bg-red-100 text-red-800': alerta.solicitud.estado === 'RECHAZADA'
                    }"
                  >
                    {{ alerta.solicitud.estado }}
                  </span>
                </div>
                
                <div class="text-xs text-gray-600 space-y-1">
                  <p><strong>Solicitante:</strong> {{ alerta.solicitud.nomSolicitante }}</p>
                  <p><strong>Región:</strong> {{ alerta.solicitud.region }}</p>
                  <p><strong>Tipo:</strong> {{ formatTipoSolicitud(alerta.solicitud.tipoSolicitud) }}</p>
                  <p><strong>Fecha:</strong> {{ formatearFecha(alerta.solicitud.fecha) }}</p>
                  <p><strong>Motivo:</strong> {{ alerta.solicitud.motivo }}</p>
                </div>
              </div>

              <!-- Fecha de la alerta -->
              <p class="text-xs text-gray-400 mt-2">
                {{ formatearFechaCompleta(alerta.fechaCreacion) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-3 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
        <button
          @click="refrescarAlertas"
          class="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Actualizar alertas
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { alertaService } from '@/services/alertaService';

// Props
const emit = defineEmits(['alertaActualizada']);

// Estado reactivo
const alertas = ref([]);
const alertasNoLeidasSolo = ref([]);
const loading = ref(false);
const mostrarPanel = ref(false);
const vistaActual = ref('no-leidas'); // 'no-leidas' o 'todas'

// Auto-refresh interval
let refreshInterval = null;

// Computed
const alertasNoLeidas = computed(() => {
  return alertasNoLeidasSolo.value;
});

const alertasAMostrar = computed(() => {
  return vistaActual.value === 'no-leidas' ? alertasNoLeidasSolo.value : alertas.value;
});

// Métodos
const cargarAlertas = async () => {
  try {
    loading.value = true;
    
    // Cargar alertas no leídas
    const responseNoLeidas = await alertaService.obtenerNoLeidas();
    alertasNoLeidasSolo.value = responseNoLeidas.data || [];
    
    // Si estamos en vista "todas", cargar todas las alertas
    if (vistaActual.value === 'todas') {
      const responseTotal = await alertaService.obtenerTodas();
      alertas.value = responseTotal.data || [];
    }
  } catch (error) {
    console.error('Error al cargar alertas:', error);
  } finally {
    loading.value = false;
  }
};

const toggleAlertas = () => {
  mostrarPanel.value = !mostrarPanel.value;
  if (mostrarPanel.value) {
    cargarAlertas();
  }
};

const cerrarPanel = () => {
  mostrarPanel.value = false;
};

const cambiarVista = async (vista) => {
  vistaActual.value = vista;
  if (vista === 'todas' && alertas.value.length === 0) {
    // Cargar todas las alertas si no están cargadas
    try {
      loading.value = true;
      const response = await alertaService.obtenerTodas();
      alertas.value = response.data || [];
    } catch (error) {
      console.error('Error al cargar todas las alertas:', error);
    } finally {
      loading.value = false;
    }
  }
};

const marcarComoLeida = async (alertaId) => {
  try {
    await alertaService.marcarComoLeida(alertaId);
    
    // Actualizar en la lista de todas las alertas
    const alerta = alertas.value.find(a => a.id === alertaId);
    if (alerta) {
      alerta.leida = true;
    }
    
    // Remover de la lista de alertas no leídas
    alertasNoLeidasSolo.value = alertasNoLeidasSolo.value.filter(a => a.id !== alertaId);
    
    emit('alertaActualizada');
  } catch (error) {
    console.error('Error al marcar alerta como leída:', error);
  }
};

const marcarTodasComoLeidas = async () => {
  try {
    await alertaService.marcarTodasComoLeidas();
    
    // Actualizar todas las alertas como leídas
    alertas.value.forEach(alerta => {
      alerta.leida = true;
    });
    
    // Limpiar la lista de alertas no leídas
    alertasNoLeidasSolo.value = [];
    
    emit('alertaActualizada');
  } catch (error) {
    console.error('Error al marcar todas las alertas como leídas:', error);
  }
};

const eliminarAlerta = async (alertaId) => {
  try {
    await alertaService.eliminar(alertaId);
    alertas.value = alertas.value.filter(a => a.id !== alertaId);
    emit('alertaActualizada');
  } catch (error) {
    console.error('Error al eliminar alerta:', error);
  }
};

const refrescarAlertas = () => {
  cargarAlertas();
};

// Formatters
const formatTipoSolicitud = (tipo) => {
  const tipos = {
    'CAMBIO_POR_ROTURA': 'Cambio por Rotura',
    'NUEVO_EQUIPO': 'Nuevo Equipo',
    'REEMPLAZO': 'Reemplazo',
    'MANTENIMIENTO': 'Mantenimiento'
  };
  return tipos[tipo] || tipo;
};

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES');
};

const formatearFechaCompleta = (fecha) => {
  return new Date(fecha).toLocaleString('es-ES');
};

// Lifecycle
onMounted(() => {
  cargarAlertas();
  
  // Auto-refresh cada 30 segundos
  refreshInterval = setInterval(() => {
    if (!mostrarPanel.value) {
      cargarAlertas();
    }
  }, 30000);
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
</script>
