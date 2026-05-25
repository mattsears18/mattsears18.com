/*
 * Twitter card image for project pages — reuses the per-project Open Graph
 * image. Same renderer, same dimensions, separate file because Next.js
 * looks them up by convention name.
 */
export { default, alt, size, contentType, generateImageMetadata } from './opengraph-image';
