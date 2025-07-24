<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-900">Crear Movimiento</h2>
      <p class="text-sm text-gray-500 mt-1">Registra un nuevo movimiento de celular</p>
    </div>

    <form @submit.prevent="guardar" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
          <input 
            v-model="form.fecha"
            type="date" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Número de Serie</label>
          <select v-model="form.numeroSerie" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
            <option value="" disabled>Seleccione un celular</option>
            <option v-for="celular in celulares" :key="celular.numeroSerie" :value="celular.numeroSerie">
              {{ celular.numeroSerie }} - {{ celular.marca }} {{ celular.modelo }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
          <select v-model="form.numReparto" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
            <option value="" disabled>Seleccione un usuario</option>
            <option v-for="usuario in usuarios" :key="usuario.numReparto" :value="usuario.numReparto">
              {{ usuario.numReparto }} - {{ usuario.region }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
          <input 
            v-model="form.descripcion"
            type="text" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Ej: Entrega inicial, Cambio de usuario"
          />
        </div>
      </div>

      <div class="flex justify-end pt-4 border-t border-gray-200">
        <button type="submit" :disabled="loading"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
          <svg v-if="loading" class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          Crear Movimiento
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const props = defineProps({
  celulares: { type: Array, default: () => [] },
  usuarios: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(['save']);

const form = reactive({
  fecha: new Date().toISOString().split('T')[0],
  numeroSerie: '',
  numReparto: '',
  descripcion: ''
});

const resetForm = () => {
  form.fecha = new Date().toISOString().split('T')[0];
  form.numeroSerie = '';
  form.numReparto = '';
  form.descripcion = '';
};

const guardar = () => {
  const movimiento = {
    fecha: form.fecha,
    celular: { numeroSerie: parseInt(form.numeroSerie) },
    usuario: { numReparto: form.numReparto },
    descripcion: form.descripcion
  };
  
  emit('save', movimiento);
  resetForm();
};
</script>
