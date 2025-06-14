import React, { useState } from 'react';

const ImageWithFallback = ({ src, alt, className, fallbackSrc, type = 'article' }) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      if (fallbackSrc) {
        setImageSrc(fallbackSrc);
      } else {
        // Use a reliable fallback image based on type
        setImageSrc(type === 'profile' ? '/images/default-author.jpg' : '/images/default-article.jpg');
      }
    }
  };

  return (
    <img 
      src={imageSrc} 
      alt={alt} 
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default ImageWithFallback; 