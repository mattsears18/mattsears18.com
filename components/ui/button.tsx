import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * Button primitive — shadcn/ui pattern (Radix Slot + cva), adapted to use
 * our design tokens (`bg`, `fg`, `accent`, `border`) instead of shadcn's
 * default `primary`/`secondary`/`muted` color names.
 *
 * Variants used on the landing page:
 *   - `default`   → solid accent on fg-contrast — primary CTA
 *   - `ghost`     → transparent, hover ring — secondary CTA
 *
 * `outline` / `link` are kept for future slices (#9, #10) so we don't need
 * a second pass at this file when they ship.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-accent text-white hover:bg-accent/90 dark:text-bg dark:hover:bg-accent/90',
        ghost:
          'text-fg border border-border bg-transparent hover:border-accent hover:text-accent',
        outline:
          'border border-border bg-bg-elevated text-fg hover:border-accent hover:text-accent',
        link: 'text-accent underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-9 px-3',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
