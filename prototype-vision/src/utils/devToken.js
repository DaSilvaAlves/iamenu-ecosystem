/**
 * DEV ONLY - Token de teste para desenvolvimento
 * Remove em produção!
 */

export const setDevToken = () => {
  // Token de teste (userId: test-user-001, role: admin, válido 24h)
  const DEV_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItMDAxIiwiZW1haWwiOiJldXJpY29AaWFtZW51LnB0Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY2ODgzNDE0LCJleHAiOjE3NjY5Njk4MTR9.z3E_z9BfX9N9hIgtkb1Ac4luVgSnGrvvE4DvII4ppOs';

  if (!localStorage.getItem('authToken')) {
    localStorage.setItem('authToken', DEV_TOKEN);
    console.log('✅ DEV: Token de teste configurado');
  }
};

// Auto-executar em DEV
if (import.meta.env.DEV) {
  setDevToken();
}
