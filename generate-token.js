const jwt = require('jsonwebtoken');

const JWT_SECRET = "meu-super-secret-key-mudar-em-producao-123456";

const payload = {
  userId: "test-user-001",
  email: "eurico@iamenu.pt",
  role: "restaurador"
};

// Token válido por 24 horas
const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

console.log('\n===========================================');
console.log('NOVO TOKEN JWT (válido por 24h):');
console.log('===========================================\n');
console.log(token);
console.log('\n===========================================');
console.log('Para usar no browser console:');
console.log('===========================================\n');
console.log(`localStorage.setItem('token', '${token}');`);
console.log('\n');
