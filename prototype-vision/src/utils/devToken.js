/**
 * DEV ONLY - Token de teste para desenvolvimento
 * Remove em produção!
 */

export const setDevToken = async () => {
  // Buscar token fresco do backend
  try {
    const response = await fetch('http://localhost:3001/api/v1/community/auth/test-token');
    const data = await response.json();

    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      console.log('✅ DEV: Token de teste configurado (válido 24h)');
      console.log('👤 User:', data.user);
    }
  } catch (error) {
    console.warn('⚠️ DEV: Não foi possível obter token do backend. Usando fallback.');
    // Fallback token (caso backend não esteja rodando)
    const FALLBACK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItMDAxIiwiZW1haWwiOiJldXJpY29AaWFtZW51LnB0Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY2ODkwNDc5LCJleHAiOjE3NjY5NzY4Nzl9.RjSe-BIyAxvBmMzO7tTDizfvfpZeiPtXsK5hlH-kFOY';
    localStorage.setItem('auth_token', FALLBACK_TOKEN);
  }
};

// Auto-executar em DEV
if (import.meta.env.DEV) {
  setDevToken();
}
