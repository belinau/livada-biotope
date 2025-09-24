import { normalizeImagePath } from '../utils/path-utils';

// This function fetches recent images from the uploads directory
export const fetchRecentImages = async (count = 30) => {
  try {
    const response = await fetch('/images/uploads/manifest.json');
    if (!response.ok) {
      throw new Error('Image manifest not found');
    }
    const manifest = await response.json();
    // The manifest contains files sorted by modification time (newest first)
    // We just need to slice the array to get the desired count
    return manifest.files.slice(0, count);
  } catch (error) {
    console.error('Error fetching recent images from manifest:', error);
    return []; // Return empty array on error
  }
};

const isLocalDevelopment = process.env.NODE_ENV === 'development';

export const getOptimizedImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // Normalize the path first
  const normalizedPath = normalizeImagePath(imagePath);
  
  // In local development, return the path directly without Netlify CDN
  if (isLocalDevelopment) {
    // Handle both relative and absolute paths
    if (normalizedPath.startsWith('http') || normalizedPath.startsWith('//')) {
      return normalizedPath;
    }
    // Ensure the path is correctly formatted for local development
    return normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
  }

  // Production: Use Netlify CDN
  const url = new URL('https://livada.bio');
  url.pathname = `/.netlify/images`;
  url.searchParams.append('url', normalizedPath);
  url.searchParams.append('w', '1200');
  url.searchParams.append('q', '80');
  return url.toString();
};

export const getResponsiveSrcSet = (imagePath) => {
  if (!imagePath || isLocalDevelopment) {
    // In local development, just return the normalized image path
    return normalizeImagePath(imagePath);
  }

  // Normalize the path for production
  const normalizedPath = normalizeImagePath(imagePath);
  
  // Production: Generate responsive srcset
  const widths = [400, 600, 800, 1000, 1200, 1600, 2000];
  const url = new URL('https://livada.bio');
  
  return widths.map(width => {
    url.pathname = `/.netlify/images`;
    const params = new URLSearchParams();
    params.append('url', normalizedPath);
    params.append('w', width.toString());
    params.append('q', '80');
    return `${url.toString()}?${params.toString()} ${width}w`;
  }).join(', ');
};