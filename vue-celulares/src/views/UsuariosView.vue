
<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { usuarioService } from '@/services/usuarioService.ts';
import DataTable from '@/components/DataTable.vue';
import Modal from '@/components/Modal.vue';
import UsuarioFilters from '@/components/UsuarioFilters.vue';

// Estados reactivos
const usuarios = ref([]);
const loading = ref(false);
const showModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const selectedUser = ref(null);

// Filtros
const filters = ref({});


// Opciones para enums
const regiones = [
  'NORTE', 'ESTE', 'SUR', 'OESTE', 'LA_PLATA', 'NAFA'
];
const zonas = [
  'CIUDADELA', 'LOMAS_DE_ZAMORA', 'LA_PLATA'
];

// Formulario
const form = reactive({
  numReparto: '',
  region: '',
  zona: '',
  numeroLinea: ''
});

// Configuración de la tabla
const columns = [
  { key: 'numReparto', title: 'Num. Reparto' },
  { key: 'region', title: 'Región' },
  { key: 'zona', title: 'Zona' },
  { key: 'numeroLinea', title: 'Línea' }
];

// Notificaciones
const notification = reactive({
  show: false,
  type: 'success', // success, error
  message: ''
});

// Computed
const modalTitle = computed(() => 
  isEditing.value ? 'Editar Usuario' : 'Crear Usuario'
);

// Métodos
const showNotification = (message, type = 'success') => {
  notification.message = message;
  notification.type = type;
  notification.show = true;
  setTimeout(() => {
    notification.show = false;
  }, 3000);
};

const resetForm = () => {
  form.numReparto = '';
  form.region = '';
  form.zona = '';
  form.numeroLinea = '';
};

const openCreateModal = () => {
  isEditing.value = false;
  resetForm();
  showModal.value = true;
};

const openEditModal = (usuario) => {
  isEditing.value = true;
  selectedUser.value = usuario;
  form.numReparto = usuario.numReparto;
  form.region = usuario.region;
  form.zona = usuario.zona;
  form.numeroLinea = usuario.numeroLinea || '';
  showModal.value = true;
};

const openDeleteModal = (usuario) => {
  selectedUser.value = usuario;
  showDeleteModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  showDeleteModal.value = false;
  selectedUser.value = null;
  resetForm();
};

const cargarUsuarios = async () => {
  try {
    loading.value = true;
    const response = await usuarioService.obtenerTodos();
    usuarios.value = response.data;
  } catch (error) {
    showNotification('Error al cargar usuarios', 'error');
    console.error('Error:', error);
  } finally {
    loading.value = false;
  }
};

const guardarUsuario = async () => {
  try {
    // Validar que zona no esté vacía
    if (!form.zona) {
      showNotification('Debe seleccionar una zona', 'error');
      return;
    }
    const usuario = {
      numReparto: form.numReparto,
      region: form.region,
      zona: form.zona,
      numeroLinea: form.numeroLinea || null
    };

    if (isEditing.value) {
      await usuarioService.actualizar(selectedUser.value.numReparto, usuario);
      showNotification('Usuario actualizado exitosamente');
    } else {
      await usuarioService.crear(usuario);
      showNotification('Usuario creado exitosamente');
    }
    
    closeModal();
    cargarUsuarios();
  } catch (error) {
    showNotification('Error al guardar usuario', 'error');
    console.error('Error:', error);
  }
};

const eliminarUsuario = async () => {
  try {
    await usuarioService.eliminar(selectedUser.value.numReparto);
    showNotification('Usuario eliminado exitosamente');
    closeModal();
    cargarUsuarios();
  } catch (error) {
    showNotification('Error al eliminar usuario', 'error');
    console.error('Error:', error);
  }
};

// Lifecycle
onMounted(() => {
  cargarUsuarios();
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <p class="mt-1 text-sm text-gray-500">Administra los usuarios del sistema</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button @click="openCreateModal" 
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Nuevo Usuario
        </button>
      </div>
    </div>

    <!-- Notificación -->
    <div v-if="notification.show" 
         :class="[
           'mt-4 p-4 rounded-md',
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

    <!-- Tabla de usuarios -->
    <div class="mt-8">
      <DataTable 
        title="Lista de Usuarios"
        :columns="columns"
        :data="usuarios"
        :show-actions="true"
        empty-message="No hay usuarios registrados"
        key-field="numReparto"
        @edit="openEditModal"
        @delete="openDeleteModal"
      />
    </div>

    <!-- Modal de crear/editar -->
    <Modal 
      :show="showModal"
      :title="modalTitle"
      confirm-text="Guardar"
      @close="closeModal"
      @confirm="guardarUsuario"
    >
      <form @submit.prevent="guardarUsuario" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Número de Reparto
          </label>
          <input 
            v-model="form.numReparto"
            :disabled="isEditing"
            type="text" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            placeholder="Ej: U001"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Región
          </label>
          <select v-model="form.region" required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            <option value="" disabled>Seleccione una región</option>
            <option v-for="r in regiones" :key="r" :value="r">{{ r.replace('_', ' ') }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Zona
          </label>
          <select v-model="form.zona" required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            <option value="" disabled>Seleccione una zona</option>
            <option v-for="z in zonas" :key="z" :value="z">{{ z.replace('_', ' ') }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Línea
          </label>
          <input 
            v-model="form.numeroLinea"
            type="text" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Ej: 15-1234-5678"
          />
          <p class="mt-1 text-sm text-gray-500">Campo opcional. Número de línea telefónica asignada</p>
        </div>
      </form>
    </Modal>

    <!-- Modal de confirmación de eliminación -->
    <Modal 
      :show="showDeleteModal"
      title="Confirmar Eliminación"
      confirm-text="Eliminar"
      type="danger"
      @close="closeModal"
      @confirm="eliminarUsuario"
    >
      <p class="text-sm text-gray-500">
        ¿Estás seguro de que deseas eliminar al usuario 
        <strong>{{ selectedUser?.numReparto }}</strong>?
        Esta acción no se puede deshacer.
      </p>
    </Modal>

    <!-- Loading overlay -->
    <div v-if="loading" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-4 rounded-lg shadow-lg">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    </div>
  </div>
</template>
