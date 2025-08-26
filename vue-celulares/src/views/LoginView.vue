<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0">
      <!-- Gradient Orbs -->
      <div class="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute top-40 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-20 left-40 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      
      <!-- Geometric Pattern -->
      <div class="w-full h-full opacity-20" style="background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0); background-size: 40px 40px;"></div>
      
      <!-- Floating Particles -->
      <div class="absolute inset-0">
        <div class="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-float"></div>
        <div class="absolute top-3/4 left-3/4 w-1 h-1 bg-purple-200 rounded-full opacity-40 animate-float animation-delay-1000"></div>
        <div class="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-blue-200 rounded-full opacity-50 animate-float animation-delay-3000"></div>
      </div>
    </div>
    
    <div class="max-w-md w-full space-y-8 relative z-10">
      <!-- Logo y Título -->
      <div class="text-center animate-fade-in-up">
        <div class="mx-auto h-24 w-24 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center mb-6 shadow-2xl transform hover:scale-110 transition-transform duration-300">
          <div class="h-20 w-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg class="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z"></path>
            </svg>
          </div>
        </div>
        <h2 class="text-5xl font-bold text-white mb-3 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">CellControl</h2>
        <p class="text-purple-200 text-lg font-medium">Gestión de Celulares</p>
        <div class="w-20 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto mt-4 rounded-full"></div>
      </div>

      <!-- Formulario de Login -->
      <div class="bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white border-opacity-20 hover:bg-opacity-15 transition-all duration-300 animate-fade-in-up animation-delay-200">
        <form @submit.prevent="login" class="space-y-6">
          <!-- Campo Usuario -->
          <div class="group">
            <label for="username" class="block text-sm font-semibold text-white mb-3 group-hover:text-purple-200 transition-colors">
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Usuario
              </span>
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-purple-300 group-focus-within:text-purple-200 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <input
                id="username"
                v-model="username"
                type="text"
                required
                class="block w-full pl-12 pr-4 py-4 border border-white border-opacity-30 rounded-2xl bg-white bg-opacity-10 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 focus:border-transparent focus:bg-opacity-20 transition-all duration-300 text-lg"
                placeholder="Ingresa tu usuario"
              />
              <div class="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
            </div>
          </div>

          <!-- Campo Contraseña -->
          <div class="group">
            <label for="password" class="block text-sm font-semibold text-white mb-3 group-hover:text-purple-200 transition-colors">
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                Contraseña
              </span>
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-purple-300 group-focus-within:text-purple-200 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                class="block w-full pl-12 pr-4 py-4 border border-white border-opacity-30 rounded-2xl bg-white bg-opacity-10 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 focus:border-transparent focus:bg-opacity-20 transition-all duration-300 text-lg"
                placeholder="Ingresa tu contraseña"
              />
              <div class="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
            </div>
          </div>

          <!-- Mensaje de Error -->
          <div v-if="error" class="bg-red-500 bg-opacity-20 border border-red-400 border-opacity-50 text-red-100 px-6 py-4 rounded-2xl backdrop-blur-sm animate-shake">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium">{{ error }}</p>
              </div>
            </div>
          </div>

          <!-- Botón de Login -->
          <div class="pt-2">
            <button
              type="submit"
              :disabled="loading"
              class="group relative w-full flex justify-center py-4 px-6 border border-transparent text-lg font-semibold rounded-2xl text-slate-900 bg-gradient-to-r from-white to-purple-100 hover:from-purple-100 hover:to-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
            >
              <!-- Loading Spinner -->
              <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
                <div class="flex items-center gap-3">
                  <div class="animate-spin rounded-full h-6 w-6 border-2 border-purple-600 border-t-transparent"></div>
                  <span class="text-purple-700 font-medium">Validando credenciales...</span>
                </div>
              </div>
              
              <!-- Normal State -->
              <span v-if="!loading" class="flex items-center gap-2">
                <svg class="w-5 h-5 text-purple-600 group-hover:text-purple-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
                Iniciar Sesión
              </span>
            </button>
          </div>
        </form>

        <!-- Información adicional -->
        <div class="mt-8 text-center">
          <p class="text-purple-200 text-sm font-medium">
            Sistema de gestión inteligente de dispositivos móviles
          </p>
          <p class="text-purple-300 text-xs mt-2">
            Versión 2.0 - {{ new Date().getFullYear() }} | Powered by IT
          </p>
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
    
    // Agregar un delay mínimo para mostrar la animación de carga
    const [success] = await Promise.all([
      authService.login(username.value, password.value),
      new Promise(resolve => setTimeout(resolve, 800)) // Delay mínimo de 800ms
    ]);
    
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

<style scoped>
/* Animaciones personalizadas */
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-10px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(10px);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-3000 {
  animation-delay: 3s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Efecto glassmorphism mejorado */
.backdrop-blur-xl {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* Gradiente animado para el texto */
.bg-clip-text {
  background-clip: text;
  -webkit-background-clip: text;
}
</style>
