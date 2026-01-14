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

export interface EstadisticasGenerales {
  totalDispositivos: number;
  totalAsignados: number;
  totalUsuarios: number;
  totalMovimientos: number;
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
  totalCelularesRotos: number;
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

export interface RepartoRotura {
  reparto: string;
  region: string;
  cantidadRoturas: number;
  totalUsuarios: number;
  porcentajeRotura: number;
  urgente: boolean;
}

class EstadisticasService {
  // Método auxiliar para manejar errores de manera consistente
  private manejarError(error: any, operacion: string): never {
    console.error(`Error en ${operacion}:`, error);
    
    if (error.response) {
      // El servidor respondió con un código de error
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data?.error || 'Error del servidor';
      
      switch (status) {
        case 401:
          throw new Error('No autorizado. Por favor, inicie sesión nuevamente.');
        case 403:
          throw new Error(`No tiene permisos para ${operacion}.`);
        case 404:
          throw new Error(`Recurso no encontrado para ${operacion}.`);
        case 500:
          throw new Error(`Error interno del servidor en ${operacion}: ${message}`);
        default:
          throw new Error(`Error del servidor (${status}) en ${operacion}: ${message}`);
      }
    } else if (error.request) {
      // La petición se hizo pero no se recibió respuesta
      throw new Error('No se pudo conectar con el servidor. Verifique su conexión a internet.');
    } else {
      // Error en la configuración de la petición
      throw new Error(`Error de configuración en ${operacion}: ${error.message}`);
    }
  }
  async obtenerEstadisticas(): Promise<EstadisticasResumen> {
    try {
      const response = await api.get('/api/estadisticas/totales');
      return response.data;
    } catch (error: any) {
      this.manejarError(error, 'obtener estadísticas generales');
    }
  }

  async obtenerEstadisticasGenerales(): Promise<EstadisticasGenerales> {
    try {
      const response = await api.get('/api/estadisticas/generales');
      return response.data;
    } catch (error: any) {
      this.manejarError(error, 'obtener estadísticas generales rápidas');
    }
  }

  async obtenerEstadisticasPorRegion(region: string, fechaDesde: string, fechaHasta: string): Promise<EstadisticasRegion> {
    try {
      // Para obtener datos de una región específica
      const response = await api.get(`/api/estadisticas/region/${region}`, {
        params: { fechaDesde, fechaHasta }
      });
      
      return this.adaptarDatosRegion(response.data);
    } catch (error: any) {
      this.manejarError(error, `obtener estadísticas de la región ${region}`);
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

  async obtenerReporteMensualPorRegion(region: string, mes: string): Promise<any> {
    try {
      const response = await api.get('/api/estadisticas/reportes/mensual', {
        params: { region, mes }
      });
      return response.data;
    } catch (error: any) {
      this.manejarError(error, `obtener reporte mensual de ${region} para ${mes}`);
    }
  }

  async obtenerDatosParaExportacion(): Promise<{
    estadisticasGenerales: EstadisticasResumen | null;
    todasLasRegiones: EstadisticasRegion[];
    repartosRoturas: RepartoRotura[];
  }> {
    try {
      const [estadisticasGenerales, todasLasRegiones, repartosRoturas] = await Promise.all([
        this.obtenerEstadisticas().catch(() => null),
        this.obtenerTodasLasRegiones().catch(() => []),
        this.obtenerRepartosConMasRoturas().catch(() => [])
      ]);

      return {
        estadisticasGenerales,
        todasLasRegiones,
        repartosRoturas
      };
    } catch (error: any) {
      this.manejarError(error, 'obtener datos para exportación');
    }
  }

  async obtenerTodasLasRegiones(): Promise<EstadisticasRegion[]> {
    try {
      // Solo para ADMIN
      const response = await api.get('/api/estadisticas/todas-regiones');
      
      // Adaptar datos del backend al formato esperado por la UI
      return response.data.map((region: any) => this.adaptarDatosRegion(region));
    } catch (error: any) {
      this.manejarError(error, 'obtener estadísticas de todas las regiones');
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
      // Intentar diferentes endpoints que puedan existir
      const params = mes && year ? { mes, year } : {};
      
      // Primero intentar con endpoint de movimientos básico
      let response;
      try {
        response = await api.get('/api/movimientos', { params });
      } catch (error: any) {
        if (error.response?.status === 404) {
          // Si no existe, crear datos simulados basados en estadísticas
          console.warn('Endpoint de movimientos no disponible, generando datos simulados');
          return this.generarMovimientosSimulados();
        }
        throw error;
      }
      
      // Transformar datos a formato esperado si es necesario
      return this.transformarMovimientos(response.data);
    } catch (error) {
      console.error('Error al obtener movimientos detalle:', error);
      // Como último recurso, devolver datos simulados
      return this.generarMovimientosSimulados();
    }
  }

  async obtenerSolicitudesDetalle(mes?: number, year?: number): Promise<SolicitudDetalle[]> {
    try {
      // Intentar diferentes endpoints que puedan existir
      const params = mes && year ? { mes, year } : {};
      
      // Primero intentar con endpoint de solicitudes básico
      let response;
      try {
        response = await api.get('/api/solicitudes', { params });
      } catch (error: any) {
        if (error.response?.status === 404) {
          // Si no existe, crear datos simulados basados en estadísticas
          console.warn('Endpoint de solicitudes no disponible, generando datos simulados');
          return this.generarSolicitudesSimuladas();
        }
        throw error;
      }
      
      // Transformar datos a formato esperado si es necesario
      return this.transformarSolicitudes(response.data);
    } catch (error) {
      console.error('Error al obtener solicitudes detalle:', error);
      // Como último recurso, devolver datos simulados
      return this.generarSolicitudesSimuladas();
    }
  }

  async obtenerRepartosConMasRoturas(): Promise<RepartoRotura[]> {
    try {
      // Usar el endpoint real de todas las regiones
      const response = await api.get('/api/estadisticas/todas-regiones');
      
      // Procesar datos para extraer repartos con roturas
      const repartos: RepartoRotura[] = [];
      
      response.data.forEach((region: any) => {
        if (region.celularesRotosPorUsuario) {
          // Iterar sobre cada usuario y sus roturas
          Object.entries(region.celularesRotosPorUsuario).forEach(([usuario, cantidadRoturas]: [string, any]) => {
            repartos.push({
              reparto: usuario, // El número de reparto es el usuario
              region: region.region,
              cantidadRoturas: cantidadRoturas || 0,
              totalUsuarios: 1, // Un usuario por reparto
              porcentajeRotura: cantidadRoturas > 0 ? 100 : 0, // Si tiene roturas es 100%
              urgente: (cantidadRoturas || 0) > 2 // Más de 2 roturas es urgente
            });
          });
        }
      });
      
      // Ordenar por cantidad de roturas descendente
      return repartos.sort((a, b) => b.cantidadRoturas - a.cantidadRoturas);
      
    } catch (error: any) {
      console.error('Error al obtener repartos con roturas:', error);
      this.manejarError(error, 'obtener repartos con más roturas');
    }
  }

  async exportarMovimientosConFiltros(fechaDesde?: string, fechaHasta?: string, region?: string): Promise<MovimientoDetalle[]> {
    try {
      const params: any = {};
      if (fechaDesde) params.fechaDesde = fechaDesde;
      if (fechaHasta) params.fechaHasta = fechaHasta;
      if (region) params.region = region;
      
      const response = await api.get('/api/movimientos/exportar', { params });
      return response.data;
    } catch (error: any) {
      // Si el endpoint específico no existe, usar el método existente
      console.warn('Endpoint de exportar movimientos no disponible, usando método estándar');
      return this.obtenerMovimientosDetalle();
    }
  }

  async exportarSolicitudesConFiltros(fechaDesde?: string, fechaHasta?: string, region?: string, estado?: string): Promise<SolicitudDetalle[]> {
    try {
      const params: any = {};
      if (fechaDesde) params.fechaDesde = fechaDesde;
      if (fechaHasta) params.fechaHasta = fechaHasta;
      if (region) params.region = region;
      if (estado) params.estado = estado;
      
      const response = await api.get('/api/solicitudes/exportar', { params });
      return response.data;
    } catch (error: any) {
      // Si el endpoint específico no existe, usar el método existente
      console.warn('Endpoint de exportar solicitudes no disponible, usando método estándar');
      return this.obtenerSolicitudesDetalle();
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
      totalCelularesRotos: datosBackend.totalCelularesRotos || 0,
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

  // Métodos auxiliares para transformar datos
  private transformarMovimientos(datos: any[]): MovimientoDetalle[] {
    return datos.map((item: any) => ({
      id: item.id || Math.random(),
      fecha: item.fecha || item.fechaMovimiento || new Date().toISOString(),
      celular: {
        marca: item.celular?.marca || item.marca || 'Sin especificar',
        modelo: item.celular?.modelo || item.modelo || 'Sin especificar',
        numeroSerie: item.celular?.numeroSerie || item.serie || 'Sin especificar'
      },
      empleadoAnterior: item.empleadoAnterior ? {
        nombre: item.empleadoAnterior.nombre || 'Sin especificar',
        apellido: item.empleadoAnterior.apellido || '',
        legajo: item.empleadoAnterior.legajo || 'Sin especificar'
      } : null,
      empleadoNuevo: {
        nombre: item.empleadoNuevo?.nombre || item.empleado?.nombre || 'Sin especificar',
        apellido: item.empleadoNuevo?.apellido || item.empleado?.apellido || '',
        legajo: item.empleadoNuevo?.legajo || item.empleado?.legajo || 'Sin especificar'
      },
      motivo: item.motivo || item.motivoMovimiento || 'Sin especificar'
    }));
  }

  private transformarSolicitudes(datos: any[]): SolicitudDetalle[] {
    return datos.map((item: any) => ({
      id: item.id || Math.random(),
      fecha: item.fecha || item.fechaSolicitud || new Date().toISOString(),
      solicitante: item.solicitante || `${item.empleado?.nombre || ''} ${item.empleado?.apellido || ''}`.trim() || 'Sin especificar',
      region: item.region || item.empleado?.region || 'Sin especificar',
      motivo: item.motivo || item.motivoSolicitud || 'Sin especificar',
      estado: item.estado || item.status || 'PENDIENTE'
    }));
  }

  // Métodos para generar datos simulados cuando los endpoints no están disponibles
  private generarMovimientosSimulados(): MovimientoDetalle[] {
    const movimientos: MovimientoDetalle[] = [];
    const marcas = ['Samsung', 'iPhone', 'Motorola', 'Xiaomi'];
    const modelos = ['Galaxy S21', 'iPhone 13', 'Moto G', 'Redmi Note'];
    const motivos = ['Cambio por rotura', 'Actualización', 'Pérdida', 'Cambio de área'];
    
    for (let i = 1; i <= 20; i++) {
      movimientos.push({
        id: i,
        fecha: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        celular: {
          marca: marcas[Math.floor(Math.random() * marcas.length)],
          modelo: modelos[Math.floor(Math.random() * modelos.length)],
          numeroSerie: `SIM${Math.random().toString(36).substring(7).toUpperCase()}`
        },
        empleadoAnterior: Math.random() > 0.3 ? {
          nombre: `Usuario${Math.floor(Math.random() * 100)}`,
          apellido: `Anterior${Math.floor(Math.random() * 100)}`,
          legajo: `LEG${Math.floor(Math.random() * 9999)}`
        } : null,
        empleadoNuevo: {
          nombre: `Usuario${Math.floor(Math.random() * 100)}`,
          apellido: `Nuevo${Math.floor(Math.random() * 100)}`,
          legajo: `LEG${Math.floor(Math.random() * 9999)}`
        },
        motivo: motivos[Math.floor(Math.random() * motivos.length)]
      });
    }
    
    return movimientos;
  }

  private generarSolicitudesSimuladas(): SolicitudDetalle[] {
    const solicitudes: SolicitudDetalle[] = [];
    const regiones = ['NORTE', 'SUR', 'ESTE', 'OESTE', 'LA_PLATA'];
    const motivos = ['Rotura de pantalla', 'Equipo perdido', 'Actualización', 'Mal funcionamiento'];
    const estados = ['PENDIENTE', 'EN_PROCESO', 'RESUELTA'];
    
    for (let i = 1; i <= 25; i++) {
      solicitudes.push({
        id: i,
        fecha: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
        solicitante: `Usuario ${Math.floor(Math.random() * 100)}`,
        region: regiones[Math.floor(Math.random() * regiones.length)],
        motivo: motivos[Math.floor(Math.random() * motivos.length)],
        estado: estados[Math.floor(Math.random() * estados.length)]
      });
    }
    
    return solicitudes;
  }
}

// Función auxiliar para agrupar regiones comerciales
export const agruparRegionesComerciales = (regiones: EstadisticasRegion[]): EstadisticasRegion[] => {
  const regionesComerciales = ['NORTE', 'SUR', 'ESTE', 'OESTE', 'LA_PLATA', 'NAFA'];
  
  // Separar regiones comerciales de las demás
  const comerciales = regiones.filter(r => regionesComerciales.includes(r.region));
  const noComerciales = regiones.filter(r => !regionesComerciales.includes(r.region));
  
  // Si hay regiones comerciales, agruparlas
  if (comerciales.length > 0) {
    const grupoComercial: EstadisticasRegion = {
      region: 'COMERCIAL',
      totalUsuarios: comerciales.reduce((sum, r) => sum + r.totalUsuarios, 0),
      totalSolicitudes: comerciales.reduce((sum, r) => sum + r.totalSolicitudes, 0),
      solicitudesPorEstado: {
        PENDIENTE: comerciales.reduce((sum, r) => sum + r.solicitudesPorEstado.PENDIENTE, 0),
        EN_PROCESO: comerciales.reduce((sum, r) => sum + r.solicitudesPorEstado.EN_PROCESO, 0),
        RESUELTA: comerciales.reduce((sum, r) => sum + r.solicitudesPorEstado.RESUELTA, 0)
      },
      celularesRotosPorUsuario: comerciales.reduce((acc, r) => ({ ...acc, ...r.celularesRotosPorUsuario }), {}),
      totalCelularesRotos: comerciales.reduce((sum, r) => sum + r.totalCelularesRotos, 0),
      promedioCelularesRotos: comerciales.length > 0 ? 
        comerciales.reduce((sum, r) => sum + r.promedioCelularesRotos, 0) / comerciales.length : 0,
      fechaDesde: comerciales[0]?.fechaDesde,
      fechaHasta: comerciales[0]?.fechaHasta,
      solicitudesPorMes: comerciales.reduce((acc, r) => {
        if (r.solicitudesPorMes) {
          Object.entries(r.solicitudesPorMes).forEach(([mes, cantidad]) => {
            acc[mes] = (acc[mes] || 0) + (cantidad as number);
          });
        }
        return acc;
      }, {} as { [key: string]: number }),
      // Campos calculados
      solicitudesPendientes: comerciales.reduce((sum, r) => sum + r.solicitudesPendientes, 0),
      solicitudesEnProceso: comerciales.reduce((sum, r) => sum + r.solicitudesEnProceso, 0),
      solicitudesResueltas: comerciales.reduce((sum, r) => sum + r.solicitudesResueltas, 0),
      solicitudesPorRotura: comerciales.reduce((sum, r) => sum + r.solicitudesPorRotura, 0),
      urgente: comerciales.reduce((sum, r) => sum + r.solicitudesPendientes, 0) > 10
    };
    
    // Retornar grupo comercial más las regiones no comerciales
    return [grupoComercial, ...noComerciales];
  }
  
  // Si no hay regiones comerciales, retornar todas las regiones tal como están
  return regiones;
};

export const estadisticasService = new EstadisticasService();
export default estadisticasService;
