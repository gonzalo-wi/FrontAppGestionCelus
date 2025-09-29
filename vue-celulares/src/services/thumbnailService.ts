// Servicio para obtener preview de PDFs
import http from './http'

export const thumbnailService = {
  /**
   * Obtiene el preview de un PDF de denuncia
   */
  async obtenerPreviewDenuncia(solicitudId: string): Promise<string> {
    try {
      const response = await http.get(`/api/solicitudes/${solicitudId}/denuncia/preview`, {
        responseType: 'blob'
      })
      
      // Convertir blob a data URL para mostrar en imagen
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(response.data)
      })
    } catch (error) {
      console.error('Error al obtener preview:', error)
      throw error
    }
  }
}