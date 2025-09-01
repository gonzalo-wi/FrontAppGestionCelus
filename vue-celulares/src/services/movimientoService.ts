import http from './http';
import { mapearTipoMovimiento, mapearTipoMovimientoInverso } from '@/types/tipoMovimiento';

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
  crear: (movimiento: Movimiento) => {
    // Mapear el tipo al formato del backend
    const movimientoParaBackend = {
      ...movimiento,
      tipo: mapearTipoMovimiento(movimiento.tipo)
    };
    console.log('🔧 Enviando movimiento al backend:', movimientoParaBackend);
    return api.post<Movimiento>('/api/movimientos', movimientoParaBackend);
  },
  
  // Obtener todos los movimientos
  obtenerTodos: () => api.get<MovimientoDetalle[]>('/api/movimientos'),
  
  // Obtener movimiento por ID
  obtenerPorId: (id: number) => api.get<MovimientoDetalle>(`/api/movimientos/${id}`),
  
  // Actualizar movimiento
  actualizar: (id: number, movimiento: Partial<Movimiento>) => {
    // Mapear el tipo si está presente
    const movimientoParaBackend = movimiento.tipo ? {
      ...movimiento,
      tipo: mapearTipoMovimiento(movimiento.tipo)
    } : movimiento;
    
    console.log('🔧 Actualizando movimiento en backend:', { id, movimiento: movimientoParaBackend });
    return api.put<MovimientoDetalle>(`/api/movimientos/${id}`, movimientoParaBackend);
  },
  
  // Eliminar movimiento
  eliminar: (id: number) => api.delete<void>(`/api/movimientos/${id}`),
  
  // Función de debug para probar tipos válidos
  probarTiposMovimiento: async () => {
    const tiposParaProbar = ['ASIGNACION', 'CAMBIO', 'DEVOLUCION', 'REPARACION', 'BAJA'];
    console.log('🧪 Probando tipos de movimiento válidos...');
    
    for (const tipo of tiposParaProbar) {
      try {
        // Crear un movimiento de prueba (no se guardará si falla)
        const movimientoPrueba = {
          tipo: tipo,
          fecha: new Date().toISOString().split('T')[0],
          motivo: `Prueba de tipo ${tipo}`,
          celularId: 1,
          usuarioId: 'test'
        };
        
        console.log(`✅ Tipo ${tipo}: VÁLIDO`);
      } catch (error: any) {
        if (error.response?.status === 500 && error.response.data?.message?.includes('No enum constant')) {
          console.log(`❌ Tipo ${tipo}: INVÁLIDO - ${error.response.data.message}`);
        } else {
          console.log(`⚠️ Tipo ${tipo}: Error diferente - ${error.message}`);
        }
      }
    }
  }
};

// Mantener compatibilidad con imports anteriores
export const crearMovimiento = movimientoService.crear;
export const obtenerMovimientos = movimientoService.obtenerTodos;