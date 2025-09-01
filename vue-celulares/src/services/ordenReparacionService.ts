import http from './http';

const api = http;

export interface OrdenReparacion {
  id?: number;
  numeroOrden?: string;
  fechaCreacion?: string;
  fechaEnvio?: string;
  fechaEstimadaEntrega?: string;
  fechaRealEntrega?: string;
  proveedor?: {
    id: number;
    nombre: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    activo?: boolean;
  };
  diagnostico?: string;
  costoEstimado?: number;
  costoFinal?: number;
  total?: number;
  observaciones?: string;
  estado?: string;
  reparacionItems?: ReparacionItem[];
  cantidadCelulares?: number;
  costoPromedioPorCelular?: number;
}

export interface ReparacionItem {
  id?: number;
  celular?: {
    id: number;
    numeroSerie: number;
    marca: string;
    modelo: string;
    codigoInterno?: string;
    estado?: string;
  };
  motivoReparacion?: string;
  costoReparacion?: number;
  observaciones?: string;
  fechaCreacion?: string;
}

export interface CrearOrdenRequest {
  proveedorId: number;
  diagnostico?: string;
  costoEstimado?: number;
  fechaEstimadaEntrega?: string;
  observaciones?: string;
}

export interface CrearItemRequest {
  codigoInterno: string;
  motivoReparacion: string;
  costoReparacion: number;
  observaciones?: string;
  modelo: string;
  marca: string;
}

class OrdenReparacionService {
  // Obtener todas las órdenes
  async obtenerTodas(): Promise<OrdenReparacion[]> {
    try {
      const response = await api.get('/api/ordenes-reparacion');
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener órdenes de reparación:', error);
      throw this.manejarError(error, 'obtener órdenes de reparación');
    }
  }

  // Crear orden de reparación
  async crear(orden: CrearOrdenRequest): Promise<OrdenReparacion> {
    try {
      const response = await api.post('/api/ordenes-reparacion', orden);
      return response.data;
    } catch (error: any) {
      console.error('Error al crear orden de reparación:', error);
      throw this.manejarError(error, 'crear orden de reparación');
    }
  }

  // Obtener orden por ID
  async obtenerPorId(id: number): Promise<OrdenReparacion> {
    try {
      const response = await api.get(`/api/ordenes-reparacion/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener orden de reparación:', error);
      throw this.manejarError(error, 'obtener orden de reparación');
    }
  }

  // Actualizar orden de reparación
  async actualizar(id: number, orden: Partial<CrearOrdenRequest>): Promise<OrdenReparacion> {
    try {
      const response = await api.put(`/api/ordenes-reparacion/${id}`, orden);
      return response.data;
    } catch (error: any) {
      console.error('Error al actualizar orden de reparación:', error);
      throw this.manejarError(error, 'actualizar orden de reparación');
    }
  }

  // Eliminar orden de reparación
  async eliminar(id: number): Promise<void> {
    try {
      await api.delete(`/api/ordenes-reparacion/${id}`);
    } catch (error: any) {
      console.error('Error al eliminar orden de reparación:', error);
      throw this.manejarError(error, 'eliminar orden de reparación');
    }
  }

  // Obtener items de una orden
  async obtenerItems(ordenId: number): Promise<ReparacionItem[]> {
    try {
      const response = await api.get(`/api/reparacion-items/orden/${ordenId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener items de reparación:', error);
      throw this.manejarError(error, 'obtener items de reparación');
    }
  }

  // Agregar item a una orden
  async agregarItem(ordenId: number, item: CrearItemRequest): Promise<ReparacionItem> {
    try {
      console.log('Agregando item a orden:', ordenId);
      console.log('Datos del item:', JSON.stringify(item, null, 2));
      console.log('Token de auth:', localStorage.getItem('auth')); // Debug auth
      const response = await api.post(`/api/reparacion-items/orden/${ordenId}`, item);
      return response.data;
    } catch (error: any) {
      console.error('Error al agregar item de reparación:', error);
      throw this.manejarError(error, 'agregar item de reparación');
    }
  }

  // Eliminar item de reparación
  async eliminarItem(itemId: number): Promise<void> {
    try {
      await api.delete(`/api/reparacion-items/${itemId}`);
    } catch (error: any) {
      console.error('Error al eliminar item de reparación:', error);
      throw this.manejarError(error, 'eliminar item de reparación');
    }
  }

  // Actualizar item de reparación
  async actualizarItem(itemId: number, item: Partial<CrearItemRequest>): Promise<ReparacionItem> {
    try {
      const response = await api.put(`/api/reparacion-items/${itemId}`, item);
      return response.data;
    } catch (error: any) {
      console.error('Error al actualizar item de reparación:', error);
      throw this.manejarError(error, 'actualizar item de reparación');
    }
  }

  // Manejo de errores centralizado
  private manejarError(error: any, operacion: string): never {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      console.log('Error response completa:', error.response);
      console.log('Error response data:', data);
      console.log('Error response status:', status);
      
      let message = 'Error del servidor';
      
      if (typeof data === 'string') {
        message = data;
      } else if (data?.message) {
        message = data.message;
      } else if (data?.error) {
        message = data.error;
      } else if (data?.details) {
        message = data.details;
      }
      
      switch (status) {
        case 401:
          throw new Error('No autorizado. Por favor, inicie sesión nuevamente.');
        case 403:
          throw new Error(`No tiene permisos para ${operacion}.`);
        case 404:
          throw new Error(`Orden de reparación no encontrada.`);
        case 409:
          throw new Error('Ya existe una orden con estos datos.');
        case 422:
          throw new Error(`Datos inválidos: ${message}`);
        case 400:
          throw new Error(`Datos incorrectos: ${message}`);
        case 500:
          throw new Error(`Error interno del servidor: ${message}`);
        default:
          throw new Error(`Error del servidor (${status}): ${message}`);
      }
    } else if (error.request) {
      throw new Error('No se pudo conectar con el servidor. Verifique su conexión a internet.');
    } else {
      throw new Error(`Error de configuración: ${error.message}`);
    }
  }
}

export const ordenReparacionService = new OrdenReparacionService();
