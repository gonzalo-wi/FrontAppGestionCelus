import axios from 'axios';

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

// Base URL
const API_URL = '/api';

// Servicio para movimientos
export const crearMovimiento = (movimiento: any) => {
  return axios.post(`${API_URL}/movimientos`, movimiento);
};

export const obtenerMovimientos = () => {
  return axios.get(`${API_URL}/movimientos`);
};

export const celularService = {
  // Crear celular
  crearCelular(celular: Celular) {
    return axios.post<Celular>(`${API_URL}/celulares`, celular);
  },

  // Obtener todos los celulares
  obtenerTodos() {
    return axios.get<Celular[]>(`${API_URL}/celulares`);
  },

  // Cambiar estado
  cambiarEstado(numeroSerie: number, estado: EstadoCelular) {
    return axios.put<boolean>(`${API_URL}/celulares/${numeroSerie}/estado`, { estado });
  },

  // Asignar usuario
  asignarUsuario(numeroSerie: number, usuario: Usuario) {
    return axios.put<boolean>(`${API_URL}/celulares/${numeroSerie}/usuario`, usuario);
  },

  // Eliminar (si querés agregarlo)
  eliminar(numeroSerie: number) {
    return axios.delete<void>(`${API_URL}/celulares/${numeroSerie}`);
  }
};