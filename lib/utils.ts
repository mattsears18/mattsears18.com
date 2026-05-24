import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Conditional class joiner that resolves Tailwind conflicts.
 * Standard shadcn helper — used by primitives like Button to merge variant
 * classes with caller overrides.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
