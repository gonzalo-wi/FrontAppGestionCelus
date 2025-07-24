<template>
  <div class="bg-white shadow-lg rounded-lg overflow-hidden">
    <div class="px-6 py-4 bg-gray-50 border-b">
      <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th v-for="column in columns" :key="column.key" 
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ column.title }}
            </th>
            <th v-if="showActions" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="data.length === 0">
            <td :colspan="columns.length + (showActions ? 1 : 0)" class="px-6 py-4 text-center text-gray-500">
              {{ emptyMessage }}
            </td>
          </tr>
          <tr v-for="item in data" :key="getItemKey(item)" class="hover:bg-gray-50">
            <td v-for="column in columns" :key="column.key" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <slot :name="column.key" :item="item">
                {{ getColumnValue(item, column.key) }}
              </slot>
            </td>
            <td v-if="showActions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <slot name="actions" :item="item">
                <button @click="$emit('edit', item)" 
                        class="text-indigo-600 hover:text-indigo-900 mr-3">
                  Editar
                </button>
                <button @click="$emit('delete', item)" 
                        class="text-red-600 hover:text-red-900">
                  Eliminar
                </button>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  columns: { type: Array, required: true },
  data: { type: Array, required: true },
  showActions: { type: Boolean, default: true },
  emptyMessage: { type: String, default: 'No hay datos para mostrar' },
  keyField: { type: String, default: 'id' }
});

defineEmits(['edit', 'delete']);

const getItemKey = (item) => {
  return item[props.keyField] || JSON.stringify(item);
};

const getColumnValue = (item, key) => {
  return key.split('.').reduce((obj, prop) => obj?.[prop], item) || '-';
};
</script>
