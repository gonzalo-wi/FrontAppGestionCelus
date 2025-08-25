import http from './http';

// Usamos el cliente HTTP compartido con interceptor de Authorization
const api = http;

export interface EstadisticasMensuales {
  mes: string;
  year: number;
  movimientos: number;
  solicitudes: number;
}

export interface EstadisticasResumen {
  totalMovimientos: number;
  totalSolicitudes: number;
  movimientosMesActual: number;
  solicitudesMesActual: number;
  estadisticasMensuales: EstadisticasMensuales[];
}

export interface MovimientoDetalle {
  id: number;
  fecha: string;
  celular: {
    marca: string;
    modelo: string;
    numeroSerie: string;
  };
  empleadoAnterior: {
    nombre: string;
    apellido: string;
    legajo: string;
  } | null;
  empleadoNuevo: {
    nombre: string;
    apellido: string;
    legajo: string;
  };
  motivo: string;
}

export interface SolicitudDetalle {
  id: number;
  fechaSolicitud: string;
  tipoSolicitud: string;
  empleado: {
    nombre: string;
    apellido: string;
    legajo: string;
    region: string;
  };
  motivo: string;
  estado: string;
}

class EstadisticasService {
  async obtenerEstadisticas(): Promise<EstadisticasResumen> {
    try {
      const response = await api.get('/api/estadisticas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      // Datos de prueba mientras implementamos el backend
      return this.obtenerDatosPrueba();
    }
  }

  async obtenerMovimientosDetalle(mes?: number, year?: number): Promise<MovimientoDetalle[]> {
    try {
      const params = mes && year ? { mes, year } : {};
      const response = await api.get('/api/movimientos/detalle', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener movimientos detalle:', error);
      return this.obtenerMovimientosPrueba();
    }
  }

  async obtenerSolicitudesDetalle(mes?: number, year?: number): Promise<SolicitudDetalle[]> {
    try {
      const params = mes && year ? { mes, year } : {};
      const response = await api.get('/api/solicitudes/detalle', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener solicitudes detalle:', error);
      return this.obtenerSolicitudesPrueba();
    }
  }

  private obtenerDatosPrueba(): EstadisticasResumen {
    const estadisticasMensuales: EstadisticasMensuales[] = [
      { mes: 'Enero', year: 2025, movimientos: 45, solicitudes: 23 },
      { mes: 'Febrero', year: 2025, movimientos: 52, solicitudes: 31 },
      { mes: 'Marzo', year: 2025, movimientos: 38, solicitudes: 19 },
      { mes: 'Abril', year: 2025, movimientos: 61, solicitudes: 42 },
      { mes: 'Mayo', year: 2025, movimientos: 47, solicitudes: 28 },
      { mes: 'Junio', year: 2025, movimientos: 55, solicitudes: 35 },
      { mes: 'Julio', year: 2025, movimientos: 43, solicitudes: 26 },
      { mes: 'Agosto', year: 2025, movimientos: 38, solicitudes: 18 }
    ];

    return {
      totalMovimientos: estadisticasMensuales.reduce((sum, m) => sum + m.movimientos, 0),
      totalSolicitudes: estadisticasMensuales.reduce((sum, m) => sum + m.solicitudes, 0),
      movimientosMesActual: 38,
      solicitudesMesActual: 18,
      estadisticasMensuales
    };
  }

  private obtenerMovimientosPrueba(): MovimientoDetalle[] {
    return [
      {
        id: 1,
        fecha: '2025-08-01',
        celular: { marca: 'Samsung', modelo: 'Galaxy A54', numeroSerie: 'SG001234' },
        empleadoAnterior: { nombre: 'Juan', apellido: 'Pérez', legajo: 'EMP001' },
        empleadoNuevo: { nombre: 'María', apellido: 'García', legajo: 'EMP002' },
        motivo: 'Cambio de área'
      },
      {
        id: 2,
        fecha: '2025-08-03',
        celular: { marca: 'iPhone', modelo: '14', numeroSerie: 'IP001234' },
        empleadoAnterior: null,
        empleadoNuevo: { nombre: 'Carlos', apellido: 'López', legajo: 'EMP003' },
        motivo: 'Nuevo empleado'
      }
    ];
  }

  private obtenerSolicitudesPrueba(): SolicitudDetalle[] {
    return [
      {
        id: 1,
        fechaSolicitud: '2025-08-02',
        tipoSolicitud: 'CAMBIO_POR_ROTURA',
        empleado: { nombre: 'Ana', apellido: 'Rodríguez', legajo: 'EMP004', region: 'CENTRO' },
        motivo: 'Pantalla rota',
        estado: 'PENDIENTE'
      },
      {
        id: 2,
        fechaSolicitud: '2025-08-05',
        tipoSolicitud: 'SOLICITUD_NUEVO',
        empleado: { nombre: 'Luis', apellido: 'Fernández', legajo: 'EMP005', region: 'NORTE' },
        motivo: 'Nuevo ingresante',
        estado: 'APROBADO'
      }
    ];
  }
}

export const estadisticasService = new EstadisticasService();
