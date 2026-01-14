import http from './http';

const api = http;

export interface Proveedor {
  id?: number;
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  tiempoEstimadoDias: number;
  activo?: boolean;
  fechaCreacion?: string;
  observaciones?: string;
  ordenesReparacion?: OrdenReparacion[];
}

export interface OrdenReparacion {
  id: number;
  // Definiremos los campos cuando veas el endpoint
}

export interface CrearProveedorRequest {
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  tiempoEstimadoDias: number;
  observaciones?: string;
}

class ProveedorService {
  // Obtener todos los proveedores
  async obtenerTodos(): Promise<Proveedor[]> {
    try {
      const response = await api.get('/api/proveedores');
      return response.data;
    } catch (error: any) {
      throw this.manejarError(error, 'obtener proveedores');
    }
  }

  // Crear proveedor
  async crear(proveedor: CrearProveedorRequest): Promise<Proveedor> {
    try {
      const response = await api.post('/api/proveedores', proveedor);
      return response.data;
    } catch (error: any) {
      throw this.manejarError(error, 'crear proveedor');
    }
  }

  // Obtener proveedor por ID
  async obtenerPorId(id: number): Promise<Proveedor> {
    try {
      const response = await api.get(`/api/proveedores/${id}`);
      return response.data;
    } catch (error: any) {
      throw this.manejarError(error, 'obtener proveedor');
    }
  }

  // Actualizar proveedor
  async actualizar(id: number, proveedor: Partial<CrearProveedorRequest>): Promise<Proveedor> {
    try {
      const response = await api.put(`/api/proveedores/${id}`, proveedor);
      return response.data;
    } catch (error: any) {
      throw this.manejarError(error, 'actualizar proveedor');
    }
  }

  // Eliminar proveedor
  async eliminar(id: number): Promise<void> {
    try {
      await api.delete(`/api/proveedores/${id}`);
    } catch (error: any) {
      throw this.manejarError(error, 'eliminar proveedor');
    }
  }

  // Activar/Desactivar proveedor
  async toggleActivo(id: number, activo: boolean): Promise<Proveedor> {
    try {
      const response = await api.patch(`/api/proveedores/${id}/activo`, { activo });
      return response.data;
    } catch (error: any) {
      throw this.manejarError(error, 'cambiar estado del proveedor');
    }
  }

  // Manejo de errores centralizado
  private manejarError(error: any, operacion: string): never {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data?.error || 'Error del servidor';
      
      switch (status) {
        case 401:
          throw new Error('No autorizado. Por favor, inicie sesión nuevamente.');
        case 403:
          throw new Error(`No tiene permisos para ${operacion}.`);
        case 404:
          throw new Error(`Proveedor no encontrado.`);
        case 409:
          throw new Error('Ya existe un proveedor con estos datos.');
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

export const proveedorService = new ProveedorService();
