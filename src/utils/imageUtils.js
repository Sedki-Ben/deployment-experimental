import React from 'react';
import defaultMaleAvatar from '../assets/images/mann.png';
import defaultFemaleAvatar from '../assets/images/frau.png';

// Get the backend URL
const getBackendUrl = () => {
  return process.env.REACT_APP_API_URL || 'http://localhost:5000';
};

// Convert relative image paths to full URLs with comprehensive error handling
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    console.warn('getImageUrl called with empty imagePath');
    return null;
  }
  
  // If it's already a full URL (including Cloudinary), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    console.log('Using full URL as-is:', imagePath);
    return imagePath;
  }
  
  // If it's a relative path, construct the full URL
  const backendUrl = getBackendUrl().replace('/api', ''); // Remove /api suffix if present
  const fullUrl = `${backendUrl}${imagePath}`;
  console.log(`Converted relative path "${imagePath}" to full URL: ${fullUrl}`);
  return fullUrl;
};

// Preload image with retry logic
export const preloadImage = (src, retries = 3) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    const attemptLoad = (attempt) => {
      img.onload = () => {
        console.log(`Image loaded successfully: ${src}`);
        resolve(img);
      };
      
      img.onerror = () => {
        console.warn(`Image load failed (attempt ${attempt}/${retries}): ${src}`);
        if (attempt < retries) {
          setTimeout(() => attemptLoad(attempt + 1), 1000 * attempt); // Exponential backoff
        } else {
          console.error(`Image load failed after ${retries} attempts: ${src}`);
          reject(new Error(`Failed to load image: ${src}`));
        }
      };
      
      img.src = src;
    };
    
    attemptLoad(1);
  });
};

// Enhanced image component with error handling
export const SafeImage = ({ src, alt, className, onLoad, onError, fallbackSrc, ...props }) => {
  const [currentSrc, setCurrentSrc] = React.useState(src);
  const [hasError, setHasError] = React.useState(false);
  
  const handleError = (e) => {
    console.error('SafeImage error:', src);
    setHasError(true);
    
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      console.log('Trying fallback image:', fallbackSrc);
      setCurrentSrc(fallbackSrc);
    } else {
      const placeholder = 'https://via.placeholder.com/400x300/cccccc/666666?text=Image+Not+Available';
      setCurrentSrc(placeholder);
    }
    
    if (onError) onError(e);
  };
  
  const handleLoad = (e) => {
    console.log('SafeImage loaded successfully:', currentSrc);
    setHasError(false);
    if (onLoad) onLoad(e);
  };
  
  return React.createElement('img', {
    src: currentSrc,
    alt: alt || 'Image',
    className,
    onLoad: handleLoad,
    onError: handleError,
    ...props
  });
};

// Avatar utilities
export const getDefaultAvatar = (gender = 'male') => {
  return gender === 'female' ? defaultFemaleAvatar : defaultMaleAvatar;
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