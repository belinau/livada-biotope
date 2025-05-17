import createCache from '@emotion/cache';

/**
 * Creates an Emotion cache for Material-UI server-side rendering.
 * This helps prevent style flickering and ensures consistent styling between server and client renders.
 */
export default function createEmotionCache() {
  return createCache({ key: 'css', prepend: true });
}
