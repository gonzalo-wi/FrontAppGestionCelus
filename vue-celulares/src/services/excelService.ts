import * as XLSX from 'xlsx';
import type { MovimientoDetalle, SolicitudDetalle, EstadisticasMensuales } from './estadisticasService';

class ExcelService {
  exportarEstadisticas(estadisticasMensuales: EstadisticasMensuales[], nombreArchivo: string = 'estadisticas_mensuales.xlsx') {
    // Preparar datos para Excel
  const datosExcel = estadisticasMensuales.map((estadistica:any) => ({
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
      'Año': null,
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
    const datosExcel = solicitudes.map((solicitud:any) => ({
      'ID': solicitud.id,
      'Fecha Solicitud': solicitud.fechaSolicitud ? new Date(solicitud.fechaSolicitud).toLocaleDateString('es-AR') : '',
      'Tipo Solicitud': this.formatearTipoSolicitud(solicitud.tipoSolicitud || solicitud.tipo),
      'Empleado': solicitud.empleado ? `${solicitud.empleado.nombre} ${solicitud.empleado.apellido}` : '',
      'Legajo': solicitud.empleado?.legajo || '',
      'Región': solicitud.empleado ? this.formatearRegion(solicitud.empleado.region) : '',
      'Motivo': solicitud.motivo || '',
      'Estado': this.formatearEstado(solicitud.estado || solicitud.status || '')
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
  const datosEstadisticas = estadisticasMensuales.map((estadistica:any) => ({
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
      'Año': null,
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
    const datosSolicitudes = solicitudes.map((solicitud:any) => ({
      'ID': solicitud.id,
      'Fecha Solicitud': solicitud.fechaSolicitud ? new Date(solicitud.fechaSolicitud).toLocaleDateString('es-AR') : '',
      'Tipo Solicitud': this.formatearTipoSolicitud(solicitud.tipoSolicitud || solicitud.tipo),
      'Empleado': solicitud.empleado ? `${solicitud.empleado.nombre} ${solicitud.empleado.apellido}` : '',
      'Legajo': solicitud.empleado?.legajo || '',
      'Región': solicitud.empleado ? this.formatearRegion(solicitud.empleado.region) : '',
      'Motivo': solicitud.motivo || '',
      'Estado': this.formatearEstado(solicitud.estado || solicitud.status || '')
    }));

    const hojas = [
      { nombre: 'Estadísticas', datos: datosEstadisticas },
      { nombre: 'Movimientos', datos: datosMovimientos },
      { nombre: 'Solicitudes', datos: datosSolicitudes }
    ];

    this.exportarAExcel(hojas, nombreArchivo);
  }

  // Nueva exportación de órdenes de reparación
  exportarOrdenesReparacion(
    ordenes: any[],
    nombreArchivo: string = 'ordenes_reparacion.xlsx'
  ) {
    const datosOrdenes = ordenes.map(o => ({
      'ID': o.id,
      'Número Orden': o.numeroOrden || ('#' + o.id),
      'Fecha Creación': o.fechaCreacion ? new Date(o.fechaCreacion).toLocaleString('es-AR') : '',
      'Proveedor': o.proveedor?.nombre || '',
      'Diagnóstico': o.diagnostico || '',
      'Costo Estimado': o.costoEstimado ?? '',
      'Costo Final': o.costoFinal ?? '',
      'Total Items': (o.reparacionItems||[]).reduce((acc: number, it: any)=> acc + (it.costoReparacion || 0), 0),
      'Estado': o.estado || '',
      'Fecha Est Entrega': o.fechaEstimadaEntrega ? new Date(o.fechaEstimadaEntrega).toLocaleDateString('es-AR') : '',
      'Fecha Real Entrega': o.fechaRealEntrega ? new Date(o.fechaRealEntrega).toLocaleDateString('es-AR') : '',
      'Observaciones': o.observaciones || '',
      'Cantidad Items': (o.reparacionItems?.length || 0)
    }));

    // Crear hoja de items detallados
    let hojas = [{ nombre: 'Ordenes', datos: datosOrdenes }];

    const itemsDetallados: any[] = [];
    
    ordenes.forEach(orden => {
      if (orden.reparacionItems && orden.reparacionItems.length > 0) {
        // Agregar cada item
        orden.reparacionItems.forEach((item: any) => {
          itemsDetallados.push({
            'Orden': orden.numeroOrden || ('#' + orden.id),
            'Proveedor': orden.proveedor?.nombre || '',
            'Modelo Celular': `${item.celular?.marca || ''} ${item.celular?.modelo || ''}`.trim(),
            'Serie': item.celular?.numeroSerie || '',
            'Motivo': item.motivoReparacion || '',
            'Precio': item.costoReparacion || 0,
            'Observaciones': item.observaciones || ''
          });
        });
        
        // Agregar fila de total de la orden
        const totalOrden = orden.reparacionItems.reduce((acc: number, it: any) => acc + (it.costoReparacion || 0), 0);
        itemsDetallados.push({
          'Orden': `TOTAL ORDEN ${orden.numeroOrden || '#' + orden.id}`,
          'Proveedor': '',
          'Modelo Celular': '',
          'Serie': '',
          'Motivo': '',
          'Precio': totalOrden,
          'Observaciones': `Total de ${orden.reparacionItems.length} items`
        });
        
        // Agregar línea en blanco para separar órdenes
        itemsDetallados.push({
          'Orden': '',
          'Proveedor': '',
          'Modelo Celular': '',
          'Serie': '',
          'Motivo': '',
          'Precio': '',
          'Observaciones': ''
        });
      }
    });

    if (itemsDetallados.length > 0) {
      hojas.push({ nombre: 'Items Detallados', datos: itemsDetallados });
    }

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
