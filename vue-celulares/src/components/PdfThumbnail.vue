<template>
  <div class="inline-flex items-center gap-1">
    <!-- Preview del PDF -->
    <div v-if="previewUrl" class="w-8 h-10 rounded border overflow-hidden bg-gray-50 cursor-pointer"
         @click="abrirPreview" 
         :title="`Click para ver preview de ${nombreArchivo}`">
      <img 
        :src="previewUrl" 
        :alt="`Preview PDF ${nombreArchivo}`"
        class="w-full h-full object-cover hover:scale-110 transition-transform"
        @error="onImageError"
      />
    </div>
    <!-- Ícono por defecto si no hay preview -->
    <div v-else class="w-8 h-10 rounded border border-gray-300 bg-red-50 flex items-center justify-center">
      <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
        </path>
      </svg>
    </div>
    <!-- Texto -->
    <span class="text-xs font-semibold">
      {{ nombreArchivo || 'PDF' }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { thumbnailService } from '../services/thumbnailService'

interface Props {
  solicitudId: string
  nombreArchivo?: string
  tieneDenuncia: boolean
}

const props = defineProps<Props>()
const previewUrl = ref<string>('')
const loading = ref(false)

const cargarPreview = async () => {
  if (!props.tieneDenuncia) return
  
  loading.value = true
  try {
    previewUrl.value = await thumbnailService.obtenerPreviewDenuncia(props.solicitudId)
  } catch (error) {
    console.error('Error cargando preview:', error)
    // Mantener previewUrl vacío para mostrar ícono por defecto
  } finally {
    loading.value = false
  }
}

const onImageError = () => {
  previewUrl.value = ''
}

const abrirPreview = () => {
  if (previewUrl.value) {
    // Abrir preview en nueva ventana
    window.open(previewUrl.value, '_blank')
  }
}

// Cargar preview al montar componente
onMounted(() => {
  if (props.tieneDenuncia) {
    cargarPreview()
  }
})

// Recargar si cambia tieneDenuncia
watch(() => props.tieneDenuncia, (newValue) => {
  if (newValue) {
    cargarPreview()
  } else {
    previewUrl.value = ''
  }
})
</script>