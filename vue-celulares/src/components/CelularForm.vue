<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">{{ isEditing ? 'Editar Celular' : 'Crear Celular' }}</h2>
        <p class="text-sm text-gray-500 mt-1">{{ isEditing ? 'Modifica los datos del celular' : 'Agrega un nuevo celular al inventario' }}</p>
      </div>
      <div class="flex space-x-2">
        <button v-if="isEditing" @click="cancelEdit" 
                class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Cancelar
        </button>
      </div>
    </div>

    <form @submit.prevent="guardar" class="space-y-4">
      <!-- Código Interno (siempre visible) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Código Interno *
        </label>
        <input 
          v-model="form.codigoInterno"
          type="text" 
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ej: SAM001"
        />
        <p class="text-xs text-gray-500 mt-1">Código interno único para el inventario</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Marca</label>
          <input 
            v-model="form.marca"
            type="text" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Samsung, iPhone, Xiaomi"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Modelo</label>
          <input 
            v-model="form.modelo"
            type="text" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Galaxy S21, iPhone 13"
          />
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
        <select v-model="form.estado" required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option value="NUEVO">Nuevo</option>
          <option value="REACONDICIONADO">Reacondicionado</option>
          <option value="ROTO">Roto</option>
        </select>
      </div>

      <!-- Nuevos campos agregados -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Código de Aplicación</label>
          <input 
            v-model="form.codigoDeAplicacion"
            type="text" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: APP001"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Cantidad de Roturas</label>
          <input 
            v-model.number="form.cantRoturas"
            type="number" 
            min="0"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex items-center">
          <input 
            id="tieneTemplado"
            v-model="form.tieneTemplado"
            type="checkbox" 
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="tieneTemplado" class="ml-2 block text-sm font-medium text-gray-700">
            Tiene Templado
          </label>
        </div>
        <div class="flex items-center">
          <input 
            id="tieneFunda"
            v-model="form.tieneFunda"
            type="checkbox" 
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="tieneFunda" class="ml-2 block text-sm font-medium text-gray-700">
            Tiene Funda
          </label>
        </div>
      </div>

      <div class="flex justify-end pt-4 border-t border-gray-200">
        <button type="submit" :disabled="loading"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
          <svg v-if="loading" class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          {{ isEditing ? 'Actualizar' : 'Crear' }} Celular
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, watch, computed } from 'vue';

const props = defineProps({
  celular: { type: Object, default: null },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(['save', 'cancel']);

const form = reactive({
  codigoInterno: '',
  marca: '',
  modelo: '',
  tieneTemplado: false,
  tieneFunda: false,
  codigoDeAplicacion: '',
  cantRoturas: 0,
  estado: 'NUEVO'
});

const isEditing = computed(() => !!props.celular);

const resetForm = () => {
  form.codigoInterno = '';
  form.marca = '';
  form.modelo = '';
  form.tieneTemplado = false;
  form.tieneFunda = false;
  form.codigoDeAplicacion = '';
  form.cantRoturas = 0;
  form.estado = 'NUEVO';
};

const cancelEdit = () => {
  resetForm();
  emit('cancel');
};

const guardar = () => {
  const celular = {
    codigoInterno: form.codigoInterno,
    marca: form.marca,
    modelo: form.modelo,
    tieneTemplado: form.tieneTemplado,
    tieneFunda: form.tieneFunda,
    codigoDeAplicacion: form.codigoDeAplicacion || null,
    cantRoturas: form.cantRoturas,
    estado: form.estado
  };
  
  console.log('💾 Guardando celular:', celular, 'Modo edición:', isEditing.value);
  emit('save', celular);
};

// Watch para cargar datos cuando se edita
watch(() => props.celular, (newCelular) => {
  console.log('🔧 Cargando celular para editar:', newCelular);
  if (newCelular) {
    form.codigoInterno = newCelular.codigoInterno || newCelular.numeroSerie || '';
    form.marca = newCelular.marca;
    form.modelo = newCelular.modelo;
    form.tieneTemplado = newCelular.tieneTemplado || false;
    form.tieneFunda = newCelular.tieneFunda || false;
    form.codigoDeAplicacion = newCelular.codigoDeAplicacion || '';
    form.cantRoturas = newCelular.cantRoturas || 0;
    form.estado = newCelular.estado;
    console.log('📝 Formulario actualizado:', form);
  } else {
    resetForm();
  }
}, { immediate: true });
</script>
