import { http } from './http';
import type { Celular } from './celularService';

export type Region = 'NORTE' | 'ESTE' | 'SUR' | 'OESTE' | 'LA_PLATA' | 'NAFA' | 'LAVAZZA' | 'TALLER'| 'IMPACTO'| 'COMERCIAL' | 'GERENCIA' | 'PLANTA'| 'SISTEMAS' | 'RRHH' | 'ADMINISTRACION' | 'COMPRAS' | 'PROMOCION' | 'GASTRONOMIA';
export type Zona   = 'CIUDADELA' | 'LOMAS_DE_ZAMORA' | 'LA_PLATA';
export type Cargo  = 'REPARTIDOR' | 'SUPERVISOR' | 'REGIONAL' | 'AYUDANTE' | 'AYUDANTE_ROTATIVO' | 'SUPLENTE' | 'ANALISTA' | 'JEFE' | 'GERENTE';

export interface Usuario {
  numReparto: string;
  region: Region;
  zona: Zona;
  numeroLinea?: string | null;
  cantCelularesRotos?: number;
  celular?: Celular | null;
  numeroSerieCelular?: number | null;
  marcaCelular?: string | null;
  modeloCelular?: string | null;
  cargo?: Cargo | null;
}


const api = http;

export const usuarioService = {
  
  obtenerTodos() {
  return api.get<Usuario[]>('/api/usuarios');
  },


  obtenerPorId(numReparto: string) {
  return api.get<Usuario>(`/api/usuarios/${encodeURIComponent(numReparto)}`);
  },

 
  crear(usuario: Usuario) {
  return api.post<Usuario>('/api/usuarios', usuario);
  },

  
  actualizar(numReparto: string, usuario: Usuario) {
    const encodedNumReparto = encodeURIComponent(numReparto);
    return api.put<Usuario>(`/api/usuarios/${encodedNumReparto}`, usuario);
  },

  
  eliminar(numReparto: string) {
  return api.delete<void>(`/api/usuarios/${encodeURIComponent(numReparto)}`);
  }
};


export const obtenerUsuarios = usuarioService.obtenerTodos;
export const crearUsuario = usuarioService.crear;

export default api;

export const obtenerMiFlota = () => {
  return api.get<Usuario[]>(`/api/usuarios/mi-flota`);
};


export const obtenerMisSolicitudes = () => {
  return api.get(`/api/solicitudes/mias`);
};


export const obtenerSolicitudesMiRegion = () => {
  return api.get(`/api/solicitudes`);
};

export const crearMiSolicitud = (solicitud: any) => {
  return api.post(`/api/solicitudes`, solicitud);
};


export const actualizarLineaFlota = (numReparto: string, numeroLinea: string | null) => {
  return api.put(`/api/usuarios/flota/${encodeURIComponent(numReparto)}/linea`, { numeroLinea });
};


export const obtenerEstadisticasMiRegion = (fechaDesde?: string, fechaHasta?: string) => {
  const params = new URLSearchParams();
  if (fechaDesde) params.append('fechaDesde', fechaDesde);
  if (fechaHasta) params.append('fechaHasta', fechaHasta);
  
  const queryString = params.toString();
  const url = `/api/estadisticas/mi-region${queryString ? '?' + queryString : ''}`;
  
  return api.get(url);
};