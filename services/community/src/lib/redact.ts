/**
 * Sensitive Data Redaction Utility
 *
 * Redacts sensitive information from logs to prevent exposing:
 * - Passwords
 * - Authentication tokens (JWT, Bearer, etc.)
 * - API keys and secrets
 * - Personal identifying information (PII)
 *
 * Used by Winston logger to automatically redact sensitive fields
 * before writing logs to files or console.
 */

/**
 * List of sensitive field names that should be redacted
 */
const SENSITIVE_FIELDS = [
  // Authentication
  'password',
  'passwordHash',
  'pwd',
  'pass',
  'token',
  'accessToken',
  'refreshToken',
  'authToken',
  'bearerToken',
  'authorization',

  // API & Security
  'apiKey',
  'api_key',
  'secretKey',
  'secret',
  'apiSecret',
  'clientSecret',
  'privateKey',
  'jwtSecret',
  'sessionSecret',

  // Database & Connection
  'connectionString',
  'connectionUrl',
  'databaseUrl',
  'dbUrl',
  'mongoUri',
  'mysqlPassword',
  'postgresPassword',

  // Third-party credentials
  'awsAccessKeyId',
  'awsSecretAccessKey',
  'stripeKey',
  'stripeSecret',
  'twilioAuthToken',
  'sendgridApiKey',

  // Personal data
  'ssn',
  'creditCard',
  'creditCardNumber',
  'cardNumber',
  'cvv',
  'cvv2',
];

/**
 * Pattern matchers for detecting sensitive data in values
 */
const SENSITIVE_PATTERNS = [
  // JWT tokens (pattern: eyXXX.eyXXX.XXXX)
  /eyJ[\w\-\.]+\.eyJ[\w\-\.]+\.[\w\-\.]+/gi,

  // Bearer tokens
  /bearer\s+[\w\-\.]+/gi,

  // API keys (common patterns)
  /api[_-]?key[\s:=]+['\"]?[\w\-]+['\"]?/gi,

  // AWS keys
  /AKIA[0-9A-Z]{16}/g,

  // Basic auth (base64)
  /basic\s+[\w\-\.]+/gi,

  // Email in logs (optional - can be commented out if needed)
  // /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
];

/**
 * Redaction replacement strings
 */
const REDACTED = '***REDACTED***';

/**
 * Redact sensitive data from an object
 * Recursively processes objects and arrays
 *
 * @param data - The data to redact (can be any type)
 * @param depth - Current recursion depth (to prevent infinite loops)
 * @returns The redacted data
 */
export function redactSensitiveData(data: any, depth: number = 0): any {
  // Prevent infinite recursion
  if (depth > 10) {
    return data;
  }

  // Handle null/undefined
  if (data === null || data === undefined) {
    return data;
  }

  // Handle primitives
  if (typeof data !== 'object') {
    return redactSensitiveValue(data);
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(item => redactSensitiveData(item, depth + 1));
  }

  // Handle objects
  const redacted: any = {};
  for (const [key, value] of Object.entries(data)) {
    // Check if key is sensitive
    if (isSensitiveField(key)) {
      redacted[key] = REDACTED;
    } else if (value !== null && typeof value === 'object') {
      // Recursively redact nested objects/arrays
      redacted[key] = redactSensitiveData(value, depth + 1);
    } else if (typeof value === 'string') {
      // Check if value matches sensitive patterns
      redacted[key] = redactSensitiveValue(value);
    } else {
      redacted[key] = value;
    }
  }

  return redacted;
}

/**
 * Check if a field name is sensitive
 *
 * @param fieldName - The field name to check
 * @returns True if the field should be redacted
 */
function isSensitiveField(fieldName: string): boolean {
  const lowerName = fieldName.toLowerCase();
  return SENSITIVE_FIELDS.some(field => lowerName.includes(field.toLowerCase()));
}

/**
 * Redact sensitive patterns in a string value
 *
 * @param value - The string value to check
 * @returns The value with sensitive patterns redacted
 */
function redactSensitiveValue(value: any): any {
  if (typeof value !== 'string') {
    return value;
  }

  let redacted = value;

  // Apply pattern-based redaction
  for (const pattern of SENSITIVE_PATTERNS) {
    redacted = redacted.replace(pattern, REDACTED);
  }

  return redacted;
}

/**
 * Create a redacting formatter for Winston logger
 * Integrates with Winston's printf format function
 *
 * @param info - Winston log info object
 * @returns The info object with sensitive data redacted
 */
export function createRedactingFormatter() {
  return (info: any) => {
    // Redact the entire info object
    return redactSensitiveData(info);
  };
}

/**
 * Redact sensitive data in error objects
 * Useful for error logging
 *
 * @param error - The error object to redact
 * @returns Redacted error object
 */
export function redactError(error: any): any {
  if (!error) {
    return error;
  }

  const redacted: any = {
    message: redactSensitiveValue(error.message),
    name: error.name,
    stack: redactSensitiveValue(error.stack),
  };

  // Copy additional properties
  for (const [key, value] of Object.entries(error)) {
    if (!redacted.hasOwnProperty(key)) {
      if (isSensitiveField(key)) {
        redacted[key] = REDACTED;
      } else if (typeof value === 'string') {
        redacted[key] = redactSensitiveValue(value);
      } else {
        redacted[key] = value;
      }
    }
  }

  return redacted;
}

/**
 * Export sensitive fields list for external reference
 */
export const REDACTED_FIELDS = SENSITIVE_FIELDS;
