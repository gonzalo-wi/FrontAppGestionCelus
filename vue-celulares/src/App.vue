<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
              <img :src="logo" alt="LogoCellControl" class="h-10 w-auto object-contain" />
            </div>
            
            <!-- Navigation Links -->
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <RouterLink 
                to="/" 
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                :class="{ 'border-indigo-500 text-gray-900': $route.name === 'Home' }"
              >
                <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                Inicio
              </RouterLink>
              
              <RouterLink 
                to="/celulares" 
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                :class="{ 'border-indigo-500 text-gray-900': $route.name === 'Celulares' }"
              >
                <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z"></path>
                </svg>
                Celulares
              </RouterLink>
              
              <RouterLink 
                to="/usuarios" 
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                :class="{ 'border-indigo-500 text-gray-900': $route.name === 'Usuarios' }"
              >
                <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                Usuarios
              </RouterLink>
              <RouterLink 
                to="/solicitudes" 
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                :class="{ 'border-indigo-500 text-gray-900': $route.name === 'Solicitudes' }"
              >
                <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
                Solicitudes
              </RouterLink>
            </div>
          </div>
          
          <!-- Mobile menu button -->
          <div class="sm:hidden flex items-center">
            <button @click="mobileMenuOpen = !mobileMenuOpen" 
                    class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="sm:hidden">
        <div class="pt-2 pb-3 space-y-1 bg-gray-50 border-t border-gray-200">
          <RouterLink to="/" 
                      class="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      @click="mobileMenuOpen = false">
            Inicio
          </RouterLink>
          <RouterLink to="/celulares" 
                      class="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      @click="mobileMenuOpen = false">
            Celulares
          </RouterLink>
          <RouterLink to="/usuarios" 
                      class="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      @click="mobileMenuOpen = false">
            Usuarios
          </RouterLink>
          <RouterLink to="/solicitudes" 
                      class="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      @click="mobileMenuOpen = false">
            Solicitudes
          </RouterLink>
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
import { ref } from 'vue';
import logo from '@/assets/LogoCellControl.png';

const mobileMenuOpen = ref(false);
</script>