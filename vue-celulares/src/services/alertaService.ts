import http from './http';

export interface Alerta {
  id: number;
  mensaje: string;
  fechaCreacion: string;
  leida: boolean;
  solicitud: {
    id: string;
    nomSolicitante: string;
    fecha: string;
    usuario: string;
    region: string;
    tipoSolicitud: string;
    motivo: string;
    necesitaLinea: boolean;
    estado: string;
    mailAutorizante: string | null;
    usuarioCreador: {
      username: string;
      rol: string;
      region: string;
    };
  };
}

export const alertaService = {
  /**
   * Obtiene todas las alertas
   */
  async obtenerTodas() {
    try {
      const response = await http.get('/alertas');
      return response;
    } catch (error) {
      console.error('Error al obtener alertas:', error);
      throw error;
    }
  },

  /**
   * Obtiene alertas no leídas
   */
  async obtenerNoLeidas() {
    try {
      const response = await http.get('/alertas?leida=false');
      return response;
    } catch (error) {
      console.error('Error al obtener alertas no leídas:', error);
      throw error;
    }
  },

  /**
   * Marca una alerta como leída
   */
  async marcarComoLeida(alertaId: number) {
    try {
      const response = await http.put(`/alertas/${alertaId}/marcar-leida`);
      return response;
    } catch (error) {
      console.error('Error al marcar alerta como leída:', error);
      throw error;
    }
  },

  /**
   * Marca todas las alertas como leídas
   */
  async marcarTodasComoLeidas() {
    try {
      const response = await http.put('/alertas/marcar-todas-leidas');
      return response;
    } catch (error) {
      console.error('Error al marcar todas las alertas como leídas:', error);
      throw error;
    }
  },

  /**
   * Elimina una alerta
   */
  async eliminar(alertaId: number) {
    try {
      const response = await http.delete(`/alertas/${alertaId}`);
      return response;
    } catch (error) {
      console.error('Error al eliminar alerta:', error);
      throw error;
    }
  }
};
