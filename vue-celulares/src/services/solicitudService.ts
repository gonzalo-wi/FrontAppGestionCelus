export enum Region {
  NORTE = 'NORTE',
  SUR = 'SUR',
  ESTE = 'ESTE',
  OESTE = 'OESTE',
  LA_PLATA = 'LA_PLATA',
  NAFA = 'NAFA'
}
import axios from 'axios';

// Tipos
export type TipoSolicitud = 'CAMBIO_POR_ROTURA' | 'NUEVO_EQUIPO';
export enum EstadoSolicitud {
  PENDIENTE = 'PENDIENTE',
  EN_PROCESO = 'EN_PROCESO',
  RESUELTA = 'RESUELTA'
}

export interface Solicitud {
  id: string;
  nomSolicitante: string;
  fecha: string;
  usuario: string;
  region: Region;
  tipoSolicitud: TipoSolicitud;
  motivo: string;
  necesitaLinea: boolean;
  estado?: EstadoSolicitud;
}

const API_URL = '/api/solicitudes';

export const solicitudService = {
  // Obtener todas las solicitudes (admin)
  obtenerTodas() {
    return axios.get<Solicitud[]>(API_URL);
  },

  // Crear nueva solicitud
  crear(solicitud: Solicitud) {
    return axios.post<Solicitud>(API_URL, solicitud);
  },

  // Cambiar estado de solicitud (admin)
  cambiarEstado(id: string, estado: EstadoSolicitud) {
    return axios.put(`${API_URL}/${id}/estado`, { estado });
  },

  // Obtener solicitudes de un usuario
  obtenerPorUsuario(usuario: string) {
    return axios.get<Solicitud[]>(`${API_URL}/usuario/${usuario}`);
  }
};

