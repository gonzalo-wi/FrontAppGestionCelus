import http from './http';

export interface Notificacion {
  id: number;
  mensaje: string;
  fecha: string;
  leida: boolean;
  usuarioQueModifico: string;
  usuarioModificado: string;
  numeroLinea: string;
}

export const notificacionService = {
  /**
   * Obtiene todas las notificaciones
   */
  async obtenerTodas() {
    try {
      const response = await http.get('/api/notificaciones');
      return response;
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      throw error;
    }
  },

  /**
   * Obtiene notificaciones no leídas
   */
  async obtenerNoLeidas() {
    try {
      const response = await http.get('/api/notificaciones?leida=false');
      return response;
    } catch (error) {
      console.error('Error al obtener notificaciones no leídas:', error);
      throw error;
    }
  },

  /**
   * Marca una notificación como leída
   */
  async marcarComoLeida(notificacionId: number) {
    try {
      const response = await http.put(`/api/notificaciones/${notificacionId}/marcar-leida`);
      return response;
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
      throw error;
    }
  },

  /**
   * Marca todas las notificaciones como leídas
   */
  async marcarTodasComoLeidas() {
    try {
      const response = await http.put('/api/notificaciones/marcar-todas-leidas');
      return response;
    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas:', error);
      throw error;
    }
  },

  /**
   * Elimina una notificación
   */
  async eliminar(notificacionId: number) {
    try {
      const response = await http.delete(`/api/notificaciones/${notificacionId}`);
      return response;
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
      throw error;
    }
  }
};