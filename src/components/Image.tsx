import React, { useState } from 'react';
import NextImage, { ImageProps as NextImageProps } from 'next/image';

interface ImageProps extends Omit<NextImageProps, 'onError' | 'alt'> {
  alt: string;
  priority?: boolean;
}

export default function Image({ src, alt, priority = false, ...props }: ImageProps) {
  const [error, setError] = useState(false);

  // Placeholder image URL (replace with your actual placeholder)
  const placeholderImage = '/images/placeholder.jpg';

  return (
    <NextImage
      {...props}
      src={error ? placeholderImage : src}
      alt={alt}
      priority={priority}
      onError={() => setError(true)}
    />
  );
} 