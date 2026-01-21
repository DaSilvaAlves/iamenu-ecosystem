const fs = require('fs');
const content = `/**
 * API Configuration - Centralized API URLs
 * Uses environment variables with fallback to localhost for development
 */

export const API_CONFIG = {
  // Backend API URLs
  COMMUNITY_API: import.meta.env.VITE_COMMUNITY_API_URL || 'http://localhost:3004/api/v1/community',
  MARKETPLACE_API: import.meta.env.VITE_MARKETPLACE_API_URL || 'http://localhost:3005/api/v1/marketplace',
  BUSINESS_API: import.meta.env.VITE_BUSINESS_API_URL || 'http://localhost:3002/api/v1/business',
  ACADEMY_API: import.meta.env.VITE_ACADEMY_API_URL || 'http://localhost:3003/api/v1/academy',

  // Base URLs without /api/v1 prefix (for static assets like images)
  COMMUNITY_BASE: import.meta.env.VITE_COMMUNITY_API_URL?.replace('/api/v1/community', '') || 'http://localhost:3004',
  MARKETPLACE_BASE: import.meta.env.VITE_MARKETPLACE_API_URL?.replace('/api/v1/marketplace', '') || 'http://localhost:3005',
};

// Helper function to build full URL for static assets (images, uploads, etc.)
export const buildAssetUrl = (path, service = 'community') => {
  if (!path) return null;
  if (path.startsWith('http')) return path; // Already full URL
  
  const base = service === 'marketplace' ? API_CONFIG.MARKETPLACE_BASE : API_CONFIG.COMMUNITY_BASE;
  return \`\${base}\${path.startsWith('/') ? path : '/` + path}\`;
};

export default API_CONFIG;
`;
fs.writeFileSync('api.js', content);
console.log('✅ API config created');
