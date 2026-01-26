import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, AnchorHTMLAttributes, forwardRef } from 'react';

// Common base styles for buttons and links
const baseStyles =
    'inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50';

const variants = {
    primary: 'bg-[#1A1A1A] text-[#FAFAFA] hover:bg-gray-800 shadow-sm',
    outline: 'border border-[#1A1A1A] bg-transparent hover:bg-[#1A1A1A] hover:text-[#FAFAFA]',
    ghost: 'hover:bg-gray-100 hover:text-gray-900',
    link: 'text-[#1A1A1A] underline-offset-4 hover:underline',
};

const sizes = {
    default: 'h-10 px-6 py-2',
    sm: 'h-8 px-4 text-xs',
    lg: 'h-12 px-8 text-base',
    icon: 'h-10 w-10',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof variants;
    size?: keyof typeof sizes;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
        return (
            <button
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

interface CustomLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    variant?: keyof typeof variants;
    size?: keyof typeof sizes;
    external?: boolean;
}

const CustomLink = forwardRef<HTMLAnchorElement, CustomLinkProps>(
    ({ className, href, variant = 'link', size = 'default', external, ...props }, ref) => {
        // If it's an external link or explicitly marked external
        if (external || href.startsWith('http')) {
            return (
                <a
                    href={href}
                    className={cn(baseStyles, variants[variant], sizes[size], className)}
                    target="_blank"
                    rel="noopener noreferrer"
                    ref={ref}
                    {...props}
                />
            );
        }

        return (
            <Link
                href={href}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                ref={ref}
                {...props}
            />
        );
    }
);
CustomLink.displayName = 'CustomLink';

export { Button, CustomLink, baseStyles, variants as buttonVariants };
