<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50">
    <!-- Pantalla de carga de inicialización del sistema -->
    <!-- Ya no se muestra porque la inicialización se hace antes de montar la app -->

    <!-- Pantalla de carga post-login -->
    <div v-if="isLoading" class="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-blue-900/95 via-purple-900/95 to-cyan-900/95 backdrop-blur-xl">
      <div class="text-center">
        <!-- Spinner principal -->
        <div class="relative mb-8">
          <div class="w-24 h-24 border-4 border-white/20 rounded-full animate-spin">
            <div class="absolute top-0 left-0 w-24 h-24 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
          </div>
          <div class="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-blue-400 rounded-full animate-ping opacity-30"></div>
        </div>
        
        <!-- Texto con animación -->
        <div class="text-white text-center">
          <h3 class="text-2xl font-bold mb-2 animate-pulse">¡Bienvenido de vuelta!</h3>
          <p class="text-blue-200 font-medium mb-6">Preparando tu área de trabajo...</p>
          
          <!-- Elementos que se están "cargando" -->
          <div class="space-y-2 text-sm text-white/80">
            <div class="flex items-center justify-center gap-2">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Verificando permisos</span>
            </div>
            <div class="flex items-center justify-center gap-2">
              <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-200"></div>
              <span>Cargando datos</span>
            </div>
            <div class="flex items-center justify-center gap-2">
              <div class="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-500"></div>
              <span>Configurando interfaz</span>
            </div>
          </div>
        </div>
        
        <!-- Barra de progreso animada -->
        <div class="mt-8 w-64 mx-auto">
          <div class="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 rounded-full animate-[loading_4s_ease-in-out_forwards]"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pantalla de carga para logout -->
    <div v-if="isLoggingOut" class="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-blue-900/90 via-purple-900/90 to-cyan-900/90 backdrop-blur-xl">
      <div class="text-center">
        <!-- Spinner principal -->
        <div class="relative mb-8">
          <div class="w-20 h-20 border-4 border-white/20 rounded-full animate-spin">
            <div class="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
          </div>
          <div class="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-400 rounded-full animate-ping opacity-20"></div>
        </div>
        
        <!-- Texto con animación -->
        <div class="text-white text-center">
          <h3 class="text-2xl font-bold mb-2 animate-pulse">{{ logoutMessage }}</h3>
          <p class="text-blue-200 font-medium">Por favor espera...</p>
        </div>
        
        <!-- Barra de progreso animada -->
        <div class="mt-8 w-64 mx-auto">
          <div class="h-1 bg-white/20 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 rounded-full animate-pulse" 
                 :class="logoutProgress"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Layout principal -->
    <div v-if="isAuthenticated && !isLoading" class="min-h-screen">
      <!-- Container del sidebar con overlay -->
      <div v-if="sidebarOpen" class="fixed inset-0 z-[90]">
        <!-- Overlay de fondo -->
        <div 
          class="absolute inset-0 bg-gray-900/50" 
          @click="sidebarOpen = false"
        ></div>
        
        <!-- Sidebar desplegable -->
        <aside class="absolute inset-y-0 left-0 w-80 z-10">
          <!-- Contenido del sidebar -->
          <div class="relative flex flex-col h-full bg-white/90 backdrop-blur-xl shadow-2xl border-r border-white/30 pointer-events-auto">
          <!-- Header del sidebar simplificado -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-white/30">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              <h2 class="text-lg font-bold text-gray-800">Menú de Navegación</h2>
            </div>
            <!-- Botón cerrar (siempre visible) -->
            <button 
              @click="sidebarOpen = false"
              class="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-white/60 transition-colors hover:scale-105"
              title="Cerrar menú"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Navigation Links en sidebar -->
          <div class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <!-- Link de Inicio -->
            <RouterLink 
              to="/" 
              @click="sidebarOpen = false"
              class="group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300"
              :class="$route.name === 'Home' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-[1.02]' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-md hover:scale-[1.01]'"
            >
              <div class="p-2 rounded-xl transition-colors" :class="$route.name === 'Home' ? 'bg-white/20' : 'bg-blue-100 group-hover:bg-blue-200'">
                <svg class="w-5 h-5" :class="$route.name === 'Home' ? 'text-white' : 'text-blue-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
              </div>
              <span>Inicio</span>
            </RouterLink>
            
            <!-- Separador para admin -->
            <div v-if="isAdmin" class="pt-4">
              <div class="px-4 mb-3">
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.012 3H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Administración
                </div>
              </div>

              <!-- Admin Links -->
              <RouterLink 
                to="/celulares" 
                @click="sidebarOpen = false"
                class="group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300"
                :class="$route.name === 'Celulares' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg transform scale-[1.02]' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-md hover:scale-[1.01]'"
              >
                <div class="p-2 rounded-xl transition-colors" :class="$route.name === 'Celulares' ? 'bg-white/20' : 'bg-emerald-100 group-hover:bg-emerald-200'">
                  <svg class="w-5 h-5" :class="$route.name === 'Celulares' ? 'text-white' : 'text-emerald-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z"></path>
                  </svg>
                </div>
                <span>Celulares</span>
              </RouterLink>
              
              <RouterLink 
                to="/usuarios" 
                @click="sidebarOpen = false"
                class="group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300"
                :class="$route.name === 'Usuarios' 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-[1.02]' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-md hover:scale-[1.01]'"
              >
                <div class="p-2 rounded-xl transition-colors" :class="$route.name === 'Usuarios' ? 'bg-white/20' : 'bg-orange-100 group-hover:bg-orange-200'">
                  <svg class="w-5 h-5" :class="$route.name === 'Usuarios' ? 'text-white' : 'text-orange-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
                <span>Usuarios</span>
              </RouterLink>
              
              <RouterLink 
                to="/solicitudes" 
                @click="sidebarOpen = false"
                class="group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300"
                :class="$route.name === 'Solicitudes' 
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg transform scale-[1.02]' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-md hover:scale-[1.01]'"
              >
                <div class="p-2 rounded-xl transition-colors" :class="$route.name === 'Solicitudes' ? 'bg-white/20' : 'bg-pink-100 group-hover:bg-pink-200'">
                  <svg class="w-5 h-5" :class="$route.name === 'Solicitudes' ? 'text-white' : 'text-pink-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                  </svg>
                </div>
                <span>Solicitudes</span>
              </RouterLink>

              <RouterLink 
                to="/proveedores" 
                @click="sidebarOpen = false"
                class="group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300"
                :class="$route.name === 'Proveedores' 
                  ? 'bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white shadow-lg transform scale-[1.02]' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-md hover:scale-[1.01]'"
              >
                <div class="p-2 rounded-xl transition-colors" :class="$route.name === 'Proveedores' ? 'bg-white/20' : 'bg-fuchsia-100 group-hover:bg-fuchsia-200'">
                  <svg class="w-5 h-5" :class="$route.name === 'Proveedores' ? 'text-white' : 'text-fuchsia-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h6l7 10h5M3 7l4 12h12"></path>
                  </svg>
                </div>
                <span>Proveedores</span>
              </RouterLink>

              <RouterLink 
                to="/ordenes-reparacion" 
                @click="sidebarOpen = false"
                class="group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300"
                :class="$route.name === 'OrdenesReparacion' 
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg transform scale-[1.02]' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-md hover:scale-[1.01]'"
              >
                <div class="p-2 rounded-xl transition-colors" :class="$route.name === 'OrdenesReparacion' ? 'bg-white/20' : 'bg-orange-100 group-hover:bg-orange-200'">
                  <svg class="w-5 h-5" :class="$route.name === 'OrdenesReparacion' ? 'text-white' : 'text-orange-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-6l3-3 3 3v6m5 4H4" />
                  </svg>
                </div>
                <span>Órdenes</span>
              </RouterLink>
              
              <RouterLink 
                to="/estadisticas" 
                @click="sidebarOpen = false"
                class="group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300"
                :class="$route.name === 'Estadisticas' 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transform scale-[1.02]' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-md hover:scale-[1.01]'"
              >
                <div class="p-2 rounded-xl transition-colors" :class="$route.name === 'Estadisticas' ? 'bg-white/20' : 'bg-indigo-100 group-hover:bg-indigo-200'">
                  <svg class="w-5 h-5" :class="$route.name === 'Estadisticas' ? 'text-white' : 'text-indigo-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <span>Estadísticas</span>
            </RouterLink>
            
            <RouterLink 
              to="/admin/usuarios" 
              @click="sidebarOpen = false"
              class="group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300"
              :class="$route.name === 'AdminUsuarios' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-[1.02]' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-md hover:scale-[1.01]'"
            >
              <div class="p-2 rounded-xl transition-colors" :class="$route.name === 'AdminUsuarios' ? 'bg-white/20' : 'bg-purple-100 group-hover:bg-purple-200'">
                <svg class="w-5 h-5" :class="$route.name === 'AdminUsuarios' ? 'text-white' : 'text-purple-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
              <span>Admin</span>
            </RouterLink>
            </div>
            
            <!-- User accessible links - solo para usuarios normales -->
            <div v-if="!isAdmin" class="px-4 space-y-2">
              <div class="mb-3">
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Usuario
                </div>
              </div>

              <RouterLink 
                to="/mis-solicitudes" 
                @click="sidebarOpen = false"
                class="group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300"
                :class="$route.name === 'MisSolicitudes' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg transform scale-[1.02]' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-md hover:scale-[1.01]'"
              >
                <div class="p-2 rounded-xl transition-colors" :class="$route.name === 'MisSolicitudes' ? 'bg-white/20' : 'bg-cyan-100 group-hover:bg-cyan-200'">
                  <svg class="w-5 h-5" :class="$route.name === 'MisSolicitudes' ? 'text-white' : 'text-cyan-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <span>Mis Solicitudes</span>
              </RouterLink>
            </div>
          </div>

        <!-- User info y logout en la parte inferior del sidebar -->
        <div class="border-t border-white/30 p-4">
          <!-- User info card -->
          <div class="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-4 text-white mb-4">
            <div class="flex items-center space-x-3">
              <div class="relative">
                <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <span class="text-white font-bold text-lg">
                    {{ (currentUser?.name || 'U').charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-bold text-white truncate">{{ currentUser?.name || 'Usuario' }}</div>
                <div class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                  <div class="text-xs font-medium text-white/80 capitalize">{{ currentUser?.role || 'user' }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Logout button -->
          <button
            @click="logout"
            class="w-full bg-white/60 backdrop-blur-sm hover:bg-red-50 border border-white/40 hover:border-red-200 text-gray-600 hover:text-red-600 p-3 rounded-xl transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 font-semibold"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Cerrar sesión
          </button>
        </div>
        </div>
        </aside>
      </div>

      <!-- Top bar con botón de menú hamburguesa -->
      <header class="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/30 sticky top-0 z-40">
        <div class="flex items-center justify-between px-4 py-4">
          <button 
            @click="toggleSidebar"
            class="p-3 rounded-2xl text-gray-600 hover:text-gray-900 hover:bg-white/60 transition-colors shadow-lg hover:shadow-xl"
            :title="sidebarOpen ? 'Cerrar menú' : 'Abrir menú'"
          >
            <svg class="w-6 h-6 transition-transform duration-300" :class="{ 'rotate-90': sidebarOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!sidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div class="flex items-center">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl blur opacity-20"></div>
              <div class="relative bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-lg">
                <img :src="logo" alt="LogoCellControl" class="h-8 w-auto object-contain" />
              </div>
            </div>
            <div class="ml-3 hidden sm:block">
              <h1 class="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CellControl
              </h1>
              <p class="text-xs text-gray-500 font-medium">Sistema de Gestión</p>
            </div>
          </div>
          
          <!-- User info compacto en header -->
          <div class="flex items-center gap-3">
            <!-- Panel de alertas simple - solo para admins -->
            <AlertasSimple v-if="isAuthenticated && isAdmin" />
            
            <div class="hidden md:flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-2xl px-3 py-2 border border-white/40">
              <div class="relative">
                <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-md">
                  <span class="text-white font-semibold text-xs">
                    {{ (currentUser?.name || 'U').charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-white"></div>
              </div>
              <div class="text-left">
                <p class="text-xs font-semibold text-gray-900 leading-tight">{{ currentUser?.name || 'Usuario' }}</p>
                <p class="text-xs text-gray-600 capitalize">{{ currentUser?.role || 'user' }}</p>
              </div>
            </div>
            
            <!-- Avatar solo en móvil -->
            <div class="md:hidden">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <span class="text-white font-bold text-sm">
                  {{ (currentUser?.name || 'U').charAt(0).toUpperCase() }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Área de contenido principal -->
      <main class="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-cyan-50/50">
        <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <RouterView />
        </div>
      </main>
    </div>

    <!-- Layout para usuarios no autenticados -->
    <div v-else>
      <RouterView />
    </div>

    <!-- Footer moderno - excluido del login -->
    <footer v-if="isAuthenticated" class="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="w-full h-full" style="background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0); background-size: 40px 40px;"></div>
      </div>
      
      <!-- Geometric decorations -->
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Company Info -->
          <div class="md:col-span-2">
            <div class="flex items-center gap-3 mb-6">
              <div class="relative">
                <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-40"></div>
                <div class="relative bg-white/10 backdrop-blur-sm rounded-2xl p-3">
                  <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z"></path>
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  CellControl
                </h3>
                <p class="text-blue-200 text-sm font-medium">Sistema de Gestión Inteligente</p>
              </div>
            </div>
            <p class="text-gray-300 text-sm leading-relaxed mb-6 max-w-md">
              Plataforma integral para la administración eficiente de dispositivos móviles, 
              control de usuarios y seguimiento de movimientos en tiempo real.
            </p>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2 text-green-400">
                <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span class="text-sm font-medium">Sistema Activo</span>
              </div>
              <div class="text-gray-400 text-sm">
                Versión 2.0 - {{ new Date().getFullYear() }}
              </div>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              Accesos Rápidos
            </h4>
            <ul class="space-y-3">
              <li>
                <RouterLink to="/" class="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  Panel Principal
                </RouterLink>
              </li>
              <li v-if="isAdmin">
                <RouterLink to="/celulares" class="text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  Gestión de Dispositivos
                </RouterLink>
              </li>
              <li v-if="isAdmin">
                <RouterLink to="/estadisticas" class="text-gray-300 hover:text-purple-400 transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  Reportes y Analytics
                </RouterLink>
              </li>
              <li v-if="isAdmin">
                <RouterLink to="/proveedores" class="text-gray-300 hover:text-fuchsia-400 transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  Proveedores
                </RouterLink>
              </li>
              <li v-if="isAdmin">
                <RouterLink to="/ordenes-reparacion" class="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                  Órdenes
                </RouterLink>
              </li>
              <li v-if="!isAdmin">
                <RouterLink to="/mis-solicitudes" class="text-gray-300 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  Mis Solicitudes
                </RouterLink>
              </li>
            </ul>
          </div>

          <!-- User Info -->
          <div>
            <h4 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Sesión Actual
            </h4>
            <div class="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <span class="text-white font-bold text-sm">
                    {{ (currentUser?.name || 'U').charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <p class="text-white font-medium text-sm">{{ currentUser?.name || 'Usuario' }}</p>
                  <div class="flex items-center gap-2">
                    <div class="w-1.5 h-1.5 rounded-full" :class="isAdmin ? 'bg-red-400' : 'bg-blue-400'"></div>
                    <p class="text-gray-400 text-xs capitalize">{{ currentUser?.role || 'user' }}</p>
                  </div>
                </div>
              </div>
              <div class="text-gray-400 text-xs">
                <div class="flex items-center justify-between">
                  <span>Última actividad:</span>
                  <span>Ahora</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Section -->
        <div class="border-t border-white/10 mt-12 pt-8">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="text-gray-400 text-sm text-center md:text-left">
              <p>© {{ new Date().getFullYear() }} CellControl - Desarrollado por Gonzalo Wiñazki</p>
            </div>
            <div class="flex items-center gap-6">
              <div class="flex items-center gap-2 text-gray-400 text-sm">
                <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Seguro y Confiable
              </div>
              <div class="flex items-center gap-2 text-gray-400 text-sm">
                <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Rendimiento Óptimo
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/authService';
import AlertasSimple from '@/components/AlertasSimple.vue';
import logo from '@/assets/LogoCellControl.png';

const router = useRouter();
const mobileMenuOpen = ref(false);
const sidebarOpen = ref(false);

// Estados para la pantalla de logout
const isLoggingOut = ref(false);
const isLoading = ref(false); // Estado de carga post-login - iniciado en false
const logoutMessage = ref('Cerrando sesión...');
const logoutProgress = ref('w-0');

// Usar los refs reactivos del authService - PRIMERO
const currentUser = computed(() => authService.user.value);
const isAuthenticated = computed(() => !!authService.authenticated.value);
const isInitializingAuth = computed(() => authService.initializing.value);
const isAdmin = computed(() => authService.isAdmin());

// Función para toggle del sidebar
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

// Cerrar sidebar con tecla Escape
const handleKeyPress = (event) => {
  if (event.key === 'Escape' && sidebarOpen.value) {
    sidebarOpen.value = false;
  }
};

// Cerrar sidebar automáticamente al cambiar de página
watch(() => router.currentRoute.value.path, () => {
  sidebarOpen.value = false;
});

// Función para mostrar loading post-login con más tiempo
const showPostLoginLoading = () => {
  isLoading.value = true;
  
  // Simular carga de recursos con más tiempo
  setTimeout(() => {
    isLoading.value = false;
  }, 2000); // 4 segundos de loading para dar más tiempo
};

// Watcher para detectar cambios en autenticación - DESPUÉS de declarar isAuthenticated
watch(isAuthenticated, (newValue, oldValue) => {
  // Solo mostrar loading si cambió de false a true (recién se logueó)
  if (newValue && !oldValue) {
    showPostLoginLoading();
  }
});

// Método para manejar actualizaciones de alertas
const onAlertaActualizada = () => {
  // Aquí podrías agregar lógica adicional cuando se actualice una alerta
  // Por ejemplo, refrescar algún contador global o emitir eventos
  console.log('Alerta actualizada');
};

const logout = async () => {
  console.log('🚪 Iniciando proceso de logout...');
  
  // Limpiar sesión INMEDIATAMENTE para evitar requests sin autenticación
  authService.logout();
  console.log('✅ Sesión cerrada inmediatamente');
  
  // Iniciar pantalla de carga
  isLoggingOut.value = true;
  logoutMessage.value = 'Cerrando sesión...';
  logoutProgress.value = 'w-1/4';
  
  try {
    // Simular progreso con menos tiempo
    setTimeout(() => {
      logoutMessage.value = 'Limpiando datos...';
      logoutProgress.value = 'w-1/2';
    }, 300);
    
    setTimeout(() => {
      logoutMessage.value = 'Finalizando sesión...';
      logoutProgress.value = 'w-3/4';
    }, 600);
    
    setTimeout(() => {
      logoutMessage.value = '¡Hasta luego! 👋';
      logoutProgress.value = 'w-full';
    }, 900);
    
    // Redireccionar rápidamente
    setTimeout(() => {
      isLoggingOut.value = false;
      router.push('/login');
    }, 1200);
    
  } catch (error) {
    console.error('Error durante logout:', error);
    // En caso de error, continuar con logout normal
    isLoggingOut.value = false;
    router.push('/login');
  }
};

onMounted(() => {
  console.log('🚀 App.vue montado');
  
  // Los router guards ahora manejan toda la lógica de redirección
  // No necesitamos verificación manual aquí
  
  // Asegurar que el sidebar inicie cerrado
  sidebarOpen.value = false;
  
  // Agregar event listener para cerrar sidebar con Escape
  document.addEventListener('keydown', handleKeyPress);
});

// Limpiar event listener al desmontar
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyPress);
});
</script>

<style scoped>
@keyframes loading {
  0% {
    width: 0%;
  }
  25% {
    width: 30%;
  }
  50% {
    width: 60%;
  }
  75% {
    width: 85%;
  }
  100% {
    width: 100%;
  }
}

/* Transiciones suaves para el layout */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>