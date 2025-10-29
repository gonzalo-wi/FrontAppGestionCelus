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

      <!-- Filtro por usuario con predictivo -->
      <div class="relative">
        <label class="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
        <input 
          v-model="usuarioSearch"
          @input="onUsuarioFilterSearch"
          @focus="showUsuarioFilterSuggestions = true"
          @blur="hideUsuarioFilterSuggestions"
          type="text"
          placeholder="Buscar usuario..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          autocomplete="off"
        />
        
        <!-- Lista de sugerencias para usuario -->
        <div v-if="showUsuarioFilterSuggestions && filteredUsuariosFilter.length > 0" 
             class="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          <div 
            v-for="usuario in filteredUsuariosFilter" 
            :key="usuario.numReparto"
            @mousedown="selectUsuarioFilter(usuario)"
            class="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">{{ usuario.numReparto }}</p>
                <p class="text-sm text-gray-600">{{ usuario.region }}</p>
              </div>
              <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                {{ usuario.region }}
              </span>
            </div>
          </div>
          <!-- Opción para limpiar filtro -->
          <div 
            @mousedown="clearUsuarioFilter"
            class="px-3 py-2 hover:bg-red-50 cursor-pointer border-t border-gray-200 text-center text-sm text-red-600 font-medium"
          >
            🗑️ Limpiar filtro de usuario
          </div>
        </div>
        
        <!-- Usuario seleccionado -->
        <div v-if="selectedUsuarioFilter" class="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-sm font-medium text-blue-800">
            {{ selectedUsuarioFilter.numReparto }} - {{ selectedUsuarioFilter.region }}
          </p>
        </div>
      </div>

      <!-- Filtro por celular con predictivo -->
      <div class="relative">
        <label class="block text-sm font-medium text-gray-700 mb-2">Celular</label>
        <input 
          v-model="celularSearch"
          @input="onCelularFilterSearch"
          @focus="showCelularFilterSuggestions = true"
          @blur="hideCelularFilterSuggestions"
          type="text"
          placeholder="Código interno o serie..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          autocomplete="off"
        />
        
        <!-- Lista de sugerencias para celular -->
        <div v-if="showCelularFilterSuggestions && filteredCelularesFilter.length > 0" 
             class="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          <div 
            v-for="celular in filteredCelularesFilter" 
            :key="celular.numeroSerie"
            @mousedown="selectCelularFilter(celular)"
            class="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">{{ celular.codigoInterno }}</p>
                <p class="text-sm text-gray-600">{{ celular.marca }} {{ celular.modelo }}</p>
                <p class="text-xs text-gray-500">Serie: {{ celular.numeroSerie }}</p>
              </div>
              <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                    :class="{
                      'bg-green-100 text-green-800': celular.estado === 'DISPONIBLE',
                      'bg-blue-100 text-blue-800': celular.estado === 'ENTREGADO',
                      'bg-red-100 text-red-800': celular.estado === 'ROTO'
                    }">
                {{ celular.estado }}
              </span>
            </div>
          </div>
          <!-- Opción para limpiar filtro -->
          <div 
            @mousedown="clearCelularFilter"
            class="px-3 py-2 hover:bg-red-50 cursor-pointer border-t border-gray-200 text-center text-sm text-red-600 font-medium"
          >
            🗑️ Limpiar filtro de celular
          </div>
        </div>
        
        <!-- Celular seleccionado -->
        <div v-if="selectedCelularFilter" class="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-sm font-medium text-green-800">
            {{ selectedCelularFilter.codigoInterno }} - {{ selectedCelularFilter.marca }} {{ selectedCelularFilter.modelo }}
          </p>
          <p class="text-xs text-green-600">Serie: {{ selectedCelularFilter.numeroSerie }}</p>
        </div>
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
          <option value="NORTE">NORTE</option>
          <option value="SUR">SUR</option>
          <option value="ESTE">ESTE</option>
          <option value="OESTE">OESTE</option>
          <option value="NAFA">NAFA</option>
          <option value="LA_PLATA">LA PLATA</option>
          <option value="PROMOCION">PROMOCION</option>
          <option value="GASTRONOMIA">GASTRONOMIA</option>
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

// Estados para campos predictivos de usuario
const usuarioSearch = ref('');
const selectedUsuarioFilter = ref(null);
const showUsuarioFilterSuggestions = ref(false);

// Estados para campos predictivos de celular
const celularSearch = ref('');
const selectedCelularFilter = ref(null);
const showCelularFilterSuggestions = ref(false);

// Computed para filtrar usuarios en el filtro
const filteredUsuariosFilter = computed(() => {
  if (!usuarioSearch.value || usuarioSearch.value.length < 1) {
    return props.usuarios.slice(0, 8); // Mostrar menos resultados en filtros
  }
  
  const searchTerm = usuarioSearch.value.toLowerCase();
  return props.usuarios.filter(usuario => {
    return (
      usuario.numReparto?.toLowerCase().includes(searchTerm) ||
      usuario.region?.toLowerCase().includes(searchTerm) ||
      usuario.nombre?.toLowerCase().includes(searchTerm)
    );
  }).slice(0, 8);
});

// Computed para filtrar celulares en el filtro
const filteredCelularesFilter = computed(() => {
  if (!celularSearch.value || celularSearch.value.length < 1) {
    return props.celulares.slice(0, 8); // Mostrar menos resultados en filtros
  }
  
  const searchTerm = celularSearch.value.toLowerCase();
  return props.celulares.filter(celular => {
    return (
      celular.codigoInterno?.toLowerCase().includes(searchTerm) ||
      celular.numeroSerie?.toString().includes(searchTerm) ||
      celular.marca?.toLowerCase().includes(searchTerm) ||
      celular.modelo?.toLowerCase().includes(searchTerm)
    );
  }).slice(0, 8);
});

// Métodos para manejo de usuario en filtros
const onUsuarioFilterSearch = () => {
  selectedUsuarioFilter.value = null;
  filtros.value.usuario = '';
  showUsuarioFilterSuggestions.value = true;
  aplicarFiltros();
};

const selectUsuarioFilter = (usuario) => {
  selectedUsuarioFilter.value = usuario;
  usuarioSearch.value = `${usuario.numReparto} - ${usuario.region}`;
  filtros.value.usuario = usuario.numReparto;
  showUsuarioFilterSuggestions.value = false;
  aplicarFiltros();
};

const clearUsuarioFilter = () => {
  selectedUsuarioFilter.value = null;
  usuarioSearch.value = '';
  filtros.value.usuario = '';
  showUsuarioFilterSuggestions.value = false;
  aplicarFiltros();
};

const hideUsuarioFilterSuggestions = () => {
  setTimeout(() => {
    showUsuarioFilterSuggestions.value = false;
  }, 150);
};

// Métodos para manejo de celular en filtros
const onCelularFilterSearch = () => {
  selectedCelularFilter.value = null;
  filtros.value.celular = '';
  showCelularFilterSuggestions.value = true;
  aplicarFiltros();
};

const selectCelularFilter = (celular) => {
  selectedCelularFilter.value = celular;
  celularSearch.value = celular.codigoInterno;
  filtros.value.celular = celular.numeroSerie;
  showCelularFilterSuggestions.value = false;
  aplicarFiltros();
};

const clearCelularFilter = () => {
  selectedCelularFilter.value = null;
  celularSearch.value = '';
  filtros.value.celular = '';
  showCelularFilterSuggestions.value = false;
  aplicarFiltros();
};

const hideCelularFilterSuggestions = () => {
  setTimeout(() => {
    showCelularFilterSuggestions.value = false;
  }, 150);
};

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
  
  // Limpiar campos predictivos
  usuarioSearch.value = '';
  selectedUsuarioFilter.value = null;
  showUsuarioFilterSuggestions.value = false;
  
  celularSearch.value = '';
  selectedCelularFilter.value = null;
  showCelularFilterSuggestions.value = false;
  
  aplicarFiltros();
};
</script>
