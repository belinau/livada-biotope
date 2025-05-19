import { StaticImageData } from 'next/image';

export interface GalleryImage {
  id: string | number;
  src: string | StaticImageData;
  title?: string;
  description?: string;
  width: number;
  height: number;
  alt?: string;
  tags?: string[];
  date?: Date | string;
  location?: string;
  aspectRatio?: number;
  thumbnail?: string | StaticImageData;
  fullSize?: string | StaticImageData;
  metadata?: Record<string, any>;
}

export interface GalleryImageGridProps {
  images: GalleryImage[];
  onImageClick?: (image: GalleryImage, index: number) => void;
  columns?: number;
  gap?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  enableLightbox?: boolean;
  lightboxOptions?: {
    showThumbnails?: boolean;
    showDownload?: boolean;
    showZoom?: boolean;
    showFullscreen?: boolean;
    showSlideshow?: boolean;
  };
  loading?: 'lazy' | 'eager';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  className?: string;
  style?: React.CSSProperties;
  itemStyle?: React.CSSProperties;
  renderImage?: (image: GalleryImage) => React.ReactNode;
  renderThumbnail?: (image: GalleryImage) => React.ReactNode;
  onLoad?: (image: GalleryImage) => void;
  onError?: (error: Error, image: GalleryImage) => void;
}

export interface LightboxProps {
  images: GalleryImage[];
  isOpen: boolean;
  currentIndex: number;
  onClose: () => void;
  onMoveNext: () => void;
  onMovePrev: () => void;
  onThumbnailClick: (index: number) => void;
  showThumbnails?: boolean;
  showDownload?: boolean;
  showZoom?: boolean;
  showFullscreen?: boolean;
  showSlideshow?: boolean;
}

export interface ImageGridProps {
  images: GalleryImage[];
  columns?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  onImageClick?: (image: GalleryImage, index: number) => void;
  renderImage?: (image: GalleryImage) => React.ReactNode;
  renderThumbnail?: (image: GalleryImage) => React.ReactNode;
  loading?: 'lazy' | 'eager';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  className?: string;
  style?: React.CSSProperties;
  itemStyle?: React.CSSProperties;
  onLoad?: (image: GalleryImage) => void;
  onError?: (error: Error, image: GalleryImage) => void;
}

export interface Gallery {
  slug: string;
  title: string;
  description?: string;
  date: string;
  coverImage?: string;
  images: GalleryImage[];
  tags?: string[];
}
