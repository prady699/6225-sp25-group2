'use client';

import React from 'react';
import NextImage, { ImageProps as NextImageProps } from 'next/image';

interface ImageProps extends Omit<NextImageProps, 'alt'> {
  alt?: string;
}

export default function Image({ alt = '', ...props }: ImageProps) {
  return <NextImage alt={alt} {...props} />;
} 