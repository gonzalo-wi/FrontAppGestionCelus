import http from './http';


const api = http;

export interface UsuarioSistema {
  username: string;
  rol: 'ADMIN' | 'USUARIO';
  region: string;
  fechaCreacion?: string;
  ultimoAcceso?: string;
}

export interface CrearUsuarioRequest {
  username: string;
  password: string;
  rol: 'ADMIN' | 'USUARIO';
  region: string;
}

export interface ActualizarUsuarioRequest {
  rol: 'ADMIN' | 'USUARIO';
  region: string;
}

export interface CambiarPasswordRequest {
  username: string;
  nuevaPassword: string;
}

class UsuariosService {
  async listarUsuarios(): Promise<UsuarioSistema[]> {
    try {
      const response = await api.get('/api/admin/usuarios-sistema');
      return response.data;
    } catch (error) {
      console.error('Error al listar usuarios:', error);
      throw error;
    }
  }

  async crearUsuario(usuario: CrearUsuarioRequest): Promise<UsuarioSistema> {
    try {
      const response = await api.post('/api/admin/usuarios-sistema', usuario);
      return response.data;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }

  async actualizarUsuario(username: string, datos: ActualizarUsuarioRequest): Promise<UsuarioSistema> {
    try {
      const response = await api.put(`/api/admin/usuarios-sistema/${username}`, datos);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }

  async cambiarPassword(datos: CambiarPasswordRequest): Promise<void> {
    try {
      await api.put('/api/admin/usuarios-sistema/cambiar-password', datos);
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw error;
    }
  }

  async eliminarUsuario(username: string): Promise<void> {
    try {
      await api.delete(`/api/admin/usuarios-sistema/${username}`);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }
}

export const usuariosService = new UsuariosService();
