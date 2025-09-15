<template>
  <div class="relative">
    <!-- Botón de alertas -->
    <button
      @click="togglePanel"
      class="relative p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
      :class="{ 'animate-pulse': alertasCount > 0 }"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-3.5-3.5a.5.5 0 010-.707l.5-.5a.5.5 0 000-.707L15 10V9a6 6 0 10-12 0v1L1.5 11.5a.5.5 0 000 .707l.5.5a.5.5 0 010 .707L5 17h5m5 0v1a3 3 0 11-6 0v-1m6 0H9"/>
      </svg>
      
      <!-- Badge contador -->
      <span
        v-if="alertasCount > 0"
        class="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full min-w-[18px]"
      >
        {{ alertasCount > 99 ? '99+' : alertasCount }}
      </span>
    </button>

    <!-- Panel desplegable -->
    <div
      v-if="showPanel"
      class="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b">
        <h3 class="font-semibold text-gray-900">Alertas</h3>
        <button
          @click="showPanel = false"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Contenido -->
      <div class="max-h-96 overflow-y-auto">
        <div v-if="loading" class="p-4 text-center text-gray-500">
          Cargando alertas...
        </div>
        
        <div v-else-if="alertas.length === 0" class="p-4 text-center text-gray-500">
          No hay alertas pendientes
        </div>
        
        <div v-else>
          <div
            v-for="alerta in alertas"
            :key="alerta.id"
            class="p-4 border-b border-gray-100 hover:bg-gray-50"
            :class="{ 'bg-red-50': !alerta.leida }"
          >
            <div class="flex justify-between items-start mb-2">
              <p class="text-sm font-medium text-gray-900">{{ alerta.mensaje }}</p>
              <div class="flex gap-1 ml-2">
                <button
                  v-if="!alerta.leida"
                  @click="marcarLeida(alerta.id)"
                  class="text-blue-600 hover:text-blue-800 text-xs"
                  title="Marcar como leída"
                >
                  ✓
                </button>
                <button
                  @click="eliminar(alerta.id)"
                  class="text-red-600 hover:text-red-800 text-xs"
                  title="Eliminar"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div class="text-xs text-gray-600 space-y-1">
              <p><strong>Solicitud:</strong> {{ alerta.solicitud.id }}</p>
              <p><strong>Solicitante:</strong> {{ alerta.solicitud.nomSolicitante }}</p>
              <p><strong>Estado:</strong> {{ alerta.solicitud.estado }}</p>
              <p><strong>Fecha:</strong> {{ formatDate(alerta.fechaCreacion) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-3 border-t bg-gray-50">
        <button
          @click="refresh"
          class="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Actualizar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

// Estados
const alertas = ref([])
const loading = ref(false)
const showPanel = ref(false)
let intervalId = null

// Computed
const alertasCount = computed(() => alertas.value.filter(a => !a.leida).length)

// Métodos
const togglePanel = () => {
  showPanel.value = !showPanel.value
  if (showPanel.value) {
    cargarAlertas()
  }
}

const cargarAlertas = async () => {
  try {
    loading.value = true
    const response = await fetch('/api/alertas', {
      headers: {
        'Authorization': 'Basic ' + localStorage.getItem('auth')
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      alertas.value = data || []
    }
  } catch (error) {
    console.error('Error cargando alertas:', error)
  } finally {
    loading.value = false
  }
}

const marcarLeida = async (alertaId) => {
  try {
    const response = await fetch(`/api/alertas/${alertaId}/marcar-leida`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Basic ' + localStorage.getItem('auth')
      }
    })
    
    if (response.ok) {
      const alerta = alertas.value.find(a => a.id === alertaId)
      if (alerta) alerta.leida = true
    }
  } catch (error) {
    console.error('Error marcando alerta:', error)
  }
}

const eliminar = async (alertaId) => {
  try {
    const response = await fetch(`/api/alertas/${alertaId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Basic ' + localStorage.getItem('auth')
      }
    })
    
    if (response.ok) {
      alertas.value = alertas.value.filter(a => a.id !== alertaId)
    }
  } catch (error) {
    console.error('Error eliminando alerta:', error)
  }
}

const refresh = () => {
  cargarAlertas()
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('es-ES')
}

// Auto-refresh
onMounted(() => {
  cargarAlertas()
  intervalId = setInterval(cargarAlertas, 30000) // cada 30 segundos
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>
