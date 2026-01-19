/**
 * DEV ONLY - Token de teste para desenvolvimento
 * Remove em produção!
 */

export const setDevToken = async () => {
  // Buscar token fresco do backend
  try {
    const response = await fetch('http://localhost:3004/api/v1/community/auth/test-token');
    const data = await response.json();

    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      console.log('✅ DEV: Token de teste configurado (válido 24h)');
      console.log('👤 User:', data.user);
    }
  } catch (error) {
    console.warn('⚠️ DEV: Não foi possível obter token do backend. Usando fallback.');
    // Fallback token (caso backend não esteja rodando)
    // Gerado com JWT_SECRET=T9NTWid03o5sBTtL, válido por 7 dias
    const FALLBACK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItMDAxIiwiZW1haWwiOiJldXJpY29AaWFtZW51LnB0Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY4NzA3NzI1LCJleHAiOjE3NjkzMTI1MjV9.1THvsqVMIplZZEj4crTc5aqWFX_8w0ErQpBJqBAqWiQ';
    localStorage.setItem('auth_token', FALLBACK_TOKEN);
  }
};

// Auto-executar em DEV e garantir que o token é setado antes de qualquer outra coisa
if (import.meta.env.DEV) {
  (async () => {
    await setDevToken();
    console.log('✅ DEV: Token de teste processado e pronto.'); // Confirm token is ready
  })();
}
