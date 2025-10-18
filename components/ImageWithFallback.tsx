
import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, alt, ...props }) => {
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
  };

  return (
    <img
      src={error ? '/placeholder/image-placeholder.svg' : src}
      alt={alt}
      onError={handleError}
      {...props}
    />
  );
};
