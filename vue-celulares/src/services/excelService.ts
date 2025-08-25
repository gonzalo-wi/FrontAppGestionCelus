import * as XLSX from 'xlsx';
import type { MovimientoDetalle, SolicitudDetalle, EstadisticasMensuales } from './estadisticasService';

class ExcelService {
  exportarEstadisticas(estadisticasMensuales: EstadisticasMensuales[], nombreArchivo: string = 'estadisticas_mensuales.xlsx') {
    // Preparar datos para Excel
    const datosExcel = estadisticasMensuales.map(estadistica => ({
      'Mes': estadistica.mes,
      'Año': estadistica.year,
      'Movimientos': estadistica.movimientos,
      'Solicitudes': estadistica.solicitudes,
      'Total': estadistica.movimientos + estadistica.solicitudes
    }));

    // Agregar totales al final
    const totalMovimientos = estadisticasMensuales.reduce((sum, e) => sum + e.movimientos, 0);
    const totalSolicitudes = estadisticasMensuales.reduce((sum, e) => sum + e.solicitudes, 0);
    
    datosExcel.push({
      'Mes': 'TOTAL',
      'Año': '',
      'Movimientos': totalMovimientos,
      'Solicitudes': totalSolicitudes,
      'Total': totalMovimientos + totalSolicitudes
    });

    this.exportarAExcel([{ nombre: 'Estadísticas', datos: datosExcel }], nombreArchivo);
  }

  exportarMovimientos(movimientos: MovimientoDetalle[], nombreArchivo: string = 'movimientos.xlsx') {
    const datosExcel = movimientos.map(movimiento => ({
      'ID': movimiento.id,
      'Fecha': new Date(movimiento.fecha).toLocaleDateString('es-AR'),
      'Celular Marca': movimiento.celular.marca,
      'Celular Modelo': movimiento.celular.modelo,
      'Número Serie': movimiento.celular.numeroSerie,
      'Empleado Anterior': movimiento.empleadoAnterior 
        ? `${movimiento.empleadoAnterior.nombre} ${movimiento.empleadoAnterior.apellido} (${movimiento.empleadoAnterior.legajo})`
        : 'Nuevo equipo',
      'Empleado Nuevo': `${movimiento.empleadoNuevo.nombre} ${movimiento.empleadoNuevo.apellido} (${movimiento.empleadoNuevo.legajo})`,
      'Motivo': movimiento.motivo
    }));

    this.exportarAExcel([{ nombre: 'Movimientos', datos: datosExcel }], nombreArchivo);
  }

  exportarSolicitudes(solicitudes: SolicitudDetalle[], nombreArchivo: string = 'solicitudes.xlsx') {
    const datosExcel = solicitudes.map(solicitud => ({
      'ID': solicitud.id,
      'Fecha Solicitud': new Date(solicitud.fechaSolicitud).toLocaleDateString('es-AR'),
      'Tipo Solicitud': this.formatearTipoSolicitud(solicitud.tipoSolicitud),
      'Empleado': `${solicitud.empleado.nombre} ${solicitud.empleado.apellido}`,
      'Legajo': solicitud.empleado.legajo,
      'Región': this.formatearRegion(solicitud.empleado.region),
      'Motivo': solicitud.motivo,
      'Estado': this.formatearEstado(solicitud.estado)
    }));

    this.exportarAExcel([{ nombre: 'Solicitudes', datos: datosExcel }], nombreArchivo);
  }

  exportarCompleto(
    estadisticasMensuales: EstadisticasMensuales[],
    movimientos: MovimientoDetalle[],
    solicitudes: SolicitudDetalle[],
    nombreArchivo: string = 'reporte_completo.xlsx'
  ) {
    // Hoja de estadísticas
    const datosEstadisticas = estadisticasMensuales.map(estadistica => ({
      'Mes': estadistica.mes,
      'Año': estadistica.year,
      'Movimientos': estadistica.movimientos,
      'Solicitudes': estadistica.solicitudes,
      'Total': estadistica.movimientos + estadistica.solicitudes
    }));

    // Totales
    const totalMovimientos = estadisticasMensuales.reduce((sum, e) => sum + e.movimientos, 0);
    const totalSolicitudes = estadisticasMensuales.reduce((sum, e) => sum + e.solicitudes, 0);
    
    datosEstadisticas.push({
      'Mes': 'TOTAL',
      'Año': '',
      'Movimientos': totalMovimientos,
      'Solicitudes': totalSolicitudes,
      'Total': totalMovimientos + totalSolicitudes
    });

    // Hoja de movimientos
    const datosMovimientos = movimientos.map(movimiento => ({
      'ID': movimiento.id,
      'Fecha': new Date(movimiento.fecha).toLocaleDateString('es-AR'),
      'Celular Marca': movimiento.celular.marca,
      'Celular Modelo': movimiento.celular.modelo,
      'Número Serie': movimiento.celular.numeroSerie,
      'Empleado Anterior': movimiento.empleadoAnterior 
        ? `${movimiento.empleadoAnterior.nombre} ${movimiento.empleadoAnterior.apellido} (${movimiento.empleadoAnterior.legajo})`
        : 'Nuevo equipo',
      'Empleado Nuevo': `${movimiento.empleadoNuevo.nombre} ${movimiento.empleadoNuevo.apellido} (${movimiento.empleadoNuevo.legajo})`,
      'Motivo': movimiento.motivo
    }));

    // Hoja de solicitudes
    const datosSolicitudes = solicitudes.map(solicitud => ({
      'ID': solicitud.id,
      'Fecha Solicitud': new Date(solicitud.fechaSolicitud).toLocaleDateString('es-AR'),
      'Tipo Solicitud': this.formatearTipoSolicitud(solicitud.tipoSolicitud),
      'Empleado': `${solicitud.empleado.nombre} ${solicitud.empleado.apellido}`,
      'Legajo': solicitud.empleado.legajo,
      'Región': this.formatearRegion(solicitud.empleado.region),
      'Motivo': solicitud.motivo,
      'Estado': this.formatearEstado(solicitud.estado)
    }));

    const hojas = [
      { nombre: 'Estadísticas', datos: datosEstadisticas },
      { nombre: 'Movimientos', datos: datosMovimientos },
      { nombre: 'Solicitudes', datos: datosSolicitudes }
    ];

    this.exportarAExcel(hojas, nombreArchivo);
  }

  private exportarAExcel(hojas: { nombre: string; datos: any[] }[], nombreArchivo: string) {
    const workbook = XLSX.utils.book_new();

    hojas.forEach(hoja => {
      const worksheet = XLSX.utils.json_to_sheet(hoja.datos);
      
      // Ajustar ancho de columnas automáticamente
      const columnWidths: { [key: string]: number } = {};
      
      hoja.datos.forEach(row => {
        Object.keys(row).forEach(key => {
          const value = row[key]?.toString() || '';
          const length = value.length;
          if (!columnWidths[key] || columnWidths[key] < length) {
            columnWidths[key] = Math.min(Math.max(length + 2, 10), 50);
          }
        });
      });

      worksheet['!cols'] = Object.keys(columnWidths).map(key => ({ 
        wch: columnWidths[key] 
      }));

      XLSX.utils.book_append_sheet(workbook, worksheet, hoja.nombre);
    });

    // Descargar archivo
    XLSX.writeFile(workbook, nombreArchivo);
  }

  private formatearTipoSolicitud(tipo: string): string {
    const tipos: { [key: string]: string } = {
      'CAMBIO_POR_ROTURA': 'Cambio por rotura',
      'CAMBIO_POR_PERDIDA': 'Cambio por pérdida',
      'SOLICITUD_NUEVO': 'Solicitud nuevo',
      'ACTUALIZACION_EQUIPO': 'Actualización equipo',
      'OTRO': 'Otro'
    };
    return tipos[tipo] || tipo;
  }

  private formatearRegion(region: string): string {
    const regiones: { [key: string]: string } = {
      'CENTRO': 'Centro',
      'NORTE': 'Norte',
      'SUR': 'Sur',
      'OESTE': 'Oeste',
      'ESTE': 'Este'
    };
    return regiones[region] || region;
  }

  private formatearEstado(estado: string): string {
    const estados: { [key: string]: string } = {
      'PENDIENTE': 'Pendiente',
      'EN_PROCESO': 'En proceso',
      'APROBADO': 'Aprobado',
      'RECHAZADO': 'Rechazado',
      'COMPLETADO': 'Completado'
    };
    return estados[estado] || estado;
  }
}

export const excelService = new ExcelService();
