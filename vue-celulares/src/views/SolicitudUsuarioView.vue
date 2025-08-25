<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header con gradiente -->
      <div class="relative mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl p-8 text-white shadow-2xl">
        <div class="absolute inset-0 bg-black opacity-10 rounded-2xl"></div>
        <div class="relative">
          <h1 class="text-4xl font-bold mb-2">Mi Perfil</h1>
          <p class="text-blue-100 text-lg">Gestiona tus solicitudes y consulta tu flota por región</p>
        </div>
        <!-- Decoración -->
        <div class="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full"></div>
        <div class="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-white opacity-5 rounded-full"></div>
      </div>

      <!-- Tabs modernas -->
      <div class="mb-8">
        <div class="bg-white/70 backdrop-blur-lg rounded-2xl p-2 inline-flex shadow-lg border border-white/20">
          <button @click="activeTab = 'solicitudes'"
                  :class="[
                    'px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2',
                    activeTab === 'solicitudes' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  ]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Mis Solicitudes
          </button>
          <button @click="activeTab = 'mi-flota'; if (!flotaCargada) cargarMiFlota();"
                  v-if="authService.isAuthenticated()"
                  :class="[
                    'px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2',
                    activeTab === 'mi-flota' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  ]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            Mi Flota
          </button>
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

      <!-- Formulario para crear solicitud (solo cuando pestaña solicitudes) -->
      <div v-if="activeTab === 'solicitudes'" class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8 mb-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Nueva Solicitud</h2>
            <p class="text-gray-600">Completa el formulario para crear una nueva solicitud</p>
          </div>
        </div>
        
        <form @submit.prevent="crearSolicitud" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">Tu Nombre</label>
            <input v-model="form.nomSolicitante" 
                   type="text" 
                   class="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/60 backdrop-blur-sm" 
                   placeholder="Ingresa tu nombre completo"
                   required />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">Número de Reparto</label>
            <input v-model="form.usuario" 
                   type="text" 
                   class="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/60 backdrop-blur-sm" 
                   placeholder="Ej: 12345"
                   required />
          </div>
          <div v-if="authService.isAdmin()" class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">Región</label>
            <select v-model="form.region" 
                    class="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/60 backdrop-blur-sm" 
                    required>
              <option value="">Seleccionar región</option>
              <option value="NORTE">NORTE</option>
              <option value="SUR">SUR</option>
              <option value="ESTE">ESTE</option>
              <option value="OESTE">OESTE</option>
              <option value="LA_PLATA">LA PLATA</option>
              <option value="NAFA">NAFA</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">Tipo de Solicitud</label>
            <select v-model="form.tipoSolicitud" 
                    class="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/60 backdrop-blur-sm" 
                    required>
              <option value="">Seleccionar tipo</option>
              <option value="CAMBIO_POR_ROTURA">CAMBIO POR ROTURA</option>
              <option value="NUEVO_EQUIPO">EQUIPO NUEVO</option>
            </select>
          </div>
          <div class="md:col-span-2 space-y-2">
            <label class="block text-sm font-semibold text-gray-700">Tipo de Problema</label>
            <select v-model="form.motivoTipo" 
                    class="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/60 backdrop-blur-sm" 
                    required>
              <option value="">Seleccionar tipo de problema</option>
              <option v-for="tipo in tiposMotivo" :key="tipo" :value="tipo">{{ tipo }}</option>
            </select>
          </div>

          <div class="md:col-span-2 space-y-2" v-if="form.motivoTipo === 'OTRO' || form.motivoTipo">
            <label class="block text-sm font-semibold text-gray-700">
              {{ form.motivoTipo === 'OTRO' ? 'Descripción del problema' : 'Detalles adicionales (opcional)' }}
            </label>
            <textarea 
              v-model="form.motivo" 
              class="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/60 backdrop-blur-sm resize-none" 
              rows="4" 
              :placeholder="form.motivoTipo === 'OTRO' ? 'Describe detalladamente el problema...' : 'Agrega detalles adicionales si es necesario...'"
              :required="form.motivoTipo === 'OTRO'"
            ></textarea>
          </div>
          
          <div v-if="form.tipoSolicitud === 'NUEVO_EQUIPO'" class="space-y-3">
            <label class="block text-sm font-semibold text-gray-700">¿Necesitas línea nueva?</label>
            <div class="flex gap-4">
              <label class="flex items-center cursor-pointer group">
                <input v-model="form.necesitaLinea" type="radio" :value="true" class="sr-only" />
                <div class="relative">
                  <div :class="['w-6 h-6 rounded-full border-2 transition-all duration-200', 
                               form.necesitaLinea === true ? 'border-blue-500 bg-blue-500' : 'border-gray-300 group-hover:border-blue-300']">
                    <div v-if="form.necesitaLinea === true" class="absolute inset-1 bg-white rounded-full"></div>
                  </div>
                </div>
                <span class="ml-3 text-gray-700 group-hover:text-gray-900">Sí, necesito línea</span>
              </label>
              <label class="flex items-center cursor-pointer group">
                <input v-model="form.necesitaLinea" type="radio" :value="false" class="sr-only" />
                <div class="relative">
                  <div :class="['w-6 h-6 rounded-full border-2 transition-all duration-200', 
                               form.necesitaLinea === false ? 'border-blue-500 bg-blue-500' : 'border-gray-300 group-hover:border-blue-300']">
                    <div v-if="form.necesitaLinea === false" class="absolute inset-1 bg-white rounded-full"></div>
                  </div>
                </div>
                <span class="ml-3 text-gray-700 group-hover:text-gray-900">No necesito línea</span>
              </label>
            </div>
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">Fecha</label>
            <input v-model="form.fecha" 
                   type="date" 
                   class="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/60 backdrop-blur-sm" 
                   required />
          </div>
          <div class="md:col-span-2 flex justify-end items-center mt-6">
            <button 
              type="submit" 
              :disabled="loading"
              class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 transform hover:scale-105 transition-all duration-200 shadow-xl"
            >
              <svg v-if="loading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              {{ loading ? 'Enviando...' : 'Crear Solicitud' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Lista de mis solicitudes -->
      <div v-if="activeTab === 'solicitudes'" class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8">
        <div class="flex justify-between items-center mb-8">
          <div class="flex items-center gap-3">
            <div class="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Mis Solicitudes</h2>
              <p class="text-gray-600">Historial de todas tus solicitudes</p>
            </div>
          </div>
          <button @click="cargarMisSolicitudes" 
                  class="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-2xl text-sm font-semibold flex items-center gap-2 transform hover:scale-105 transition-all duration-200 shadow-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Actualizar
          </button>
        </div>

        <div v-if="loadingSolicitudes" class="text-center py-12">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mb-4">
            <svg class="animate-spin w-8 h-8 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p class="text-lg font-medium text-gray-700">Cargando solicitudes...</p>
          <p class="text-gray-500">Esto puede tomar unos segundos</p>
        </div>

        <div v-else-if="misSolicitudes.length === 0" class="text-center py-16">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mb-6">
            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No tienes solicitudes aún</h3>
          <p class="text-gray-500 mb-6">Crea tu primera solicitud usando el formulario de arriba</p>
          <div class="inline-flex items-center gap-2 text-blue-600 font-medium">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Crear primera solicitud
          </div>
        </div>

        <div v-else class="space-y-6">
          <div v-for="solicitud in misSolicitudes" :key="solicitud.id" 
               class="bg-white/60 backdrop-blur-sm border-2 border-white/50 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center gap-4">
                <div class="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900">Solicitud #{{ solicitud.id }}</h3>
                  <p class="text-gray-600 flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-4 0v4m-4 0h8m0 0V3m0 4h.01"></path>
                    </svg>
                    {{ solicitud.fecha }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <!-- Estado badge mejorado -->
                <span :class="{
                  'bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg': solicitud.estado === EstadoSolicitud.PENDIENTE,
                  'bg-gradient-to-r from-blue-400 to-indigo-400 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg': solicitud.estado === EstadoSolicitud.EN_PROCESO,
                  'bg-gradient-to-r from-green-400 to-emerald-400 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg': solicitud.estado === EstadoSolicitud.RESUELTA
                }">
                  {{ formatearEstado(solicitud.estado) }}
                </span>
                <!-- Botón PDF mejorado -->
                <button 
                  @click="descargarPDF(solicitud)"
                  class="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  title="Descargar PDF"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  PDF
                </button>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-4">
              <div class="bg-white/50 rounded-xl p-4">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                  </svg>
                  <span class="font-semibold text-gray-700">Tipo:</span>
                </div>
                <span class="text-gray-900 font-medium">{{ formatearTipoSolicitud(solicitud.tipoSolicitud) }}</span>
              </div>
              <div class="bg-white/50 rounded-xl p-4">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span class="font-semibold text-gray-700">Región:</span>
                </div>
                <span class="text-gray-900 font-medium">{{ formatearRegion(solicitud.region) }}</span>
              </div>
              <div class="bg-white/50 rounded-xl p-4">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  <span class="font-semibold text-gray-700">Necesita línea:</span>
                </div>
                <span class="text-gray-900 font-medium">{{ solicitud.necesitaLinea ? 'Sí' : 'No' }}</span>
              </div>
              <div class="bg-white/50 rounded-xl p-4">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span class="font-semibold text-gray-700">Reparto:</span>
                </div>
                <span class="text-gray-900 font-medium">{{ solicitud.usuario }}</span>
              </div>
            </div>
            
            <div class="bg-white/50 rounded-xl p-4">
              <div class="flex items-center gap-2 mb-3">
                <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                </svg>
                <span class="font-semibold text-gray-700">Motivo:</span>
              </div>
              <p class="text-gray-900 leading-relaxed">{{ solicitud.motivo }}</p>
            </div>
          </div>
        </div>
      </div>
    
      <!-- Mi Flota -->
      <div v-if="activeTab === 'mi-flota'" class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8">
        <div class="flex justify-between items-center mb-8">
          <div class="flex items-center gap-3">
            <div class="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Mi Flota</h2>
              <p class="text-gray-600">Usuarios de tu región</p>
            </div>
          </div>
          <button @click="cargarMiFlota" 
                  class="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-2xl text-sm font-semibold flex items-center gap-2 transform hover:scale-105 transition-all duration-200 shadow-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Actualizar
          </button>
        </div>

        <div v-if="loadingFlota" class="text-center py-12">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mb-4">
            <svg class="animate-spin w-8 h-8 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p class="text-lg font-medium text-gray-700">Cargando flota...</p>
          <p class="text-gray-500">Obteniendo información de usuarios</p>
        </div>

        <div v-else-if="miFlota.length === 0" class="text-center py-16">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mb-6">
            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No se encontraron usuarios en tu región</h3>
          <p class="text-gray-500">La flota de tu región está vacía o no tienes permisos para verla</p>
        </div>

        <div v-else class="bg-white/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/50">
          <!-- Estadísticas rápidas -->
          <div class="bg-gradient-to-r from-cyan-500 to-blue-500 p-6 text-white">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-lg font-semibold mb-1">Total de Usuarios</h3>
                <p class="text-3xl font-bold">{{ miFlota.length }}</p>
              </div>
              <div class="text-right">
                <p class="text-cyan-100">Con Celular Asignado</p>
                <p class="text-2xl font-bold">{{ miFlota.filter(u => u.celular).length }}</p>
              </div>
            </div>
          </div>
          
          <!-- Tabla mejorada -->
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50/80">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div class="flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      Reparto
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div class="flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      Región
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div class="flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                      </svg>
                      Zona
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div class="flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      Línea
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div class="flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                      </svg>
                      Celular
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200/50">
                <tr v-for="u in miFlota" :key="u.numReparto" 
                    class="hover:bg-blue-50/50 transition-colors duration-200 group">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {{ u.numReparto.toString().slice(-2) }}
                      </div>
                      <span class="text-sm font-semibold text-gray-900">{{ u.numReparto }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {{ u.region }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-700 font-medium">{{ u.zona }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span v-if="u.numeroLinea" class="inline-flex items-center gap-1 text-sm text-gray-900 font-medium">
                      <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {{ u.numeroLinea }}
                    </span>
                    <span v-else class="text-gray-400 italic text-sm">Sin línea</span>
                  </td>
                  <td class="px-6 py-4">
                    <div v-if="u.celular" class="flex items-center gap-2">
                      <div class="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg flex items-center justify-center">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <div>
                        <p class="text-sm font-semibold text-gray-900">{{ u.celular.marca }} {{ u.celular.modelo }}</p>
                        <p class="text-xs text-gray-500">{{ u.celular.numeroSerie || 'S/N no disponible' }}</p>
                      </div>
                    </div>
                    <div v-else class="flex items-center gap-2">
                      <div class="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </div>
                      <span class="text-gray-400 italic text-sm">Sin asignar</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { solicitudService, EstadoSolicitud } from '@/services/solicitudService';
import { authService } from '@/services/authService';
import { excelService } from '@/services/excelService';
import { pdfService } from '@/services/pdfService';
import { obtenerMiFlota, obtenerMisSolicitudes } from '@/services/usuarioService';

// Funciones helper para formatear enums
const formatearTipoSolicitud = (tipo) => {
  switch (tipo) {
    case 'CAMBIO_POR_ROTURA':
      return 'Cambio por rotura';
    case 'NUEVO_EQUIPO':
      return 'Equipo nuevo';
    default:
      return tipo?.replace(/_/g, ' ') || 'N/A';
  }
};

const formatearRegion = (region) => {
  switch (region) {
    case 'LA_PLATA':
      return 'La Plata';
    default:
      return region?.replace(/_/g, ' ') || 'N/A';
  }
};

const formatearEstado = (estado) => {
  switch (estado) {
    case 'PENDIENTE':
      return 'Pendiente';
    case 'EN_PROCESO':
      return 'En proceso';
    case 'RESUELTA':
      return 'Resuelta';
    default:
      return estado?.replace(/_/g, ' ') || 'Pendiente';
  }
};

// Tabs
const activeTab = ref('solicitudes'); // 'solicitudes' | 'mi-flota'

// Estado
const misSolicitudes = ref([]);
const loading = ref(false);
const loadingSolicitudes = ref(false);
const loadingFlota = ref(false);
const miFlota = ref([]);
const flotaCargada = ref(false);
const notification = reactive({ show: false, type: 'success', message: '' });

// Formulario - inicialización condicional según rol
const initializeForm = () => {
  const baseForm = {
    id: '',
    nomSolicitante: '',
    fecha: new Date().toISOString().split('T')[0],
    usuario: '',
    tipoSolicitud: '',
    motivoTipo: '',
    motivo: '',
    necesitaLinea: false
  };
  
  // Solo incluir región si es admin
  if (authService.isAdmin()) {
    baseForm.region = '';
  }
  
  return baseForm;
};

const form = reactive(initializeForm());

// Opciones para el tipo de motivo
const tiposMotivo = [
  'MODULO ROTO',
  'BATERIA',
  'LENTITUD', 
  'NO PRENDE',
  'OTRO'
];

// Usuario actual (esto vendría de tu sistema de autenticación)
const usuarioActual = ref(''); // Se debe setear con el usuario logueado

// Función para mostrar notificación con auto-ocultar
const mostrarNotificacion = (mensaje, tipo = 'success') => {
  notification.message = mensaje;
  notification.type = tipo;
  notification.show = true;
  setTimeout(() => {
    notification.show = false;
  }, 4000);
};

// Crear solicitud
const crearSolicitud = async () => {
  try {
    loading.value = true;
    
    // Debug de autenticación
    console.log('Auth header:', authService.getAuthHeader());
    console.log('Is authenticated:', authService.isAuthenticated());
    console.log('Current user:', authService.getCurrentUser());
    
    // Generar ID único
    form.id = `S${Date.now()}`;
    
    // Preparar payload
    const payload = {
      ...form,
      motivo: form.motivoTipo === 'OTRO' ? form.motivo : `${form.motivoTipo}${form.motivo ? ' - ' + form.motivo : ''}`,
      necesitaLinea: form.tipoSolicitud === 'NUEVO_EQUIPO' ? form.necesitaLinea : false,
      estado: EstadoSolicitud.PENDIENTE
    };

    // Si no es admin, la región se maneja automáticamente por el backend
    // (el backend debería usar la región del usuario autenticado)
    if (!authService.isAdmin()) {
      delete payload.region;
    }
    
    console.log('Creando solicitud:', payload);
    await solicitudService.crear(payload);
    
    mostrarNotificacion('¡Solicitud creada exitosamente! Recibirás una respuesta pronto.');
    
    // Limpiar formulario
    const formReset = {
      id: '',
      nomSolicitante: '',
      fecha: new Date().toISOString().split('T')[0],
      usuario: '',
      tipoSolicitud: '',
      motivoTipo: '',
      motivo: '',
      necesitaLinea: false
    };
    
    // Solo incluir región si es admin
    if (authService.isAdmin()) {
      formReset.region = '';
    }
    
    Object.assign(form, formReset);
    
    // Recargar mis solicitudes
    cargarMisSolicitudes();
    
  } catch (error) {
    console.error('Error al crear solicitud:', error);
    mostrarNotificacion('Error al crear la solicitud. Intenta nuevamente.', 'error');
  } finally {
    loading.value = false;
  }
};

// Cargar solicitudes del usuario actual
const cargarMisSolicitudes = async () => {
  try {
    loadingSolicitudes.value = true;
    
    console.log('Cargando mis solicitudes...');
    console.log('Auth header:', authService.getAuthHeader());
    
    // Usar el nuevo endpoint específico para el usuario autenticado
    const response = await obtenerMisSolicitudes();
    misSolicitudes.value = response.data || [];
    
    // Ordenar por fecha de creación descendente (más recientes primero)
    misSolicitudes.value.sort((a, b) => {
      // Si tienen fecha, compararla
      if (a.fecha && b.fecha) {
        return new Date(b.fecha) - new Date(a.fecha);
      }
      // Si tienen ID, usar el ID (asumiendo que IDs más altos = más recientes)
      if (a.id && b.id) {
        return b.id - a.id;
      }
      return 0;
    });
    
    console.log('Mis solicitudes ordenadas:', misSolicitudes.value);
    
  } catch (error) {
    console.error('Error al cargar solicitudes:', error);
    
    if (error.response?.status === 403) {
      mostrarNotificacion('No tienes permisos para ver tus solicitudes', 'error');
    } else if (error.response?.status === 404) {
      // Fallback al método anterior si el endpoint no existe
      console.log('Endpoint /api/usuarios/me/solicitudes no disponible, usando método anterior');
      try {
        const response = await solicitudService.obtenerTodas();
        // Filtrar por usuario actual si no hay endpoint específico
        misSolicitudes.value = response.data || [];
        
        // Ordenar por fecha de creación descendente (más recientes primero)
        misSolicitudes.value.sort((a, b) => {
          if (a.fecha && b.fecha) {
            return new Date(b.fecha) - new Date(a.fecha);
          }
          if (a.id && b.id) {
            return b.id - a.id;
          }
          return 0;
        });
      } catch (fallbackError) {
        console.error('Error en fallback:', fallbackError);
        mostrarNotificacion('Error al cargar tus solicitudes', 'error');
      }
    } else {
      mostrarNotificacion('Error al cargar tus solicitudes', 'error');
    }
  } finally {
    loadingSolicitudes.value = false;
  }
};

// Descargar PDF
const descargarPDF = async (solicitud) => {
  try {
    console.log('Generando PDF para solicitud:', solicitud.id);
    await pdfService.generarPDFSolicitud(solicitud);
    mostrarNotificacion('PDF descargado correctamente');
  } catch (error) {
    console.error('Error al generar PDF:', error);
    mostrarNotificacion('Error al generar el PDF', 'error');
  }
};

// Cargar al montar
onMounted(() => {
  // Aquí deberías obtener el usuario actual del sistema de autenticación
  // usuarioActual.value = obtenerUsuarioActual();
  
  cargarMisSolicitudes();
});

// Cargar Mi Flota
const cargarMiFlota = async () => {
  try {
    loadingFlota.value = true;
    console.log('Cargando mi flota...');
    console.log('Auth header:', authService.getAuthHeader());
    console.log('Current user:', authService.getCurrentUser());
    
    const resp = await obtenerMiFlota();
    miFlota.value = resp.data || [];
    flotaCargada.value = true;
    console.log('Mi flota cargada:', miFlota.value);
  } catch (error) {
    console.error('Error al cargar mi flota:', error);
    
    if (error.response?.status === 403) {
      mostrarNotificacion('No tienes permisos para ver la flota de tu región. Esta función podría estar disponible solo para ciertos roles.', 'error');
    } else if (error.response?.status === 404) {
      mostrarNotificacion('El servicio de flota no está disponible. Contacta al administrador.', 'error');
    } else {
      mostrarNotificacion('Error al cargar la flota de tu región', 'error');
    }
    
    miFlota.value = [];
  } finally {
    loadingFlota.value = false;
  }
};
</script>
