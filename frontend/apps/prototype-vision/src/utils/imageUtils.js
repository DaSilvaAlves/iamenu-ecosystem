
/**
 * Image URL Helper
 * Safely resolves image URLs to prevent mixed content errors in production
 */
export const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/600x400';

    // If it's already a full URL, return it
    if (path.startsWith('http')) return path;

    // In production, force a placeholder if the path likely came from a local upload
    // or if we don't have a configured backend
    if (import.meta.env.PROD) {
        // If you had a CDN, you'd use it here. For now, use a placeholder
        // or a static asset if you have one.
        return 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1074';
    }

    // In development, use local backend
    return `http://localhost:3004/uploads/${path}`;
};
