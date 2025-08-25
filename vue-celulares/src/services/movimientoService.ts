import http from './http';

const api = http;


export interface Movimiento {
  tipo: string;
  fecha: string;
  motivo: string;
  celularId: number;
  usuarioId?: string;
}

// ✅ Función para crear un movimiento
export const crearMovimiento = (movimiento: Movimiento) => api.post<Movimiento>('/api/movimientos', movimiento);