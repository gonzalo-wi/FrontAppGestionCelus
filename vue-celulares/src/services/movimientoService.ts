import http from './http';

const api = http;

export interface Movimiento {
  id?: number;
  tipo: string;
  fecha: string;
  motivo: string;
  celularId: number;
  usuarioId?: string;
}

export interface MovimientoDetalle {
  id: number;
  fecha: string;
  tipo: string;
  celular: {
    marca: string;
    modelo: string;
    numeroSerie: string;
  };
  usuario: {
    nombre: string;
    apellido: string;
    numReparto: string;
  };
  descripcion: string;
}

// Servicio completo de movimientos
export const movimientoService = {
  // Crear movimiento
  crear: (movimiento: Movimiento) => api.post<Movimiento>('/api/movimientos', movimiento),
  
  // Obtener todos los movimientos
  obtenerTodos: () => api.get<MovimientoDetalle[]>('/api/movimientos'),
  
  // Obtener movimiento por ID
  obtenerPorId: (id: number) => api.get<MovimientoDetalle>(`/api/movimientos/${id}`),
  
  // Actualizar movimiento
  actualizar: (id: number, movimiento: Partial<Movimiento>) => api.put<MovimientoDetalle>(`/api/movimientos/${id}`, movimiento),
  
  // Eliminar movimiento
  eliminar: (id: number) => api.delete<void>(`/api/movimientos/${id}`)
};

// Mantener compatibilidad con imports anteriores
export const crearMovimiento = movimientoService.crear;
export const obtenerMovimientos = movimientoService.obtenerTodos;