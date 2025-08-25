<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-30">
      <div class="w-full h-full" style="background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0); background-size: 20px 20px;"></div>
    </div>
    
    <div class="max-w-md w-full space-y-8 relative">
      <!-- Logo y Título -->
      <div class="text-center">
        <div class="mx-auto h-20 w-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6">
          <img src="@/assets/LogoCellControl.png" alt="Logo CellControl" class="h-16 w-16 object-contain" />
        </div>
        <h2 class="text-4xl font-bold text-white mb-2">CellControl</h2>
        <p class="text-blue-100 text-lg">Accede a tu cuenta</p>
      </div>

      <!-- Formulario de Login -->
      <div class="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white border-opacity-20">
        <form @submit.prevent="login" class="space-y-6">
          <!-- Campo Usuario -->
          <div>
            <label for="username" class="block text-sm font-medium text-white mb-2">
              Usuario
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <input
                id="username"
                v-model="username"
                type="text"
                required
                class="block w-full pl-10 pr-3 py-3 border border-white border-opacity-30 rounded-xl bg-white bg-opacity-20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent transition-all"
                placeholder="Ingresa tu usuario"
              />
            </div>
          </div>

          <!-- Campo Contraseña -->
          <div>
            <label for="password" class="block text-sm font-medium text-white mb-2">
              Contraseña
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                class="block w-full pl-10 pr-3 py-3 border border-white border-opacity-30 rounded-xl bg-white bg-opacity-20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent transition-all"
                placeholder="Ingresa tu contraseña"
              />
            </div>
          </div>

          <!-- Mensaje de Error -->
          <div v-if="error" class="bg-red-500 bg-opacity-20 border border-red-400 text-red-100 px-4 py-3 rounded-xl">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm">{{ error }}</p>
              </div>
            </div>
          </div>

          <!-- Botón de Login -->
          <div>
            <button
              type="submit"
              :disabled="loading"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-xl text-blue-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-blue-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ loading ? 'Ingresando...' : 'Ingresar' }}
            </button>
          </div>
        </form>

        <!-- Información adicional -->
        <div class="mt-6 text-center">
          <p class="text-blue-100 text-sm">
            Sistema de gestión de celulares
          </p>
          <p class="text-blue-200 text-xs mt-1">
            Versión 2.0 - {{ new Date().getFullYear() }}
          </p>
        </div>
      </div>

      <!-- Demo Credentials -->
      <div class="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-4 border border-white border-opacity-20">
        <h3 class="text-white font-medium mb-2 text-center">Credenciales de Prueba</h3>
        <div class="space-y-2 text-sm text-blue-100">
          <div class="flex justify-between">
            <span>Admin:</span>
            <span class="font-mono">admin / admin123</span>
          </div>
          <div class="flex justify-between">
            <span>Usuario:</span>
            <span class="font-mono">user / user123</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { authService } from '@/services/authService';

const router = useRouter();
const route = useRoute();

const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const login = async () => {
  if (loading.value) return;
  
  error.value = '';
  loading.value = true;

  try {
    console.log('🔑 Intentando login con:', username.value);
    const success = await authService.login(username.value, password.value);
    
    if (success) {
      const user = authService.getCurrentUser();
      console.log('✅ Login exitoso, usuario:', user);
      
      // Redirigir a la ruta original (si existe) o al home
      const redirect = (route.query.redirect as string) || '/';
      console.log('📍 Redirigiendo a:', redirect);
      router.replace(redirect);
    } else {
      error.value = 'Usuario o contraseña incorrectos';
    }
  } catch (e) {
    console.error('❌ Error en login:', e);
    error.value = 'Error de conexión. Intenta nuevamente.';
  } finally {
    loading.value = false;
  }
};

// (Opcional) Aquí podés agregar helpers o acciones adicionales
</script>
