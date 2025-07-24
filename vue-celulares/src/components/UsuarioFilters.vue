<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 flex items-center">
        <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"></path>
        </svg>
        Filtros de Usuarios
      </h3>
      <button @click="limpiarFiltros" 
              class="text-sm text-gray-500 hover:text-gray-700 font-medium">
        Limpiar filtros
      </button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Búsqueda por número de reparto -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Número de Reparto</label>
        <div class="relative">
          <input 
            v-model="filtros.numReparto"
            type="text" 
            placeholder="Buscar por número..."
            class="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          @change="aplicarFiltros"
        >
          <option value="">Todas las regiones</option>
          <option value="REGION_1">Región 1</option>
          <option value="REGION_2">Región 2</option>
          <option value="REGION_3">Región 3</option>
        </select>
      </div>

      <!-- Filtro por zona -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Zona</label>
        <select 
          v-model="filtros.zona"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          @change="aplicarFiltros"
        >
          <option value="">Todas las zonas</option>
          <option value="ZONA_NORTE">Zona Norte</option>
          <option value="ZONA_SUR">Zona Sur</option>
          <option value="ZONA_ESTE">Zona Este</option>
          <option value="ZONA_OESTE">Zona Oeste</option>
          <option value="ZONA_CENTRO">Zona Centro</option>
        </select>
      </div>

      <!-- Ordenar por -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
        <select 
          v-model="filtros.ordenar"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          @change="aplicarFiltros"
        >
          <option value="numReparto_asc">Número de reparto (A-Z)</option>
          <option value="numReparto_desc">Número de reparto (Z-A)</option>
          <option value="region">Región</option>
          <option value="zona">Zona</option>
          <option value="celulares_asignados">Celulares asignados</option>
        </select>
      </div>
    </div>

    <!-- Filtros adicionales -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <!-- Estado de asignación -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Estado de asignación</label>
        <select 
          v-model="filtros.estadoAsignacion"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          @change="aplicarFiltros"
        >
          <option value="">Todos los estados</option>
          <option value="con_celulares">Con celulares asignados</option>
          <option value="sin_celulares">Sin celulares asignados</option>
        </select>
      </div>

      <!-- Vista rápida -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Vista rápida</label>
        <div class="flex space-x-2">
          <button @click="filtroRapido('region_1')" 
                  :class="[
                    'px-3 py-2 text-sm rounded-lg border transition-colors',
                    filtros.region === 'REGION_1' 
                      ? 'bg-green-100 border-green-300 text-green-800' 
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                  ]">
            R1
          </button>
          <button @click="filtroRapido('region_2')" 
                  :class="[
                    'px-3 py-2 text-sm rounded-lg border transition-colors',
                    filtros.region === 'REGION_2' 
                      ? 'bg-green-100 border-green-300 text-green-800' 
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                  ]">
            R2
          </button>
          <button @click="filtroRapido('region_3')" 
                  :class="[
                    'px-3 py-2 text-sm rounded-lg border transition-colors',
                    filtros.region === 'REGION_3' 
                      ? 'bg-green-100 border-green-300 text-green-800' 
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                  ]">
            R3
          </button>
        </div>
      </div>

      <!-- Estadísticas rápidas -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Resultados</label>
        <div class="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
          <span class="font-medium">{{ resultadosCount }}</span> usuario(s) encontrado(s)
        </div>
      </div>
    </div>

    <!-- Indicadores de filtros activos -->
    <div class="mt-4 flex flex-wrap gap-2" v-if="tieneFiltrosActivos">
      <span class="text-sm text-gray-600">Filtros activos:</span>
      <span v-if="filtros.numReparto" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Reparto: {{ filtros.numReparto }}
        <button @click="filtros.numReparto = ''; aplicarFiltros()" class="ml-2 text-green-600 hover:text-green-800">×</button>
      </span>
      <span v-if="filtros.region" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Región: {{ filtros.region }}
        <button @click="filtros.region = ''; aplicarFiltros()" class="ml-2 text-green-600 hover:text-green-800">×</button>
      </span>
      <span v-if="filtros.zona" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Zona: {{ filtros.zona }}
        <button @click="filtros.zona = ''; aplicarFiltros()" class="ml-2 text-green-600 hover:text-green-800">×</button>
      </span>
      <span v-if="filtros.estadoAsignacion" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Estado: {{ filtros.estadoAsignacion === 'con_celulares' ? 'Con celulares' : 'Sin celulares' }}
        <button @click="filtros.estadoAsignacion = ''; aplicarFiltros()" class="ml-2 text-green-600 hover:text-green-800">×</button>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  resultadosCount: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['filter']);

const filtros = ref({
  numReparto: '',
  region: '',
  zona: '',
  estadoAsignacion: '',
  ordenar: 'numReparto_asc'
});

const tieneFiltrosActivos = computed(() => {
  return filtros.value.numReparto || 
         filtros.value.region || 
         filtros.value.zona || 
         filtros.value.estadoAsignacion;
});

const aplicarFiltros = () => {
  emit('filter', { ...filtros.value });
};

const limpiarFiltros = () => {
  filtros.value = {
    numReparto: '',
    region: '',
    zona: '',
    estadoAsignacion: '',
    ordenar: 'numReparto_asc'
  };
  aplicarFiltros();
};

const filtroRapido = (tipo) => {
  switch (tipo) {
    case 'region_1':
      filtros.value.region = filtros.value.region === 'REGION_1' ? '' : 'REGION_1';
      break;
    case 'region_2':
      filtros.value.region = filtros.value.region === 'REGION_2' ? '' : 'REGION_2';
      break;
    case 'region_3':
      filtros.value.region = filtros.value.region === 'REGION_3' ? '' : 'REGION_3';
      break;
  }
  aplicarFiltros();
};
</script>
