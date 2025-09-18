import http from './http';
import type { Celular } from './celularService';

export type Region = 'NORTE' | 'ESTE' | 'SUR' | 'OESTE' | 'LA_PLATA' | 'NAFA' | 'LAVAZZA' | 'TALLER'| 'IMPACTO'| 'COMERCIAL' | 'GERENCIA' | 'PLANTA'| 'SISTEMAS';
export type Zona   = 'CIUDADELA' | 'LOMAS_DE_ZAMORA' | 'LA_PLATA';
export type Cargo  = 'REPARTIDOR' | 'SUPERVISOR' | 'REGIONAL' | 'AYUDANTE' | 'AYUDANTE_ROTATIVO';

export interface Usuario {
  numReparto: string;
  region: Region;
  zona: Zona;
  numeroLinea?: string | null;
  cantCelularesRotos?: number;
  celular?: Celular | null;
  cargo?: Cargo | null;
}

// Usamos http (axios compartido con interceptor de Authorization)
const api = http;

export const usuarioService = {
  // Obtener todos los usuarios
  obtenerTodos() {
  return api.get<Usuario[]>('/api/usuarios');
  },

  // Obtener usuario por ID
  obtenerPorId(numReparto: string) {
  return api.get<Usuario>(`/api/usuarios/${encodeURIComponent(numReparto)}`);
  },

  // Crear usuario
  crear(usuario: Usuario) {
  return api.post<Usuario>('/api/usuarios', usuario);
  },

  // Actualizar usuario
  actualizar(numReparto: string, usuario: Usuario) {
  return api.put<Usuario>(`/api/usuarios/${encodeURIComponent(numReparto)}`, usuario);
  },

  // Eliminar usuario
  eliminar(numReparto: string) {
  return api.delete<void>(`/api/usuarios/${encodeURIComponent(numReparto)}`);
  }
};

// Mantener compatibilidad con imports anteriores
export const obtenerUsuarios = usuarioService.obtenerTodos;
export const crearUsuario = usuarioService.crear;

export default api;

// Obtener la flota (usuarios de mi región autenticada)
export const obtenerMiFlota = () => {
  return api.get<Usuario[]>(`/api/usuarios/mi-flota`);
};

// Obtener mis solicitudes (solicitudes del usuario autenticado)
export const obtenerMisSolicitudes = () => {
  return api.get(`/api/usuarios/me/solicitudes`);
};

// Obtener solicitudes de mi región (todas las solicitudes de la región del usuario autenticado)
export const obtenerSolicitudesMiRegion = () => {
  return api.get(`/api/usuarios/mi-region/solicitudes`);
};

// Crear nueva solicitud del usuario autenticado
export const crearMiSolicitud = (solicitud: any) => {
  return api.post(`/api/usuarios/me/solicitudes`, solicitud);
};

// Actualizar línea de usuario en mi flota
export const actualizarLineaFlota = (numReparto: string, numeroLinea: string | null) => {
  return api.put(`/api/usuarios/flota/${encodeURIComponent(numReparto)}/linea`, { numeroLinea });
};

// Obtener estadísticas de mi región
export const obtenerEstadisticasMiRegion = (fechaDesde?: string, fechaHasta?: string) => {
  const params = new URLSearchParams();
  if (fechaDesde) params.append('fechaDesde', fechaDesde);
  if (fechaHasta) params.append('fechaHasta', fechaHasta);
  
  const queryString = params.toString();
  const url = `/api/estadisticas/mi-region${queryString ? '?' + queryString : ''}`;
  
  return api.get(url);
};