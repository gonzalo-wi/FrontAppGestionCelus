<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium text-gray-900">Filtros</h3>
      <button @click="clearFilters" 
              class="text-sm text-gray-500 hover:text-gray-700">
        Limpiar filtros
      </button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Código Interno</label>
        <input 
          v-model="filters.codigoInterno"
          type="text" 
          placeholder="Buscar por código"
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Código APP</label>
        <input 
          v-model="filters.codigoApp"
          type="text" 
          placeholder="Buscar por código APP"
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Marca</label>
        <input 
          v-model="filters.marca"
          type="text" 
          placeholder="Buscar por marca"
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
        <select v-model="filters.estado" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
          <option value="">Todos los estados</option>
          <option value="NUEVO">Nuevo</option>
          <option value="REACONDICIONADO">Reacondicionado</option>
          <option value="ROTO">Roto</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
        <input 
          v-model="filters.usuario"
          type="text" 
          placeholder="Buscar por usuario"
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Asignación</label>
        <select v-model="filters.asignado" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
          <option value="">Todos</option>
          <option value="true">Asignados</option>
          <option value="false">Sin asignar</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const emit = defineEmits(['filter']);

const filters = reactive({
  codigoInterno: '',
  codigoApp: '',
  marca: '',
  estado: '',
  usuario: '',
  asignado: ''
});

const clearFilters = () => {
  filters.codigoInterno = '';
  filters.codigoApp = '';
  filters.marca = '';
  filters.estado = '';
  filters.usuario = '';
  filters.asignado = '';
};

// Emitir cambios de filtros
watch(filters, (newFilters) => {
  emit('filter', { ...newFilters });
}, { deep: true });
</script>
