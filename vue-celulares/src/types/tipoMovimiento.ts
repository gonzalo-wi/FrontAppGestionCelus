// Mapeo de tipos de movimiento entre frontend y backend
export const TipoMovimientoMap = {
  // Frontend -> Backend (nombres en inglés que probablemente usa el backend)
  ASIGNACION: 'ASSIGNMENT', // Probable valor en backend
  CAMBIO: 'CHANGE',
  DEVOLUCION: 'RETURN', 
  REPARACION: 'REPAIR',
  BAJA: 'REMOVAL'
} as const;

// Valores que usa el frontend
export const TiposMovimientoFrontend = [
  'ASIGNACION',
  'CAMBIO', 
  'DEVOLUCION',
  'REPARACION',
  'BAJA'
] as const;

// Función para mapear tipo de frontend a backend
export const mapearTipoMovimiento = (tipoFrontend: string): string => {
  // Mapeo específico para el backend (probablemente en inglés)
  const mapeo: Record<string, string> = {
    'ASIGNACION': 'ASSIGNMENT',  // Cambio temporal para probar
    'CAMBIO': 'CHANGE',
    'DEVOLUCION': 'RETURN',
    'REPARACION': 'REPAIR',
    'BAJA': 'REMOVAL'
  };
  
  return mapeo[tipoFrontend] || tipoFrontend;
};

// Función para mapear tipo de backend a frontend
export const mapearTipoMovimientoInverso = (tipoBackend: string): string => {
  // Mapeo inverso para mostrar en UI
  const mapeoInverso: Record<string, string> = {
    'ASSIGNMENT': 'ASIGNACION',
    'CHANGE': 'CAMBIO', 
    'RETURN': 'DEVOLUCION',
    'REPAIR': 'REPARACION',
    'REMOVAL': 'BAJA'
  };
  
  return mapeoInverso[tipoBackend] || tipoBackend;
};

export type TipoMovimiento = typeof TiposMovimientoFrontend[number];
