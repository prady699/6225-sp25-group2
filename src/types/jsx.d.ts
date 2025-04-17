import React from 'react';
import { HTMLMotionProps } from 'framer-motion';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Add specific type definitions for motion components if needed
declare module 'framer-motion' {
  export interface MotionProps extends HTMLMotionProps<'div'> {}
}
