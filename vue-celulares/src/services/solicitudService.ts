import http from './http';

// Usamos http (axios compartido con interceptor de Authorization)
const api = http;

// Enums reemplazados por objetos constantes para evitar restricciones de compilación
export const Region = {
  NORTE: 'NORTE',
  SUR: 'SUR',
  ESTE: 'ESTE',
  OESTE: 'OESTE',
  LA_PLATA: 'LA_PLATA',
  NAFA: 'NAFA',
  SISTEMAS: 'SISTEMAS',
  LAVAZZA: 'LAVAZZA',
  TALLER: 'TALLER',
  IMPACTO: 'IMPACTO',
  COMERCIAL: 'COMERCIAL',
  GERENCIA: 'GERENCIA',
  PLANTA: 'PLANTA'
} as const;
export type RegionType = typeof Region[keyof typeof Region];

// Tipos
export type TipoSolicitud = 'CAMBIO_POR_ROTURA' | 'NUEVO_EQUIPO' | 'ROBO';
export const EstadoSolicitud = {
  PENDIENTE: 'PENDIENTE',
  EN_PROCESO: 'EN_PROCESO',
  RESUELTA: 'RESUELTA'
} as const;
export type EstadoSolicitudType = typeof EstadoSolicitud[keyof typeof EstadoSolicitud];

export interface Solicitud {
  id: string;
  nomSolicitante: string;
  fecha: string;
  usuario: string;
  region: RegionType;
  tipoSolicitud: TipoSolicitud;
  motivo: string;
  necesitaLinea: boolean;
  estado?: EstadoSolicitudType;
  tieneDenunciaAdjunta?: boolean;
  nombreArchivoDenuncia?: string;
}

const API_URL = '/api/solicitudes';

export const solicitudService = {
  // Obtener todas las solicitudes (admin)
  obtenerTodas() {
  return api.get<Solicitud[]>(API_URL);
  },

  // Crear nueva solicitud
  crear(solicitud: Solicitud) {
  return api.post<Solicitud>(API_URL, solicitud);
  },

  // Cambiar estado de solicitud (admin)
  cambiarEstado(id: string, estado: EstadoSolicitudType) {
  return api.put(`${API_URL}/${id}/estado`, { estado });
  },

  // Obtener solicitudes de un usuario
  obtenerPorUsuario(usuario: string) {
  return api.get<Solicitud[]>(`${API_URL}/usuario/${usuario}`);
  },

  // Adjuntar denuncia PDF para solicitudes de ROBO
  adjuntarDenuncia(id: string, archivo: File) {
    const formData = new FormData();
    formData.append('archivo', archivo);
    
    return api.post(`${API_URL}/${id}/denuncia`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Descargar denuncia PDF
  descargarDenuncia(id: string) {
    return api.get(`${API_URL}/${id}/denuncia`, {
      responseType: 'blob',
    });
  }
};

