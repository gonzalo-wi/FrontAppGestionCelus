<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" @click="closeOnBackdrop && $emit('close')">
      <div class="flex min-h-screen items-center justify-center p-4">
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
        <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full" @click.stop>
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
            <button @click="$emit('close')" 
                    class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="px-6 py-4">
            <slot></slot>
          </div>
          <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
            <button @click="$emit('close')" 
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              {{ cancelText }}
            </button>
            <button @click="$emit('confirm')" 
                    :class="confirmButtonClass"
                    class="px-4 py-2 text-sm font-medium text-white rounded-md">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, required: true },
  confirmText: { type: String, default: 'Confirmar' },
  cancelText: { type: String, default: 'Cancelar' },
  closeOnBackdrop: { type: Boolean, default: true },
  type: { type: String, default: 'primary' } // primary, danger, success
});

defineEmits(['close', 'confirm']);

const confirmButtonClass = computed(() => {
  const classes = {
    primary: 'bg-blue-600 hover:bg-blue-700',
    danger: 'bg-red-600 hover:bg-red-700',
    success: 'bg-green-600 hover:bg-green-700'
  };
  return classes[props.type] || classes.primary;
});
</script>
