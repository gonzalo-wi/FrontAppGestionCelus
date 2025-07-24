import axios from 'axios';
import type { Celular } from './celularService';

export type Region = 'NORTE' | 'ESTE' | 'SUR' | 'OESTE' | 'LA_PLATA' | 'NAFA';
export type Zona   = 'CIUDADELA' | 'LOMAS_DE_ZAMORA' | 'LA_PLATA';

export interface Usuario {
  numReparto: string;
  region: Region;
  zona: Zona;
  celular?: Celular | null;
}

const api = axios.create({
  baseURL: '/api',
});

export const usuarioService = {
  // Obtener todos los usuarios
  obtenerTodos() {
    return api.get<Usuario[]>('/usuarios');
  },

  // Obtener usuario por ID
  obtenerPorId(numReparto: string) {
    return api.get<Usuario>(`/usuarios/${numReparto}`);
  },

  // Crear usuario
  crear(usuario: Usuario) {
    return api.post<Usuario>('/usuarios', usuario);
  },

  // Actualizar usuario
  actualizar(numReparto: string, usuario: Usuario) {
    return api.put<Usuario>(`/usuarios/${numReparto}`, usuario);
  },

  // Eliminar usuario
  eliminar(numReparto: string) {
    return api.delete<void>(`/usuarios/${numReparto}`);
  }
};

// Mantener compatibilidad con imports anteriores
export const obtenerUsuarios = usuarioService.obtenerTodos;
export const crearUsuario = usuarioService.crear;

export default api;