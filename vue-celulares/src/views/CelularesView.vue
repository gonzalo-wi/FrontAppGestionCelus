
<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { crearMovimiento, obtenerMovimientos, celularService } from '@/services/celularService.ts';
import { usuarioService } from '@/services/usuarioService.ts';
import DataTable from '@/components/DataTable.vue';
import Modal from '@/components/Modal.vue';
import CelularForm from '@/components/CelularForm.vue';
import MovimientoForm from '@/components/MovimientoForm.vue';
import CelularFilters from '@/components/CelularFilters.vue';
import MovimientoFilters from '@/components/MovimientoFilters.vue';

// Estados reactivos
const celulares = ref([]);
const movimientos = ref([]);
const usuarios = ref([]);
const loading = ref(false);
const loadingCelular = ref(false);
const loadingMovimiento = ref(false);

// Modales
const showDeleteModal = ref(false);
const selectedCelular = ref(null);
const editingCelular = ref(null);

// Pestañas
const activeTab = ref('celulares');

// Filtros
const filters = ref({});
const movimientoFilters = ref({});

// Notificaciones
const notification = reactive({
  show: false,
  type: 'success',
  message: ''
});

// Configuración de tablas
const celularColumns = [
  { key: 'numeroSerie', title: 'Serie' },
  { key: 'marca', title: 'Marca' },
  { key: 'modelo', title: 'Modelo' },
  { key: 'estado', title: 'Estado' },
  { key: 'usuario.numReparto', title: 'Usuario' }
];

const movimientoColumns = [
  { key: 'fecha', title: 'Fecha' },
  { key: 'celular.numeroSerie', title: 'Serie' },
  { key: 'usuario.numReparto', title: 'Usuario' },
  { key: 'descripcion', title: 'Descripción' }
];

// Computed
const celularesFiltrados = computed(() => {
  if (!filters.value || Object.keys(filters.value).length === 0) {
    return celulares.value;
  }
  
  return celulares.value.filter(celular => {
    const { marca, estado, usuario, asignado } = filters.value;
    
    if (marca && !celular.marca.toLowerCase().includes(marca.toLowerCase())) {
      return false;
    }
    
    if (estado && celular.estado !== estado) {
      return false;
    }
    
    if (usuario && (!celular.usuario || !celular.usuario.numReparto.toLowerCase().includes(usuario.toLowerCase()))) {
      return false;
    }
    
    if (asignado === 'true' && !celular.usuario) {
      return false;
    }
    
    if (asignado === 'false' && celular.usuario) {
      return false;
    }
    
    return true;
  });
});

const movimientosFiltrados = computed(() => {
  if (!movimientoFilters.value || Object.keys(movimientoFilters.value).length === 0) {
    return movimientos.value;
  }
  
  return movimientos.value.filter(movimiento => {
    const { fechaDesde, fechaHasta, usuario, celular, descripcion, region } = movimientoFilters.value;
    
    // Filtro por fecha desde
    if (fechaDesde) {
      const fechaMovimiento = new Date(movimiento.fecha);
      const fechaDesdeDate = new Date(fechaDesde);
      if (fechaMovimiento < fechaDesdeDate) {
        return false;
      }
    }
    
    // Filtro por fecha hasta
    if (fechaHasta) {
      const fechaMovimiento = new Date(movimiento.fecha);
      const fechaHastaDate = new Date(fechaHasta);
      if (fechaMovimiento > fechaHastaDate) {
        return false;
      }
    }
    
    // Filtro por usuario
    if (usuario && movimiento.usuario?.numReparto !== usuario) {
      return false;
    }
    
    // Filtro por celular
    if (celular && movimiento.celular?.numeroSerie !== parseInt(celular)) {
      return false;
    }
    
    // Filtro por descripción
    if (descripcion && !movimiento.descripcion?.toLowerCase().includes(descripcion.toLowerCase())) {
      return false;
    }
    
    // Filtro por región
    if (region && movimiento.usuario?.region !== region) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    const { ordenar } = movimientoFilters.value;
    
    switch (ordenar) {
      case 'fecha_asc':
        return new Date(a.fecha) - new Date(b.fecha);
      case 'fecha_desc':
      default:
        return new Date(b.fecha) - new Date(a.fecha);
      case 'usuario':
        return (a.usuario?.numReparto || '').localeCompare(b.usuario?.numReparto || '');
      case 'celular':
        return (a.celular?.numeroSerie || 0) - (b.celular?.numeroSerie || 0);
    }
  });
});

// Métodos
const showNotification = (message, type = 'success') => {
  notification.message = message;
  notification.type = type;
  notification.show = true;
  setTimeout(() => {
    notification.show = false;
  }, 3000);
};

const cargarDatos = async () => {
  await Promise.all([
    cargarCelulares(),
    cargarMovimientos(),
    cargarUsuarios()
  ]);
};

const cargarCelulares = async () => {
  try {
    loading.value = true;
    const response = await celularService.obtenerTodos();
    celulares.value = response.data;
  } catch (error) {
    showNotification('Error al cargar celulares', 'error');
    console.error('Error:', error);
  } finally {
    loading.value = false;
  }
};

const cargarMovimientos = async () => {
  try {
    const response = await obtenerMovimientos();
    movimientos.value = response.data;
  } catch (error) {
    console.error('Error cargando movimientos:', error);
  }
};

const cargarUsuarios = async () => {
  try {
    const response = await usuarioService.obtenerTodos();
    usuarios.value = response.data;
  } catch (error) {
    console.error('Error cargando usuarios:', error);
  }
};

const guardarCelular = async (celularData) => {
  try {
    loadingCelular.value = true;
    
    if (editingCelular.value) {
      // Actualizar celular existente
      await celularService.actualizar(editingCelular.value.numeroSerie, celularData);
      showNotification('Celular actualizado exitosamente');
    } else {
      // Crear nuevo celular
      await celularService.crearCelular(celularData);
      showNotification('Celular creado exitosamente');
    }
    
    editingCelular.value = null;
    cargarCelulares();
  } catch (error) {
    showNotification('Error al guardar celular', 'error');
    console.error('Error:', error);
  } finally {
    loadingCelular.value = false;
  }
};

const editarCelular = (celular) => {
  editingCelular.value = celular;
};

const cancelarEdicion = () => {
  editingCelular.value = null;
};

const confirmarEliminar = (celular) => {
  selectedCelular.value = celular;
  showDeleteModal.value = true;
};

const eliminarCelular = async () => {
  try {
    await celularService.eliminar(selectedCelular.value.numeroSerie);
    showNotification('Celular eliminado exitosamente');
    showDeleteModal.value = false;
    selectedCelular.value = null;
    cargarCelulares();
  } catch (error) {
    showNotification('Error al eliminar celular', 'error');
    console.error('Error:', error);
  }
};

const guardarMovimiento = async (movimientoData) => {
  try {
    loadingMovimiento.value = true;
    await crearMovimiento(movimientoData);
    showNotification('Movimiento creado exitosamente');
    cargarMovimientos();
  } catch (error) {
    showNotification('Error al crear movimiento', 'error');
    console.error('Error:', error);
  } finally {
    loadingMovimiento.value = false;
  }
};

const aplicarFiltros = (newFilters) => {
  filters.value = newFilters;
};

const aplicarFiltrosMovimientos = (newFilters) => {
  movimientoFilters.value = newFilters;
};

// Lifecycle
onMounted(() => {
  cargarDatos();
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Gestión de Celulares</h1>
      <p class="mt-1 text-sm text-gray-500">Administra el inventario de celulares y sus movimientos</p>
    </div>

    <!-- Notificación -->
    <div v-if="notification.show" 
         :class="[
           'mb-6 p-4 rounded-lg',
           notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
         ]">
      <div class="flex">
        <svg v-if="notification.type === 'success'" class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        <svg v-else class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
        <span class="ml-2">{{ notification.message }}</span>
      </div>
    </div>

    <!-- Pestañas -->
    <div class="border-b border-gray-200 mb-6">
      <nav class="-mb-px flex space-x-8">
        <button @click="activeTab = 'celulares'"
                :class="[
                  'py-2 px-1 border-b-2 font-medium text-sm',
                  activeTab === 'celulares' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]">
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z"></path>
          </svg>
          Celulares
        </button>
        <button @click="activeTab = 'movimientos'"
                :class="[
                  'py-2 px-1 border-b-2 font-medium text-sm',
                  activeTab === 'movimientos' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]">
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
          </svg>
          Movimientos
        </button>
      </nav>
    </div>

    <!-- Contenido de las pestañas -->
    <div v-if="activeTab === 'celulares'">
      <!-- Filtros -->
      <CelularFilters @filter="aplicarFiltros" />
      
      <!-- Formulario de celular -->
      <div class="mb-6">
        <CelularForm 
          :celular="editingCelular"
          :loading="loadingCelular"
          @save="guardarCelular"
          @cancel="cancelarEdicion"
        />
      </div>

      <!-- Tabla de celulares -->
      <DataTable 
        title="Inventario de Celulares"
        :columns="celularColumns"
        :data="celularesFiltrados"
        :show-actions="true"
        empty-message="No hay celulares registrados"
        key-field="numeroSerie"
        @edit="editarCelular"
        @delete="confirmarEliminar"
      >
        <template #estado="{ item }">
          <span :class="{
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium': true,
            'bg-green-100 text-green-800': item.estado === 'NUEVO',
            'bg-yellow-100 text-yellow-800': item.estado === 'REACONDICIONADO',
            'bg-red-100 text-red-800': item.estado === 'ROTO'
          }">
            {{ item.estado }}
          </span>
        </template>
        
        <template #usuario.numReparto="{ item }">
          <span v-if="item.usuario" class="text-gray-900">{{ item.usuario.numReparto }}</span>
          <span v-else class="text-gray-400 italic">Sin asignar</span>
        </template>
      </DataTable>
    </div>

    <div v-else-if="activeTab === 'movimientos'">
      <!-- Filtros de movimientos -->
      <MovimientoFilters 
        :usuarios="usuarios"
        :celulares="celulares"
        @filter="aplicarFiltrosMovimientos" 
      />
      
      <!-- Formulario de movimientos -->
      <div class="mb-6">
        <MovimientoForm 
          :celulares="celulares"
          :usuarios="usuarios"
          :loading="loadingMovimiento"
          @save="guardarMovimiento"
        />
      </div>

      <!-- Tabla de movimientos -->
      <DataTable 
        title="Historial de Movimientos"
        :columns="movimientoColumns"
        :data="movimientosFiltrados"
        :show-actions="false"
        empty-message="No hay movimientos registrados"
        key-field="id"
      >
        <template #fecha="{ item }">
          {{ new Date(item.fecha).toLocaleDateString() }}
        </template>
      </DataTable>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <Modal 
      :show="showDeleteModal"
      title="Confirmar Eliminación"
      confirm-text="Eliminar"
      type="danger"
      @close="showDeleteModal = false; selectedCelular = null"
      @confirm="eliminarCelular"
    >
      <p class="text-sm text-gray-500">
        ¿Estás seguro de que deseas eliminar el celular 
        <strong>{{ selectedCelular?.marca }} {{ selectedCelular?.modelo }}</strong>
        (Serie: {{ selectedCelular?.numeroSerie }})?
        Esta acción no se puede deshacer.
      </p>
    </Modal>

    <!-- Loading overlay -->
    <div v-if="loading" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <div class="flex items-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
          <span class="text-gray-700">Cargando datos...</span>
        </div>
      </div>
    </div>
  </div>
</template>
