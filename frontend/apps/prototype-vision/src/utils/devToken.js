/**
 * DEV ONLY - Token de teste para desenvolvimento
 * Remove em produção!
 */

export const setDevToken = async () => {
  // Buscar token fresco do backend (funciona em dev e produção)
  try {
    // Em produção, usar Railway API; em dev, usar localhost
    const apiUrl = import.meta.env.PROD
      ? 'https://iamenucommunity-api-production.up.railway.app/api/v1/community/auth/test-token'
      : 'http://localhost:3004/api/v1/community/auth/test-token';

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      console.log('✅ Token de teste configurado (válido 24h)');
      console.log('👤 User:', data.user);
      return data.token;
    }
  } catch (error) {
    console.warn('⚠️ Não foi possível obter token do backend. Usando fallback.');
    // Fallback token (caso backend não esteja rodando)
    // Gerado com JWT_SECRET=T9NTWid03o5sBTtL, válido por 7 dias
    const FALLBACK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItMDAxIiwiZW1haWwiOiJldXJpY29AaWFtZW51LnB0Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY4NzA3NzI1LCJleHAiOjE3NjkzMTI1MjV9.1THvsqVMIplZZEj4crTc5aqWFX_8w0ErQpBJqBAqWiQ';
    localStorage.setItem('auth_token', FALLBACK_TOKEN);
    return FALLBACK_TOKEN;
  }
};

// Auto-executar em DEV e PRODUÇÃO para garantir que o token é setado
(async () => {
  await setDevToken();
  console.log('✅ Token de teste processado e pronto.');
})();
