<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
    <!-- Header -->
    <div class="mb-6 lg:mb-8">
      <h1 class="text-2xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        📊 Estadísticas y Análisis
      </h1>
      <p class="text-gray-600 mt-2 text-sm sm:text-base">Panel de control y análisis regional de solicitudes</p>
    </div>

      <!-- Selector de región -->
      <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">Filtros de Análisis</h2>
            <p class="text-gray-600">Selecciona una región específica o visualiza todas</p>
          </div>
          <div class="flex items-center gap-4">
            <select v-model="regionSeleccionada" 
                    @change="cargarDatosPorRegion"
                    class="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all duration-200">
              <option value="">Todas las regiones</option>
              <option value="COMERCIAL">Comercial (Agrupado)</option>
              <option value="NORTE">Norte</option>
              <option value="SUR">Sur</option>
              <option value="ESTE">Este</option>
              <option value="OESTE">Oeste</option>
              <option value="LA_PLATA">La Plata</option>
              <option value="NAFA">NAFA</option>
            </select>
            <button @click="cargarTodosDatos" 
                    class="bg-gradient-to-r from-slate-600 to-gray-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Actualizar
            </button>
          </div>
        </div>
      </div>

      <!-- Mensaje de éxito -->
      <div v-if="mensajeExito" class="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-3xl p-6 mb-8 shadow-2xl">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-white/20 rounded-xl">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-lg">¡Exportación Exitosa!</h3>
            <p class="opacity-90">{{ mensajeExito }}</p>
          </div>
        </div>
      </div>

      <!-- Mensaje de error -->
      <div v-if="error" class="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-3xl p-6 mb-8 shadow-2xl">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-white/20 rounded-xl">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-lg">Error de Conexión</h3>
            <p class="opacity-90">{{ error }}</p>
          </div>
          <button @click="cargarTodosDatos" class="ml-auto p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Cards de resumen por región -->
      <div v-if="!regionSeleccionada && estadisticasRegiones.length > 0" class="mb-8">
        <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 mb-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Alertas Críticas - Solicitudes por Rotura</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="region in regionesUrgentes" 
                 :key="region.region" 
                 class="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-4 text-white shadow-lg transform hover:scale-105 transition-all duration-200">
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-bold text-lg">{{ region.region.replace('_', ' ') }}</h3>
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <div class="text-2xl font-bold mb-1">{{ region.solicitudesPorRotura }}</div>
              <div class="text-sm opacity-90">Solicitudes por rotura</div>
              <div class="text-xs opacity-75 mt-1">{{ ((region.solicitudesPorRotura / region.totalSolicitudes) * 100).toFixed(1) }}% del total</div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="region in estadisticasRegiones" 
               :key="region.region" 
               class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 hover:shadow-3xl transition-all duration-300">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-gray-900">{{ region.region.replace('_', ' ') }}</h3>
              <div v-if="region.urgente" class="p-2 bg-red-100 rounded-full">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
            </div>
            
            <!-- Total de solicitudes -->
            <div class="text-center mb-6">
              <div class="text-3xl font-bold text-gray-900 mb-2">{{ region.totalSolicitudes }}</div>
              <div class="text-sm text-gray-600">Total de Solicitudes</div>
            </div>

            <!-- Estados de solicitudes -->
            <div class="space-y-3 mb-6">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-600">Pendientes</span>
                <div class="flex items-center gap-2">
                  <div class="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-yellow-400 to-orange-500" 
                         :style="{ width: `${(region.solicitudesPendientes / region.totalSolicitudes) * 100}%` }"></div>
                  </div>
                  <span class="text-sm font-bold text-gray-900">{{ region.solicitudesPendientes }}</span>
                </div>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-600">En Proceso</span>
                <div class="flex items-center gap-2">
                  <div class="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-blue-400 to-indigo-500" 
                         :style="{ width: `${(region.solicitudesEnProceso / region.totalSolicitudes) * 100}%` }"></div>
                  </div>
                  <span class="text-sm font-bold text-gray-900">{{ region.solicitudesEnProceso }}</span>
                </div>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-600">Resueltas</span>
                <div class="flex items-center gap-2">
                  <div class="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-green-400 to-emerald-500" 
                         :style="{ width: `${(region.solicitudesResueltas / region.totalSolicitudes) * 100}%` }"></div>
                  </div>
                  <span class="text-sm font-bold text-gray-900">{{ region.solicitudesResueltas }}</span>
                </div>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-600">Por Rotura</span>
                <div class="flex items-center gap-2">
                  <div class="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-red-400 to-pink-500" 
                         :style="{ width: `${(region.solicitudesPorRotura / region.totalSolicitudes) * 100}%` }"></div>
                  </div>
                  <span class="text-sm font-bold text-gray-900">{{ region.solicitudesPorRotura }}</span>
                </div>
              </div>
            </div>

            <!-- Botón para ver detalles -->
            <button @click="verDetalleRegion(region.region)" 
                    class="w-full bg-gradient-to-r from-slate-600 to-gray-700 text-white py-2 px-4 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              Ver Detalle
            </button>
          </div>
        </div>
      </div>
      <!-- Cards de resumen generales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Card Total Movimientos -->
        <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 hover:shadow-3xl transition-all duration-300">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Movimientos</p>
              <p class="text-3xl font-bold text-gray-900">{{ estadisticas?.totalMovimientos || 0 }}</p>
            </div>
          </div>
        </div>

        <!-- Card Total Solicitudes -->
        <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 hover:shadow-3xl transition-all duration-300">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Solicitudes</p>
              <p class="text-3xl font-bold text-gray-900">{{ estadisticas?.totalSolicitudes || 0 }}</p>
            </div>
          </div>
        </div>

        <!-- Card Movimientos Este Mes -->
        <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 hover:shadow-3xl transition-all duration-300">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Mov. Este Mes</p>
              <p class="text-3xl font-bold text-gray-900">{{ estadisticas?.movimientosMesActual || 0 }}</p>
            </div>
          </div>
        </div>

        <!-- Card Solicitudes Este Mes -->
        <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 hover:shadow-3xl transition-all duration-300">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0-8v8m0 0v8m0-8h8m-8 0V3"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Sol. Este Mes</p>
              <p class="text-3xl font-bold text-gray-900">{{ estadisticas?.solicitudesMesActual || 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráficos modernos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Gráfico de líneas -->
        <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Tendencia Mensual</h3>
          </div>
          <div class="h-80">
            <Line
              v-if="chartData.labels.length > 0"
              :data="chartData"
              :options="chartOptions"
            />
            <div v-else class="flex items-center justify-center h-full text-gray-500">
              <div class="text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p class="text-lg font-medium">Cargando gráfico...</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Ranking de Celulares Rotos por Región (existente) -->
        <div class="bg-white/30 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                🚨 Ranking de Regiones por Celulares Rotos
              </h3>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="(region, index) in rankingCelularesRotos" 
              :key="region.region"
              class="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:shadow-lg transition-all duration-300"
              :class="{
                'border-red-300 bg-red-50/50': index === 0,
                'border-orange-300 bg-orange-50/50': index === 1,
                'border-yellow-300 bg-yellow-50/50': index === 2
              }"
            >
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <div 
                    class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    :class="{
                      'bg-red-500': index === 0,
                      'bg-orange-500': index === 1,
                      'bg-yellow-500': index === 2,
                      'bg-gray-400': index > 2
                    }"
                  >
                    {{ index + 1 }}
                  </div>
                  <h4 class="font-semibold text-gray-800">{{ region.region.replace('_', ' ') }}</h4>
                </div>
                <div 
                  v-if="region.urgente" 
                  class="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full"
                >
                  ⚠️ URGENTE
                </div>
              </div>
              
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Total Usuarios:</span>
                  <span class="font-semibold text-gray-800">{{ region.totalUsuarios }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Celulares Rotos:</span>
                  <span class="font-bold text-red-600">{{ region.totalCelularesRotos || 0 }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Promedio por Usuario:</span>
                  <span class="font-semibold text-orange-600">{{ region.promedioCelularesRotos.toFixed(2) }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div 
                    class="h-2 rounded-full transition-all duration-500"
                    :class="{
                      'bg-red-500': region.promedioCelularesRotos > 0.5,
                      'bg-orange-500': region.promedioCelularesRotos > 0.3 && region.promedioCelularesRotos <= 0.5,
                      'bg-green-500': region.promedioCelularesRotos <= 0.3
                    }"
                    :style="{ width: Math.min(region.promedioCelularesRotos * 100, 100) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Gráfico de barras por región -->
        <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Estados por Región</h3>
          </div>
          <div class="h-80">
            <Bar
              v-if="regionesChartData.labels.length > 0"
              :data="regionesChartData"
              :options="barChartOptions"
            />
            <div v-else class="flex items-center justify-center h-full text-gray-500">
              <div class="text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p class="text-lg font-medium">Cargando gráfico...</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones de exportación modernos -->
      <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Exportar Datos</h2>
        </div>
        
        <!-- Filtros de exportación -->
        <div class="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-4 mb-6 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"></path>
            </svg>
            Filtros de Exportación
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Desde</label>
              <input 
                type="date" 
                v-model="filtrosExportacion.fechaDesde"
                class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Hasta</label>
              <input 
                type="date" 
                v-model="filtrosExportacion.fechaHasta"
                class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Región</label>
              <select 
                v-model="filtrosExportacion.region"
                class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas las regiones</option>
                <option value="COMERCIAL">Comercial (Agrupado)</option>
                <option value="NORTE">Norte</option>
                <option value="SUR">Sur</option>
                <option value="ESTE">Este</option>
                <option value="OESTE">Oeste</option>
                <option value="LA_PLATA">La Plata</option>
                <option value="NAFA">NAFA</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <button
            @click="exportarEstadisticas"
            class="group relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
          >
            <svg class="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Estadísticas
          </button>
          
          <button
            @click="exportarMovimientos"
            class="group relative bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
          >
            <svg class="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            Movimientos
          </button>
          
          <button
            @click="exportarSolicitudes"
            class="group relative bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
          >
            <svg class="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Solicitudes
          </button>
          
          <button
            @click="exportarRepartosRoturas"
            class="group relative bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
          >
            <svg class="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Repartos
          </button>
          
          <button
            @click="exportarCompleto"
            class="group relative bg-gradient-to-r from-gray-700 to-slate-800 text-white px-6 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
          >
            <svg class="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            Todo
          </button>
        </div>
      </div>

      <!-- Tabla de datos moderna y compacta -->
      <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        <div class="bg-gradient-to-r from-slate-800 via-gray-800 to-zinc-800 px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 backdrop-blur-lg rounded-xl">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <div class="flex items-center gap-4">
                <h3 class="text-xl font-bold text-white">Detalle por Mes</h3>
                <!-- Resumen condensado cuando está colapsado -->
                <div v-if="!mostrarDetalleMensual" class="flex items-center gap-3 text-sm text-white/80">
                  <span class="bg-white/10 px-2 py-1 rounded">
                    {{ (estadisticas?.estadisticasMensuales || []).length }} meses
                  </span>
                  <span class="bg-blue-500/20 px-2 py-1 rounded">
                    {{ (estadisticas?.estadisticasMensuales || []).reduce((sum, item) => sum + item.movimientos, 0) }} mov.
                  </span>
                  <span class="bg-green-500/20 px-2 py-1 rounded">
                    {{ (estadisticas?.estadisticasMensuales || []).reduce((sum, item) => sum + item.solicitudes, 0) }} sol.
                  </span>
                </div>
              </div>
            </div>
            <!-- Botón para colapsar/expandir -->
            <button 
              @click="mostrarDetalleMensual = !mostrarDetalleMensual"
              class="flex items-center gap-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white text-sm"
            >
              <svg 
                :class="['w-4 h-4 transition-transform', mostrarDetalleMensual ? 'rotate-180' : '']" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
              {{ mostrarDetalleMensual ? 'Ocultar' : 'Mostrar' }}
            </button>
          </div>
        </div>
        
        <div v-show="mostrarDetalleMensual" class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gradient-to-r from-slate-600 to-gray-700">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-bold text-white uppercase tracking-wider">Mes</th>
                <th class="px-4 py-2 text-left text-xs font-bold text-white uppercase tracking-wider">Año</th>
                <th class="px-4 py-2 text-left text-xs font-bold text-white uppercase tracking-wider">Movimientos</th>
                <th class="px-4 py-2 text-left text-xs font-bold text-white uppercase tracking-wider">Solicitudes</th>
                <th class="px-4 py-2 text-left text-xs font-bold text-white uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody class="bg-white/90 backdrop-blur-sm divide-y divide-gray-200/50">
              <tr v-for="item in estadisticas?.estadisticasMensuales || []" 
                  :key="`${item.mes}-${item.year}`"
                  class="hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 transition-all duration-200">
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm font-bold text-gray-900">{{ item.mes }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm text-gray-700">{{ item.year }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800">
                    {{ item.movimientos }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800">
                    {{ item.solicitudes }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800">
                    {{ item.movimientos + item.solicitudes }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
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
import { 
  estadisticasService, 
  agruparRegionesComerciales,
  type EstadisticasResumen, 
  type EstadisticasRegion,
  type RepartoRotura
} from '@/services/estadisticasService';
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

// Estados reactivos
const estadisticas = ref<EstadisticasResumen | null>(null);
const estadisticasRegiones = ref<EstadisticasRegion[]>([]);
const repartosRoturas = ref<RepartoRotura[]>([]);
const regionSeleccionada = ref<string>('');
const cargando = ref(false);
const cargandoRepartos = ref(false);
const error = ref<string>('');
const mensajeExito = ref<string>('');
const mostrarDetalleMensual = ref(false); // Collapsed por defecto

// Filtros de exportación
const filtrosExportacion = ref({
  fechaDesde: '',
  fechaHasta: '',
  region: ''
});

// Computed properties
const regionesUrgentes = computed(() => 
  estadisticasRegiones.value.filter(region => region.urgente)
);

const rankingCelularesRotos = computed(() => {
  return estadisticasRegiones.value
    .filter(region => region.totalUsuarios > 0) // Solo regiones con usuarios
    .sort((a, b) => b.promedioCelularesRotos - a.promedioCelularesRotos) // Ordenar por promedio descendente
    .slice(0, 6); // Top 6 regiones
});

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

const regionesChartData = computed(() => {
  if (estadisticasRegiones.value.length === 0) {
    console.log('No hay datos de regiones para el gráfico');
    return { labels: [], datasets: [] };
  }

  const labels = estadisticasRegiones.value.map(r => r.region.replace('_', ' '));
  console.log('📊 Gráfico de regiones - Labels:', labels, 'Cantidad:', estadisticasRegiones.value.length);
  
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Pendientes',
        backgroundColor: 'rgba(251, 191, 36, 0.8)',
        data: estadisticasRegiones.value.map(r => r.solicitudesPendientes)
      },
      {
        label: 'En Proceso',
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        data: estadisticasRegiones.value.map(r => r.solicitudesEnProceso)
      },
      {
        label: 'Resueltas',
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        data: estadisticasRegiones.value.map(r => r.solicitudesResueltas)
      },
      {
        label: 'Por Rotura',
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        data: estadisticasRegiones.value.map(r => r.solicitudesPorRotura)
      }
    ]
  };
  
  return chartData;
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

// Métodos
const cargarEstadisticas = async () => {
  cargando.value = true;
  error.value = '';
  
  try {
    estadisticas.value = await estadisticasService.obtenerEstadisticas();
  } catch (err: any) {
    console.error('Error al cargar estadísticas:', err);
    // Usar el mensaje específico del error
    error.value = err.message || 'Error al cargar las estadísticas. Verifique la conexión con el servidor.';
    estadisticas.value = null;
  } finally {
    cargando.value = false;
  }
};

const cargarEstadisticasRegiones = async () => {
  cargando.value = true;
  error.value = '';
  
  try {
    console.log('Cargando estadísticas de regiones...');
    let regionesData = await estadisticasService.obtenerTodasLasRegiones();
    console.log('Estadísticas de regiones cargadas (antes de filtro):', regionesData);
    
    // Filtrar SISTEMAS si existe
    regionesData = regionesData.filter(region => region.region !== 'SISTEMAS');
    console.log('Estadísticas de regiones después de filtro:', regionesData);
    
    // Aplicar agrupación comercial
    regionesData = agruparRegionesComerciales(regionesData);
    console.log('Estadísticas de regiones después de agrupación comercial:', regionesData);
    
    estadisticasRegiones.value = regionesData;
  } catch (err: any) {
    console.error('Error al cargar estadísticas por región:', err);
    // Usar el mensaje específico del error
    error.value = err.message || 'Error al cargar las estadísticas por región. Verifique la conexión con el servidor.';
    estadisticasRegiones.value = [];
  } finally {
    cargando.value = false;
  }
};

const cargarDatosPorRegion = async () => {
  if (!regionSeleccionada.value) {
    await cargarEstadisticasRegiones();
    return;
  }

  cargando.value = true;
  error.value = '';
  try {
    const fechaActual = new Date();
    const fechaHasta = fechaActual.toISOString().split('T')[0];
    const fechaDesde = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1).toISOString().split('T')[0];
    
    const estadisticaRegion = await estadisticasService.obtenerEstadisticasPorRegion(
      regionSeleccionada.value, 
      fechaDesde, 
      fechaHasta
    );
    
    estadisticasRegiones.value = [estadisticaRegion];
  } catch (err) {
    console.error('Error al cargar datos por región:', err);
    error.value = `Error al cargar datos de la región ${regionSeleccionada.value}. Verifique la conexión con el servidor.`;
    estadisticasRegiones.value = [];
  } finally {
    cargando.value = false;
  }
};

const cargarTodosDatos = async () => {
  await Promise.all([
    cargarEstadisticas(),
    cargarEstadisticasRegiones(),
    cargarRepartosRoturas()
  ]);
};

const cargarRepartosRoturas = async () => {
  cargandoRepartos.value = true;
  try {
    repartosRoturas.value = await estadisticasService.obtenerRepartosConMasRoturas();
    console.log('Repartos con roturas cargados:', repartosRoturas.value);
  } catch (err: any) {
    console.error('Error al cargar repartos con roturas:', err);
    error.value = err.message || 'Error al cargar repartos con roturas';
    repartosRoturas.value = [];
  } finally {
    cargandoRepartos.value = false;
  }
};

const verDetalleRegion = (region: string) => {
  regionSeleccionada.value = region;
  cargarDatosPorRegion();
};

const exportarEstadisticas = async () => {
  try {
    // Usar el nuevo método de exportación completa que maneja múltiples hojas
    await excelService.exportarEstadisticasCompletas();
    
    mostrarExito('📊 Estadísticas completas exportadas correctamente');
  } catch (error: any) {
    console.error('Error al exportar estadísticas completas:', error);
    mostrarError(error.message || 'Error al exportar las estadísticas');
  }
};

const exportarMovimientos = async () => {
  try {
    // Primero intentar con filtros, si falla usar método básico
    let movimientos;
    const hayFiltros = Object.values(filtrosExportacion.value).some(v => v);
    
    if (hayFiltros) {
      try {
        movimientos = await estadisticasService.exportarMovimientosConFiltros(
          filtrosExportacion.value.fechaDesde || undefined,
          filtrosExportacion.value.fechaHasta || undefined,
          filtrosExportacion.value.region || undefined
        );
      } catch (err) {
        console.warn('Filtros no disponibles, usando exportación básica');
        movimientos = await estadisticasService.obtenerMovimientosDetalle();
      }
    } else {
      movimientos = await estadisticasService.obtenerMovimientosDetalle();
    }
    
    const fechaHoy = new Date().toISOString().split('T')[0];
    
    if (hayFiltros) {
      // Usar exportación con filtros si hay filtros aplicados
      excelService.exportarMovimientosConFiltros(
        movimientos, 
        filtrosExportacion.value,
        `movimientos_filtrados_${fechaHoy}.xlsx`
      );
    } else {
      // Usar exportación normal si no hay filtros
      excelService.exportarMovimientos(movimientos, `movimientos_${fechaHoy}.xlsx`);
    }
    
    mostrarExito(`📱 ${movimientos.length} movimientos exportados correctamente`);
  } catch (err) {
    console.error('Error al exportar movimientos:', err);
    mostrarError('Error al exportar movimientos');
  }
};

const exportarSolicitudes = async () => {
  try {
    // Primero intentar con filtros, si falla usar método básico
    let solicitudes;
    const hayFiltros = Object.values(filtrosExportacion.value).some(v => v);
    
    if (hayFiltros) {
      try {
        solicitudes = await estadisticasService.exportarSolicitudesConFiltros(
          filtrosExportacion.value.fechaDesde || undefined,
          filtrosExportacion.value.fechaHasta || undefined,
          filtrosExportacion.value.region || undefined,
          undefined // estado
        );
      } catch (err) {
        console.warn('Filtros no disponibles, usando exportación básica');
        solicitudes = await estadisticasService.obtenerSolicitudesDetalle();
      }
    } else {
      solicitudes = await estadisticasService.obtenerSolicitudesDetalle();
    }
    
    const fechaHoy = new Date().toISOString().split('T')[0];
    
    if (hayFiltros) {
      // Usar exportación con filtros si hay filtros aplicados
      excelService.exportarSolicitudesConFiltros(
        solicitudes, 
        filtrosExportacion.value,
        `solicitudes_filtradas_${fechaHoy}.xlsx`
      );
    } else {
      // Usar exportación normal si no hay filtros
      excelService.exportarSolicitudes(solicitudes, `solicitudes_${fechaHoy}.xlsx`);
    }
    
    mostrarExito(`📋 ${solicitudes.length} solicitudes exportadas correctamente`);
  } catch (err) {
    console.error('Error al exportar solicitudes:', err);
    mostrarError('Error al exportar solicitudes');
  }
};

const exportarCompleto = async () => {
  if (!estadisticas.value?.estadisticasMensuales) {
    error.value = 'No hay datos para exportar';
    return;
  }
  
  try {
    const hayFiltros = Object.values(filtrosExportacion.value).some(v => v);
    let movimientos, solicitudes;
    
    // Obtener datos con o sin filtros
    if (hayFiltros) {
      try {
        [movimientos, solicitudes] = await Promise.all([
          estadisticasService.exportarMovimientosConFiltros(
            filtrosExportacion.value.fechaDesde || undefined,
            filtrosExportacion.value.fechaHasta || undefined,
            filtrosExportacion.value.region || undefined
          ),
          estadisticasService.exportarSolicitudesConFiltros(
            filtrosExportacion.value.fechaDesde || undefined,
            filtrosExportacion.value.fechaHasta || undefined,
            filtrosExportacion.value.region || undefined,
            undefined
          )
        ]);
      } catch (err) {
        console.warn('Filtros no disponibles, usando exportación básica');
        [movimientos, solicitudes] = await Promise.all([
          estadisticasService.obtenerMovimientosDetalle(),
          estadisticasService.obtenerSolicitudesDetalle()
        ]);
      }
    } else {
      [movimientos, solicitudes] = await Promise.all([
        estadisticasService.obtenerMovimientosDetalle(),
        estadisticasService.obtenerSolicitudesDetalle()
      ]);
    }
    
    const fechaHoy = new Date().toISOString().split('T')[0];
    const nombreArchivo = hayFiltros 
      ? `reporte_completo_filtrado_${fechaHoy}.xlsx`
      : `reporte_completo_${fechaHoy}.xlsx`;
      
    excelService.exportarCompleto(
      estadisticas.value.estadisticasMensuales,
      movimientos,
      solicitudes,
      nombreArchivo
    );
    
    mostrarExito('📦 Reporte completo exportado correctamente');
  } catch (err) {
    console.error('Error al exportar reporte completo:', err);
    mostrarError('Error al exportar reporte completo');
  }
};

const exportarRepartosRoturas = async () => {
  try {
    // Usar el método de exportación completa que incluye los repartos con roturas
    await excelService.exportarEstadisticasCompletas();
    
    mostrarExito('🏆 Estadísticas completas con ranking de repartos exportadas correctamente');
  } catch (err: any) {
    console.error('Error al exportar repartos con roturas:', err);
    mostrarError(err.message || 'Error al exportar repartos con roturas');
  }
};

// Lifecycle
onMounted(() => {
  cargarTodosDatos();
});

// Función auxiliar para limpiar mensajes
const limpiarMensajes = () => {
  setTimeout(() => {
    error.value = '';
    mensajeExito.value = '';
  }, 5000);
};

const mostrarExito = (mensaje: string) => {
  mensajeExito.value = mensaje;
  error.value = '';
  limpiarMensajes();
};

const mostrarError = (mensajeError: string) => {
  error.value = mensajeError;
  mensajeExito.value = '';
  limpiarMensajes();
};
</script>
