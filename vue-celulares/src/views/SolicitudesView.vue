<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Gestión de Solicitudes</h1>
      <p class="mt-1 text-sm text-gray-500">Administra y consulta las solicitudes de celulares</p>
    </div>

    <!-- Notificación -->
    <div v-if="notification.show" :class="[
      'mb-6 p-4 rounded-lg flex items-center justify-between',
      notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
    ]">
      <span>{{ notification.message }}</span>
      <button @click="notification.show = false" class="ml-3 hover:opacity-70">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- Formulario para crear solicitud -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Nueva Solicitud</h2>
      <form @submit.prevent="crearSolicitud" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Solicitante</label>
          <input v-model="form.nomSolicitante" type="text" class="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Reparto</label>
          <input v-model="form.usuario" type="text" class="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Región</label>
          <select v-model="form.region" class="w-full border rounded px-3 py-2" required>
            <option value="">Seleccionar</option>
            <option value="NORTE">NORTE</option>
            <option value="SUR">SUR</option>
            <option value="ESTE">ESTE</option>
            <option value="OESTE">OESTE</option>
            <option value="LA_PLATA">LA PLATA</option>
            <option value="NAFA">NAFA</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Solicitud</label>
          <select v-model="form.tipoSolicitud" class="w-full border rounded px-3 py-2" required>
            <option value="">Seleccionar</option>
            <option value="CAMBIO_POR_ROTURA">CAMBIO POR ROTURA</option>
            <option value="NUEVO_EQUIPO">EQUIPO NUEVO</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
          <input v-model="form.motivo" type="text" class="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">¿Necesita línea?</label>
          <select v-model="form.necesitaLinea" class="w-full border rounded px-3 py-2" required>
            <option :value="true">Sí</option>
            <option :value="false">No</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <input v-model="form.fecha" type="date" class="w-full border rounded px-3 py-2" required />
        </div>
        <div class="md:col-span-2 flex justify-end items-center mt-2">
          <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold">Crear Solicitud</button>
        </div>
      </form>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Filtros</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Región</label>
          <select v-model="filtros.region" class="w-full border rounded px-3 py-2">
            <option value="">Todas</option>
            <option value="NORTE">NORTE</option>
            <option value="SUR">SUR</option>
            <option value="ESTE">ESTE</option>
            <option value="OESTE">OESTE</option>
            <option value="LA_PLATA">LA PLATA</option>
            <option value="NAFA">NAFA</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Solicitud</label>
          <select v-model="filtros.tipoSolicitud" class="w-full border rounded px-3 py-2">
            <option value="">Todas</option>
            <option value="ALTA">ALTA</option>
            <option value="BAJA">BAJA</option>
            <option value="CAMBIO">CAMBIO</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
          <input v-model="filtros.usuario" type="text" class="w-full border rounded px-3 py-2" placeholder="Buscar usuario..." />
        </div>
      </div>
    </div>

    <!-- Tabla de solicitudes -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Solicitudes</h2>
      <div v-if="loading" class="text-gray-500">Cargando...</div>
      <div v-else-if="solicitudesFiltradas.length === 0" class="text-gray-500">No hay solicitudes registradas</div>
  <div v-else>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Solicitante</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Región</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Línea</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="solicitud in solicitudesPaginadas" :key="solicitud.id">
              <td class="px-4 py-2">{{ solicitud.id }}</td>
              <td class="px-4 py-2">{{ solicitud.nomSolicitante }}</td>
              <td class="px-4 py-2">{{ solicitud.usuario }}</td>
              <td class="px-4 py-2">{{ solicitud.region }}</td>
              <td class="px-4 py-2">{{ solicitud.tipoSolicitud }}</td>
              <td class="px-4 py-2">{{ solicitud.motivo }}</td>
              <td class="px-4 py-2">
                <span :class="solicitud.necesitaLinea ? 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs' : 'bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs'">
                  {{ solicitud.necesitaLinea ? 'Sí' : 'No' }}
                </span>
              </td>
              <td class="px-4 py-2">{{ solicitud.fecha }}</td>
              <td class="px-4 py-2">
                <!-- Modo edición inline -->
                <div v-if="solicitudEditando === solicitud.id" class="flex items-center gap-2">
                  <select 
                    v-model="estadoTemporal" 
                    class="text-xs px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    @keyup.enter="guardarEstado(solicitud)"
                    @keyup.escape="cancelarEdicion()"
                    @change="console.log('Estado seleccionado:', estadoTemporal)"
                    ref="selectEstado"
                    autofocus
                  >
                    <option :value="EstadoSolicitud.PENDIENTE">PENDIENTE</option>
                    <option :value="EstadoSolicitud.EN_PROCESO">EN PROCESO</option>
                    <option :value="EstadoSolicitud.RESUELTA">RESUELTA</option>
                  </select>
                  <button @click="guardarEstado(solicitud)" class="text-green-600 hover:text-green-800" title="Guardar">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </button>
                  <button @click="cancelarEdicion()" class="text-red-600 hover:text-red-800" title="Cancelar">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <!-- Modo visualización -->
                <div v-else class="flex items-center gap-2">
                  <span 
                    :class="{
                      'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs': solicitud.estado === EstadoSolicitud.PENDIENTE,
                      'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs': solicitud.estado === EstadoSolicitud.EN_PROCESO,
                      'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs': solicitud.estado === EstadoSolicitud.RESUELTA
                    }"
                    class="cursor-pointer hover:opacity-80 transition-opacity"
                    @click="iniciarEdicion(solicitud)"
                    title="Click para editar"
                  >
                    {{ solicitud.estado || EstadoSolicitud.PENDIENTE }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-2">
                <div class="flex items-center gap-2">
                  <button @click="iniciarEdicion(solicitud)" class="text-blue-600 hover:text-blue-800 text-sm" title="Editar estado">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button v-if="isAdmin" @click="abrirModalEstado(solicitud)" class="text-indigo-600 hover:text-indigo-800 text-sm" title="Modal completo">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Acciones y Paginación -->
        <div class="flex flex-col md:flex-row md:justify-between md:items-center mt-4 gap-3">
          <div>
            <button @click="cargarSolicitudes" class="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm text-gray-700 hover:bg-gray-50">Refrescar</button>
          </div>
          <div class="flex justify-end items-center gap-2">
          <button @click="paginaActual = Math.max(1, paginaActual - 1)" :disabled="paginaActual === 1" class="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50">Anterior</button>
          <span class="text-sm">Página {{ paginaActual }} de {{ totalPaginas }}</span>
          <button @click="paginaActual = Math.min(totalPaginas, paginaActual + 1)" :disabled="paginaActual === totalPaginas" class="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50">Siguiente</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para cambiar estado -->
    <div v-if="showModalEstado" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h3 class="text-lg font-bold mb-4">Cambiar estado de solicitud</h3>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
          <select v-model="nuevoEstado" class="w-full border rounded px-3 py-2">
            <option :value="EstadoSolicitud.PENDIENTE">PENDIENTE</option>
            <option :value="EstadoSolicitud.EN_PROCESO">EN PROCESO</option>
            <option :value="EstadoSolicitud.RESUELTA">RESUELTA</option>
          </select>
        </div>
        <div class="flex justify-end gap-2">
          <button @click="showModalEstado = false" class="px-4 py-2 rounded bg-gray-100 text-gray-700">Cancelar</button>
          <button @click="cambiarEstadoSolicitud" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { solicitudService, EstadoSolicitud } from '@/services/solicitudService.ts';

const solicitudes = ref([]);
const loading = ref(false);
const notification = reactive({ show: false, type: 'success', message: '' });
const isAdmin = ref(true); // Cambiado a true para poder editar estados

// Función para mostrar notificación con auto-ocultar
const mostrarNotificacion = (mensaje, tipo = 'success') => {
  notification.message = mensaje;
  notification.type = tipo;
  notification.show = true;
  setTimeout(() => {
    notification.show = false;
  }, 4000);
};

const form = reactive({
  id: '',
  nomSolicitante: '',
  fecha: '',
  usuario: '',
  region: '',
  tipoSolicitud: '',
  motivo: '',
  necesitaLinea: true
});

// Filtros
const filtros = reactive({
  region: '',
  tipoSolicitud: '',
  usuario: ''
});

// Paginación
const paginaActual = ref(1);
const solicitudesPorPagina = 10;

const solicitudesFiltradas = computed(() => {
  return solicitudes.value.filter(s => {
    if (filtros.region && s.region !== filtros.region) return false;
    if (filtros.tipoSolicitud && s.tipoSolicitud !== filtros.tipoSolicitud) return false;
    if (filtros.usuario && !s.usuario.toLowerCase().includes(filtros.usuario.toLowerCase())) return false;
    return true;
  });
});

const totalPaginas = computed(() => {
  return Math.max(1, Math.ceil(solicitudesFiltradas.value.length / solicitudesPorPagina));
});

const solicitudesPaginadas = computed(() => {
  const start = (paginaActual.value - 1) * solicitudesPorPagina;
  return solicitudesFiltradas.value.slice(start, start + solicitudesPorPagina);
});

const showModalEstado = ref(false);
const solicitudSeleccionada = ref(null);
const nuevoEstado = ref('PENDIENTE');

// Variables para edición inline
const solicitudEditando = ref(null);
const estadoTemporal = ref('');

const cargarSolicitudes = async () => {
  loading.value = true;
  try {
    const resp = await solicitudService.obtenerTodas();
    console.log('Solicitudes recibidas:', resp.data);
    solicitudes.value = resp.data;
    paginaActual.value = 1;
  } catch (error) {
    console.error('Error al cargar solicitudes:', error?.response?.data || error);
    mostrarNotificacion('Error al cargar solicitudes', 'error');
  } finally {
    loading.value = false;
  }
};

const crearSolicitud = async () => {
  try {
    form.id = `S${Math.floor(Math.random() * 10000)}`;
    // Preparar payload (asegurar estado inicial)
    const payload = {
      ...form,
      estado: EstadoSolicitud.PENDIENTE
    };
    console.log('Enviando solicitud:', payload);
    const resp = await solicitudService.crear(payload);
    mostrarNotificacion('Solicitud creada correctamente');
    cargarSolicitudes();
  } catch (error) {
    console.error('Error al crear solicitud:', error?.response?.data || error);
    mostrarNotificacion('Error al crear solicitud', 'error');
  }
};

const abrirModalEstado = (solicitud) => {
  solicitudSeleccionada.value = solicitud;
  nuevoEstado.value = solicitud.estado || 'PENDIENTE';
  showModalEstado.value = true;
};

const cambiarEstadoSolicitud = async () => {
  try {
    await solicitudService.cambiarEstado(solicitudSeleccionada.value.id, nuevoEstado.value);
    mostrarNotificacion('Estado actualizado correctamente');
    showModalEstado.value = false;
    cargarSolicitudes();
  } catch (error) {
    mostrarNotificacion('Error al actualizar estado', 'error');
  }
};

// Funciones para edición inline
const iniciarEdicion = (solicitud) => {
  console.log('Iniciando edición para:', solicitud.id, 'Estado actual:', solicitud.estado);
  solicitudEditando.value = solicitud.id;
  estadoTemporal.value = solicitud.estado || EstadoSolicitud.PENDIENTE;
};

const cancelarEdicion = () => {
  console.log('Cancelando edición');
  solicitudEditando.value = null;
  estadoTemporal.value = '';
};

const guardarEstado = async (solicitud) => {
  console.log('Guardando estado:', {
    solicitudId: solicitud.id,
    estadoAnterior: solicitud.estado,
    estadoNuevo: estadoTemporal.value
  });

  if (estadoTemporal.value === solicitud.estado) {
    // No hay cambios, solo cancelar edición
    console.log('No hay cambios, cancelando edición');
    cancelarEdicion();
    return;
  }

  try {
    console.log('Enviando petición PUT al backend...');
    const response = await solicitudService.cambiarEstado(solicitud.id, estadoTemporal.value);
    console.log('Respuesta del backend:', response);
    
    // Actualizar la solicitud local inmediatamente (optimistic update)
    const index = solicitudes.value.findIndex(s => s.id === solicitud.id);
    if (index !== -1) {
      solicitudes.value[index].estado = estadoTemporal.value;
      console.log('Estado actualizado localmente');
    }
    
    mostrarNotificacion(`Estado cambiado a ${estadoTemporal.value}`);
    cancelarEdicion();
    
  } catch (error) {
    console.error('Error completo al actualizar estado:', {
      error: error,
      response: error?.response,
      data: error?.response?.data,
      status: error?.response?.status,
      message: error?.message
    });
    mostrarNotificacion(`Error al actualizar estado: ${error?.response?.data?.message || error?.message || 'Error desconocido'}`, 'error');
    cancelarEdicion();
  }
};

onMounted(() => {
  cargarSolicitudes();
});
</script>
