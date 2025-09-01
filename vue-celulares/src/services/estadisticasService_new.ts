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

export interface EstadisticasRegion {
  region: string;
  totalUsuarios: number;
  totalSolicitudes: number;
  solicitudesPorEstado: {
    PENDIENTE: number;
    EN_PROCESO: number;
    RESUELTA: number;
  };
  celularesRotosPorUsuario: { [key: string]: number };
  promedioCelularesRotos: number;
  fechaDesde?: string;
  fechaHasta?: string;
  solicitudesPorMes?: { [key: string]: number };
  // Campos calculados para compatibilidad con la UI existente
  solicitudesPendientes: number;
  solicitudesEnProceso: number;
  solicitudesResueltas: number;
  solicitudesPorRotura: number;
  urgente: boolean;
}

export interface ReporteMensual {
  region: string;
  mes: string;
  año: number;
  solicitudesAbiertas: number;
  solicitudesCerradas: number;
  solicitudesEnProceso: number;
  total: number;
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
  fecha: string;
  solicitante: string;
  region: string;
  motivo: string;
  estado: string;
}

class EstadisticasService {
  async obtenerEstadisticas(): Promise<EstadisticasResumen> {
    try {
      const response = await api.get('/api/estadisticas/totales');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw new Error('No se pudieron cargar las estadísticas. Verifique la conexión con el servidor.');
    }
  }

  async obtenerEstadisticasPorRegion(region: string, fechaDesde: string, fechaHasta: string): Promise<EstadisticasRegion> {
    try {
      // Para obtener datos de una región específica
      const response = await api.get(`/api/estadisticas/region/${region}`, {
        params: { fechaDesde, fechaHasta }
      });
      
      return this.adaptarDatosRegion(response.data);
    } catch (error) {
      console.error(`Error al obtener estadísticas para región ${region}:`, error);
      throw new Error(`No se pudieron cargar las estadísticas de la región ${region}. Verifique la conexión con el servidor.`);
    }
  }

  async obtenerReporteMensual(mes: string): Promise<ReporteMensual> {
    try {
      const response = await api.get('/api/estadisticas/reportes/mensual', {
        params: { mes }
      });
      return response.data;
    } catch (error) {
      console.error(`Error al obtener reporte mensual para ${mes}:`, error);
      throw new Error(`No se pudo cargar el reporte mensual de ${mes}. Verifique la conexión con el servidor.`);
    }
  }

  async obtenerTodasLasRegiones(): Promise<EstadisticasRegion[]> {
    try {
      // Solo para ADMIN
      const response = await api.get('/api/estadisticas/todas-regiones');
      
      // Adaptar datos del backend al formato esperado por la UI
      return response.data.map((region: any) => this.adaptarDatosRegion(region));
    } catch (error) {
      console.error('Error al obtener estadísticas de todas las regiones:', error);
      throw new Error('No se pudieron cargar las estadísticas de todas las regiones. Verifique la conexión con el servidor.');
    }
  }

  async obtenerMiRegion(fechaDesde?: string, fechaHasta?: string): Promise<EstadisticasRegion> {
    try {
      // Para obtener datos de mi región (usuario normal)
      const response = await api.get('/api/estadisticas/mi-region', {
        params: { fechaDesde, fechaHasta }
      });
      
      return this.adaptarDatosRegion(response.data);
    } catch (error) {
      console.error('Error al obtener estadísticas de mi región:', error);
      throw new Error('No se pudieron cargar las estadísticas de tu región. Verifique la conexión con el servidor.');
    }
  }

  async obtenerMovimientosDetalle(mes?: number, year?: number): Promise<MovimientoDetalle[]> {
    try {
      const params = mes && year ? { mes, year } : {};
      const response = await api.get('/api/movimientos/detalle', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener movimientos detalle:', error);
      throw new Error('No se pudieron cargar los movimientos detallados. Verifique la conexión con el servidor.');
    }
  }

  async obtenerSolicitudesDetalle(mes?: number, year?: number): Promise<SolicitudDetalle[]> {
    try {
      const params = mes && year ? { mes, year } : {};
      const response = await api.get('/api/solicitudes/detalle', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener solicitudes detalle:', error);
      throw new Error('No se pudieron cargar las solicitudes detalladas. Verifique la conexión con el servidor.');
    }
  }

  // Método auxiliar para adaptar datos del backend al formato esperado
  private adaptarDatosRegion(datosBackend: any): EstadisticasRegion {
    return {
      region: datosBackend.region,
      totalUsuarios: datosBackend.totalUsuarios || 0,
      totalSolicitudes: datosBackend.totalSolicitudes || 0,
      solicitudesPorEstado: datosBackend.solicitudesPorEstado || {
        PENDIENTE: 0,
        EN_PROCESO: 0,
        RESUELTA: 0
      },
      celularesRotosPorUsuario: datosBackend.celularesRotosPorUsuario || {},
      promedioCelularesRotos: datosBackend.promedioCelularesRotos || 0,
      fechaDesde: datosBackend.fechaDesde,
      fechaHasta: datosBackend.fechaHasta,
      solicitudesPorMes: datosBackend.solicitudesPorMes,
      // Campos calculados para compatibilidad con la UI existente
      solicitudesPendientes: datosBackend.solicitudesPorEstado?.PENDIENTE || 0,
      solicitudesEnProceso: datosBackend.solicitudesPorEstado?.EN_PROCESO || 0,
      solicitudesResueltas: datosBackend.solicitudesPorEstado?.RESUELTA || 0,
      solicitudesPorRotura: datosBackend.solicitudesPorRotura || 0,
      urgente: (datosBackend.solicitudesPorEstado?.PENDIENTE || 0) > 10
    };
  }
}

export const estadisticasService = new EstadisticasService();
