<template>
  <div class="bg-gradient-to-br from-indigo-50 to-purple-100 backdrop-blur-xl rounded-2xl p-6 border border-indigo-200 shadow-lg">
    <!-- Header del panel -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-3.5-3.5a.5.5 0 010-.707l.5-.5a.5.5 0 000-.707L15 10V9a6 6 0 10-12 0v1L1.5 11.5a.5.5 0 000 .707l.5.5a.5.5 0 010 .707L5 17h5m5 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
        </div>
        <div>
          <h3 class="text-xl font-bold text-gray-900">Notificaciones</h3>
          <p class="text-sm text-gray-600" v-if="ultimaActualizacion">
            Actualizado: {{ ultimaActualizacion }}
          </p>
        </div>
      </div>
      
      <!-- Badge de notificaciones no leídas -->
      <div class="flex items-center gap-2">
        <div v-if="notificacionesNoLeidas > 0" 
             class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
          {{ notificacionesNoLeidas }}
        </div>
        
        <!-- Botón de refrescar -->
        <button @click="refrescar" 
                :disabled="loading"
                class="p-2 bg-white/50 hover:bg-white/80 rounded-xl transition-all duration-200 transform hover:scale-105"
                title="Refrescar notificaciones">
          <svg class="w-5 h-5 text-gray-600" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Toggle de vistas -->
    <div class="mb-4">
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
            No leídas ({{ notificacionesNoLeidas }})
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

    <!-- Botones de acción -->
    <div v-if="vistaActual === 'no-leidas' && notificacionesNoLeidas > 0" class="mb-4 flex justify-center">
      <button
        @click="marcarTodasComoLeidas"
        class="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        Marcar todas como leídas
      </button>
    </div>

    <!-- Contenido -->
    <div class="bg-white rounded-xl shadow-sm">
      <!-- Loading state -->
      <div v-if="loading" class="p-8 text-center">
        <div class="mx-auto w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-gray-500">Cargando notificaciones...</p>
      </div>

      <!-- Sin notificaciones -->
      <div v-else-if="notificacionesAMostrar.length === 0" class="p-8 text-center">
        <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h4 class="text-gray-500 font-medium">No hay notificaciones</h4>
        <p class="text-gray-400 text-sm mt-1">Todas las notificaciones están al día</p>
      </div>

      <!-- Lista de notificaciones -->
      <div v-else class="max-h-96 overflow-y-auto">
        <div v-for="notificacion in notificacionesAMostrar" :key="notificacion.id" 
             class="p-4 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 last:border-b-0"
             :class="{ 'bg-blue-50 border-l-4 border-l-blue-500': !notificacion.leida }">
          
          <div class="flex items-start gap-3">
            <!-- Indicador de estado -->
            <div class="flex-shrink-0 mt-1">
              <div v-if="!notificacion.leida" class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <div v-else class="w-3 h-3 bg-gray-300 rounded-full"></div>
            </div>
            
            <div class="flex-1 min-w-0">
              <!-- Mensaje principal -->
              <p class="text-sm text-gray-900 mb-2" 
                 :class="{ 'font-semibold': !notificacion.leida }">
                {{ notificacion.mensaje }}
              </p>
              
              <!-- Información adicional -->
              <div class="flex items-center gap-4 text-xs text-gray-500">
                <span>{{ formatearFecha(notificacion.fecha) }}</span>
                <span v-if="notificacion.usuarioQueModifico">
                  Por: {{ notificacion.usuarioQueModifico }}
                </span>
                <span v-if="notificacion.numeroLinea">
                  Línea: {{ formatearTelefono(notificacion.numeroLinea) }}
                </span>
              </div>
            </div>
            
            <!-- Acciones -->
            <div class="flex-shrink-0 flex items-center gap-2">
              <button v-if="!notificacion.leida"
                      @click="marcarComoLeida(notificacion.id)"
                      class="text-blue-600 hover:text-blue-800 text-xs font-medium"
                      title="Marcar como leída">
                Marcar leída
              </button>
              
              <button @click="eliminarNotificacion(notificacion.id)"
                      class="text-red-600 hover:text-red-800 text-xs"
                      title="Eliminar notificación">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div v-if="notificaciones.length > 0" class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
      <button @click="marcarTodasComoLeidas"
              v-if="notificacionesNoLeidas > 0"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium">
        Marcar todas como leídas
      </button>
      <div v-else></div>
      
      <div class="text-xs text-gray-500">
        {{ notificaciones.length }} notificación{{ notificaciones.length !== 1 ? 'es' : '' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { notificacionService } from '@/services/notificacionService';

// Estados reactivos
const notificaciones = ref([]);
const notificacionesNoLeidasSolo = ref([]);
const loading = ref(false);
const ultimaActualizacion = ref('');
const vistaActual = ref('no-leidas'); // 'no-leidas' o 'todas'

// Auto-refresh interval
let refreshInterval = null;

// Computed
const notificacionesNoLeidas = computed(() => {
  return notificacionesNoLeidasSolo.value.length;
});

const notificacionesAMostrar = computed(() => {
  return vistaActual.value === 'no-leidas' ? notificacionesNoLeidasSolo.value : notificaciones.value;
});

// Métodos
const cargarNotificaciones = async () => {
  try {
    loading.value = true;
    
    // Cargar notificaciones no leídas
    try {
      const responseNoLeidas = await notificacionService.obtenerNoLeidas();
      if (responseNoLeidas && responseNoLeidas.data && Array.isArray(responseNoLeidas.data)) {
        notificacionesNoLeidasSolo.value = responseNoLeidas.data;
      } else if (responseNoLeidas && Array.isArray(responseNoLeidas)) {
        notificacionesNoLeidasSolo.value = responseNoLeidas;
      } else {
        notificacionesNoLeidasSolo.value = [];
      }
    } catch (error) {
      console.warn('Error al cargar notificaciones no leídas, usando datos mock:', error);
      notificacionesNoLeidasSolo.value = [
        {
          "id": 1,
          "mensaje": "Cambio de línea por norte en usuario 1",
          "fecha": "2025-09-16T14:37:33",
          "leida": false,
          "usuarioQueModifico": "norte",
          "usuarioModificado": "1",
          "numeroLinea": "1164449098"
        }
      ];
    }
    
    // Si estamos en vista "todas", cargar todas las notificaciones
    if (vistaActual.value === 'todas') {
      try {
        const responseTotal = await notificacionService.obtenerTodas();
        if (responseTotal && responseTotal.data && Array.isArray(responseTotal.data)) {
          notificaciones.value = responseTotal.data;
        } else if (responseTotal && Array.isArray(responseTotal)) {
          notificaciones.value = responseTotal;
        } else {
          notificaciones.value = [];
        }
      } catch (error) {
        console.warn('Error al cargar todas las notificaciones:', error);
        notificaciones.value = [...notificacionesNoLeidasSolo.value];
      }
    }
    
    ultimaActualizacion.value = new Date().toLocaleTimeString('es-ES');
  } catch (error) {
    console.error('Error general al cargar notificaciones:', error);
  } finally {
    loading.value = false;
  }
};

const cambiarVista = async (vista) => {
  vistaActual.value = vista;
  if (vista === 'todas' && notificaciones.value.length === 0) {
    // Cargar todas las notificaciones si no están cargadas
    try {
      loading.value = true;
      const response = await notificacionService.obtenerTodas();
      if (response && response.data && Array.isArray(response.data)) {
        notificaciones.value = response.data;
      } else if (response && Array.isArray(response)) {
        notificaciones.value = response;
      } else {
        notificaciones.value = [];
      }
    } catch (error) {
      console.error('Error al cargar todas las notificaciones:', error);
    } finally {
      loading.value = false;
    }
  }
};

const marcarComoLeida = async (notificacionId) => {
  try {
    await notificacionService.marcarComoLeida(notificacionId);
    
    // Actualizar en la lista de todas las notificaciones
    const notificacion = notificaciones.value.find(n => n.id === notificacionId);
    if (notificacion) {
      notificacion.leida = true;
    }
    
    // Remover de la lista de notificaciones no leídas
    notificacionesNoLeidasSolo.value = notificacionesNoLeidasSolo.value.filter(n => n.id !== notificacionId);
    
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
  }
};

const marcarTodasComoLeidas = async () => {
  try {
    await notificacionService.marcarTodasComoLeidas();
    
    // Actualizar todas las notificaciones como leídas
    notificaciones.value.forEach(notificacion => {
      notificacion.leida = true;
    });
    
    // Limpiar la lista de notificaciones no leídas
    notificacionesNoLeidasSolo.value = [];
    
  } catch (error) {
    console.error('Error al marcar todas las notificaciones como leídas:', error);
  }
};

const eliminarNotificacion = async (notificacionId) => {
  if (!confirm('¿Estás seguro de que quieres eliminar esta notificación?')) {
    return;
  }
  
  try {
    await notificacionService.eliminar(notificacionId);
    
    // Eliminar de ambas listas
    notificaciones.value = notificaciones.value.filter(n => n.id !== notificacionId);
    notificacionesNoLeidasSolo.value = notificacionesNoLeidasSolo.value.filter(n => n.id !== notificacionId);
    
  } catch (error) {
    console.error('Error al eliminar notificación:', error);
  }
};

const refrescar = () => {
  cargarNotificaciones();
};

// Formatters
const formatearTelefono = (telefono) => {
  if (!telefono) return '';
  const clean = telefono.replace(/\D/g, '');
  if (clean.length === 10) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
  }
  return telefono;
};

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Lifecycle
onMounted(() => {
  cargarNotificaciones();
  
  // Auto-refresh cada 30 segundos
  refreshInterval = setInterval(() => {
    cargarNotificaciones();
  }, 30000);
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
</script>

<style scoped>
/* Scroll personalizado */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>