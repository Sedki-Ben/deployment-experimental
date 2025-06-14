import React, { useState } from 'react';
import defaultAuthorImage from '../assets/images/bild3.jpg';

const ImageWithFallback = ({ src, alt, className, fallbackSrc, type = 'article' }) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      if (fallbackSrc) {
        setImageSrc(fallbackSrc);
      } else {
        // Use bild3.jpg for author images, default-article.jpg for articles
        setImageSrc(type === 'profile' ? defaultAuthorImage : '/images/default-article.jpg');
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