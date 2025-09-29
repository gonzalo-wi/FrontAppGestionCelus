<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8">
    <div class="w-full px-4 sm:px-6 lg:px-8">
      <!-- Header con gradiente -->
      <div class="relative mb-8 bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 rounded-3xl p-8 text-white shadow-2xl overflow-hidden">
        <div class="absolute inset-0 bg-black opacity-10"></div>
        <div class="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-white opacity-10 rounded-full"></div>
        <div class="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-white opacity-5 rounded-full"></div>
        
        <div class="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex-1">
            <h1 class="text-2xl sm:text-4xl lg:text-5xl font-bold mb-2">Gestión de Solicitudes</h1>
            <p class="text-pink-100 text-sm sm:text-lg">Administra y consulta las solicitudes de celulares</p>
          </div>
          <div class="p-3 sm:p-4 bg-white/20 backdrop-blur-lg rounded-2xl flex-shrink-0">
            <svg class="w-8 h-8 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Notificación moderna -->
      <div v-if="notification.show" 
           :class="[
             'mb-8 p-4 rounded-2xl flex items-center justify-between shadow-xl transform transition-all duration-300',
             notification.type === 'success' 
               ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' 
               : 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
           ]">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-white/20 rounded-xl">
            <svg v-if="notification.type === 'success'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <span class="font-medium">{{ notification.message }}</span>
        </div>
        <button @click="notification.show = false" class="p-2 hover:bg-white/20 rounded-xl transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Formulario para crear solicitud con diseño moderno -->
      <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8 hover:shadow-3xl transition-all duration-300">
        <div class="flex items-center gap-4 mb-6">
          <div class="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Nueva Solicitud</h2>
        </div>
        
        <form @submit.prevent="crearSolicitud" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">Solicitante</label>
            <input v-model="form.nomSolicitante" 
                   type="text" 
                   class="w-full bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                   placeholder="Nombre del solicitante"
                   required />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">Reparto</label>
            <input v-model="form.usuario" 
                   type="text" 
                   class="w-full bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                   placeholder="Área de reparto"
                   required />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">Región</label>
            <select v-model="form.region" 
                    class="w-full bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200" 
                    required>
              <option value="">Seleccionar región</option>
              <option value="NORTE">NORTE</option>
              <option value="SUR">SUR</option>
              <option value="ESTE">ESTE</option>
              <option value="OESTE">OESTE</option>
              <option value="LA_PLATA">LA PLATA</option>
              <option value="NAFA">NAFA</option>
              <option value="LAVAZZA">LAVAZZA</option>
              <option value="TALLER">TALLER</option>
              <option value="IMPACTO">IMPACTO</option>
              <option value="COMERCIAL">COMERCIAL</option>
              <option value="GERENCIA">GERENCIA</option>
              <option value="PLANTA">PLANTA</option>
              <option value="SISTEMAS">SISTEMAS</option>
              <option value="RRHH">RRHH</option>
              <option value="ADMINISTRACION">ADMINISTRACION</option>
              <option value="COMPRAS">COMPRAS</option>
              <option value="RRHH">RRHH</option>
              <option value="ADMINISTRACION">ADMINISTRACION</option>
              <option value="COMPRAS">COMPRAS</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">Tipo de Solicitud</label>
            <select v-model="form.tipoSolicitud" 
                    class="w-full bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200" 
                    required>
              <option value="">Seleccionar tipo</option>
              <option value="CAMBIO_POR_ROTURA">CAMBIO POR ROTURA</option>
              <option value="NUEVO_EQUIPO">NUEVO EQUIPO</option>
              <option value="ROBO">ROBO</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">Motivo</label>
            <input v-model="form.motivo" 
                   type="text" 
                   class="w-full bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                   placeholder="Describe el motivo de la solicitud"
                   required />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">¿Necesita línea?</label>
            <select v-model="form.necesitaLinea" 
                    class="w-full bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200" 
                    required>
              <option :value="true">Sí</option>
              <option :value="false">No</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">Fecha</label>
            <input v-model="form.fecha" 
                   type="date" 
                   class="w-full bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200" 
                   required />
          </div>
          <div class="md:col-span-2 flex justify-end items-center mt-6">
            <button type="submit" 
                    class="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3">
              <svg class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Crear Solicitud
            </button>
          </div>
        </form>
      </div>

      <!-- Filtros con diseño moderno -->
      <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
        <div class="flex items-center gap-4 mb-6">
          <div class="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Filtros</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">Región</label>
            <select v-model="filtros.region" 
                    class="w-full bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200">
              <option value="">Todas las regiones</option>
              <option value="NORTE">NORTE</option>
              <option value="SUR">SUR</option>
              <option value="ESTE">ESTE</option>
              <option value="OESTE">OESTE</option>
              <option value="LA_PLATA">LA PLATA</option>
              <option value="NAFA">NAFA</option>
              <option value="LAVAZZA">LAVAZZA</option>
              <option value="TALLER">TALLER</option>
              <option value="IMPACTO">IMPACTO</option>
              <option value="COMERCIAL">COMERCIAL</option>
              <option value="GERENCIA">GERENCIA</option>
              <option value="PLANTA">PLANTA</option>
              <option value="SISTEMAS">SISTEMAS</option>
              <option value="RRHH">RRHH</option>
              <option value="ADMINISTRACION">ADMINISTRACION</option>
              <option value="COMPRAS">COMPRAS</option>
              <option value="RRHH">RRHH</option>
              <option value="ADMINISTRACION">ADMINISTRACION</option>
              <option value="COMPRAS">COMPRAS</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">Tipo de Solicitud</label>
            <select v-model="filtros.tipoSolicitud" 
                    class="w-full bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200">
              <option value="">Todos los tipos</option>
              <option value="CAMBIO_POR_ROTURA">CAMBIO POR ROTURA</option>
              <option value="NUEVO_EQUIPO">NUEVO EQUIPO</option>
              <option value="ROBO">ROBO</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">Usuario</label>
            <input v-model="filtros.usuario" 
                   type="text" 
                   class="w-full bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 placeholder-gray-400" 
                   placeholder="Buscar usuario..." />
          </div>
        </div>
      </div>

      <!-- Tabla de solicitudes con diseño moderno -->
      <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Solicitudes</h2>
          </div>
          <div class="text-sm text-gray-600 bg-gray-100/70 px-4 py-2 rounded-xl">
            Total: {{ solicitudesFiltradas.length }}
          </div>
        </div>
        
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="flex items-center gap-3 text-gray-600">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span class="text-lg font-medium">Cargando solicitudes...</span>
          </div>
        </div>
        
        <div v-else-if="solicitudesFiltradas.length === 0" class="text-center py-12">
          <div class="flex flex-col items-center gap-4">
            <div class="p-4 bg-gray-100 rounded-2xl">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <p class="text-gray-500 text-lg">No hay solicitudes registradas</p>
          </div>
        </div>
        
        <div v-else class="space-y-4">
          <!-- Tabla moderna con scroll horizontal -->
          <div class="hidden lg:block overflow-x-auto rounded-2xl border border-gray-200/50 shadow-xl">
            <div class="min-w-full">
              <table class="w-full divide-y divide-gray-200/50" style="min-width: 1200px;">
                <thead class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                  <tr>
                    <th class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider w-20">ID</th>
                    <th class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[150px]">Solicitante</th>
                    <th class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[120px]">Usuario</th>
                    <th class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[100px]">Región</th>
                    <th class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[140px]">Tipo</th>
                    <th class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[200px]">Motivo</th>
                    <th class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[80px]">Línea</th>
                    <th class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[100px]">Fecha</th>
                    <th class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[120px]">Estado</th>
                    <th class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[150px]">Acciones</th>
                  </tr>
                </thead>
                <tbody class="bg-white/90 backdrop-blur-sm divide-y divide-gray-200/50">
                <tr v-for="solicitud in solicitudesPaginadas" 
                    :key="solicitud.id" 
                    class="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group">
                  <td class="px-4 py-4 whitespace-nowrap w-20">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span class="text-xs font-bold text-white">#{{ solicitud.id }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap min-w-[150px]">
                    <div class="text-sm font-semibold text-gray-900">{{ solicitud.nomSolicitante }}</div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap min-w-[120px]">
                    <div class="text-sm text-gray-700">{{ solicitud.usuario }}</div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap min-w-[100px]">
                    <span class="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800">
                      {{ solicitud.region }}
                    </span>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap min-w-[140px]">
                    <div class="flex items-center gap-2">
                      <span class="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-800">
                        {{ solicitud.tipoSolicitud.replace(/_/g, ' ') }}
                      </span>
                      <!-- Indicador de denuncia para ROBO -->
                      <div v-if="solicitud.tipoSolicitud === 'ROBO'" class="flex items-center">
                        <span v-if="solicitud.tieneDenunciaAdjunta" 
                              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800"
                              title="Con denuncia PDF">
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          PDF
                        </span>
                        <span v-else 
                              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800"
                              title="Sin denuncia">
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                          </svg>
                          Sin PDF
                        </span>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-4 min-w-[200px]">
                    <div class="text-sm text-gray-700 max-w-[180px] truncate" :title="solicitud.motivo">{{ solicitud.motivo }}</div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap min-w-[80px]">
                    <span :class="solicitud.necesitaLinea ? 
                      'bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg' : 
                      'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold'">
                      {{ solicitud.necesitaLinea ? 'Sí' : 'No' }}
                    </span>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-700 min-w-[100px]">
                    {{ solicitud.fecha }}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap min-w-[120px]">
                    <!-- Modo edición inline -->
                    <div v-if="solicitudEditando === solicitud.id" class="flex items-center gap-3">
                      <select 
                        v-model="estadoTemporal" 
                        class="bg-white/90 backdrop-blur-sm border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                        @keyup.enter="guardarEstado(solicitud)"
                        @keyup.escape="cancelarEdicion()"
                        ref="selectEstado"
                        autofocus
                      >
                        <option :value="EstadoSolicitud.PENDIENTE">PENDIENTE</option>
                        <option :value="EstadoSolicitud.EN_PROCESO">EN PROCESO</option>
                        <option :value="EstadoSolicitud.RESUELTA">RESUELTA</option>
                      </select>
                      <button @click="guardarEstado(solicitud)" 
                              class="p-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200" 
                              title="Guardar">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </button>
                      <button @click="cancelarEdicion()" 
                              class="p-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200" 
                              title="Cancelar">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                    <!-- Modo visualización -->
                    <div v-else>
                      <span 
                        :class="{
                          'bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg': solicitud.estado === EstadoSolicitud.PENDIENTE,
                          'bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg': solicitud.estado === EstadoSolicitud.EN_PROCESO,
                          'bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg': solicitud.estado === EstadoSolicitud.RESUELTA
                        }"
                        class="cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200"
                        @click="iniciarEdicion(solicitud)"
                        title="Click para editar"
                      >
                        {{ solicitud.estado || EstadoSolicitud.PENDIENTE }}
                      </span>
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap min-w-[150px]">
                    <div class="flex items-center justify-center gap-2">
                      <!-- Botones PDF para solicitudes ROBO con denuncia -->
                      <button v-if="solicitud.tipoSolicitud === 'ROBO' && solicitud.tieneDenunciaAdjunta"
                              @click="verPdfDenuncia(solicitud.id)"
                              class="p-1.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                              title="Ver PDF">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </button>
                      <button v-if="solicitud.tipoSolicitud === 'ROBO' && solicitud.tieneDenunciaAdjunta"
                              @click="descargarDenuncia(solicitud.id)"
                              :disabled="descargandoDenuncia"
                              class="p-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                              title="Descargar PDF">
                        <svg v-if="descargandoDenuncia" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                      </button>
                      <!-- Botón de configuración/edición para admin -->
                      <button v-if="isAdmin" 
                              @click="abrirModalEstado(solicitud)" 
                              class="p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 group" 
                              title="Editar solicitud">
                        <svg class="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
            
            <!-- Acciones y Paginación moderna -->
            <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center mt-8 gap-6 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border-t border-gray-200/50">
              <div class="flex items-center gap-4">
                <button @click="cargarSolicitudes" 
                        class="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <svg class="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Refrescar
                </button>
                <div class="text-sm text-gray-600 bg-white/70 px-4 py-2 rounded-xl border border-gray-200">
                  Mostrando {{ ((paginaActual - 1) * solicitudesPorPagina) + 1 }} - {{ Math.min(paginaActual * solicitudesPorPagina, solicitudesFiltradas.length) }} de {{ solicitudesFiltradas.length }} solicitudes
                </div>
              </div>
              
              <div class="flex items-center gap-4">
                <button @click="paginaActual = Math.max(1, paginaActual - 1)" 
                        :disabled="paginaActual === 1" 
                        class="group flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white hover:border-transparent shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white disabled:hover:text-gray-700">
                  <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                  Anterior
                </button>
                
                <div class="flex items-center gap-2">
                  <span class="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold shadow-lg">
                    {{ paginaActual }}
                  </span>
                  <span class="text-gray-500 font-medium">de</span>
                  <span class="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold">
                    {{ totalPaginas }}
                  </span>
                </div>
                
                <button @click="paginaActual = Math.min(totalPaginas, paginaActual + 1)" 
                        :disabled="paginaActual === totalPaginas" 
                        class="group flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white hover:border-transparent shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white disabled:hover:text-gray-700">
                  Siguiente
                  <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Vista móvil - Cards responsive -->
          <div class="lg:hidden space-y-4">
            <div v-for="solicitud in solicitudesPaginadas" 
                 :key="solicitud.id" 
                 class="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span class="text-sm font-bold text-white">#{{ solicitud.id }}</span>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-900">{{ solicitud.nomSolicitante }}</h3>
                    <p class="text-sm text-gray-600">{{ solicitud.usuario }}</p>
                  </div>
                </div>
                <span 
                  :class="{
                    'bg-gradient-to-r from-yellow-400 to-orange-500': solicitud.estado === EstadoSolicitud.PENDIENTE,
                    'bg-gradient-to-r from-blue-500 to-indigo-600': solicitud.estado === EstadoSolicitud.EN_PROCESO,
                    'bg-gradient-to-r from-green-500 to-emerald-600': solicitud.estado === EstadoSolicitud.RESUELTA
                  }"
                  class="text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  {{ solicitud.estado || EstadoSolicitud.PENDIENTE }}
                </span>
              </div>
              
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span class="text-xs font-semibold text-gray-500 uppercase">Región</span>
                  <p class="text-sm font-medium text-gray-900">{{ solicitud.region }}</p>
                </div>
                <div>
                  <span class="text-xs font-semibold text-gray-500 uppercase">Tipo</span>
                  <div class="flex items-center gap-2 flex-wrap">
                    <p class="text-sm font-medium text-gray-900">{{ solicitud.tipoSolicitud.replace(/_/g, ' ') }}</p>
                    <!-- Preview de denuncia para solicitudes ROBO -->
                    <PdfThumbnail 
                      v-if="solicitud.tipoSolicitud === 'ROBO' && solicitud.tieneDenunciaAdjunta"
                      :solicitud-id="solicitud.id"
                      :nombre-archivo="solicitud.nombreArchivoDenuncia"
                      :tiene-denuncia="solicitud.tieneDenunciaAdjunta"
                    />
                    <span v-else-if="solicitud.tipoSolicitud === 'ROBO'" 
                          class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                      </svg>
                      Sin denuncia
                    </span>
                  </div>
                </div>
                <div>
                  <span class="text-xs font-semibold text-gray-500 uppercase">Fecha</span>
                  <p class="text-sm font-medium text-gray-900">{{ solicitud.fecha }}</p>
                </div>
                <div>
                  <span class="text-xs font-semibold text-gray-500 uppercase">Línea</span>
                  <span :class="solicitud.necesitaLinea ? 
                    'bg-gradient-to-r from-green-400 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-semibold' : 
                    'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold'">
                    {{ solicitud.necesitaLinea ? 'Sí' : 'No' }}
                  </span>
                </div>
              </div>
              
              <div class="mb-4">
                <span class="text-xs font-semibold text-gray-500 uppercase">Motivo</span>
                <p class="text-sm text-gray-700 mt-1">{{ solicitud.motivo }}</p>
              </div>
              
              <div class="flex items-center gap-3 pt-4 border-t border-gray-200">
                <button @click="iniciarEdicion(solicitud)" 
                        class="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  Editar Estado
                </button>
                <!-- Botón ver PDF -->
                <button v-if="solicitud.tipoSolicitud === 'ROBO' && solicitud.tieneDenunciaAdjunta"
                        @click="verPdfDenuncia(solicitud.id)"
                        class="p-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        title="Ver PDF">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
                <!-- Botón descargar denuncia -->
                <button v-if="solicitud.tipoSolicitud === 'ROBO' && solicitud.tieneDenunciaAdjunta"
                        @click="descargarDenuncia(solicitud.id)"
                        :disabled="descargandoDenuncia"
                        class="p-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                        title="Descargar PDF">
                  <svg v-if="descargandoDenuncia" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </button>
                <button v-if="isAdmin" 
                        @click="abrirModalEstado(solicitud)" 
                        class="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Paginación móvil -->
            <div class="flex items-center justify-center gap-4 mt-8 p-4 bg-white/70 backdrop-blur-xl rounded-2xl">
              <button @click="paginaActual = Math.max(1, paginaActual - 1)" 
                      :disabled="paginaActual === 1" 
                      class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Anterior
              </button>
              
              <span class="px-4 py-2 bg-white rounded-xl font-bold text-gray-700 shadow-lg">
                {{ paginaActual }} / {{ totalPaginas }}
              </span>
              
              <button @click="paginaActual = Math.min(totalPaginas, paginaActual + 1)" 
                      :disabled="paginaActual === totalPaginas" 
                      class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                Siguiente
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

    <!-- Modal para cambiar estado -->
    <div v-if="showModalEstado" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h3 class="text-lg font-bold mb-4">Cambiar estado de solicitud</h3>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
          <select v-model="nuevoEstado" class="w-full border rounded px-3 py-2">
            <option :value="EstadoSolicitud.PENDIENTE">PENDIENTE</option>
            <option :value="EstadoSolicitud.EN_PROCESO">EN PROCESO</option>
            <option :value="EstadoSolicitud.RESUELTA">RESUELTA</option>
          </select>
        </div>
        <div class="flex justify-end gap-2">
          <button @click="showModalEstado = false" class="px-4 py-2 rounded bg-gray-100 text-gray-700">Cancelar</button>
          <button @click="cambiarEstadoSolicitud" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Guardar</button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { solicitudService, EstadoSolicitud } from '@/services/solicitudService.ts';
import PdfThumbnail from '@/components/PdfThumbnail.vue';

const solicitudes = ref([]);
const loading = ref(false);
const notification = reactive({ show: false, type: 'success', message: '' });
const isAdmin = ref(true); // Cambiado a true para poder editar estados

// Función para mostrar notificación con auto-ocultar
const mostrarNotificacion = (mensaje, tipo = 'success') => {
  notification.message = mensaje;
  notification.type = tipo;
  notification.show = true;
  setTimeout(() => {
    notification.show = false;
  }, 4000);
};

const form = reactive({
  id: '',
  nomSolicitante: '',
  fecha: '',
  usuario: '',
  region: '',
  tipoSolicitud: '',
  motivo: '',
  necesitaLinea: true
});

// Filtros
const filtros = reactive({
  region: '',
  tipoSolicitud: '',
  usuario: ''
});

// Paginación
const paginaActual = ref(1);
const solicitudesPorPagina = 10;

const solicitudesFiltradas = computed(() => {
  return solicitudes.value.filter(s => {
    if (filtros.region && s.region !== filtros.region) return false;
    if (filtros.tipoSolicitud && s.tipoSolicitud !== filtros.tipoSolicitud) return false;
    if (filtros.usuario && !s.usuario.toLowerCase().includes(filtros.usuario.toLowerCase())) return false;
    return true;
  });
});

const totalPaginas = computed(() => {
  return Math.max(1, Math.ceil(solicitudesFiltradas.value.length / solicitudesPorPagina));
});

const solicitudesPaginadas = computed(() => {
  const start = (paginaActual.value - 1) * solicitudesPorPagina;
  return solicitudesFiltradas.value.slice(start, start + solicitudesPorPagina);
});

const showModalEstado = ref(false);
const solicitudSeleccionada = ref(null);
const nuevoEstado = ref('PENDIENTE');

// Variables para edición inline
const solicitudEditando = ref(null);
const estadoTemporal = ref('');

const cargarSolicitudes = async () => {
  loading.value = true;
  try {
    const resp = await solicitudService.obtenerTodas();
    console.log('Solicitudes recibidas:', resp.data);
    solicitudes.value = resp.data;
    paginaActual.value = 1;
  } catch (error) {
    console.error('Error al cargar solicitudes:', error?.response?.data || error);
    mostrarNotificacion('Error al cargar solicitudes', 'error');
  } finally {
    loading.value = false;
  }
};

const crearSolicitud = async () => {
  try {
    form.id = `S${Math.floor(Math.random() * 10000)}`;
    // Preparar payload (asegurar estado inicial)
    const payload = {
      ...form,
      estado: EstadoSolicitud.PENDIENTE
    };
    console.log('Enviando solicitud:', payload);
    const resp = await solicitudService.crear(payload);
    mostrarNotificacion('Solicitud creada correctamente');
    cargarSolicitudes();
  } catch (error) {
    console.error('Error al crear solicitud:', error?.response?.data || error);
    mostrarNotificacion('Error al crear solicitud', 'error');
  }
};

const abrirModalEstado = (solicitud) => {
  solicitudSeleccionada.value = solicitud;
  nuevoEstado.value = solicitud.estado || 'PENDIENTE';
  showModalEstado.value = true;
};

const cambiarEstadoSolicitud = async () => {
  try {
    await solicitudService.cambiarEstado(solicitudSeleccionada.value.id, nuevoEstado.value);
    mostrarNotificacion('Estado actualizado correctamente');
    showModalEstado.value = false;
    cargarSolicitudes();
  } catch (error) {
    mostrarNotificacion('Error al actualizar estado', 'error');
  }
};

// Funciones para edición inline
const iniciarEdicion = (solicitud) => {
  console.log('Iniciando edición para:', solicitud.id, 'Estado actual:', solicitud.estado);
  solicitudEditando.value = solicitud.id;
  estadoTemporal.value = solicitud.estado || EstadoSolicitud.PENDIENTE;
};

const cancelarEdicion = () => {
  console.log('Cancelando edición');
  solicitudEditando.value = null;
  estadoTemporal.value = '';
};

const guardarEstado = async (solicitud) => {
  console.log('Guardando estado:', {
    solicitudId: solicitud.id,
    estadoAnterior: solicitud.estado,
    estadoNuevo: estadoTemporal.value
  });

  if (estadoTemporal.value === solicitud.estado) {
    // No hay cambios, solo cancelar edición
    console.log('No hay cambios, cancelando edición');
    cancelarEdicion();
    return;
  }

  try {
    console.log('Enviando petición PUT al backend...');
    const response = await solicitudService.cambiarEstado(solicitud.id, estadoTemporal.value);
    console.log('Respuesta del backend:', response);
    
    // Actualizar la solicitud local inmediatamente (optimistic update)
    const index = solicitudes.value.findIndex(s => s.id === solicitud.id);
    if (index !== -1) {
      solicitudes.value[index].estado = estadoTemporal.value;
      console.log('Estado actualizado localmente');
    }
    
    mostrarNotificacion(`Estado cambiado a ${estadoTemporal.value}`);
    cancelarEdicion();
    
  } catch (error) {
    console.error('Error completo al actualizar estado:', {
      error: error,
      response: error?.response,
      data: error?.response?.data,
      status: error?.response?.status,
      message: error?.message
    });
    mostrarNotificacion(`Error al actualizar estado: ${error?.response?.data?.message || error?.message || 'Error desconocido'}`, 'error');
    cancelarEdicion();
  }
};

// Estado para descarga de denuncias
const descargandoDenuncia = ref(false);

// Función para ver PDF en nueva ventana
const verPdfDenuncia = async (solicitudId) => {
  try {
    console.log('Abriendo preview de denuncia:', solicitudId);
    const response = await solicitudService.descargarDenuncia(solicitudId);
    
    // Verificar que la respuesta sea válida
    const blob = response.data;
    
    if (!(blob instanceof Blob)) {
      throw new Error('La respuesta no es un blob válido');
    }
    
    // Crear URL del blob y abrir en nueva ventana
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank', 'width=800,height=1000,scrollbars=yes');
    
    // Liberar la URL después de un tiempo para evitar memory leaks
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 1000);
    
  } catch (error) {
    console.error('Error al abrir PDF:', error);
    mostrarNotificacion('Error al abrir el PDF', 'error');
  }
};

// Función para descargar denuncia PDF
const descargarDenuncia = async (solicitudId) => {
  descargandoDenuncia.value = true;
  try {
    console.log('Descargando denuncia de solicitud:', solicitudId);
    const response = await solicitudService.descargarDenuncia(solicitudId);
    
    // Verificar que la respuesta sea válida
    console.log('Response type:', typeof response);
    console.log('Response data:', response.data);
    
    // Obtener el blob de la respuesta
    const blob = response.data;
    
    // Verificar que sea un Blob válido
    if (!(blob instanceof Blob)) {
      throw new Error('La respuesta no es un blob válido');
    }
    
    // Crear URL del blob y descargar
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `denuncia-solicitud-${solicitudId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    mostrarNotificacion('Denuncia descargada correctamente');
  } catch (error) {
    console.error('Error al descargar denuncia:', error);
    mostrarNotificacion('Error al descargar la denuncia', 'error');
  } finally {
    descargandoDenuncia.value = false;
  }
};

onMounted(() => {
  cargarSolicitudes();
});
</script>
