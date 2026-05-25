/*
 * Twitter card image for the `/work` index — reuses the Open Graph image
 * renderer. Next.js requires a separate file rather than letting us alias
 * one to the other.
 */
export { default, alt, size, contentType } from './opengraph-image';
