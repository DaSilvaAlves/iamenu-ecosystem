import { API_CONFIG } from '../config/api';

/**
 * Image URL Helper
 * Safely resolves image URLs to prevent mixed content errors in production
 */
export const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/600x400';

    // If it's already a full URL, return it
    if (path.startsWith('http')) return path;

    // Use the configured base URL (Railway in prod, localhost in dev)
    // Remove leading slash from path if base also ends with slash (though API_CONFIG.COMMUNITY_BASE usually doesn't)
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_CONFIG.COMMUNITY_BASE}${cleanPath}`;
};
