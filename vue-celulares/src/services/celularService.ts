import http from './http';

// Usamos http (axios compartido con interceptor de Authorization)
const api = http;

// Tipos
export type EstadoCelular = 'NUEVO' | 'REACONDICIONADO' | 'ROTO';

export interface Usuario {
  numReparto: string;
  region: string;
  zona: string;
}

export interface Celular {
  numeroSerie?: number; // Lo genera el backend
  marca: string;
  modelo: string;
  estado: EstadoCelular;
  usuario?: Usuario | null;
}

// Base URL para endpoints
const API_URL = '/api';

// Servicio para movimientos
export const crearMovimiento = (movimiento: any) => {
  return api.post(`${API_URL}/movimientos`, movimiento);
};

export const obtenerMovimientos = () => {
  return api.get(`${API_URL}/movimientos`);
};

export const celularService = {
  // Crear celular
  crearCelular(celular: Celular) {
    console.log('Creando celular:', celular);
    return api.post<Celular>(`${API_URL}/celulares`, celular);
  },

  // Obtener todos los celulares
  obtenerTodos() {
    console.log('Obteniendo todos los celulares...');
    return api.get<Celular[]>(`${API_URL}/celulares`);
  },

  // Actualizar celular completo
  // TEMPORAL: Usando endpoints específicos hasta que se agregue PUT /{numeroSerie}
  async actualizar(numeroSerie: number, celular: Celular) {
    console.log('Actualizando celular:', { numeroSerie, celular });
    
    try {
      // Actualizar estado si cambió
      if (celular.estado) {
        await api.put(`${API_URL}/celulares/${numeroSerie}/estado`, { estado: celular.estado });
      }
      
      // Actualizar usuario si existe
      if (celular.usuario) {
        await api.put(`${API_URL}/celulares/${numeroSerie}/usuario`, celular.usuario);
      }
      
      // Retornar el celular actualizado (simulado)
      return { data: celular };
    } catch (error) {
      console.error('Error al actualizar celular:', error);
      throw error;
    }
  },

  // Cambiar estado
  cambiarEstado(numeroSerie: number, estado: EstadoCelular) {
    console.log('Cambiando estado:', { numeroSerie, estado });
    return api.put<boolean>(`${API_URL}/celulares/${numeroSerie}/estado`, { estado });
  },

  // Asignar usuario
  asignarUsuario(numeroSerie: number, usuario: Usuario) {
    console.log('Asignando usuario:', { numeroSerie, usuario });
    return api.put<boolean>(`${API_URL}/celulares/${numeroSerie}/usuario`, usuario);
  },

  // Eliminar (si querés agregarlo)
  eliminar(numeroSerie: number) {
    console.log('Eliminando celular:', numeroSerie);
    return api.delete<void>(`${API_URL}/celulares/${numeroSerie}`);
  }
};