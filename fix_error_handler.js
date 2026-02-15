const fs = require('fs');

let content = fs.readFileSync('errorHandler.ts', 'utf8');

// The exact block to replace
const oldBlock = `  // Log error (só erros não operacionais - inesperados)
  if (!isOperational || statusCode === 500) {
    console.error('❌ ERROR:', {
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      body: req.body,
      user: req.user?.userId || 'anonymous'
    });
  }`;

const newBlock = `  // Log error (só erros não operacionais - inesperados)
  if (!isOperational || statusCode === 500) {
    const requestLogger = (req as any).logger || logger;
    requestLogger.error('Request error', {
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      statusCode,
      userId: (req as any).user?.userId || 'anonymous'
    });
  }`;

if (content.includes(oldBlock)) {
  content = content.replace(oldBlock, newBlock);
  fs.writeFileSync('errorHandler.ts', content);
  console.log('✓ errorHandler.ts updated successfully');
} else {
  console.log('✗ Could not find exact block');
  process.exit(1);
}
