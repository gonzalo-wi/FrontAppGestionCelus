<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard de Estadísticas</h1>
        <p class="text-gray-600 mt-2">Análisis de movimientos y solicitudes por período</p>
      </div>

      <!-- Cards de resumen -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Movimientos</p>
              <p class="text-2xl font-semibold text-gray-900">{{ estadisticas?.totalMovimientos || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Solicitudes</p>
              <p class="text-2xl font-semibold text-gray-900">{{ estadisticas?.totalSolicitudes || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Mov. Este Mes</p>
              <p class="text-2xl font-semibold text-gray-900">{{ estadisticas?.movimientosMesActual || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0-8v8m0 0v8m0-8h8m-8 0V3"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Sol. Este Mes</p>
              <p class="text-2xl font-semibold text-gray-900">{{ estadisticas?.solicitudesMesActual || 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones de exportación -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Exportar Datos</h2>
        <div class="flex flex-wrap gap-4">
          <button
            @click="exportarEstadisticas"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Exportar Estadísticas
          </button>
          
          <button
            @click="exportarMovimientos"
            class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Exportar Movimientos
          </button>
          
          <button
            @click="exportarSolicitudes"
            class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Exportar Solicitudes
          </button>
          
          <button
            @click="exportarCompleto"
            class="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Exportar Todo
          </button>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Gráfico de líneas -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Tendencia Mensual</h3>
          <div class="h-80">
            <Line
              v-if="chartData.labels.length > 0"
              :data="chartData"
              :options="chartOptions"
            />
            <div v-else class="flex items-center justify-center h-full text-gray-500">
              Cargando gráfico...
            </div>
          </div>
        </div>

        <!-- Gráfico de barras -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Comparación Mensual</h3>
          <div class="h-80">
            <Bar
              v-if="chartData.labels.length > 0"
              :data="chartData"
              :options="barChartOptions"
            />
            <div v-else class="flex items-center justify-center h-full text-gray-500">
              Cargando gráfico...
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de datos -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Detalle por Mes</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mes
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Año
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Movimientos
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Solicitudes
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in estadisticas?.estadisticasMensuales || []" :key="`${item.mes}-${item.year}`">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ item.mes }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.year }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ item.movimientos }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {{ item.solicitudes }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {{ item.movimientos + item.solicitudes }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'vue-chartjs';
import { estadisticasService, type EstadisticasResumen } from '@/services/estadisticasService';
import { excelService } from '@/services/excelService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const estadisticas = ref<EstadisticasResumen | null>(null);
const cargando = ref(false);

const chartData = computed(() => {
  if (!estadisticas.value?.estadisticasMensuales) {
    return { labels: [], datasets: [] };
  }

  return {
    labels: estadisticas.value.estadisticasMensuales.map(item => item.mes),
    datasets: [
      {
        label: 'Movimientos',
        backgroundColor: 'rgb(59, 130, 246)',
        borderColor: 'rgb(59, 130, 246)',
        data: estadisticas.value.estadisticasMensuales.map(item => item.movimientos),
        tension: 0.4
      },
      {
        label: 'Solicitudes',
        backgroundColor: 'rgb(34, 197, 94)',
        borderColor: 'rgb(34, 197, 94)',
        data: estadisticas.value.estadisticasMensuales.map(item => item.solicitudes),
        tension: 0.4
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

const cargarEstadisticas = async () => {
  cargando.value = true;
  try {
    estadisticas.value = await estadisticasService.obtenerEstadisticas();
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
  } finally {
    cargando.value = false;
  }
};

const exportarEstadisticas = async () => {
  if (!estadisticas.value?.estadisticasMensuales) return;
  
  try {
    const fechaHoy = new Date().toISOString().split('T')[0];
    excelService.exportarEstadisticas(
      estadisticas.value.estadisticasMensuales,
      `estadisticas_mensuales_${fechaHoy}.xlsx`
    );
  } catch (error) {
    console.error('Error al exportar estadísticas:', error);
  }
};

const exportarMovimientos = async () => {
  try {
    const movimientos = await estadisticasService.obtenerMovimientosDetalle();
    const fechaHoy = new Date().toISOString().split('T')[0];
    excelService.exportarMovimientos(movimientos, `movimientos_${fechaHoy}.xlsx`);
  } catch (error) {
    console.error('Error al exportar movimientos:', error);
  }
};

const exportarSolicitudes = async () => {
  try {
    const solicitudes = await estadisticasService.obtenerSolicitudesDetalle();
    const fechaHoy = new Date().toISOString().split('T')[0];
    excelService.exportarSolicitudes(solicitudes, `solicitudes_${fechaHoy}.xlsx`);
  } catch (error) {
    console.error('Error al exportar solicitudes:', error);
  }
};

const exportarCompleto = async () => {
  if (!estadisticas.value?.estadisticasMensuales) return;
  
  try {
    const [movimientos, solicitudes] = await Promise.all([
      estadisticasService.obtenerMovimientosDetalle(),
      estadisticasService.obtenerSolicitudesDetalle()
    ]);
    
    const fechaHoy = new Date().toISOString().split('T')[0];
    excelService.exportarCompleto(
      estadisticas.value.estadisticasMensuales,
      movimientos,
      solicitudes,
      `reporte_completo_${fechaHoy}.xlsx`
    );
  } catch (error) {
    console.error('Error al exportar reporte completo:', error);
  }
};

onMounted(() => {
  cargarEstadisticas();
});
</script>
