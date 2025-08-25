<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50">
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

    <!-- Navigation moderna -->
    <nav v-if="isAuthenticated" class="bg-white/80 backdrop-blur-xl shadow-xl border-b border-white/30 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-20">
          <div class="flex items-center">
            <!-- Logo mejorado -->
            <div class="flex-shrink-0 flex items-center mr-8">
              <div class="relative">
                <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-20"></div>
                <div class="relative bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
                  <img :src="logo" alt="LogoCellControl" class="h-10 w-auto object-contain" />
                </div>
              </div>
              <div class="ml-3 hidden sm:block">
                <h1 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CellControl
                </h1>
                <p class="text-xs text-gray-500 font-medium">Gestión Inteligente</p>
              </div>
            </div>
            
            <!-- Navigation Links modernos -->
            <div class="hidden lg:flex lg:space-x-2">
              <RouterLink 
                to="/" 
                class="group relative px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center gap-2"
                :class="$route.name === 'Home' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-md'"
              >
                <div class="p-1.5 rounded-xl" :class="$route.name === 'Home' ? 'bg-white/20' : 'bg-blue-100 group-hover:bg-blue-200'">
                  <svg class="w-4 h-4" :class="$route.name === 'Home' ? 'text-white' : 'text-blue-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                </div>
                Inicio
              </RouterLink>
              
              <!-- Admin only links -->
              <template v-if="isAdmin">
                <RouterLink 
                  to="/celulares" 
                  class="group relative px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center gap-2"
                  :class="$route.name === 'Celulares' 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-md'"
                >
                  <div class="p-1.5 rounded-xl" :class="$route.name === 'Celulares' ? 'bg-white/20' : 'bg-emerald-100 group-hover:bg-emerald-200'">
                    <svg class="w-4 h-4" :class="$route.name === 'Celulares' ? 'text-white' : 'text-emerald-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z"></path>
                    </svg>
                  </div>
                  Celulares
                </RouterLink>
                
                <RouterLink 
                  to="/usuarios" 
                  class="group relative px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center gap-2"
                  :class="$route.name === 'Usuarios' 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-md'"
                >
                  <div class="p-1.5 rounded-xl" :class="$route.name === 'Usuarios' ? 'bg-white/20' : 'bg-orange-100 group-hover:bg-orange-200'">
                    <svg class="w-4 h-4" :class="$route.name === 'Usuarios' ? 'text-white' : 'text-orange-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                  </div>
                  Usuarios
                </RouterLink>
                
                <RouterLink 
                  to="/solicitudes" 
                  class="group relative px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center gap-2"
                  :class="$route.name === 'Solicitudes' 
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-md'"
                >
                  <div class="p-1.5 rounded-xl" :class="$route.name === 'Solicitudes' ? 'bg-white/20' : 'bg-pink-100 group-hover:bg-pink-200'">
                    <svg class="w-4 h-4" :class="$route.name === 'Solicitudes' ? 'text-white' : 'text-pink-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                    </svg>
                  </div>
                  Solicitudes
                </RouterLink>
                
                <RouterLink 
                  to="/estadisticas" 
                  class="group relative px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center gap-2"
                  :class="$route.name === 'Estadisticas' 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-md'"
                >
                  <div class="p-1.5 rounded-xl" :class="$route.name === 'Estadisticas' ? 'bg-white/20' : 'bg-indigo-100 group-hover:bg-indigo-200'">
                    <svg class="w-4 h-4" :class="$route.name === 'Estadisticas' ? 'text-white' : 'text-indigo-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  Estadísticas
                </RouterLink>
              </template>
              
              <!-- User accessible links -->
              <RouterLink 
                to="/mis-solicitudes" 
                class="group relative px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center gap-2"
                :class="$route.name === 'MisSolicitudes' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-md'"
              >
                <div class="p-1.5 rounded-xl" :class="$route.name === 'MisSolicitudes' ? 'bg-white/20' : 'bg-cyan-100 group-hover:bg-cyan-200'">
                  <svg class="w-4 h-4" :class="$route.name === 'MisSolicitudes' ? 'text-white' : 'text-cyan-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                Mis Solicitudes
              </RouterLink>
            </div>
          </div>
          
          <!-- User Menu más sutil -->
          <div class="hidden lg:flex lg:items-center lg:space-x-3">
            <!-- User info compacto -->
            <div class="flex items-center space-x-3">
              <!-- Avatar y info minimalista -->
              <div class="group relative">
                <div class="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/40 hover:bg-white/80 hover:shadow-lg transition-all duration-300">
                  <div class="relative">
                    <div class="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                      <span class="text-white font-semibold text-sm">
                        {{ (currentUser?.name || 'U').charAt(0).toUpperCase() }}
                      </span>
                    </div>
                    <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div class="text-left">
                    <p class="text-sm font-semibold text-gray-900 leading-tight">{{ currentUser?.name || 'Usuario' }}</p>
                    <div class="flex items-center gap-1.5">
                      <div class="w-1.5 h-1.5 rounded-full" :class="isAdmin ? 'bg-red-400' : 'bg-blue-400'"></div>
                      <p class="text-xs text-gray-600 font-medium capitalize">{{ currentUser?.role || 'user' }}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Logout button compacto -->
              <button
                @click="logout"
                class="group bg-white/60 backdrop-blur-sm hover:bg-red-50 border border-white/40 hover:border-red-200 text-gray-600 hover:text-red-600 p-2.5 rounded-xl transition-all duration-300 hover:shadow-lg"
                title="Cerrar sesión"
              >
                <svg class="w-5 h-5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Mobile menu button modernizado -->
          <div class="lg:hidden flex items-center">
            <button @click="mobileMenuOpen = !mobileMenuOpen" 
                    class="group relative bg-white/70 backdrop-blur-lg p-3 rounded-2xl text-gray-600 hover:text-gray-900 hover:bg-white/90 transition-all duration-300 shadow-lg">
              <svg class="h-6 w-6 transition-transform duration-300" :class="{ 'rotate-90': mobileMenuOpen }" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mobile menu modernizado -->
      <div v-if="mobileMenuOpen" class="lg:hidden border-t border-white/30">
        <div class="bg-white/60 backdrop-blur-xl">
          <div class="px-4 py-6 space-y-3">
            <RouterLink to="/" 
                        class="group flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-semibold transition-all duration-300 hover:bg-white/80 hover:shadow-md"
                        :class="$route.name === 'Home' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' : 'text-gray-700'"
                        @click="mobileMenuOpen = false">
              <div class="p-2 rounded-xl" :class="$route.name === 'Home' ? 'bg-white/20' : 'bg-blue-100'">
                <svg class="w-5 h-5" :class="$route.name === 'Home' ? 'text-white' : 'text-blue-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
              </div>
              Inicio
            </RouterLink>
            
            <!-- Admin only mobile links -->
            <template v-if="isAdmin">
              <RouterLink to="/celulares" 
                          class="group flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-semibold transition-all duration-300 hover:bg-white/80 hover:shadow-md"
                          :class="$route.name === 'Celulares' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' : 'text-gray-700'"
                          @click="mobileMenuOpen = false">
                <div class="p-2 rounded-xl" :class="$route.name === 'Celulares' ? 'bg-white/20' : 'bg-emerald-100'">
                  <svg class="w-5 h-5" :class="$route.name === 'Celulares' ? 'text-white' : 'text-emerald-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z"></path>
                  </svg>
                </div>
                Celulares
              </RouterLink>
              <RouterLink to="/usuarios" 
                          class="group flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-semibold transition-all duration-300 hover:bg-white/80 hover:shadow-md"
                          :class="$route.name === 'Usuarios' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' : 'text-gray-700'"
                          @click="mobileMenuOpen = false">
                <div class="p-2 rounded-xl" :class="$route.name === 'Usuarios' ? 'bg-white/20' : 'bg-orange-100'">
                  <svg class="w-5 h-5" :class="$route.name === 'Usuarios' ? 'text-white' : 'text-orange-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
                Usuarios
              </RouterLink>
              <RouterLink to="/solicitudes" 
                          class="group flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-semibold transition-all duration-300 hover:bg-white/80 hover:shadow-md"
                          :class="$route.name === 'Solicitudes' ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg' : 'text-gray-700'"
                          @click="mobileMenuOpen = false">
                <div class="p-2 rounded-xl" :class="$route.name === 'Solicitudes' ? 'bg-white/20' : 'bg-pink-100'">
                  <svg class="w-5 h-5" :class="$route.name === 'Solicitudes' ? 'text-white' : 'text-pink-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                  </svg>
                </div>
                Solicitudes
              </RouterLink>
              <RouterLink to="/estadisticas" 
                          class="group flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-semibold transition-all duration-300 hover:bg-white/80 hover:shadow-md"
                          :class="$route.name === 'Estadisticas' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' : 'text-gray-700'"
                          @click="mobileMenuOpen = false">
                <div class="p-2 rounded-xl" :class="$route.name === 'Estadisticas' ? 'bg-white/20' : 'bg-indigo-100'">
                  <svg class="w-5 h-5" :class="$route.name === 'Estadisticas' ? 'text-white' : 'text-indigo-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                Estadísticas
              </RouterLink>
            </template>
            
            <RouterLink to="/mis-solicitudes" 
                        class="group flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-semibold transition-all duration-300 hover:bg-white/80 hover:shadow-md"
                        :class="$route.name === 'MisSolicitudes' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' : 'text-gray-700'"
                        @click="mobileMenuOpen = false">
              <div class="p-2 rounded-xl" :class="$route.name === 'MisSolicitudes' ? 'bg-white/20' : 'bg-cyan-100'">
                <svg class="w-5 h-5" :class="$route.name === 'MisSolicitudes' ? 'text-white' : 'text-cyan-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              Mis Solicitudes
            </RouterLink>
            
            <!-- Mobile user info and logout -->
            <div class="border-t border-white/30 pt-6 mt-6">
              <div class="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white mb-4">
                <div class="flex items-center space-x-4">
                  <div class="relative">
                    <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <span class="text-white font-bold text-xl">
                        {{ (currentUser?.name || 'U').charAt(0).toUpperCase() }}
                      </span>
                    </div>
                    <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <div class="text-lg font-bold text-white">{{ currentUser?.name || 'Usuario' }}</div>
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 bg-white/60 rounded-full"></div>
                      <div class="text-sm font-medium text-white/80 capitalize">{{ currentUser?.role || 'user' }}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                @click="logout"
                class="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg transform hover:scale-105"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/authService';
import logo from '@/assets/LogoCellControl.png';

const router = useRouter();
const mobileMenuOpen = ref(false);

// Estados para la pantalla de logout
const isLoggingOut = ref(false);
const logoutMessage = ref('Cerrando sesión...');
const logoutProgress = ref('w-0');

// Usar los refs reactivos del authService
const currentUser = computed(() => authService.user.value);
const isAuthenticated = computed(() => !!authService.authenticated.value);
const isAdmin = computed(() => authService.isAdmin());

const logout = async () => {
  console.log('🚪 Iniciando proceso de logout...');
  
  // Iniciar pantalla de carga
  isLoggingOut.value = true;
  logoutMessage.value = 'Cerrando sesión...';
  logoutProgress.value = 'w-1/4';
  
  try {
    // Simular progreso paso a paso
    setTimeout(() => {
      logoutMessage.value = 'Guardando cambios...';
      logoutProgress.value = 'w-1/2';
    }, 500);
    
    setTimeout(() => {
      logoutMessage.value = 'Limpiando datos...';
      logoutProgress.value = 'w-3/4';
    }, 1000);
    
    setTimeout(() => {
      logoutMessage.value = 'Finalizando sesión...';
      logoutProgress.value = 'w-full';
    }, 1500);
    
    // Realizar logout después de las animaciones
    setTimeout(() => {
      authService.logout();
      console.log('✅ Sesión cerrada, redirigiendo...');
      
      // Mensaje final antes de redireccionar
      logoutMessage.value = '¡Hasta luego! 👋';
      
      setTimeout(() => {
        isLoggingOut.value = false;
        router.push('/login');
      }, 800);
      
    }, 2000);
    
  } catch (error) {
    console.error('Error durante logout:', error);
    // En caso de error, continuar con logout normal
    authService.logout();
    isLoggingOut.value = false;
    router.push('/login');
  }
};

onMounted(() => {
  // Verificar autenticación al cargar la aplicación
  if (!authService.isAuthenticated() && router.currentRoute.value.path !== '/login') {
    router.push('/login');
  }
});
</script>