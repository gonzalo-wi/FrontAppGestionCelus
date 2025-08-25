// Función para probar diferentes credenciales contra el backend
export async function testCredentials() {
  const credentialsToTest = [
    { user: 'admin', pass: 'admin' },
    { user: 'admin', pass: 'password' },
    { user: 'admin', pass: 'admin123' },
    { user: 'user', pass: 'password' },
    { user: 'user', pass: 'user' },
    { user: 'root', pass: 'root' },
    { user: 'test', pass: 'test' },
    { user: 'usuario', pass: 'contraseña' },
    { user: 'admin', pass: '123456' },
    { user: 'demo', pass: 'demo' }
  ];

  console.log('🔍 Probando diferentes credenciales...');

  for (const cred of credentialsToTest) {
    try {
      const credentials = btoa(`${cred.user}:${cred.pass}`);
      
      console.log(`🔑 Probando: ${cred.user}:${cred.pass}`);
      
      const response = await fetch('/api/solicitudes', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log(`✅ ¡ÉXITO! Credenciales válidas: ${cred.user}:${cred.pass}`);
        console.log(`📝 Header de autorización: Basic ${credentials}`);
        return { user: cred.user, pass: cred.pass, auth: credentials };
      } else {
        console.log(`❌ Falló: ${cred.user}:${cred.pass} - Status: ${response.status}`);
      }
    } catch (error) {
      console.log(`💥 Error con: ${cred.user}:${cred.pass}`, error);
    }
  }

  console.log('🚨 Ninguna credencial funcionó');
  return null;
}

// Función para probar una credencial específica
export async function testSpecificCredential(user: string, pass: string) {
  try {
    const credentials = btoa(`${user}:${pass}`);
    
    console.log(`🔑 Probando credencial específica: ${user}:${pass}`);
    console.log(`📝 Header: Basic ${credentials}`);
    
    const response = await fetch('/api/solicitudes', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`📊 Status: ${response.status}`);
    console.log(`📋 Headers de respuesta:`, response.headers);

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ ¡ÉXITO! Datos recibidos:`, data);
      return { success: true, data };
    } else {
      const errorText = await response.text();
      console.log(`❌ Error: ${response.status} - ${errorText}`);
      return { success: false, status: response.status, error: errorText };
    }
  } catch (error) {
    console.log(`💥 Error de conexión:`, error);
    return { success: false, error };
  }
}
