import http from './http';

// Usamos http (axios compartido con interceptor de Authorization)
const api = http;

// Tipos
export type EstadoCelular = 'NUEVO' | 'REACONDICIONADO' | 'ROTO';

export interface Usuario {
  numReparto: string;
  region: string;
  zona: string;
}

export interface Celular {
  numeroSerie?: number; 
  codigoInterno: string;
  marca: string;
  modelo: string;
  tieneTemplado: boolean;
  tieneFunda: boolean;
  codigoDeAplicacion?: string | null;
  cantRoturas: number;
  estado: EstadoCelular;
  usuario?: Usuario | null;
}


const API_URL = '/api';


export const crearMovimiento = (movimiento: any) => {
  return api.post(`${API_URL}/movimientos`, movimiento);
};

export const obtenerMovimientos = () => {
  return api.get(`${API_URL}/movimientos`);
};

export const celularService = {
  crearCelular(celular: Celular) {
    return api.post<Celular>(`${API_URL}/celulares`, celular);
  },

  obtenerTodos() {
    return api.get<Celular[]>(`${API_URL}/celulares`);
  },

  actualizar(numeroSerie: number, celular: any) {
    console.log('Actualizando celular completo:', { numeroSerie, celular });
    return api.put(`${API_URL}/celulares/${numeroSerie}`, celular);
  },

  cambiarEstado(numeroSerie: number, estado: EstadoCelular) {
    console.log('Cambiando estado:', { numeroSerie, estado });
    return api.put<boolean>(`${API_URL}/celulares/${numeroSerie}/estado`, { estado });
  },

  asignarUsuario(numeroSerie: number, usuario: Usuario) {
    console.log('Asignando usuario:', { numeroSerie, usuario });
    return api.put<boolean>(`${API_URL}/celulares/${numeroSerie}/usuario`, usuario);
  },

  eliminar(numeroSerie: number) {
    console.log('Eliminando celular:', numeroSerie);
    return api.delete<void>(`${API_URL}/celulares/${numeroSerie}`);
  },

  buscarPorSerie(query: string) {
    console.log('Buscando celulares por serie:', query);
    return api.get<Celular[]>(`${API_URL}/celulares/buscar?serie=${encodeURIComponent(query)}`);
  }
};