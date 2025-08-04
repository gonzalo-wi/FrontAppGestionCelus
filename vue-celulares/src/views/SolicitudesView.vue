<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Gestión de Solicitudes</h1>
      <p class="mt-1 text-sm text-gray-500">Administra y consulta las solicitudes de celulares</p>
    </div>

    <!-- Notificación -->
    <div v-if="notification.show" :class="[
      'mb-6 p-4 rounded-lg',
      notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
    ]">
      <span>{{ notification.message }}</span>
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
                <span :class="{
                  'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs': solicitud.estado === EstadoSolicitud.PENDIENTE,
                  'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs': solicitud.estado === EstadoSolicitud.EN_PROCESO,
                  'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs': solicitud.estado === EstadoSolicitud.RESUELTA
                }">
                  {{ solicitud.estado || EstadoSolicitud.PENDIENTE }}
                </span>
              </td>
              <td class="px-4 py-2">
                <button v-if="isAdmin" @click="abrirModalEstado(solicitud)" class="text-blue-600 hover:underline text-sm">Cambiar estado</button>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Paginación -->
        <div class="flex justify-end items-center mt-4 gap-2">
          <button @click="paginaActual = Math.max(1, paginaActual - 1)" :disabled="paginaActual === 1" class="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50">Anterior</button>
          <span class="text-sm">Página {{ paginaActual }} de {{ totalPaginas }}</span>
          <button @click="paginaActual = Math.min(totalPaginas, paginaActual + 1)" :disabled="paginaActual === totalPaginas" class="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50">Siguiente</button>
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
const isAdmin = ref(false); // Cambia esto según tu lógica de usuario

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

const cargarSolicitudes = async () => {
  loading.value = true;
  try {
    if (isAdmin.value) {
      const resp = await solicitudService.obtenerTodas();
      solicitudes.value = resp.data;
    } else {
      // Aquí deberías obtener el usuario logueado
      const usuarioActual = form.usuario;
      if (usuarioActual) {
        const resp = await solicitudService.obtenerPorUsuario(usuarioActual);
        solicitudes.value = resp.data;
      } else {
        solicitudes.value = [];
      }
    }
    paginaActual.value = 1;
  } catch (error) {
    notification.message = 'Error al cargar solicitudes';
    notification.type = 'error';
    notification.show = true;
  } finally {
    loading.value = false;
  }
};

const crearSolicitud = async () => {
  try {
    form.id = `S${Math.floor(Math.random() * 10000)}`;
    const resp = await solicitudService.crear({ ...form });
    notification.message = 'Solicitud creada correctamente';
    notification.type = 'success';
    notification.show = true;
    cargarSolicitudes();
  } catch (error) {
    notification.message = 'Error al crear solicitud';
    notification.type = 'error';
    notification.show = true;
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
    notification.message = 'Estado actualizado correctamente';
    notification.type = 'success';
    notification.show = true;
    showModalEstado.value = false;
    cargarSolicitudes();
  } catch (error) {
    notification.message = 'Error al actualizar estado';
    notification.type = 'error';
    notification.show = true;
  }
};

onMounted(() => {
  cargarSolicitudes();
});
</script>
