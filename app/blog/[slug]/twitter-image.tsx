/*
 * Twitter card image for blog posts — reuses the per-post Open Graph image.
 * Same renderer, same dimensions, separate file because Next.js looks them
 * up by convention name.
 */
export { default, alt, size, contentType, generateImageMetadata } from './opengraph-image';
