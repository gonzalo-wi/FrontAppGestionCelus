import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});


export interface Movimiento {
  tipo: string;
  fecha: string;
  motivo: string;
  celularId: number;
  usuarioId?: string;
}

// ✅ Función para crear un movimiento
export const crearMovimiento = (movimiento: Movimiento) => {
  return api.post<Movimiento>('/movimientos', movimiento);
};