// Sin validación remota en login; el backend validará en cada request
import { ref } from 'vue';

export interface User {
  username: string;
  name?: string;
  role?: 'ADMIN' | 'USUARIO';
}

// Estado reactivo para la autenticación
const currentUser = ref<User | null>(null);
const authToken = ref<string | null>(null);
const isInitializing = ref<boolean>(true); // Nuevo estado para manejar la carga inicial

class AuthService {
  constructor() {
    // Llamar la verificación asíncrona sin bloquear
    this.initializeAuth();
  }

  private async initializeAuth(): Promise<void> {
    console.log('🔄 Inicializando sistema de autenticación...');
    isInitializing.value = true;

    try {
      await this.checkExistingSession();
    } catch (error) {
      console.error('❌ Error durante inicialización de auth:', error);
      // En caso de error, limpiar sesión
      this.logout();
    } finally {
      isInitializing.value = false;
      console.log('✅ Inicialización de autenticación completa');
    }
  }

  private async checkExistingSession(): Promise<void> {
    const savedUser = localStorage.getItem('user');
    const savedAuth = localStorage.getItem('auth');
    
    if (!savedUser || !savedAuth) {
      console.log('📭 No hay sesión guardada');
      return;
    }

    try {
      console.log('🔍 Verificando sesión existente...');
      
      // Parsear datos guardados
      const userData = JSON.parse(savedUser);
      authToken.value = savedAuth;

      // Verificar si la sesión sigue siendo válida con el backend
      const testResponse = await fetch('/api/solicitudes', {
        method: 'GET',
        headers: { 
          'Authorization': `Basic ${savedAuth}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(5000) // Timeout de 5 segundos
      });
      
      if (testResponse.ok) {
        console.log('✅ Sesión válida encontrada');
        currentUser.value = userData;
        
        // Verificar permisos de admin si es necesario
        if (!userData.role || userData.role === 'USUARIO') {
          await this.determineUserRole(savedAuth);
        }
      } else {
        console.log('❌ Sesión expirada o inválida');
        this.logout();
      }
    } catch (error) {
      console.error('❌ Error verificando sesión:', error);
      this.logout();
    }
  }

  private async determineUserRole(authToken: string): Promise<void> {
    try {
      const adminTestResponse = await fetch('/api/usuarios', {
        method: 'GET',
        headers: { 
          'Authorization': `Basic ${authToken}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(3000)
      });
      
      if (adminTestResponse.ok || adminTestResponse.status === 200) {
        if (currentUser.value) {
          currentUser.value.role = 'ADMIN';
          localStorage.setItem('user', JSON.stringify(currentUser.value));
          console.log('✅ Permisos de admin confirmados');
        }
      }
    } catch (error) {
      console.log('ℹ️ Usuario no tiene permisos de admin');
      // Mantener como USUARIO
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    console.log('🔐 Iniciando proceso de login...');
    const encoded = btoa(`${username}:${password}`);
    authToken.value = encoded;
    localStorage.setItem('auth', encoded);
    
    try {
      // Intentar obtener información del usuario realizando una request que requiera autenticación
      console.log('🔍 Verificando credenciales con el servidor...');
      const testResponse = await fetch('/api/solicitudes', {
        method: 'GET',
        headers: { 
          'Authorization': `Basic ${encoded}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(10000) // Timeout de 10 segundos para login
      });
      
      if (testResponse.ok) {
        console.log('✅ Credenciales válidas');
        
        // Determinar rol basado en si puede acceder a recursos admin
        let role: 'ADMIN' | 'USUARIO' = 'USUARIO';
        
        try {
          console.log('🔍 Determinando permisos de usuario...');
          const adminTestResponse = await fetch('/api/usuarios', {
            method: 'GET',
            headers: { 
              'Authorization': `Basic ${encoded}`,
              'Content-Type': 'application/json'
            },
            signal: AbortSignal.timeout(5000)
          });
          
          if (adminTestResponse.ok || adminTestResponse.status === 200) {
            role = 'ADMIN';
            console.log('✅ Permisos de administrador confirmados');
          }
        } catch (adminError) {
          console.log('ℹ️ Usuario con permisos estándar');
        }
        
        currentUser.value = { 
          username, 
          name: username,
          role 
        };
        
        localStorage.setItem('user', JSON.stringify(currentUser.value));
        console.log('✅ Login exitoso:', currentUser.value);
        return true;
      } else {
        console.log('❌ Credenciales inválidas');
        this.logout();
        return false;
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      this.logout();
      return false;
    }
  }

  logout(): void {
    currentUser.value = null;
    authToken.value = null;
    localStorage.removeItem('auth');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!authToken.value && !!localStorage.getItem('auth');
  }

  isInitializing(): boolean {
    return isInitializing.value;
  }

  // Esperar a que la inicialización termine
  async waitForInitialization(): Promise<void> {
    return new Promise((resolve) => {
      if (!isInitializing.value) {
        resolve();
        return;
      }
      
      const checkInterval = setInterval(() => {
        if (!isInitializing.value) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 10);
    });
  }

  getCurrentUser(): User | null {
    return currentUser.value;
  }

  getAuthHeader(): string | null {
    const token = authToken.value || localStorage.getItem('auth');
    return token ? `Basic ${token}` : null;
  }

  // Dev-only: simple admin check. Adjust when backend provides roles.
  isAdmin(): boolean {
    return currentUser.value?.role === 'ADMIN';
  }

  // Computed getters para reactividad en Vue
  get user() {
    return currentUser;
  }

  get authenticated() {
    return authToken;
  }

  get initializing() {
    return isInitializing;
  }
}

export const authService = new AuthService();
