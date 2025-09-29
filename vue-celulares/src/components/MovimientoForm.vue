<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative overflow-visible">
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
        
        <!-- Campo predictivo para celular por código interno -->
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-2">Código Interno del Celular</label>
          <input 
            v-model="celularSearch"
            @input="onCelularSearch"
            @focus="showCelularSuggestions = true"
            @blur="hideCelularSuggestions"
            type="text" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Escribe el código interno..."
            autocomplete="off"
          />
          
          <!-- Lista de sugerencias para celular -->
          <div v-if="showCelularSuggestions && filteredCelulares.length > 0" 
               class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
            <div 
              v-for="celular in filteredCelulares" 
              :key="celular.numeroSerie"
              @mousedown="selectCelular(celular)"
              class="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900">{{ celular.codigoInterno }}</p>
                  <p class="text-sm text-gray-600">{{ celular.marca }} {{ celular.modelo }}</p>
                </div>
                <div class="text-right">
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
            </div>
          </div>
          
          <!-- Celular seleccionado -->
          <div v-if="selectedCelular" class="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-sm font-medium text-green-800">
              {{ selectedCelular.codigoInterno }} - {{ selectedCelular.marca }} {{ selectedCelular.modelo }}
            </p>
            <p class="text-xs text-green-600">Serie: {{ selectedCelular.numeroSerie }}</p>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Campo predictivo para usuario -->
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
          <input 
            ref="usuarioInput"
            v-model="usuarioSearch"
            @input="onUsuarioSearch"
            @focus="showUsuarioSuggestions = true; checkDropdownPosition()"
            @blur="hideUsuarioSuggestions"
            type="text" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Escribe el número de reparto o región..."
            autocomplete="off"
          />
          
          <!-- Lista de sugerencias para usuario con posicionamiento dinámico -->
          <div v-if="showUsuarioSuggestions && filteredUsuarios.length > 0" 
               :class="[
                 'absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-2xl max-h-60 overflow-y-auto',
                 shouldShowUsuarioDropdownAbove ? 'bottom-full mb-1' : 'top-full mt-1'
               ]">
            <div 
              v-for="usuario in filteredUsuarios" 
              :key="usuario.numReparto"
              @mousedown="selectUsuario(usuario)"
              class="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900">{{ usuario.numReparto }}</p>
                  <p class="text-sm text-gray-600">{{ usuario.region }}</p>
                </div>
                <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {{ usuario.estado || 'ACTIVO' }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Usuario seleccionado -->
          <div v-if="selectedUsuario" class="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <p class="text-sm font-medium text-blue-800">
              {{ selectedUsuario.numReparto }} - {{ selectedUsuario.region }}
            </p>
          </div>
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
        <button type="submit" :disabled="loading || !selectedCelular || !selectedUsuario"
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
import { reactive, ref, computed, nextTick } from 'vue';

const props = defineProps({
  celulares: { type: Array, default: () => [] },
  usuarios: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(['save']);

const form = reactive({
  fecha: new Date().toISOString().split('T')[0],
  descripcion: ''
});

// Referencias para los elementos
const usuarioInput = ref(null);

// Estados para el campo predictivo de celular
const celularSearch = ref('');
const selectedCelular = ref(null);
const showCelularSuggestions = ref(false);

// Estados para el campo predictivo de usuario
const usuarioSearch = ref('');
const selectedUsuario = ref(null);
const showUsuarioSuggestions = ref(false);
const shouldShowUsuarioDropdownAbove = ref(false);

// Computed para filtrar celulares
const filteredCelulares = computed(() => {
  console.log('🔍 Filtrando celulares - Búsqueda:', celularSearch.value);
  
  if (!celularSearch.value || celularSearch.value.trim().length === 0) {
    console.log('📋 Sin búsqueda, mostrando primeros 20 ordenados');
    // Mostrar primeros 20 ordenados por código interno numéricamente
    return props.celulares
      .slice()
      .sort((a, b) => {
        const numA = parseInt(a.codigoInterno) || 0;
        const numB = parseInt(b.codigoInterno) || 0;
        return numA - numB;
      })
      .slice(0, 20);
  }
  
  const searchTerm = celularSearch.value.trim().toLowerCase();
  console.log('🎯 Término de búsqueda:', searchTerm);
  
  const filtered = props.celulares.filter(celular => {
    const codigoInterno = celular.codigoInterno?.toString().toLowerCase() || '';
    const numeroSerie = celular.numeroSerie?.toString().toLowerCase() || '';
    const marca = celular.marca?.toLowerCase() || '';
    const modelo = celular.modelo?.toLowerCase() || '';
    
    const matches = (
      codigoInterno.includes(searchTerm) ||
      numeroSerie.includes(searchTerm) ||
      marca.includes(searchTerm) ||
      modelo.includes(searchTerm)
    );
    
    if (matches) {
      console.log('✅ Coincidencia encontrada:', {
        codigoInterno: celular.codigoInterno,
        marca: celular.marca,
        modelo: celular.modelo
      });
    }
    
    return matches;
  })
  .sort((a, b) => {
    // Ordenar por coincidencia exacta primero, luego numéricamente
    const aExact = a.codigoInterno?.toString().toLowerCase() === searchTerm;
    const bExact = b.codigoInterno?.toString().toLowerCase() === searchTerm;
    
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    
    // Si ambos o ninguno es exacto, ordenar numéricamente
    const numA = parseInt(a.codigoInterno) || 0;
    const numB = parseInt(b.codigoInterno) || 0;
    return numA - numB;
  })
  .slice(0, 20);
  
  console.log('📊 Resultados filtrados:', filtered.length);
  return filtered;
});

// Computed para filtrar usuarios
const filteredUsuarios = computed(() => {
  if (!usuarioSearch.value || usuarioSearch.value.trim().length === 0) {
    return props.usuarios.slice(0, 10); // Mostrar los primeros 10 si no hay búsqueda
  }
  
  const searchTerm = usuarioSearch.value.trim().toLowerCase();
  const filtered = props.usuarios.filter(usuario => {
    const numReparto = usuario.numReparto?.toString().toLowerCase() || '';
    const region = usuario.region?.toLowerCase() || '';
    const nombre = usuario.nombre?.toLowerCase() || '';
    const zona = usuario.zona?.toLowerCase() || '';
    
    return (
      numReparto.includes(searchTerm) ||
      region.includes(searchTerm) ||
      nombre.includes(searchTerm) ||
      zona.includes(searchTerm) ||
      // Búsqueda exacta por número
      numReparto === searchTerm
    );
  }).slice(0, 15); // Aumentar a 15 resultados
  
  // Ordenar resultados: coincidencias exactas primero
  return filtered.sort((a, b) => {
    const aNumReparto = a.numReparto?.toString().toLowerCase() || '';
    const bNumReparto = b.numReparto?.toString().toLowerCase() || '';
    
    if (aNumReparto === searchTerm && bNumReparto !== searchTerm) return -1;
    if (bNumReparto === searchTerm && aNumReparto !== searchTerm) return 1;
    if (aNumReparto.startsWith(searchTerm) && !bNumReparto.startsWith(searchTerm)) return -1;
    if (bNumReparto.startsWith(searchTerm) && !aNumReparto.startsWith(searchTerm)) return 1;
    
    return 0;
  });
});

// Métodos para manejo de celular
const onCelularSearch = () => {
  selectedCelular.value = null;
  showCelularSuggestions.value = true;
  
  // Debug logs
  console.log('🔍 Búsqueda de celular:', celularSearch.value);
  console.log('📱 Total celulares disponibles:', props.celulares.length);
  console.log('🎯 Celulares filtrados:', filteredCelulares.value.length);
  console.log('📋 Primeros 5 resultados:', filteredCelulares.value.slice(0, 5));
};

const selectCelular = (celular) => {
  selectedCelular.value = celular;
  celularSearch.value = celular.codigoInterno;
  showCelularSuggestions.value = false;
};

const hideCelularSuggestions = () => {
  setTimeout(() => {
    showCelularSuggestions.value = false;
  }, 150); // Delay para permitir el click en las sugerencias
};

// Métodos para manejo de usuario
const onUsuarioSearch = () => {
  selectedUsuario.value = null;
  showUsuarioSuggestions.value = true;
  checkDropdownPosition();
  
  // Debug logs para usuarios
  console.log('🔍 Búsqueda de usuario:', usuarioSearch.value);
  console.log('👥 Total usuarios disponibles:', props.usuarios.length);
  console.log('🎯 Usuarios filtrados:', filteredUsuarios.value.length);
  console.log('📋 Primeros 5 resultados:', filteredUsuarios.value.slice(0, 5));
};

const selectUsuario = (usuario) => {
  selectedUsuario.value = usuario;
  usuarioSearch.value = usuario.numReparto?.toString() || '';
  showUsuarioSuggestions.value = false;
  
  console.log('👤 Usuario seleccionado:', usuario);
};

const hideUsuarioSuggestions = () => {
  setTimeout(() => {
    showUsuarioSuggestions.value = false;
  }, 150); // Delay para permitir el click en las sugerencias
};

// Función para verificar si el dropdown debe mostrarse arriba
const checkDropdownPosition = async () => {
  await nextTick();
  if (usuarioInput.value) {
    const inputRect = usuarioInput.value.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = 240; // max-h-60 = ~240px
    const spaceBelow = viewportHeight - inputRect.bottom;
    const spaceAbove = inputRect.top;
    
    // Si no hay suficiente espacio abajo pero sí arriba, mostrar arriba
    shouldShowUsuarioDropdownAbove.value = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;
  }
};

const resetForm = () => {
  form.fecha = new Date().toISOString().split('T')[0];
  form.descripcion = '';
  
  // Reset campos predictivos
  celularSearch.value = '';
  selectedCelular.value = null;
  showCelularSuggestions.value = false;
  
  usuarioSearch.value = '';
  selectedUsuario.value = null;
  showUsuarioSuggestions.value = false;
};

const guardar = () => {
  if (!selectedCelular.value || !selectedUsuario.value) {
    alert('Por favor selecciona un celular y un usuario');
    return;
  }
  
  const movimiento = {
    fecha: form.fecha,
    celular: { numeroSerie: selectedCelular.value.numeroSerie },
    usuario: { numReparto: selectedUsuario.value.numReparto },
    descripcion: form.descripcion
  };
  
  emit('save', movimiento);
  resetForm();
};

// Exponer método para reset desde el componente padre
defineExpose({ resetForm });
</script>
