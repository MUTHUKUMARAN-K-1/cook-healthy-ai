// Updated Button Component - Zomato Style

import * as React from 'react';
import { cn } from '@/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'health' | 'zomato' | 'purple';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          // Variants
          {
            // Default - Zomato Red
            'default': 'bg-[#E23744] text-white hover:bg-[#CB202D] shadow-md hover:shadow-lg',
            // Health Green
            'health': 'bg-[#24963F] text-white hover:bg-[#1B7A30] shadow-md hover:shadow-lg',
            // Zomato Red with gradient
            'zomato': 'bg-gradient-to-r from-[#E23744] to-[#FF7043] text-white hover:from-[#CB202D] hover:to-[#E65C3C] shadow-md hover:shadow-lg',
            // Secondary
            'secondary': 'bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] border border-[var(--border)]',
            // Outline
            'outline': 'border border-[var(--border)] bg-transparent hover:bg-[var(--surface)] text-[var(--text-primary)]',
            // Ghost
            'ghost': 'bg-transparent hover:bg-[var(--surface)] text-[var(--text-primary)]',
            // Destructive
            'destructive': 'bg-red-500 text-white hover:bg-red-600',
            // Purple
            'purple': 'bg-[#7C3AED] text-white hover:bg-[#6D28D9] shadow-md hover:shadow-lg',
          }[variant],
          // Sizes
          {
            'default': 'h-10 px-5 text-sm',
            'sm': 'h-8 px-3 text-xs',
            'lg': 'h-12 px-6 text-base',
            'icon': 'h-10 w-10 p-0',
          }[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
