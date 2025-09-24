/**
 * Utility functions for handling path normalization
 */

/**
 * Normalizes image paths to ensure they work correctly in the application
 * @param {string} path - The image path to normalize
 * @returns {string} - The normalized image path
 */
export const normalizeImagePath = (path) => {
  if (!path) return '';
  
  // If it's already an absolute path starting with '/', return as-is
  if (path.startsWith('/')) {
    // Ensure it includes the proper image path prefix
    if (!path.startsWith('/images/')) {
      // If it doesn't start with /images/ but starts with /, it might be a relative path that was incorrectly processed
      return path;
    }
    return path;
  }
  
  // If it's a relative path like ../../images/..., resolve it properly
  // For our use case, we want to ensure all paths are absolute
  if (path.includes('images/')) {
    // Extract the part after 'images/' and make it absolute
    const imagePart = path.split('images/')[1];
    return `/images/${imagePart}`;
  }
  
  // For any other relative path, return empty or handle as needed
  console.warn(`Unrecognized image path format: ${path}`);
  return path;
};