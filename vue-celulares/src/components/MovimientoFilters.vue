<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 flex items-center">
        <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"></path>
        </svg>
        Filtros de Movimientos
      </h3>
      <button @click="limpiarFiltros" 
              class="text-sm text-gray-500 hover:text-gray-700 font-medium">
        Limpiar filtros
      </button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Filtro por fecha desde -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Fecha desde</label>
        <input 
          v-model="filtros.fechaDesde"
          type="date" 
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          @change="aplicarFiltros"
        />
      </div>

      <!-- Filtro por fecha hasta -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Fecha hasta</label>
        <input 
          v-model="filtros.fechaHasta"
          type="date" 
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          @change="aplicarFiltros"
        />
      </div>

      <!-- Filtro por usuario -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
        <select 
          v-model="filtros.usuario"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          @change="aplicarFiltros"
        >
          <option value="">Todos los usuarios</option>
          <option v-for="usuario in usuarios" :key="usuario.numReparto" :value="usuario.numReparto">
            {{ usuario.numReparto }} - {{ usuario.region }}
          </option>
        </select>
      </div>

      <!-- Filtro por celular -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Celular (Serie)</label>
        <select 
          v-model="filtros.celular"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          @change="aplicarFiltros"
        >
          <option value="">Todos los celulares</option>
          <option v-for="celular in celulares" :key="celular.numeroSerie" :value="celular.numeroSerie">
            Serie: {{ celular.numeroSerie }} - {{ celular.marca }} {{ celular.modelo }}
          </option>
        </select>
      </div>
    </div>

    <!-- Filtros adicionales -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <!-- Búsqueda por descripción -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Buscar en descripción</label>
        <div class="relative">
          <input 
            v-model="filtros.descripcion"
            type="text" 
            placeholder="Buscar movimientos..."
            class="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            @input="aplicarFiltros"
          />
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      <!-- Filtro por región -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Región</label>
        <select 
          v-model="filtros.region"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          @change="aplicarFiltros"
        >
          <option value="">Todas las regiones</option>
          <option value="REGION_1">Región 1</option>
          <option value="REGION_2">Región 2</option>
          <option value="REGION_3">Región 3</option>
        </select>
      </div>

      <!-- Ordenar por -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
        <select 
          v-model="filtros.ordenar"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          @change="aplicarFiltros"
        >
          <option value="fecha_desc">Fecha (más reciente)</option>
          <option value="fecha_asc">Fecha (más antigua)</option>
          <option value="usuario">Usuario</option>
          <option value="celular">Número de serie</option>
        </select>
      </div>
    </div>

    <!-- Indicadores de filtros activos -->
    <div class="mt-4 flex flex-wrap gap-2" v-if="tieneFiltrosActivos">
      <span class="text-sm text-gray-600">Filtros activos:</span>
      <span v-if="filtros.fechaDesde" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        Desde: {{ filtros.fechaDesde }}
        <button @click="filtros.fechaDesde = ''; aplicarFiltros()" class="ml-2 text-purple-600 hover:text-purple-800">×</button>
      </span>
      <span v-if="filtros.fechaHasta" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        Hasta: {{ filtros.fechaHasta }}
        <button @click="filtros.fechaHasta = ''; aplicarFiltros()" class="ml-2 text-purple-600 hover:text-purple-800">×</button>
      </span>
      <span v-if="filtros.usuario" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        Usuario: {{ filtros.usuario }}
        <button @click="filtros.usuario = ''; aplicarFiltros()" class="ml-2 text-purple-600 hover:text-purple-800">×</button>
      </span>
      <span v-if="filtros.celular" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        Serie: {{ filtros.celular }}
        <button @click="filtros.celular = ''; aplicarFiltros()" class="ml-2 text-purple-600 hover:text-purple-800">×</button>
      </span>
      <span v-if="filtros.descripcion" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        Descripción: {{ filtros.descripcion }}
        <button @click="filtros.descripcion = ''; aplicarFiltros()" class="ml-2 text-purple-600 hover:text-purple-800">×</button>
      </span>
      <span v-if="filtros.region" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        Región: {{ filtros.region }}
        <button @click="filtros.region = ''; aplicarFiltros()" class="ml-2 text-purple-600 hover:text-purple-800">×</button>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  usuarios: {
    type: Array,
    default: () => []
  },
  celulares: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['filter']);

const filtros = ref({
  fechaDesde: '',
  fechaHasta: '',
  usuario: '',
  celular: '',
  descripcion: '',
  region: '',
  ordenar: 'fecha_desc'
});

const tieneFiltrosActivos = computed(() => {
  return filtros.value.fechaDesde || 
         filtros.value.fechaHasta || 
         filtros.value.usuario || 
         filtros.value.celular || 
         filtros.value.descripcion || 
         filtros.value.region;
});

const aplicarFiltros = () => {
  emit('filter', { ...filtros.value });
};

const limpiarFiltros = () => {
  filtros.value = {
    fechaDesde: '',
    fechaHasta: '',
    usuario: '',
    celular: '',
    descripcion: '',
    region: '',
    ordenar: 'fecha_desc'
  };
  aplicarFiltros();
};
</script>
