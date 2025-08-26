<template>
  <div v-if="show" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-2xl transform transition-all duration-300">
      <div class="p-8">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Editar Movimiento
            </h2>
          </div>
          <button @click="$emit('close')" class="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="guardar" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Fecha -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Fecha *</label>
              <input 
                v-model="form.fecha"
                type="date" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              />
            </div>

            <!-- Tipo -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
              <select 
                v-model="form.tipo"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              >
                <option value="">Seleccionar tipo</option>
                <option value="ASIGNACION">Asignación</option>
                <option value="CAMBIO">Cambio de usuario</option>
                <option value="DEVOLUCION">Devolución</option>
                <option value="REPARACION">Reparación</option>
                <option value="BAJA">Baja del equipo</option>
              </select>
            </div>
          </div>

          <!-- Celular -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Celular *</label>
            <select 
              v-model="form.celularId"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            >
              <option value="">Seleccionar celular</option>
              <option 
                v-for="celular in celulares" 
                :key="celular.numeroSerie" 
                :value="celular.numeroSerie"
              >
                {{ celular.marca }} {{ celular.modelo }} - {{ celular.numeroSerie }}
              </option>
            </select>
          </div>

          <!-- Usuario -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Usuario *</label>
            <select 
              v-model="form.usuarioId"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            >
              <option value="">Seleccionar usuario</option>
              <option 
                v-for="usuario in usuarios" 
                :key="usuario.numReparto" 
                :value="usuario.numReparto"
              >
                {{ usuario.numReparto }} - {{ usuario.region }}
              </option>
            </select>
          </div>

          <!-- Descripción -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Descripción / Motivo *</label>
            <textarea 
              v-model="form.descripcion"
              required
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              placeholder="Describe el motivo del movimiento..."
            ></textarea>
          </div>

          <!-- Botones -->
          <div class="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button 
              type="button"
              @click="$emit('close')"
              class="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              :disabled="loading"
              class="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-white bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              <svg v-if="loading" class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  show: { type: Boolean, default: false },
  movimiento: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  celulares: { type: Array, default: () => [] },
  usuarios: { type: Array, default: () => [] }
});

const emit = defineEmits(['close', 'save']);

const form = reactive({
  fecha: '',
  tipo: '',
  descripcion: '',
  celularId: '',
  usuarioId: ''
});

// Watch para cargar datos cuando cambie el movimiento
watch(() => props.movimiento, (newMovimiento) => {
  if (newMovimiento) {
    form.fecha = newMovimiento.fecha;
    form.tipo = newMovimiento.tipo || '';
    form.descripcion = newMovimiento.descripcion || '';
    form.celularId = newMovimiento.celular?.numeroSerie || '';
    form.usuarioId = newMovimiento.usuario?.numReparto || '';
  } else {
    // Reset form
    form.fecha = '';
    form.tipo = '';
    form.descripcion = '';
    form.celularId = '';
    form.usuarioId = '';
  }
}, { immediate: true });

const guardar = () => {
  const movimientoData = {
    fecha: form.fecha,
    tipo: form.tipo,
    descripcion: form.descripcion,
    celularId: form.celularId,
    usuarioId: form.usuarioId
  };
  
  emit('save', movimientoData);
};
</script>
