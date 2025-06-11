import defaultMaleAvatar from '../assets/images/mann.png';
import defaultFemaleAvatar from '../assets/images/frau.png';

// Get the backend URL with better environment handling
const getBackendUrl = () => {
  // In production, try to use the current domain if API_URL not set
  const apiUrl = process.env.REACT_APP_API_URL;
  
  if (apiUrl) {
    return apiUrl.replace('/api', ''); // Remove /api suffix if present
  }
  
  // Fallback logic for production
  if (process.env.NODE_ENV === 'production') {
    // Try to construct from current window location
    if (typeof window !== 'undefined') {
      const protocol = window.location.protocol;
      const hostname = window.location.hostname;
      // Common production patterns
      if (hostname.includes('vercel.app') || hostname.includes('netlify.app')) {
        // For frontend-only deploys, construct backend URL
        return `${protocol}//your-backend-domain.render.com`;
      }
      return `${protocol}//${hostname}`;
    }
    return 'https://your-backend-domain.render.com'; // Replace with actual backend domain
  }
  
  return 'http://localhost:5000';
};

// Cache the backend URL to avoid repeated calculations
let cachedBackendUrl = null;

const getCachedBackendUrl = () => {
  if (!cachedBackendUrl) {
    cachedBackendUrl = getBackendUrl();
  }
  return cachedBackendUrl;
};

// Convert relative image paths to full URLs with better error handling
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it's a relative path, construct the full URL
  const backendUrl = getCachedBackendUrl();
  const fullUrl = `${backendUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  
  return fullUrl;
};

// Get default avatar based on gender
export const getDefaultAvatar = (gender = 'male') => {
  return gender === 'female' ? defaultFemaleAvatar : defaultMaleAvatar;
};

// Preload images to avoid loading delays
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    if (!src) {
      reject(new Error('No image source provided'));
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Handle image load errors with fallback
export const handleImageError = (event, fallbackSrc = null) => {
  if (fallbackSrc) {
    event.target.src = fallbackSrc;
  } else {
    event.target.style.display = 'none';
  }
};

// Reset cached URL if needed (useful for hot reloading in development)
export const resetBackendUrlCache = () => {
  cachedBackendUrl = null;
};

// Get user avatar URL with fallback to default
export const getUserAvatarUrl = (user) => {
  if (!user) return defaultMaleAvatar;
  
  if (user.profileImage) {
    return getImageUrl(user.profileImage);
  }
  
  // Return default avatar based on gender
  return user.gender === 'female' ? defaultFemaleAvatar : defaultMaleAvatar;
}; 