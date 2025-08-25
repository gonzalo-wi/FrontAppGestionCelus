import jsPDF from 'jspdf';
import type { Solicitud } from './solicitudService';

// Funciones helper para formatear enums
const formatearTipoSolicitud = (tipo: string): string => {
  switch (tipo) {
    case 'CAMBIO_POR_ROTURA':
      return 'Cambio por rotura';
    case 'NUEVO_EQUIPO':
      return 'Equipo nuevo';
    default:
      return tipo?.replace(/_/g, ' ') || 'N/A';
  }
};

const formatearRegion = (region: string): string => {
  switch (region) {
    case 'LA_PLATA':
      return 'La Plata';
    default:
      return region?.replace(/_/g, ' ') || 'N/A';
  }
};

const formatearEstado = (estado: string): string => {
  switch (estado) {
    case 'EN_PROCESO':
      return 'En proceso';
    default:
      return estado?.replace(/_/g, ' ') || 'Pendiente';
  }
};

export const generarPDFSolicitud = async (solicitud: Solicitud) => {
  try {
    // Crear nueva instancia de jsPDF
    const doc = new jsPDF();
    
    // Configuración de colores y fuentes mejorados
    const colorPrimario: [number, number, number] = [30, 58, 138]; // Indigo-800 (más elegante)
    const colorSecundario: [number, number, number] = [55, 65, 81]; // Gray-700
    const colorTexto: [number, number, number] = [17, 24, 39]; // Gray-900
    const colorFondo: [number, number, number] = [249, 250, 251]; // Gray-50
    const colorBorde: [number, number, number] = [209, 213, 219]; // Gray-300
    
    // Configurar fuente
    doc.setFont('helvetica');
    
    // === HEADER MEJORADO ===
    // Fondo del header con gradiente simulado
    doc.setFillColor(...colorPrimario);
    doc.rect(0, 0, 210, 35, 'F');
    
    // Línea decorativa inferior
    doc.setFillColor(79, 70, 229); // Indigo-600
    doc.rect(0, 32, 210, 3, 'F');
    
    // Título principal
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('SOLICITUD DE CELULAR', 20, 22);
    
    // Información de la empresa mejorada
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Sistema de Gestión de Celulares', 130, 18);
    doc.text('Departamento de Sistemas', 130, 26);
    
    // === INFORMACIÓN PRINCIPAL ===
    doc.setTextColor(...colorTexto);
    let yPos = 55;
    
    // ID y Estado en una caja destacada
    doc.setFillColor(...colorFondo);
    doc.rect(15, yPos - 8, 180, 20, 'F');
    doc.setDrawColor(...colorBorde);
    doc.rect(15, yPos - 8, 180, 20);
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SOLICITUD #' + solicitud.id, 20, yPos);
    
    // Estado con color y marco
    const estadoColor = getEstadoColor(solicitud.estado || 'PENDIENTE');
    const estadoTexto = formatearEstado(solicitud.estado || 'PENDIENTE');
    
    // Marco para el estado
    doc.setFillColor(...estadoColor);
    doc.roundedRect(130, yPos - 6, 35, 12, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(estadoTexto, 133, yPos + 1);
    
    doc.setTextColor(...colorTexto);
    yPos += 25;
    
    // === DATOS DEL SOLICITANTE ===
    // Sección con fondo
    doc.setFillColor(239, 246, 255); // Blue-50
    doc.rect(15, yPos - 5, 180, 60, 'F');
    doc.setDrawColor(191, 219, 254); // Blue-200
    doc.rect(15, yPos - 5, 180, 60);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175); // Blue-800
    doc.text('DATOS DEL SOLICITANTE', 20, yPos + 5);
    
    doc.setTextColor(...colorTexto);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    yPos += 18;
    
    // Datos en dos columnas
    doc.setFont('helvetica', 'bold');
    doc.text('Nombre completo:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(solicitud.nomSolicitante || 'N/A', 65, yPos);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Fecha:', 120, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(solicitud.fecha || 'N/A', 135, yPos);
    yPos += 10;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Número de reparto:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(solicitud.usuario || 'N/A', 65, yPos);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Región:', 120, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(formatearRegion(solicitud.region || ''), 135, yPos);
    
    yPos += 25;
    
    // === DETALLES DE LA SOLICITUD ===
    doc.setFillColor(240, 253, 244); // Green-50
    doc.rect(15, yPos - 5, 180, 45, 'F');
    doc.setDrawColor(187, 247, 208); // Green-200
    doc.rect(15, yPos - 5, 180, 45);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(21, 128, 61); // Green-700
    doc.text('DETALLES DE LA SOLICITUD', 20, yPos + 5);
    
    doc.setTextColor(...colorTexto);
    doc.setFontSize(11);
    yPos += 18;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Tipo de solicitud:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(formatearTipoSolicitud(solicitud.tipoSolicitud || ''), 70, yPos);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Necesita línea:', 120, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(solicitud.necesitaLinea ? 'Sí' : 'No', 160, yPos);
    
    yPos += 25;
    
    // === MOTIVO ===
    doc.setFillColor(255, 251, 235); // Amber-50
    doc.rect(15, yPos - 5, 180, 35, 'F');
    doc.setDrawColor(253, 230, 138); // Amber-200
    doc.rect(15, yPos - 5, 180, 35);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 83, 9); // Amber-700
    doc.text('DESCRIPCIÓN / MOTIVO:', 20, yPos + 5);
    
    doc.setTextColor(...colorTexto);
    doc.setFont('helvetica', 'normal');
    const motivo = solicitud.motivo || 'Sin descripción proporcionada';
    const motivoLineas = doc.splitTextToSize(motivo, 160);
    doc.text(motivoLineas, 25, yPos + 15);
    
    yPos += 40; // Reducido de 50 a 40
    
    // === SECCIÓN PARA USO DE SISTEMAS ===
    // Línea separadora elegante
    doc.setDrawColor(...colorPrimario);
    doc.setLineWidth(1.5);
    doc.line(15, yPos, 195, yPos);
    yPos += 8; // Reducido de 10 a 8
    
    doc.setFillColor(254, 242, 242); // Red-50
    doc.rect(15, yPos - 3, 180, 70, 'F'); // Reducido altura de 85 a 70
    doc.setDrawColor(254, 202, 202); // Red-200
    doc.rect(15, yPos - 3, 180, 70);
    
    doc.setFontSize(13); // Reducido de 14 a 13
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(185, 28, 28); // Red-700
    doc.text('PARA USO EXCLUSIVO DEL DEPARTAMENTO DE SISTEMAS', 20, yPos + 6);
    
    doc.setTextColor(...colorTexto);
    doc.setFontSize(10); // Reducido de 11 a 10
    doc.setFont('helvetica', 'normal');
    yPos += 16; // Reducido de 20 a 16
    
    // Campos mejorados con líneas más elegantes (más compactos)
    doc.text('Reparto responsable:', 25, yPos);
    doc.setDrawColor(...colorSecundario);
    doc.line(70, yPos + 2, 180, yPos + 2);
    yPos += 10; // Reducido de 12 a 10
    
    doc.text('Celular entregado (Marca/Modelo):', 25, yPos);
    doc.line(90, yPos + 2, 180, yPos + 2);
    yPos += 10;
    
    doc.text('Número de serie:', 25, yPos);
    doc.line(70, yPos + 2, 180, yPos + 2);
    yPos += 10;
    
    doc.text('Fecha de entrega:', 25, yPos);
    doc.line(70, yPos + 2, 140, yPos + 2);
    
    doc.text('Estado del equipo:', 145, yPos);
    doc.line(185, yPos + 2, 195, yPos + 2);
    yPos += 15; 
    
    // === FIRMAS ===
    doc.setFillColor(248, 250, 252); // Slate-50
    doc.rect(15, yPos - 3, 180, 20, 'F'); // Reducido altura de 25 a 20
    doc.setDrawColor(203, 213, 225); // Slate-300
    doc.rect(15, yPos - 3, 180, 20);
    
    doc.setFont('helvetica', 'bold');
    doc.text('FIRMAS Y AUTORIZACIONES:', 20, yPos + 3);
    yPos += 10; // Reducido de 12 a 10
    
    doc.setFont('helvetica', 'normal');
    // Dos columnas para firmas
    doc.text('Firma de supervisor:', 25, yPos);
    doc.line(70, yPos + 2, 100, yPos + 2);
    
    doc.text('Firma del solicitante:', 110, yPos);
    doc.line(155, yPos + 2, 185, yPos + 2);
    
    yPos += 12; // Reducido de 15 a 12
    
    // === FOOTER MEJORADO ===
    doc.setFillColor(...colorPrimario);
    doc.rect(0, yPos, 210, 12, 'F'); // Reducido altura de 15 a 12
    
    const fechaGeneracion = new Date().toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    doc.setFontSize(7); // Reducido de 8 a 7
    doc.setTextColor(255, 255, 255);
    doc.text(`Documento generado el ${fechaGeneracion}`, 20, yPos + 7); // Ajustado posición
    doc.text('Sistema de Gestión de Celulares v2.0', 130, yPos + 7);
    
    // Descargar el PDF con nombre mejorado
    const nombreArchivo = `Solicitud_${solicitud.id}_${solicitud.nomSolicitante?.replace(/\s+/g, '_') || 'Usuario'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(nombreArchivo);
    
  } catch (error) {
    console.error('Error al generar PDF:', error);
    throw new Error('No se pudo generar el PDF');
  }
};

// Función helper para colores de estado mejorados
const getEstadoColor = (estado: string): [number, number, number] => {
  switch (estado) {
    case 'PENDIENTE':
      return [245, 158, 11]; // Amber-500
    case 'EN_PROCESO':
      return [59, 130, 246]; // Blue-500
    case 'RESUELTA':
      return [34, 197, 94]; // Green-500
    default:
      return [107, 114, 128]; // Gray-500
  }
};

// Función para preview del PDF (opcional)
export const previsualizarPDF = async (_solicitud: Solicitud) => {
  try {
    const doc = new jsPDF();
    // ... mismo código que generarPDFSolicitud pero sin save()
    
    // Abrir en nueva ventana para preview
    const pdfData = doc.output('datauristring');
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <iframe width="100%" height="100%" src="${pdfData}"></iframe>
      `);
    }
    
    return pdfData;
  } catch (error) {
    console.error('Error al previsualizar PDF:', error);
    throw error;
  }
};

// Exportar servicio para compatibilidad
export const pdfService = {
  generarPDFSolicitud,
  previsualizarPDF
};

export default pdfService;
