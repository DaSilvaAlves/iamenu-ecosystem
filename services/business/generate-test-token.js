const jwt = require('jsonwebtoken');

const JWT_SECRET = "meu-super-secret-key-mudar-em-producao-123456";

const payload = {
  userId: 'test-user-123',
  email: 'test@iamenu.pt',
  role: 'user'
};

const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

console.log('\n🔑 Test JWT Token:');
console.log('==================');
console.log(token);
console.log('==================\n');
console.log('Usage:');
console.log('curl -H "Authorization: Bearer ' + token + '" http://localhost:3003/api/v1/business/dashboard/stats\n');
