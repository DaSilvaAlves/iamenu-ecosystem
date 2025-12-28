/**
 * DEV ONLY - Token de teste para desenvolvimento
 * Remove em produção!
 */

export const setDevToken = () => {
  // Token de teste (userId: test-user-123)
  const DEV_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGlhbWVudS5wdCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzY2ODgxMTcxLCJleHAiOjE3NjY5Njc1NzF9.NwwG6FSvzKzhN3O5yiWxffYT1iKlQQRCc9WWouVJpLU';

  if (!localStorage.getItem('authToken')) {
    localStorage.setItem('authToken', DEV_TOKEN);
    console.log('✅ DEV: Token de teste configurado');
  }
};

// Auto-executar em DEV
if (import.meta.env.DEV) {
  setDevToken();
}
