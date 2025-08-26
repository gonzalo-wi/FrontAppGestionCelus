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
  actualizar(numeroSerie: number, celular: any) {
    console.log('Actualizando celular completo:', { numeroSerie, celular });
    return api.put(`${API_URL}/celulares/${numeroSerie}`, celular);
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