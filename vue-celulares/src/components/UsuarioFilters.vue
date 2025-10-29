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
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

      <!-- Búsqueda por línea -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Número de Línea</label>
        <div class="relative">
          <input 
            v-model="filtros.linea"
            type="text" 
            placeholder="Buscar por línea..."
            class="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            @input="aplicarFiltros"
          />
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
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
          <option value="NORTE">NORTE</option>
          <option value="SUR">SUR</option>
          <option value="ESTE">ESTE</option>
          <option value="OESTE">OESTE</option>
          <option value="NAFA">NAFA</option>
          <option value="LA_PLATA">LA PLATA</option>
          <option value="LAVAZZA">LAVAZZA</option>
          <option value="TALLER">TALLER</option>
          <option value="IMPACTO">IMPACTO</option>
          <option value="COMERCIAL">COMERCIAL</option>
          <option value="GERENCIA">GERENCIA</option>
          <option value="PLANTA">PLANTA</option>
          <option value="SISTEMAS">SISTEMAS</option>
          <option value="RRHH">RRHH</option>
          <option value="ADMINISTRACION">ADMINISTRACION</option>
          <option value="COMPRAS">COMPRAS</option>
          <option value="PROMOCION">PROMOCION</option>
          <option value="GASTRONOMIA">GASTRONOMIA</option>
        </select>
      </div>

      <!-- Filtro por cargo -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Cargo</label>
        <select 
          v-model="filtros.cargo"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          @change="aplicarFiltros"
        >
          <option value="">Todos los cargos</option>
          <option value="REPARTIDOR">REPARTIDOR</option>
          <option value="SUPERVISOR">SUPERVISOR</option>
          <option value="REGIONAL">REGIONAL</option>
          <option value="AYUDANTE">AYUDANTE</option>
          <option value="AYUDANTE_ROTATIVO">AYUDANTE ROTATIVO</option>
          <option value="SUPLENTE">SUPLENTE</option>
          <option value="ANALISTA">ANALISTA</option>
          <option value="JEFE">JEFE</option>
          <option value="GERENTE">GERENTE</option>
          <option value="SIN_CARGO">Sin cargo</option>
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
          <option value="">Sin ordenar</option>
          <option value="numReparto_asc">Número de reparto (A-Z)</option>
          <option value="numReparto_desc">Número de reparto (Z-A)</option>
          <option value="region">Región</option>
          <option value="cargo">Cargo</option>
        </select>
      </div>
    </div>

    <!-- Estadísticas y filtros activos -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
      <span v-if="filtros.linea" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Línea: {{ filtros.linea }}
        <button @click="filtros.linea = ''; aplicarFiltros()" class="ml-2 text-blue-600 hover:text-blue-800">×</button>
      </span>
      <span v-if="filtros.region" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Región: {{ filtros.region }}
        <button @click="filtros.region = ''; aplicarFiltros()" class="ml-2 text-green-600 hover:text-green-800">×</button>
      </span>
      <span v-if="filtros.cargo" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        Cargo: {{ filtros.cargo === 'SIN_CARGO' ? 'Sin cargo' : filtros.cargo.replace('_', ' ') }}
        <button @click="filtros.cargo = ''; aplicarFiltros()" class="ml-2 text-purple-600 hover:text-purple-800">×</button>
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
  linea: '',
  region: '',
  cargo: '',
  ordenar: ''
});

const tieneFiltrosActivos = computed(() => {
  return filtros.value.numReparto || 
         filtros.value.linea ||
         filtros.value.region ||
         filtros.value.cargo;
});

const aplicarFiltros = () => {
  emit('filter', { ...filtros.value });
};

const limpiarFiltros = () => {
  filtros.value = {
    numReparto: '',
    linea: '',
    region: '',
    cargo: '',
    ordenar: ''
  };
  aplicarFiltros();
};
</script>
