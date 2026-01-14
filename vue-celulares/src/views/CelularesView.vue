
<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';
import { celularService } from '@/services/celularService.ts';
import { movimientoService } from '@/services/movimientoService.ts';
import { usuarioService } from '@/services/usuarioService.ts';
import { excelService } from '@/services/excelService.ts';
import http from '@/services/http.ts';
import DataTable from '@/components/DataTable.vue';
import Modal from '@/components/Modal.vue';
import CelularForm from '@/components/CelularForm.vue';
import MovimientoForm from '@/components/MovimientoForm.vue';
import MovimientoEditModal from '@/components/MovimientoEditModal.vue';
import CelularFilters from '@/components/CelularFilters.vue';
import MovimientoFilters from '@/components/MovimientoFilters.vue';
import Pagination from '@/components/Pagination.vue';

// Estados reactivos
const celulares = ref([]);
const movimientos = ref([]);
const totalMovimientos = ref(0); // Total de movimientos del backend
const usuarios = ref([]);
const loading = ref(false);
const loadingCelular = ref(false);
const loadingMovimiento = ref(false);
const loadingReporte = ref(false);

// Paginación
const currentPageCelulares = ref(1);
const currentPageMovimientos = ref(1);
const itemsPerPageCelulares = ref(25);
const itemsPerPageMovimientos = ref(25);

// Modales
const showDeleteModal = ref(false);
const showMovimientoModal = ref(false);
const showCelularModal = ref(false);
const selectedCelular = ref(null);
const editingCelular = ref(null);
const celularFormRef = ref(null);

// Notificación específica para movimientos
const movimientoNotification = reactive({
  show: false,
  type: 'success',
  message: ''
});

// Estados para edición de movimientos
const showEditMovimientoModal = ref(false);
const showDeleteMovimientoModal = ref(false);
const selectedMovimiento = ref(null);
const loadingEditMovimiento = ref(false);

// Pestañas
const activeTab = ref('celulares');

// Filtros
const filters = ref({});
const movimientoFilters = ref({});

// Formulario de reporte de celular roto
const reporteForm = reactive({
  codigoInterno: '',
  numReparto: '',
  motivoRotura: '',
  fechaReporte: new Date().toISOString().split('T')[0] // Fecha actual por defecto en formato YYYY-MM-DD
});

const resultadoReporte = ref(null);

// Estados para autocompletado de reportes
const showCodigosDropdown = ref(false);
const showUsuariosDropdown = ref(false);
const codigosDropdownRef = ref(null);
const usuariosDropdownRef = ref(null);

const codigosFiltrados = computed(() => {
  console.log('🔍 Filtrando códigos - Búsqueda:', reporteForm.codigoInterno);
  console.log('📱 Total celulares disponibles:', celulares.value.length);
  
  if (!reporteForm.codigoInterno || reporteForm.codigoInterno.trim().length === 0) {
    console.log('📋 Sin búsqueda, mostrando primeros 20 ordenados');
    const result = celulares.value
      .slice()
      .sort((a, b) => {
        const numA = parseInt(a.codigoInterno) || 0;
        const numB = parseInt(b.codigoInterno) || 0;
        return numA - numB;
      })
      .slice(0, 20);
    return result;
  }
  
  const searchTerm = reporteForm.codigoInterno.trim().toLowerCase();
  console.log('🎯 Término de búsqueda:', searchTerm);
  
  const filtered = celulares.value.filter(c => {
    const codigoInterno = c.codigoInterno?.toString().toLowerCase() || '';
    const marca = c.marca?.toLowerCase() || '';
    const modelo = c.modelo?.toLowerCase() || '';
    
    const matches = (
      codigoInterno.startsWith(searchTerm) ||
      marca.startsWith(searchTerm) ||
      modelo.startsWith(searchTerm)
    );
    
    if (matches) {
      console.log('✅ Coincidencia encontrada:', {
        codigoInterno: c.codigoInterno,
        marca: c.marca,
        modelo: c.modelo
      });
    }
    
    return matches;
  });
  
  console.log('📊 Total resultados filtrados:', filtered.length);
  
  return filtered.sort((a, b) => {
    const aExact = a.codigoInterno?.toString().toLowerCase() === searchTerm;
    const bExact = b.codigoInterno?.toString().toLowerCase() === searchTerm;
    
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    
    const numA = parseInt(a.codigoInterno) || 0;
    const numB = parseInt(b.codigoInterno) || 0;
    return numA - numB;
  }).slice(0, 20);
});
const usuariosFiltrados = computed(() => {
  console.log('🔍 Filtrando usuarios - Búsqueda:', reporteForm.numReparto);
  console.log('👥 Total usuarios disponibles:', usuarios.value.length);
  
  if (!reporteForm.numReparto || reporteForm.numReparto.trim().length === 0) {
    console.log('📋 Sin búsqueda, mostrando primeros 10');
    return usuarios.value.slice(0, 10);
  }
  
  const searchTerm = reporteForm.numReparto.trim().toLowerCase();
  console.log('🎯 Término de búsqueda:', searchTerm);
  
  const filtered = usuarios.value.filter(u => {
    const numReparto = u.numReparto?.toString().toLowerCase() || '';
    const nombre = u.nombre?.toLowerCase() || '';
    const apellido = u.apellido?.toLowerCase() || '';
    const region = u.region?.toLowerCase() || '';
    
    const matches = (
      numReparto.startsWith(searchTerm) ||
      nombre.startsWith(searchTerm) ||
      apellido.startsWith(searchTerm) ||
      region.startsWith(searchTerm)
    );
    
    if (matches) {
      console.log('✅ Coincidencia encontrada:', {
        numReparto: u.numReparto,
        nombre: u.nombre,
        apellido: u.apellido,
        region: u.region
      });
    }
    
    return matches;
  });
  
  console.log('📊 Total resultados filtrados:', filtered.length);
  
  return filtered.sort((a, b) => {
    const aNumReparto = a.numReparto?.toString().toLowerCase() || '';
    const bNumReparto = b.numReparto?.toString().toLowerCase() || '';
    
    if (aNumReparto === searchTerm && bNumReparto !== searchTerm) return -1;
    if (bNumReparto === searchTerm && aNumReparto !== searchTerm) return 1;
    if (aNumReparto.startsWith(searchTerm) && !bNumReparto.startsWith(searchTerm)) return -1;
    if (bNumReparto.startsWith(searchTerm) && !aNumReparto.startsWith(searchTerm)) return 1;
    
    return 0;
  }).slice(0, 15);
});

// Función para cerrar dropdowns al hacer clic fuera
const handleClickOutside = (event) => {
  if (codigosDropdownRef.value && !codigosDropdownRef.value.contains(event.target)) {
    showCodigosDropdown.value = false;
  }
  if (usuariosDropdownRef.value && !usuariosDropdownRef.value.contains(event.target)) {
    showUsuariosDropdown.value = false;
  }
};

// Notificaciones
const notification = reactive({
  show: false,
  type: 'success',
  message: ''
});

// Configuración de tablas
const celularColumns = [
  { key: 'codigoInterno', title: 'Código' },
  { key: 'marca', title: 'Marca' },
  { key: 'modelo', title: 'Modelo' },
  { key: 'tieneTemplado', title: 'Templado' },
  { key: 'tieneFunda', title: 'Funda' },
  { key: 'cantRoturas', title: 'Roturas' },
  { key: 'estado', title: 'Estado' },
  { key: 'usuario.numReparto', title: 'Usuario' }
];

const movimientoColumns = [
  { key: 'fecha', title: 'Fecha' },
  { key: 'celular.codigoInterno', title: 'Código' },
  { key: 'usuario.numReparto', title: 'Usuario' },
  { key: 'descripcion', title: 'Descripción' }
];

// Computed
const celularesFiltrados = computed(() => {
  if (!filters.value || Object.keys(filters.value).length === 0) {
    return celulares.value;
  }
  
  return celulares.value.filter(celular => {
    const { codigoInterno, codigoApp, marca, estado, usuario, asignado } = filters.value;
    
    if (codigoInterno && !celular.codigoInterno?.toString().toLowerCase().includes(codigoInterno.toLowerCase())) {
      return false;
    }
    
    if (codigoApp && !celular.codigoDeAplicacion?.toString().toLowerCase().includes(codigoApp.toLowerCase())) {
      return false;
    }
    
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
    
   
    if (fechaDesde) {
      const fechaMovimiento = new Date(movimiento.fecha);
      const fechaDesdeDate = new Date(fechaDesde);
      if (fechaMovimiento < fechaDesdeDate) {
        return false;
      }
    }
    
   
    if (fechaHasta) {
      const fechaMovimiento = new Date(movimiento.fecha);
      const fechaHastaDate = new Date(fechaHasta);
      if (fechaMovimiento > fechaHastaDate) {
        return false;
      }
    }
    
    
    if (usuario && movimiento.usuario?.numReparto !== usuario) {
      return false;
    }
    
    
    if (celular && movimiento.celular?.numeroSerie !== parseInt(celular)) {
      return false;
    }
    
    
    if (descripcion && !movimiento.descripcion?.toLowerCase().includes(descripcion.toLowerCase())) {
      return false;
    }
    
    
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

// Computed para paginación
const celularesPaginados = computed(() => {
  const start = (currentPageCelulares.value - 1) * itemsPerPageCelulares.value;
  const end = start + itemsPerPageCelulares.value;
  return celularesFiltrados.value.slice(start, end);
});

const movimientosPaginados = computed(() => {
  const start = (currentPageMovimientos.value - 1) * itemsPerPageMovimientos.value;
  const end = start + itemsPerPageMovimientos.value;
  return movimientosFiltrados.value.slice(start, end);
});

// Métodos
// Helper para formatear fechas sin problemas de zona horaria
const formatearFecha = (fechaString) => {
  if (!fechaString) return '-';
  // Parsear la fecha en formato YYYY-MM-DD como fecha local
  const [year, month, day] = fechaString.split('T')[0].split('-');
  const fecha = new Date(year, month - 1, day);
  return fecha.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const formatearHora = (fechaString) => {
  if (!fechaString) return '-';
  // Si la fecha incluye hora, mostrarla, sino mostrar '-'
  if (fechaString.includes('T')) {
    const fecha = new Date(fechaString);
    return fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }
  return '-';
};

const showNotification = (message, type = 'success') => {
  notification.message = message;
  notification.type = type;
  notification.show = true;
  setTimeout(() => {
    notification.show = false;
  }, 3000);
};

const showMovimientoNotification = (message, type = 'success') => {
  movimientoNotification.message = message;
  movimientoNotification.type = type;
  movimientoNotification.show = true;
  setTimeout(() => {
    movimientoNotification.show = false;
  }, 4000);
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
    celulares.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    celulares.value = [];
    const status = error?.response?.status;
    const mensaje = status === 500 
      ? 'Error en el servidor. Verifica que el backend esté corriendo en el puerto 8080.'
      : 'Error al cargar celulares. Verifica la conexión con el servidor.';
    showNotification(mensaje, 'error');
    console.error('❌ Error cargando celulares:', { status, mensaje: error.message });
  } finally {
    loading.value = false;
  }
};

const cargarMovimientos = async () => {
  try {
    const response = await movimientoService.obtenerTodos();
    console.log('📦 Respuesta movimientos completa:', response.data);
    
    // El backend puede devolver un array directo o una respuesta paginada con 'content'
    let movimientosData = [];
    if (Array.isArray(response.data)) {
      movimientosData = response.data;
      totalMovimientos.value = response.data.length;
      console.log('📊 Array directo - Total movimientos:', totalMovimientos.value);
    } else if (response.data?.content && Array.isArray(response.data.content)) {
      movimientosData = response.data.content;
      totalMovimientos.value = response.data.totalElements || response.data.content.length;
      console.log('📊 Respuesta paginada - Total movimientos:', totalMovimientos.value, 'totalElements:', response.data.totalElements);
    } else {
      console.warn('⚠️ Estructura de respuesta no reconocida:', response.data);
      totalMovimientos.value = 0;
    }
    
    // Mapear los movimientos al formato esperado por el frontend
    movimientos.value = movimientosData.map(mov => ({
      id: mov.id,
      fecha: mov.fecha,
      tipo: mov.tipo,
      descripcion: mov.descripcion,
      estadoCelular: mov.estadoCelular,
      celular: {
        numeroSerie: mov.numeroSerieCelular,
        codigoInterno: mov.codigoInterno || mov.numeroSerieCelular,
        marca: mov.marca || '',
        modelo: mov.modelo || ''
      },
      usuario: {
        numReparto: mov.numRepartoUsuario,
        nombre: mov.nombreUsuario || '',
        apellido: mov.apellidoUsuario || ''
      }
    })).sort((a, b) => {
      // Ordenar por fecha descendente (más reciente primero)
      const fechaA = new Date(a.fecha);
      const fechaB = new Date(b.fecha);
      return fechaB - fechaA;
    });
    
    console.log('✅ Movimientos cargados:', movimientos.value.length, 'Total:', totalMovimientos.value);
  } catch (error) {
    movimientos.value = [];
    totalMovimientos.value = 0;
    const status = error?.response?.status;
    const mensaje = status === 500 
      ? 'Error en el servidor. Verifica que el backend esté corriendo en el puerto 8080.'
      : 'Error al cargar movimientos. Verifica la conexión con el servidor.';
    showNotification(mensaje, 'error');
    console.error('❌ Error cargando movimientos:', { status, mensaje: error.message });
  }
};

const cargarUsuarios = async () => {
  try {
    const response = await usuarioService.obtenerTodos();
    usuarios.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    usuarios.value = [];
    const status = error?.response?.status;
    const mensaje = status === 500 
      ? 'Error en el servidor. Verifica que el backend esté corriendo en el puerto 8080.'
      : 'Error al cargar usuarios. Verifica la conexión con el servidor.';
    showNotification(mensaje, 'error');
    console.error('❌ Error cargando usuarios:', { status, mensaje: error.message });
  }
};

const guardarCelular = async (celularData) => {
  try {
    loadingCelular.value = true;
    
    console.log('💾 Datos a guardar:', celularData);
    
    if (editingCelular.value) {
      // Actualizar celular existente
      console.log('📝 Actualizando celular:', editingCelular.value.numeroSerie);
      await celularService.actualizar(editingCelular.value.numeroSerie, celularData);
      showNotification('Celular actualizado exitosamente');
    } else {
      // Crear nuevo celular
      console.log('➕ Creando nuevo celular');
      await celularService.crearCelular(celularData);
      showNotification('Celular creado exitosamente');
      // Limpiar formulario después de crear exitosamente
      if (celularFormRef.value) {
        celularFormRef.value.resetForm();
      }
    }
    
    editingCelular.value = null;
    cargarCelulares();
  } catch (error) {
    const status = error?.response?.status;
    const errorData = error?.response?.data;
    
    let mensaje = 'Error al guardar celular';
    if (status === 500) {
      mensaje = 'Error en el servidor. Verifica que la base de datos tenga todas las columnas necesarias (incluyendo cantidad_roturas).';
    } else if (status === 400) {
      mensaje = 'Datos inválidos. Verifica que todos los campos estén correctos.';
    }
    
    showNotification(mensaje, 'error');
    console.error('❌ Error al guardar celular:', {
      status,
      mensaje: error.message,
      datosEnviados: celularData,
      respuestaServidor: errorData
    });
  } finally {
    loadingCelular.value = false;
  }
};

const guardarCelularYCerrar = async (celularData) => {
  await guardarCelular(celularData);
  showCelularModal.value = false;
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
    await movimientoService.crear(movimientoData);
    showMovimientoNotification('✅ Movimiento creado exitosamente');
    cargarMovimientos();
  } catch (error) {
    showMovimientoNotification('❌ Error al crear movimiento', 'error');
    console.error('Error:', error);
  } finally {
    loadingMovimiento.value = false;
  }
};

const guardarMovimientoYCerrar = async (movimientoData) => {
  await guardarMovimiento(movimientoData);
  showMovimientoModal.value = false;
};

// Funciones para edición de movimientos
const editarMovimiento = (movimiento) => {
  selectedMovimiento.value = movimiento;
  showEditMovimientoModal.value = true;
};

const guardarEdicionMovimiento = async (movimientoData) => {
  try {
    loadingEditMovimiento.value = true;
    await movimientoService.actualizar(selectedMovimiento.value.id, movimientoData);
    showNotification('Movimiento actualizado exitosamente');
    showEditMovimientoModal.value = false;
    selectedMovimiento.value = null;
    cargarMovimientos();
  } catch (error) {
    showNotification('Error al actualizar movimiento', 'error');
    console.error('Error:', error);
  } finally {
    loadingEditMovimiento.value = false;
  }
};

const confirmarEliminarMovimiento = (movimiento) => {
  selectedMovimiento.value = movimiento;
  showDeleteMovimientoModal.value = true;
};

const eliminarMovimiento = async () => {
  try {
    if (!selectedMovimiento.value) {
      console.warn('[EliminarMovimiento] No hay movimiento seleccionado');
      showNotification('No hay movimiento seleccionado', 'error');
      return;
    }
    const id = selectedMovimiento.value.id || selectedMovimiento.value.idMovimiento || selectedMovimiento.value?.movimientoId;
    if (!id) {
      console.error('[EliminarMovimiento] El objeto movimiento no tiene un ID válido:', selectedMovimiento.value);
      showNotification('Movimiento sin ID (revisar backend)', 'error');
      return;
    }
    console.log('[EliminarMovimiento] Eliminando movimiento id=', id, 'obj:', selectedMovimiento.value);
    await movimientoService.eliminar(id);
    showNotification('Movimiento eliminado exitosamente');
    showDeleteMovimientoModal.value = false;
    selectedMovimiento.value = null;
    await cargarMovimientos();
  } catch (error) {
    const status = error?.response?.status;
    console.error('[EliminarMovimiento] Error eliminando movimiento:', status, error);
    if (status === 404) {
      showNotification('Movimiento no encontrado (404)', 'error');
    } else if (status === 401) {
      showNotification('Sesión expirada (401)', 'error');
    } else {
      showNotification('Error al eliminar movimiento', 'error');
    }
  }
};

const cerrarModalesMovimiento = () => {
  showEditMovimientoModal.value = false;
  showDeleteMovimientoModal.value = false;
  selectedMovimiento.value = null;
};

const aplicarFiltros = (newFilters) => {
  filters.value = newFilters;
};

const aplicarFiltrosMovimientos = (newFilters) => {
  movimientoFilters.value = newFilters;
};

// Función para reportar celular roto
const reportarCelularRoto = async () => {
  loadingReporte.value = true;
  resultadoReporte.value = null;
  
  try {
    const reporte = {
      codigoInterno: reporteForm.codigoInterno.trim(),
      numReparto: reporteForm.numReparto.trim(),
      motivoRotura: reporteForm.motivoRotura.trim(),
      fechaReporte: reporteForm.fechaReporte // Formato YYYY-MM-DD
    };

    console.log('📤 Enviando reporte:', reporte);

    // Delay de 2 segundos para mejor experiencia visual
    await new Promise(resolve => setTimeout(resolve, 2000));

    const response = await http.post('/api/celulares/gestion/reportar-roto', reporte);

    console.log('📥 Respuesta del servidor:', response.status, response.statusText);

    const resultado = response.data;
    console.log('✅ Resultado exitoso:', resultado);
    resultadoReporte.value = resultado;
    
    // Limpiar formulario si fue exitoso
    if (resultado) {
      reporteForm.codigoInterno = '';
      reporteForm.numReparto = '';
      reporteForm.motivoRotura = '';
      reporteForm.fechaReporte = new Date().toISOString().split('T')[0]; // Resetear a fecha actual
      
      showNotification(
        resultado.exitoReemplazo 
          ? 'Celular reportado y reemplazado exitosamente' 
          : 'Celular reportado como roto', 
        resultado.exitoReemplazo ? 'success' : 'warning'
      );
      
      // Recargar datos para actualizar estados
      await cargarCelulares();
    }
  } catch (error) {
    console.error('💥 Error completo:', error);
    showNotification(`Error al reportar celular roto: ${error.message}`, 'error');
  } finally {
    loadingReporte.value = false;
  }
};

// Métodos de paginación
const onPageChangedCelulares = (page) => {
  currentPageCelulares.value = page;
};

const onItemsPerPageChangedCelulares = (itemsPerPage) => {
  itemsPerPageCelulares.value = itemsPerPage;
  currentPageCelulares.value = 1; // Reset to first page
};

const onPageChangedMovimientos = (page) => {
  currentPageMovimientos.value = page;
};

const onItemsPerPageChangedMovimientos = (itemsPerPage) => {
  itemsPerPageMovimientos.value = itemsPerPage;
  currentPageMovimientos.value = 1; // Reset to first page
};

// Lifecycle
onMounted(() => {
  cargarDatos();
  // Agregar listener para cerrar dropdowns al hacer clic fuera
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  // Remover listener al desmontar el componente
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 py-8">
    <div class="w-full px-4 sm:px-6 lg:px-8">
      <!-- Header con gradiente -->
      <div class="relative mb-6 lg:mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 text-white shadow-2xl overflow-hidden">
        <div class="absolute inset-0 bg-black opacity-10"></div>
        <div class="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 lg:w-40 lg:h-40 bg-white opacity-10 rounded-full"></div>
        <div class="absolute bottom-0 left-0 -mb-10 -ml-10 w-24 h-24 lg:w-32 lg:h-32 bg-white opacity-5 rounded-full"></div>
        
        <div class="relative">
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4">
            <div class="p-3 lg:p-4 bg-white/20 backdrop-blur-lg rounded-xl lg:rounded-2xl">
              <svg class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Gestión de Celulares</h1>
              <p class="text-indigo-100 text-sm sm:text-base lg:text-lg">Administra el inventario de celulares y sus movimientos</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Notificación moderna -->
      <div v-if="notification.show" 
           :class="[
             'mb-8 p-4 rounded-2xl flex items-center justify-between shadow-xl transform transition-all duration-300',
             notification.type === 'success' 
               ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' 
               : 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
           ]">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-white/20 rounded-xl">
            <svg v-if="notification.type === 'success'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <span class="font-medium">{{ notification.message }}</span>
        </div>
        <button @click="notification.show = false" class="p-2 hover:bg-white/20 rounded-xl transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Pestañas modernas -->
      <div class="bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-white/20 p-1 sm:p-2 mb-6 lg:mb-8">
        <nav class="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
          <button @click="activeTab = 'celulares'"
                  :class="[
                    'flex-1 flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 px-3 sm:px-6 rounded-xl sm:rounded-2xl font-semibold text-xs sm:text-sm transition-all duration-300',
                    activeTab === 'celulares' 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl' 
                      : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                  ]">
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z"></path>
            </svg>
            <span class="text-sm sm:text-lg">Celulares</span>
            <span v-if="activeTab === 'celulares'" class="bg-white/20 px-2 py-1 rounded-lg text-xs font-bold">{{ celulares.length }}</span>
          </button>
          <button @click="activeTab = 'movimientos'"
                  :class="[
                    'flex-1 flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 px-3 sm:px-6 rounded-xl sm:rounded-2xl font-semibold text-xs sm:text-sm transition-all duration-300',
                    activeTab === 'movimientos' 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl' 
                      : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                  ]">
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
            </svg>
            <span class="text-sm sm:text-lg">Movimientos</span>
            <span v-if="activeTab === 'movimientos'" class="bg-white/20 px-2 py-1 rounded-lg text-xs font-bold">{{ totalMovimientos }}</span>
          </button>
          <button @click="activeTab = 'reportar-roto'"
                  :class="[
                    'flex-1 flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 px-3 sm:px-6 rounded-xl sm:rounded-2xl font-semibold text-xs sm:text-sm transition-all duration-300',
                    activeTab === 'reportar-roto' 
                      ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-xl' 
                      : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                  ]">
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            <span class="text-sm sm:text-lg">Reportar Roto</span>
          </button>
        </nav>
      </div>

      <!-- Contenido de las pestañas -->
      <div v-if="activeTab === 'celulares'" class="space-y-8">
        <!-- Filtros modernos -->
        <div class="bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-white/20 p-4 lg:p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Filtros de Búsqueda</h3>
              <p class="text-sm text-gray-500 mt-1">Filtra los celulares por diferentes criterios</p>
            </div>
            <button 
              @click="showCelularModal = true"
              class="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Nuevo Celular
            </button>
          </div>
          <CelularFilters @filter="aplicarFiltros" />
        </div>
        <!-- Tabla de celulares moderna -->
        <div class="bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-white/20 p-4 lg:p-8 overflow-hidden">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 lg:mb-6 gap-4">
            <div class="flex items-center gap-3 lg:gap-4">
              <div class="p-2 lg:p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl lg:rounded-2xl">
                <svg class="w-6 h-6 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z"></path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Inventario de Celulares</h2>
            </div>
            <div class="text-sm text-gray-600 bg-gray-100/70 px-4 py-2 rounded-xl">
              Total: {{ celularesFiltrados.length }}
            </div>
          </div>
          
          <div v-if="loading" class="flex items-center justify-center py-12">
            <div class="flex items-center gap-3 text-gray-600">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span class="text-lg font-medium">Cargando celulares...</span>
            </div>
          </div>
          
          <div v-else-if="celularesFiltrados.length === 0" class="text-center py-12">
            <div class="flex flex-col items-center gap-4">
              <div class="p-4 bg-gray-100 rounded-2xl">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z"></path>
                </svg>
              </div>
              <p class="text-gray-500 text-lg">No hay celulares registrados</p>
            </div>
          </div>
          
          <div v-else class="space-y-4">
           
            <div class="hidden lg:block overflow-x-auto rounded-2xl border border-gray-200/50 shadow-xl">
              <table class="w-full divide-y divide-gray-200/50" style="min-width: 950px;">
                <thead class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[100px]">Código</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[80px]">App</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[80px]">Marca</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[80px]">Modelo</th>
                    <th class="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider min-w-[60px]" title="Templado">Templ</th>
                    <th class="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider min-w-[60px]" title="Funda">Funda</th>
                    <th class="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider min-w-[60px]" title="Cantidad de Roturas">Rot</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[80px]">Estado</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[90px]">Usuario</th>
                    <th class="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider min-w-[100px]">Acciones</th>
                  </tr>
                </thead>
                <tbody class="bg-white/90 backdrop-blur-sm divide-y divide-gray-200/50">
                  <tr v-for="celular in celularesPaginados" 
                      :key="celular.codigoInterno" 
                      class="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 group">
                    <td class="px-4 py-3 whitespace-nowrap min-w-[100px]">
                      <div class="text-sm font-medium text-gray-900">{{ celular.codigoInterno }}</div>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap min-w-[80px]">
                      <div class="text-xs text-gray-600">{{ celular.codigoDeAplicacion || '-' }}</div>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap min-w-[80px]">
                      <div class="text-sm text-gray-700">{{ celular.marca }}</div>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap min-w-[80px]">
                      <div class="text-sm text-gray-700">{{ celular.modelo }}</div>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap min-w-[60px] text-center">
                      <span v-if="celular.tieneTemplado" class="text-green-600 text-lg">✓</span>
                      <span v-else class="text-gray-300 text-lg">✗</span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap min-w-[60px] text-center">
                      <span v-if="celular.tieneFunda" class="text-green-600 text-lg">✓</span>
                      <span v-else class="text-gray-300 text-lg">✗</span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap min-w-[60px] text-center">
                      <span :class="{
                        'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold': true,
                        'bg-red-100 text-red-700': celular.cantRoturas > 0,
                        'bg-green-100 text-green-700': celular.cantRoturas === 0
                      }">
                        {{ celular.cantRoturas || 0 }}
                      </span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap min-w-[80px]">
                      <span :class="{
                        'inline-flex px-2 py-1 text-xs font-medium rounded-full': true,
                        'bg-green-100 text-green-800': celular.estado === 'NUEVO',
                        'bg-yellow-100 text-yellow-800': celular.estado === 'REACONDICIONADO',
                        'bg-red-100 text-red-800': celular.estado === 'ROTO'
                      }">
                        {{ celular.estado === 'REACONDICIONADO' ? 'REAC' : celular.estado }}
                      </span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap min-w-[90px]">
                      <span v-if="celular.usuario?.numReparto || celular.numRepartoUsuario" class="text-sm text-gray-900">
                        {{ celular.usuario?.numReparto || celular.numRepartoUsuario }}
                      </span>
                      <span v-else class="text-xs text-gray-400 italic">Sin asignar</span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap min-w-[100px] text-center">
                      <div class="flex items-center justify-center gap-2">
                        <button @click="editarCelular(celular)" 
                                class="p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 group" 
                                title="Editar celular">
                          <svg class="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>
                        <button @click="confirmarEliminar(celular)" 
                                class="p-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 group" 
                                title="Eliminar celular">
                          <svg class="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Vista móvil - Cards -->
            <div class="lg:hidden space-y-4">
              <div v-for="celular in celularesPaginados" 
                   :key="celular.codigoInterno" 
                   class="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <div class="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span class="text-sm font-bold text-white">{{ String(celular.codigoInterno).substring(0, 2).toUpperCase() }}</span>
                    </div>
                    <div>
                      <h3 class="font-bold text-gray-900 text-lg">{{ celular.codigoInterno }}</h3>
                      <p class="text-sm text-gray-600">{{ celular.marca }} {{ celular.modelo }}</p>
                      <p v-if="celular.codigoDeAplicacion" class="text-xs text-gray-500 mt-1">App: {{ celular.codigoDeAplicacion }}</p>
                    </div>
                  </div>
                  <span :class="{
                    'inline-flex px-3 py-1 text-xs font-medium rounded-full': true,
                    'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg': celular.estado === 'NUEVO',
                    'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg': celular.estado === 'REACONDICIONADO',
                    'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg': celular.estado === 'ROTO'
                  }">
                    {{ celular.estado }}
                  </span>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span class="text-xs font-semibold text-gray-500 uppercase">Usuario Asignado</span>
                    <p class="text-sm font-medium text-gray-900 mt-1">
                      {{ celular.usuario?.numReparto || 'Sin asignar' }}
                    </p>
                  </div>
                  <div>
                    <span class="text-xs font-semibold text-gray-500 uppercase">Roturas</span>
                    <p class="text-sm font-medium text-gray-900 mt-1">
                      <span :class="{
                        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium': true,
                        'bg-red-100 text-red-800': celular.cantRoturas > 0,
                        'bg-green-100 text-green-800': celular.cantRoturas === 0
                      }">
                        {{ celular.cantRoturas || 0 }}
                      </span>
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-6">
                  <div class="flex items-center gap-2">
                    <span v-if="celular.tieneTemplado" class="inline-flex items-center justify-center w-5 h-5 bg-green-100 text-green-600 rounded-full">
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                    </span>
                    <span v-else class="inline-flex items-center justify-center w-5 h-5 bg-gray-100 text-gray-400 rounded-full">
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                      </svg>
                    </span>
                    <span class="text-xs font-medium text-gray-700">Templado</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span v-if="celular.tieneFunda" class="inline-flex items-center justify-center w-5 h-5 bg-green-100 text-green-600 rounded-full">
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                    </span>
                    <span v-else class="inline-flex items-center justify-center w-5 h-5 bg-gray-100 text-gray-400 rounded-full">
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                      </svg>
                    </span>
                    <span class="text-xs font-medium text-gray-700">Funda</span>
                  </div>
                </div>
                
                <div class="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <button @click="editarCelular(celular)" 
                          class="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                    Editar
                  </button>
                  <button @click="confirmarEliminar(celular)" 
                          class="p-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Paginación de celulares -->
        <Pagination 
          :current-page="currentPageCelulares"
          :total-records="celularesFiltrados.length"
          :items-per-page="itemsPerPageCelulares"
          @page-changed="onPageChangedCelulares"
          @items-per-page-changed="onItemsPerPageChangedCelulares"
        />
      </div>

      <div v-else-if="activeTab === 'movimientos'" class="space-y-8">
        <!-- Filtros de movimientos modernos -->
        <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Filtros de Búsqueda</h3>
              <p class="text-sm text-gray-500 mt-1">Filtra los movimientos por diferentes criterios</p>
            </div>
            <button 
              @click="showMovimientoModal = true"
              class="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Nuevo Movimiento
            </button>
          </div>
          <MovimientoFilters 
            :usuarios="usuarios"
            :celulares="celulares"
            @filter="aplicarFiltrosMovimientos" 
          />
        </div>

        <!-- Notificación específica para movimientos -->
        <div v-if="movimientoNotification.show" 
             :class="[
               'p-4 rounded-2xl flex items-center justify-between shadow-xl transform transition-all duration-300 animate-pulse',
               movimientoNotification.type === 'success' 
                 ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' 
                 : 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
             ]">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-white/20 rounded-xl">
              <svg v-if="movimientoNotification.type === 'success'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p class="font-semibold text-lg">{{ movimientoNotification.message }}</p>
              <p class="text-sm opacity-90">El formulario se ha limpiado automáticamente</p>
            </div>
          </div>
          <button @click="movimientoNotification.show = false" class="p-2 hover:bg-white/20 rounded-xl transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Tabla de movimientos moderna -->
        <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Historial de Movimientos</h2>
            </div>
            <div class="text-sm text-gray-600 bg-gray-100/70 px-4 py-2 rounded-xl">
              Total: {{ movimientosFiltrados.length }}
            </div>
          </div>
          
          <div v-if="loading" class="flex items-center justify-center py-12">
            <div class="flex items-center gap-3 text-gray-600">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              <span class="text-lg font-medium">Cargando movimientos...</span>
            </div>
          </div>
          
          <div v-else-if="movimientosFiltrados.length === 0" class="text-center py-12">
            <div class="flex flex-col items-center gap-4">
              <div class="p-4 bg-gray-100 rounded-2xl">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
              </div>
              <p class="text-gray-500 text-lg">No hay movimientos registrados</p>
            </div>
          </div>
          
          <div v-else class="space-y-4">
            <!-- Vista escritorio - Tabla -->
            <div class="hidden lg:block overflow-x-auto rounded-2xl border border-gray-200/50 shadow-xl">
              <table class="w-full divide-y divide-gray-200/50" style="min-width: 1200px;">
                <thead class="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500">
                  <tr>
                    <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[140px]">Fecha</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[120px]">Tipo</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[150px]">Celular</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[100px]">Estado</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[150px]">Usuario</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[200px]">Descripción</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[120px]">Acciones</th>
                  </tr>
                </thead>
                <tbody class="bg-white/90 backdrop-blur-sm divide-y divide-gray-200/50">
                  <tr v-for="movimiento in movimientosPaginados" 
                      :key="movimiento.id" 
                      class="hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 transition-all duration-200 group">
                    <td class="px-6 py-4 whitespace-nowrap min-w-[140px]">
                      <div class="text-sm font-medium text-gray-900">{{ formatearFecha(movimiento.fecha) }}</div>
                      <div class="text-xs text-gray-500">{{ formatearHora(movimiento.fecha) }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap min-w-[120px]">
                      <span :class="{
                        'inline-flex px-3 py-1 text-xs font-medium rounded-full': true,
                        'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg': movimiento.tipo === 'ASIGNACION',
                        'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg': movimiento.tipo === 'DEVOLUCION',
                        'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg': movimiento.tipo === 'MANTENIMIENTO'
                      }">
                        {{ movimiento.tipo }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap min-w-[150px]">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
                          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z"></path>
                          </svg>
                        </div>
                        <div class="ml-3">
                          <div class="text-sm font-semibold text-gray-900">{{ movimiento.celular?.codigoInterno }}</div>
                          <div class="text-xs text-gray-500">{{ movimiento.celular?.marca }} {{ movimiento.celular?.modelo }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap min-w-[100px]">
                      <span :class="{
                        'inline-flex px-2 py-1 text-xs font-medium rounded-full': true,
                        'bg-green-100 text-green-800': movimiento.estadoCelular === 'NUEVO',
                        'bg-yellow-100 text-yellow-800': movimiento.estadoCelular === 'REACONDICIONADO',
                        'bg-red-100 text-red-800': movimiento.estadoCelular === 'ROTO'
                      }">
                        {{ movimiento.estadoCelular === 'REACONDICIONADO' ? 'REAC' : movimiento.estadoCelular || '-' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap min-w-[150px]">
                      <div class="text-sm font-medium text-gray-900">
                        {{ movimiento.usuario?.numReparto || movimiento.numRepartoUsuario || '-' }}
                      </div>
                    </td>
                    <td class="px-6 py-4 min-w-[200px]">
                      <div class="text-sm text-gray-700 max-w-xs truncate" :title="movimiento.descripcion">
                        {{ movimiento.descripcion }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap min-w-[120px]">
                      <div class="flex items-center space-x-2">
                        <button
                          @click="editarMovimiento(movimiento)"
                          class="inline-flex items-center p-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                          title="Editar movimiento"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>
                        <button
                          @click="confirmarEliminarMovimiento(movimiento)"
                          class="inline-flex items-center p-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-105"
                          title="Eliminar movimiento"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Vista móvil - Cards -->
            <div class="lg:hidden space-y-4">
              <div v-for="movimiento in movimientosPaginados" 
                   :key="movimiento.id" 
                   class="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <div class="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 class="font-bold text-gray-900 text-lg">{{ movimiento.celular?.numeroSerie }}</h3>
                      <p class="text-sm text-gray-600">{{ movimiento.celular?.marca }} {{ movimiento.celular?.modelo }}</p>
                    </div>
                  </div>
                  <span :class="{
                    'inline-flex px-3 py-1 text-xs font-medium rounded-full': true,
                    'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg': movimiento.tipo === 'ASIGNACION',
                    'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg': movimiento.tipo === 'DEVOLUCION',
                    'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg': movimiento.tipo === 'MANTENIMIENTO'
                  }">
                    {{ movimiento.tipo }}
                  </span>
                </div>
                
                <div class="space-y-3 mb-6">
                  <div>
                    <span class="text-xs font-semibold text-gray-500 uppercase">Fecha</span>
                    <p class="text-sm font-medium text-gray-900">{{ new Date(movimiento.fecha).toLocaleDateString() }} {{ new Date(movimiento.fecha).toLocaleTimeString() }}</p>
                  </div>
                  <div>
                    <span class="text-xs font-semibold text-gray-500 uppercase">Usuario</span>
                    <p class="text-sm font-medium text-gray-900">{{ movimiento.usuario?.numReparto }}</p>
                  </div>
                  <div>
                    <span class="text-xs font-semibold text-gray-500 uppercase">Descripción</span>
                    <p class="text-sm text-gray-700">{{ movimiento.descripcion }}</p>
                  </div>
                </div>
                
                <!-- Botones de acciones para móvil -->
                <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    @click="editarMovimiento(movimiento)"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Editar
                  </button>
                  <button
                    @click="confirmarEliminarMovimiento(movimiento)"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Paginación de movimientos -->
        <Pagination 
          :current-page="currentPageMovimientos"
          :total-records="movimientosFiltrados.length"
          :items-per-page="itemsPerPageMovimientos"
          @page-changed="onPageChangedMovimientos"
          @items-per-page-changed="onItemsPerPageChangedMovimientos"
        />
      </div>

      <!-- Sección Reportar Roto -->
      <div v-else-if="activeTab === 'reportar-roto'" class="space-y-8">
        <!-- Formulario de Reporte de Celular Roto -->
        <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <div class="flex items-center gap-4 mb-6">
            <div class="p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Reportar Celular Roto
              </h2>
              <p class="text-gray-600">Registra un celular dañado para gestionar su reemplazo</p>
            </div>
          </div>

          <form @submit.prevent="reportarCelularRoto" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Campo Código Interno con autocompletado -->
              <div ref="codigosDropdownRef" class="relative">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Código Interno *
                </label>
                <input 
                  v-model="reporteForm.codigoInterno"
                  type="text" 
                  required
                  @focus="showCodigosDropdown = true"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Ej: SAM001"
                />
                <!-- Dropdown de códigos -->
                <div v-if="showCodigosDropdown && codigosFiltrados.length > 0" 
                     class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
                  <div 
                    v-for="celular in codigosFiltrados.slice(0, 10)" 
                    :key="celular.numeroSerie"
                    @click="reporteForm.codigoInterno = celular.codigoInterno; showCodigosDropdown = false"
                    class="px-4 py-3 hover:bg-red-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div class="font-semibold text-gray-900">{{ celular.codigoInterno }}</div>
                    <div class="text-sm text-gray-600">{{ celular.marca }} {{ celular.modelo }}</div>
                    <div class="text-xs text-gray-500">Estado: {{ celular.estado }}</div>
                  </div>
                </div>
              </div>
              
              <!-- Campo Número de Reparto con autocompletado -->
              <div ref="usuariosDropdownRef" class="relative">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Número de Reparto *
                </label>
                <input 
                  v-model="reporteForm.numReparto"
                  type="text" 
                  required
                  @focus="showUsuariosDropdown = true"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Ej: norte123"
                />
                <!-- Dropdown de usuarios -->
                <div v-if="showUsuariosDropdown && usuariosFiltrados.length > 0" 
                     class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
                  <div 
                    v-for="usuario in usuariosFiltrados.slice(0, 10)" 
                    :key="usuario.id"
                    @click="reporteForm.numReparto = usuario.numReparto; showUsuariosDropdown = false"
                    class="px-4 py-3 hover:bg-red-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div class="font-semibold text-gray-900">{{ usuario.numReparto }}</div>
                    <div class="text-sm text-gray-600">{{ usuario.nombre }} {{ usuario.apellido }}</div>
                    <div class="text-xs text-gray-500">{{ usuario.region }} - {{ usuario.zona }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Fecha del Reporte *
              </label>
              <input 
                v-model="reporteForm.fechaReporte"
                type="date" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <p class="mt-1 text-sm text-gray-500">
                Fecha en que se reportó la rotura del celular
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Motivo de la Rotura *
              </label>
              <textarea 
                v-model="reporteForm.motivoRotura"
                required
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Describe detalladamente el motivo de la rotura (ej: Pantalla quebrada por caída, daño por agua, etc.)"
              ></textarea>
            </div>

            <div class="flex justify-end pt-4 border-t border-gray-200">
              <button 
                type="submit" 
                :disabled="loadingReporte"
                class="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <svg v-if="loadingReporte" class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
                {{ loadingReporte ? 'Reportando...' : 'Reportar Celular Roto' }}
              </button>
            </div>
          </form>

          <!-- Resultado del reporte -->
          <div v-if="resultadoReporte" class="mt-6 p-4 rounded-xl border" :class="{
            'bg-red-50 border-red-200': !resultadoReporte.exitoReemplazo,
            'bg-green-50 border-green-200': resultadoReporte.exitoReemplazo
          }">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg v-if="!resultadoReporte.exitoReemplazo" class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
                <svg v-else class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium" :class="{
                  'text-red-800': !resultadoReporte.exitoReemplazo,
                  'text-green-800': resultadoReporte.exitoReemplazo
                }">
                  {{ resultadoReporte.exitoReemplazo ? 'Reemplazo exitoso' : 'Sin reemplazo automático' }}
                </h3>
                <div class="mt-2 text-sm" :class="{
                  'text-red-700': !resultadoReporte.exitoReemplazo,
                  'text-green-700': resultadoReporte.exitoReemplazo
                }">
                  <p>{{ resultadoReporte.mensaje }}</p>
                  <div v-if="resultadoReporte.celularReemplazo" class="mt-2 p-2 bg-white rounded border">
                    <p class="font-medium">Celular de reemplazo asignado:</p>
                    <p>{{ resultadoReporte.celularReemplazo.marca }} {{ resultadoReporte.celularReemplazo.modelo }}</p>
                    <p class="text-xs">Serie: {{ resultadoReporte.celularReemplazo.numeroSerie }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    <!-- Modal de edición de movimiento -->
    <MovimientoEditModal
      :show="showEditMovimientoModal"
      :movimiento="selectedMovimiento"
      :loading="loadingEditMovimiento"
      :celulares="celulares"
      :usuarios="usuarios"
      @close="cerrarModalesMovimiento"
      @save="guardarEdicionMovimiento"
    />

    <!-- Modal de confirmación de eliminación de movimiento -->
    <div v-if="showDeleteMovimientoModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-md transform transition-all duration-300 animate-in zoom-in-95">
        <div class="p-8">
          <div class="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-500 to-pink-600 rounded-full">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </div>
          
          <h3 class="text-2xl font-bold text-center text-gray-900 mb-4">Confirmar Eliminación</h3>
          
          <div class="text-center mb-8">
            <p class="text-gray-600 mb-4">
              ¿Estás seguro de que deseas eliminar este movimiento?
            </p>
            <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
              <p class="font-semibold text-gray-900">{{ selectedMovimiento?.celular?.marca }} {{ selectedMovimiento?.celular?.modelo }}</p>
              <p class="text-sm text-gray-600">Fecha: {{ selectedMovimiento?.fecha ? new Date(selectedMovimiento.fecha).toLocaleDateString() : '' }}</p>
              <p class="text-sm text-gray-600">Usuario: {{ selectedMovimiento?.usuario?.numReparto }}</p>
            </div>
            <p class="text-sm text-red-600 mt-3 font-medium">Esta acción no se puede deshacer.</p>
          </div>
          
          <div class="flex gap-4">
            <button @click="cerrarModalesMovimiento" 
                    class="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3 px-6 rounded-2xl font-semibold text-sm hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              Cancelar
            </button>
            <button @click="eliminarMovimiento" 
                    class="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 px-6 rounded-2xl font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación moderno -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-md transform transition-all duration-300 animate-in zoom-in-95">
        <div class="p-8">
          <div class="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-500 to-pink-600 rounded-full">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </div>
          
          <h3 class="text-2xl font-bold text-center text-gray-900 mb-4">Confirmar Eliminación</h3>
          
          <div class="text-center mb-8">
            <p class="text-gray-600 mb-4">
              ¿Estás seguro de que deseas eliminar el celular?
            </p>
            <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
              <p class="font-semibold text-gray-900">{{ selectedCelular?.marca }} {{ selectedCelular?.modelo }}</p>
              <p class="text-sm text-gray-600">Serie: {{ selectedCelular?.numeroSerie }}</p>
            </div>
            <p class="text-sm text-red-600 mt-3 font-medium">Esta acción no se puede deshacer.</p>
          </div>
          
          <div class="flex gap-4">
            <button @click="showDeleteModal = false; selectedCelular = null" 
                    class="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3 px-6 rounded-2xl font-semibold text-sm hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              Cancelar
            </button>
            <button @click="eliminarCelular" 
                    class="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 px-6 rounded-2xl font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Nuevo Movimiento -->
    <div v-if="showMovimientoModal" 
         class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
         @click.self="showMovimientoModal = false">
      <div class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 animate-in"
           @click.stop>
        <!-- Header del Modal -->
        <div class="sticky top-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-3xl">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-white/20 rounded-2xl">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-bold">Nuevo Movimiento</h2>
                <p class="text-green-100 text-sm mt-1">Registra un movimiento de celular</p>
              </div>
            </div>
            <button @click="showMovimientoModal = false" 
                    class="p-2 hover:bg-white/20 rounded-xl transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Contenido del Modal -->
        <div class="p-6">
          <MovimientoForm 
            :celulares="celulares"
            :usuarios="usuarios"
            :loading="loadingMovimiento"
            @save="guardarMovimientoYCerrar"
          />
        </div>
      </div>
    </div>

    <!-- Modal de Nuevo Celular -->
    <div v-if="showCelularModal" 
         class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
         @click.self="showCelularModal = false">
      <div class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 animate-in"
           @click.stop>
        <!-- Header del Modal -->
        <div class="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-t-3xl">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-white/20 rounded-2xl">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z"></path>
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-bold">{{ editingCelular ? 'Editar Celular' : 'Nuevo Celular' }}</h2>
                <p class="text-blue-100 text-sm mt-1">{{ editingCelular ? 'Modifica los datos del celular' : 'Agrega un nuevo celular al inventario' }}</p>
              </div>
            </div>
            <button @click="showCelularModal = false; editingCelular = null" 
                    class="p-2 hover:bg-white/20 rounded-xl transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Contenido del Modal -->
        <div class="p-6">
          <CelularForm 
            ref="celularFormRef"
            :celular="editingCelular"
            :loading="loadingCelular"
            @save="guardarCelularYCerrar"
            @cancel="showCelularModal = false; editingCelular = null"
          />
        </div>
      </div>
    </div>

    <!-- Loading overlay moderno -->
    <div v-if="loading" class="fixed inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/80 to-pink-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center transform transition-all duration-300 animate-pulse">
        <div class="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Cargando datos...</h3>
        <p class="text-gray-600">Por favor espera un momento</p>
      </div>
    </div>
    </div>
  </div>
</template>
