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

class AuthService {
  constructor() {
    this.checkExistingSession();
  }

  private checkExistingSession(): void {
    const savedUser = localStorage.getItem('user');
    const savedAuth = localStorage.getItem('auth');
    if (savedUser && savedAuth) {
      try {
        currentUser.value = JSON.parse(savedUser);
        authToken.value = savedAuth;
      } catch {
        this.logout();
      }
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    const encoded = btoa(`${username}:${password}`);
    authToken.value = encoded;
    localStorage.setItem('auth', encoded);
    
    try {
      // Intentar obtener información del usuario realizando una request que requiera autenticación
      // El backend debería retornar información del usuario autenticado
      const testResponse = await fetch('/api/solicitudes', {
        method: 'GET',
        headers: { 
          'Authorization': `Basic ${encoded}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (testResponse.ok) {
        // Si la request es exitosa, el usuario está autenticado
        // Por ahora, determinar rol basado en si puede acceder a recursos admin
        let role: 'ADMIN' | 'USUARIO' = 'USUARIO';
        
        try {
          // Intentar acceder a un endpoint de admin para determinar el rol
          const adminTestResponse = await fetch('/api/usuarios', {
            method: 'GET',
            headers: { 
              'Authorization': `Basic ${encoded}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (adminTestResponse.ok || adminTestResponse.status === 200) {
            role = 'ADMIN';
          }
        } catch (adminError) {
          // Si falla, mantener como USUARIO
          console.log('Usuario no tiene permisos de admin');
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
        // Credenciales inválidas
        this.logout();
        return false;
      }
    } catch (error) {
      console.error('Error en login:', error);
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
}

export const authService = new AuthService();
