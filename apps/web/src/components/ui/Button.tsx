import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    fullWidth?: boolean;
    size?: 'normal' | 'large';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', fullWidth = false, size = 'normal', children, ...props }, ref) => {

        let baseClass = 'btn';

        if (variant === 'primary') baseClass += ' btn-primary';
        if (variant === 'secondary') baseClass += ' btn-secondary';

        if (fullWidth) baseClass += ' btn-full';
        if (size === 'large') baseClass += ' btn-large';

        return (
            <button
                ref={ref}
                className={`${baseClass} ${className}`}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
