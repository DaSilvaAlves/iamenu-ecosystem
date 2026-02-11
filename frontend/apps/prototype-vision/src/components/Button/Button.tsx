import { forwardRef } from 'react';
import { ButtonProps } from './Button.types';

/**
 * Button Component - Core component for user actions
 * Supports 3 variants (primary, secondary, tertiary)
 * 3 sizes (sm, md, lg)
 * Multiple states (default, hover, active, disabled, loading)
 *
 * Accessibility:
 * - Semantic button element
 * - Full keyboard navigation support
 * - ARIA attributes for screen readers
 * - Focus indicators for visibility
 * - Contrast ratios meet WCAG AA
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      children,
      onClick,
      disabled = false,
      loading = false,
      type = 'button',
      fullWidth = false,
      className = '',
      'aria-label': ariaLabel,
      'aria-disabled': ariaDisabled,
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    // Base styles
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ds-primary disabled:opacity-50 disabled:cursor-not-allowed';

    // Variant styles
    const variantStyles = {
      primary:
        'bg-ds-primary text-white hover:bg-blue-600 active:bg-blue-700 disabled:bg-ds-primary',
      secondary:
        'bg-ds-gray-200 text-ds-gray-800 hover:bg-ds-gray-300 active:bg-ds-gray-400 disabled:bg-ds-gray-200',
      tertiary:
        'bg-transparent text-ds-primary hover:bg-blue-50 active:bg-blue-100 disabled:text-ds-gray-400 border border-ds-primary disabled:border-ds-gray-400',
    };

    // Size styles
    const sizeStyles = {
      sm: 'px-3 py-2 text-sm gap-2',
      md: 'px-4 py-2.5 text-base gap-2',
      lg: 'px-6 py-3 text-lg gap-2',
    };

    // Full width
    const fullWidthClass = fullWidth ? 'w-full' : '';

    // Combine all classes
    const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidthClass} ${className}`;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        onClick={onClick}
        className={buttonClasses}
        aria-label={ariaLabel}
        aria-disabled={ariaDisabled || isDisabled}
        role="button"
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
