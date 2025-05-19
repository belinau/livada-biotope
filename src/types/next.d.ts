import { Metadata } from 'next';

// Declare module for iNaturalist feed component
declare module '@/components/INaturalistFeed' {
  import { FC } from 'react';
  
  interface INaturalistFeedProps {
    projectId: string;
    limit?: number;
    locale?: 'en' | 'sl';
    className?: string;
  }

  const INaturalistFeed: FC<INaturalistFeedProps>;
  export default INaturalistFeed;
}

// Extend Next.js types
declare module 'next' {
  export interface Metadata {
    title: string | { default: string; template?: string };
    description?: string;
    keywords?: string[];
    authors?: Array<{ name: string; url?: string }>;
    creator?: string;
    publisher?: string;
    formatDetection?: {
      email?: boolean;
      address?: boolean;
      telephone?: boolean;
    };
    robots?: string | { index?: boolean; follow?: boolean };
    viewport?: string | { width: string; initialScale?: number };
    themeColor?: string | { media: string; color: string }[];
    openGraph?: {
      title?: string;
      description?: string;
      url?: string;
      siteName?: string;
      images?: Array<{
        url: string;
        width?: number;
        height?: number;
        alt?: string;
      }>;
      locale?: string;
      type?: string;
    };
    twitter?: {
      card?: string;
      title?: string;
      description?: string;
      images?: string[];
      creator?: string;
    };
    icons?: string | { icon: string; type?: string; sizes?: string }[];
    manifest?: string;
    alternates?: {
      canonical?: string;
      languages?: { [locale: string]: string };
      media?: { [mediaName: string]: string };
      types?: { [mimeType: string]: string };
    };
    other?: { [key: string]: string };
  }
}

// Global type declarations
declare global {
  // Add global types here if needed
  namespace JSX {
    interface IntrinsicElements {
      // Add any custom elements here
    }
  }
}

// Type definitions for Next.js

// Add type definitions for global JSX elements
declare namespace JSX {
  interface IntrinsicElements {
    'ion-icon': {
      name: string;
      class?: string;
      style?: React.CSSProperties;
      [key: string]: any;
    };
  }
}

// Add type definitions for environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_GA_MEASUREMENT_ID?: string;
    NEXT_PUBLIC_INATURALIST_PROJECT_ID?: string;
    NEXT_PUBLIC_INATURALIST_USER_ID?: string;
    NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN?: string;
    NEXT_PUBLIC_INSTAGRAM_USER_ID?: string;
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?: string;
    NEXT_PUBLIC_SITE_URL?: string;
    RESEND_API_KEY?: string;
    EMAIL_FROM?: string;
    EMAIL_TO?: string;
    // Add other environment variables here as needed
  }
}

// Add type definitions for MDX files
declare module '*.mdx' {
  import { ComponentType } from 'react';
  const MDXComponent: ComponentType;
  export default MDXComponent;
}

// Add type definitions for other file types
declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.webp';
