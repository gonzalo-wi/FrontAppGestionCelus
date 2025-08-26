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
      const response = await api.get('/api/estadisticas/totales');
      return response.data;
    } catch (error) {
      console.warn('Backend no disponible, usando datos de desarrollo:', error);
      return this.obtenerDatosPrueba();
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
      console.warn(`Backend no disponible para región ${region}, usando datos de desarrollo:`, error);
      return this.obtenerEstadisticasRegionPrueba(region);
    }
  }

  async obtenerReporteMensual(mes: string): Promise<ReporteMensual> {
    try {
      const response = await api.get('/api/estadisticas/reportes/mensual', {
        params: { mes }
      });
      return response.data;
    } catch (error) {
      console.warn(`Backend no disponible para reporte mensual ${mes}, usando datos de desarrollo:`, error);
      return this.obtenerReporteMensualPrueba('MI_REGION', mes);
    }
  }

  async obtenerTodasLasRegiones(): Promise<EstadisticasRegion[]> {
    try {
      // Solo para ADMIN
      const response = await api.get('/api/estadisticas/todas-regiones');
      
      // Adaptar datos del backend al formato esperado por la UI
      return response.data.map((region: any) => this.adaptarDatosRegion(region));
    } catch (error) {
      console.warn('Backend no disponible para todas las regiones (requiere rol ADMIN), usando datos de desarrollo:', error);
      const regiones = ['NORTE', 'SUR', 'ESTE', 'OESTE', 'LA_PLATA', 'NAFA'];
      return regiones.map(region => this.obtenerEstadisticasRegionPrueba(region));
    }
  }

  async obtenerMiRegion(fechaDesde?: string, fechaHasta?: string): Promise<EstadisticasRegion> {
    try {
      const params: any = {};
      if (fechaDesde) params.fechaDesde = fechaDesde;
      if (fechaHasta) params.fechaHasta = fechaHasta;
      
      const response = await api.get('/api/estadisticas/mi-region', { params });
      
      return this.adaptarDatosRegion(response.data);
    } catch (error) {
      console.warn('Backend no disponible para mi región, usando datos de desarrollo:', error);
      return this.obtenerEstadisticasRegionPrueba('MI_REGION');
    }
  }

  // Función para adaptar datos del backend al formato de la UI
  private adaptarDatosRegion(regionData: any): EstadisticasRegion {
    const totalCelularesRotos = Object.values(regionData.celularesRotosPorUsuario || {})
      .reduce((sum: number, rotos: any) => sum + rotos, 0);
    
    return {
      region: regionData.region,
      totalUsuarios: regionData.totalUsuarios,
      totalSolicitudes: regionData.totalSolicitudes,
      solicitudesPorEstado: regionData.solicitudesPorEstado,
      celularesRotosPorUsuario: regionData.celularesRotosPorUsuario || {},
      promedioCelularesRotos: regionData.promedioCelularesRotos,
      fechaDesde: regionData.fechaDesde,
      fechaHasta: regionData.fechaHasta,
      solicitudesPorMes: regionData.solicitudesPorMes,
      // Campos para compatibilidad con UI existente
      solicitudesPendientes: regionData.solicitudesPorEstado?.PENDIENTE || 0,
      solicitudesEnProceso: regionData.solicitudesPorEstado?.EN_PROCESO || 0,
      solicitudesResueltas: regionData.solicitudesPorEstado?.RESUELTA || 0,
      solicitudesPorRotura: totalCelularesRotos,
      urgente: regionData.promedioCelularesRotos > 0.3 || totalCelularesRotos > 5 // Más del 30% o más de 5 celulares rotos
    };
  }

  async obtenerMovimientosDetalle(mes?: number, year?: number): Promise<MovimientoDetalle[]> {
    try {
      const params = mes && year ? { mes, year } : {};
      const response = await api.get('/api/movimientos/detalle', { params });
      return response.data;
    } catch (error) {
      console.warn('Backend no disponible para movimientos detalle, usando datos de desarrollo:', error);
      return this.obtenerMovimientosPrueba();
    }
  }

  async obtenerSolicitudesDetalle(mes?: number, year?: number): Promise<SolicitudDetalle[]> {
    try {
      const params = mes && year ? { mes, year } : {};
      const response = await api.get('/api/solicitudes/detalle', { params });
      return response.data;
    } catch (error) {
      console.warn('Backend no disponible para solicitudes detalle, usando datos de desarrollo:', error);
      return this.obtenerSolicitudesPrueba();
    }
  }

  // DATOS DE DESARROLLO - Se eliminarán cuando el backend esté listo
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

  private obtenerEstadisticasRegionPrueba(region: string): EstadisticasRegion {
    const datos = {
      'NORTE': { total: 45, pendientes: 12, enProceso: 8, resueltas: 25, porRotura: 15, usuarios: 20 },
      'SUR': { total: 32, pendientes: 8, enProceso: 5, resueltas: 19, porRotura: 8, usuarios: 15 },
      'ESTE': { total: 38, pendientes: 10, enProceso: 6, resueltas: 22, porRotura: 12, usuarios: 18 },
      'OESTE': { total: 28, pendientes: 6, enProceso: 4, resueltas: 18, porRotura: 6, usuarios: 12 },
      'LA_PLATA': { total: 51, pendientes: 15, enProceso: 9, resueltas: 27, porRotura: 18, usuarios: 25 },
      'NAFA': { total: 24, pendientes: 5, enProceso: 3, resueltas: 16, porRotura: 4, usuarios: 10 },
      'MI_REGION': { total: 35, pendientes: 8, enProceso: 7, resueltas: 20, porRotura: 10, usuarios: 16 }
    };

    const stats = datos[region as keyof typeof datos] || datos['NORTE'];
    
    // Simular celularesRotosPorUsuario
    const celularesRotos: { [key: string]: number } = {};
    for (let i = 1; i <= stats.usuarios; i++) {
      celularesRotos[i.toString()] = Math.floor(Math.random() * 3); // 0-2 celulares rotos por usuario
    }
    
    return {
      region,
      totalUsuarios: stats.usuarios,
      totalSolicitudes: stats.total,
      solicitudesPorEstado: {
        PENDIENTE: stats.pendientes,
        EN_PROCESO: stats.enProceso,
        RESUELTA: stats.resueltas
      },
      celularesRotosPorUsuario: celularesRotos,
      promedioCelularesRotos: stats.porRotura / stats.usuarios,
      // Campos para compatibilidad con UI existente
      solicitudesPendientes: stats.pendientes,
      solicitudesEnProceso: stats.enProceso,
      solicitudesResueltas: stats.resueltas,
      solicitudesPorRotura: stats.porRotura,
      urgente: stats.porRotura > 10 // Más de 10 solicitudes por rotura es urgente
    };
  }

  private obtenerReporteMensualPrueba(region: string, mes: string): ReporteMensual {
    const año = new Date().getFullYear();
    const abiertas = Math.floor(Math.random() * 20) + 5;
    const cerradas = Math.floor(Math.random() * 15) + 8;
    const enProceso = Math.floor(Math.random() * 10) + 3;

    return {
      region,
      mes,
      año,
      solicitudesAbiertas: abiertas,
      solicitudesCerradas: cerradas,
      solicitudesEnProceso: enProceso,
      total: abiertas + cerradas + enProceso
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
      },
      {
        id: 3,
        fecha: '2025-08-05',
        celular: { marca: 'Motorola', modelo: 'Edge 40', numeroSerie: 'MT001234' },
        empleadoAnterior: { nombre: 'Ana', apellido: 'Rodríguez', legajo: 'EMP004' },
        empleadoNuevo: { nombre: 'Luis', apellido: 'Fernández', legajo: 'EMP005' },
        motivo: 'Transferencia de departamento'
      }
    ];
  }

  private obtenerSolicitudesPrueba(): SolicitudDetalle[] {
    return [
      {
        id: 1,
        fechaSolicitud: '2025-08-02',
        tipoSolicitud: 'CAMBIO_POR_ROTURA',
        empleado: { nombre: 'Ana', apellido: 'Rodríguez', legajo: 'EMP004', region: 'NORTE' },
        motivo: 'Pantalla rota',
        estado: 'PENDIENTE'
      },
      {
        id: 2,
        fechaSolicitud: '2025-08-05',
        tipoSolicitud: 'SOLICITUD_NUEVO',
        empleado: { nombre: 'Luis', apellido: 'Fernández', legajo: 'EMP005', region: 'SUR' },
        motivo: 'Nuevo ingresante',
        estado: 'APROBADO'
      },
      {
        id: 3,
        fechaSolicitud: '2025-08-07',
        tipoSolicitud: 'CAMBIO_POR_ROTURA',
        empleado: { nombre: 'Carlos', apellido: 'López', legajo: 'EMP006', region: 'LA_PLATA' },
        motivo: 'Batería no funciona',
        estado: 'EN_PROCESO'
      },
      {
        id: 4,
        fechaSolicitud: '2025-08-10',
        tipoSolicitud: 'SOLICITUD_NUEVO',
        empleado: { nombre: 'María', apellido: 'García', legajo: 'EMP007', region: 'ESTE' },
        motivo: 'Promoción interna',
        estado: 'RESUELTO'
      }
    ];
  }
}

export const estadisticasService = new EstadisticasService();
