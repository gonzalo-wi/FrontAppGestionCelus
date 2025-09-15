import { ref, onMounted, onUnmounted } from 'vue';
import { alertaService } from '@/services/alertaService';

export function useAlertas() {
  const alertas = ref([]);
  const alertasNoLeidas = ref([]);
  const loading = ref(false);
  const error = ref(null);
  
  let intervalId = null;

  // Cargar alertas
  const cargarAlertas = async () => {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await alertaService.obtenerTodas();
      alertas.value = response.data || [];
      
      // Filtrar alertas no leídas
      alertasNoLeidas.value = alertas.value.filter(alerta => !alerta.leida);
      
    } catch (err) {
      error.value = 'Error al cargar alertas';
      console.error('Error al cargar alertas:', err);
    } finally {
      loading.value = false;
    }
  };

  // Cargar solo alertas no leídas
  const cargarAlertasNoLeidas = async () => {
    try {
      const response = await alertaService.obtenerNoLeidas();
      alertasNoLeidas.value = response.data || [];
    } catch (err) {
      console.error('Error al cargar alertas no leídas:', err);
    }
  };

  // Marcar alerta como leída
  const marcarComoLeida = async (alertaId) => {
    try {
      await alertaService.marcarComoLeida(alertaId);
      
      // Actualizar estado local
      const alerta = alertas.value.find(a => a.id === alertaId);
      if (alerta) {
        alerta.leida = true;
      }
      
      // Actualizar alertas no leídas
      alertasNoLeidas.value = alertasNoLeidas.value.filter(a => a.id !== alertaId);
      
      return true;
    } catch (err) {
      console.error('Error al marcar alerta como leída:', err);
      return false;
    }
  };

  // Marcar todas las alertas como leídas
  const marcarTodasComoLeidas = async () => {
    try {
      await alertaService.marcarTodasComoLeidas();
      
      // Actualizar estado local
      alertas.value.forEach(alerta => {
        alerta.leida = true;
      });
      alertasNoLeidas.value = [];
      
      return true;
    } catch (err) {
      console.error('Error al marcar todas las alertas como leídas:', err);
      return false;
    }
  };

  // Eliminar alerta
  const eliminarAlerta = async (alertaId) => {
    try {
      await alertaService.eliminar(alertaId);
      
      // Actualizar estado local
      alertas.value = alertas.value.filter(a => a.id !== alertaId);
      alertasNoLeidas.value = alertasNoLeidas.value.filter(a => a.id !== alertaId);
      
      return true;
    } catch (err) {
      console.error('Error al eliminar alerta:', err);
      return false;
    }
  };

  // Iniciar auto-refresh
  const iniciarAutoRefresh = (intervalMs = 30000) => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    
    intervalId = setInterval(() => {
      cargarAlertasNoLeidas();
    }, intervalMs);
  };

  // Detener auto-refresh
  const detenerAutoRefresh = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  // Computed values
  const totalAlertas = () => alertas.value.length;
  const totalAlertasNoLeidas = () => alertasNoLeidas.value.length;
  const hayAlertasNoLeidas = () => alertasNoLeidas.value.length > 0;

  // Lifecycle
  onMounted(() => {
    cargarAlertas();
    iniciarAutoRefresh();
  });

  onUnmounted(() => {
    detenerAutoRefresh();
  });

  return {
    // Estado
    alertas,
    alertasNoLeidas,
    loading,
    error,
    
    // Métodos
    cargarAlertas,
    cargarAlertasNoLeidas,
    marcarComoLeida,
    marcarTodasComoLeidas,
    eliminarAlerta,
    iniciarAutoRefresh,
    detenerAutoRefresh,
    
    // Computed helpers
    totalAlertas,
    totalAlertasNoLeidas,
    hayAlertasNoLeidas
  };
}
