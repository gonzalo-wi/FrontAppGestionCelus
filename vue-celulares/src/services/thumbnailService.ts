import http from './http'

export const thumbnailService = {
  
  async obtenerPreviewDenuncia(solicitudId: string): Promise<string> {
    try {
      const response = await http.get(`/api/solicitudes/${solicitudId}/denuncia/preview`, {
        responseType: 'blob'
      })
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