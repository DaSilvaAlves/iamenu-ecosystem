import { CardProps } from './Card.types';

/**
 * Card Component - Container for content with visual separation
 * Supports 3 variants (elevated, outlined, filled)
 * 3 sizes (sm, md, lg)
 * Optional header, footer, and image
 * Clickable and interactive states
 *
 * Accessibility:
 * - Semantic section element or button if clickable
 * - Proper ARIA attributes for interactive cards
 * - Keyboard accessible when clickable
 * - Clear focus indicators
 */
export function Card({
  variant = 'elevated',
  size = 'md',
  children,
  header,
  footer,
  image,
  clickable = false,
  hoverable = true,
  disabled = false,
  loading = false,
  onClick,
  rounded = 'md',
  className = '',
}: CardProps) {
    // Base styles
    const baseStyles = 'transition-all duration-200';

    // Variant styles
    const variantStyles = {
      elevated:
        'bg-white shadow-md hover:shadow-lg border border-transparent',
      outlined:
        'bg-white shadow-none border border-ds-gray-300 hover:border-ds-gray-400',
      filled:
        'bg-ds-gray-100 shadow-none border border-transparent hover:bg-ds-gray-200',
    };

    // Size styles (padding)
    const sizeStyles = {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };

    // Rounded styles
    const roundedStyles = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    };

    // Clickable styles
    const clickableStyles = clickable && hoverable && !disabled ? 'cursor-pointer' : '';

    // Combine all classes
    const cardClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${roundedStyles[rounded]} ${clickableStyles} ${className}`;

    // Handle click
    const handleClick = () => {
      if (clickable && !disabled && !loading && onClick) {
        onClick();
      }
    };

    // Handle keyboard
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement | HTMLDivElement>) => {
      if (clickable && !disabled && !loading && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onClick?.();
      }
    };

    const commonProps = {
      className: cardClasses,
      'aria-disabled': disabled,
      'aria-busy': loading,
    };

    const cardContent = (
      <>
        {/* Image Banner */}
        {image && (
          <div className="overflow-hidden -m-4 mb-4" style={{ marginBottom: size === 'sm' ? '0.75rem' : size === 'lg' ? '1.5rem' : '1rem' }}>
            <img
              src={image.src}
              alt={image.alt}
              height={image.height || 200}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Header */}
        {header && (
          <div className={`mb-4 ${size === 'sm' ? 'mb-2' : size === 'lg' ? 'mb-6' : ''}`}>
            {header}
          </div>
        )}

        {/* Content */}
        <div className={`${footer ? 'mb-4' : ''} ${size === 'sm' ? 'mb-2' : size === 'lg' ? 'mb-4' : ''}`}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={`pt-4 border-t border-ds-gray-200 ${size === 'sm' ? 'pt-2' : size === 'lg' ? 'pt-6' : ''}`}>
            {footer}
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/50 rounded-md flex items-center justify-center">
            <svg
              className="animate-spin h-6 w-6 text-ds-primary"
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
          </div>
        )}
      </>
    );

    // Render as button if clickable
    if (clickable) {
      return (
        <button
          {...commonProps}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          disabled={disabled || loading}
          className={`${cardClasses} relative w-full text-left ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          type="button"
          role="button"
          tabIndex={disabled ? -1 : 0}
        >
          {cardContent}
        </button>
      );
    }

  // Render as div if not clickable
  return (
    <div {...commonProps} className={`${cardClasses} relative ${disabled ? 'opacity-50' : ''}`}>
      {cardContent}
    </div>
  );
}
