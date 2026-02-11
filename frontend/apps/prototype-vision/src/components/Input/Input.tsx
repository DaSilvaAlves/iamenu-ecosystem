import { forwardRef, useState } from 'react';
import { InputProps } from './Input.types';

/**
 * Input Component - Core text input field
 * Supports multiple types (text, password, email, number, etc.)
 * 3 sizes (sm, md, lg)
 * 4 states (default, error, success, warning)
 * Optional icons, labels, and helper text
 *
 * Accessibility:
 * - Semantic input element
 * - Associated label for screen readers
 * - Error messages with aria-describedby
 * - Full keyboard navigation support
 * - Focus indicators for visibility
 * - Loading state with aria-busy
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      size = 'md',
      state: stateProp = 'default',
      label,
      helperText,
      error,
      success,
      startIcon,
      endIcon,
      disabled = false,
      loading = false,
      fullWidth = false,
      required = false,
      showCharCount = false,
      maxCharCount,
      className = '',
      value,
      onChange,
      onFocus,
      onBlur,
      placeholder,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      id,
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [charCount, setCharCount] = useState(
      typeof value === 'string' ? value.length : 0
    );

    // Determine state based on error/success
    const state = error ? 'error' : success ? 'success' : stateProp;
    const isDisabled = disabled || loading;

    // Base styles
    const baseStyles =
      'w-full px-3 py-2 bg-white border rounded-md transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ds-primary disabled:opacity-50 disabled:cursor-not-allowed font-normal';

    // Size styles
    const sizeStyles = {
      sm: 'text-sm px-2.5 py-1.5',
      md: 'text-base px-3 py-2',
      lg: 'text-lg px-4 py-3',
    };

    // State styles
    const stateStyles = {
      default: `border-ds-gray-300 ${
        isFocused ? 'border-ds-primary bg-blue-50' : 'hover:border-ds-gray-400'
      }`,
      error: `border-red-500 ${isFocused ? 'bg-red-50' : 'bg-white'}`,
      success: `border-green-500 ${isFocused ? 'bg-green-50' : 'bg-white'}`,
      warning: `border-yellow-500 ${isFocused ? 'bg-yellow-50' : 'bg-white'}`,
    };

    // Icon container styles
    const iconContainerStyles = 'flex items-center justify-center w-5 h-5 text-ds-gray-600';

    // Input wrapper styles
    const wrapperFullWidth = fullWidth ? 'w-full' : '';

    // Handle change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    // Handle focus
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    // Handle blur
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const describedById = [
      ariaDescribedBy,
      error ? `${id}-error` : undefined,
      success ? `${id}-success` : undefined,
      showCharCount ? `${id}-charcount` : undefined,
      helperText ? `${id}-helper` : undefined,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={`${wrapperFullWidth}`}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-ds-gray-900 mb-2"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {/* Start Icon */}
          {startIcon && (
            <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconContainerStyles}`}>
              {startIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={id}
            type={type}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={isDisabled}
            required={required}
            placeholder={placeholder}
            aria-label={ariaLabel}
            aria-describedby={describedById || undefined}
            aria-disabled={isDisabled}
            aria-invalid={state === 'error'}
            aria-busy={loading}
            className={`${baseStyles} ${sizeStyles[size]} ${stateStyles[state]} ${
              startIcon ? 'pl-10' : ''
            } ${endIcon ? 'pr-10' : ''} ${className}`}
            {...rest}
          />

          {/* End Icon */}
          {endIcon && (
            <div className={`absolute right-3 top-1/2 -translate-y-1/2 ${iconContainerStyles}`}>
              {endIcon}
            </div>
          )}

          {/* Loading Spinner */}
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg
                className="animate-spin h-4 w-4 text-ds-primary"
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
        </div>

        {/* Char Count */}
        {showCharCount && (
          <div
            id={`${id}-charcount`}
            className="mt-1 text-xs text-ds-gray-600 text-right"
          >
            {charCount}
            {maxCharCount && `/${maxCharCount}`}
          </div>
        )}

        {/* Helper Text */}
        {helperText && (
          <p id={`${id}-helper`} className="mt-1 text-xs text-ds-gray-600">
            {helperText}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p id={`${id}-error`} className="mt-1 text-xs text-red-500 flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {/* Success Message */}
        {success && (
          <p id={`${id}-success`} className="mt-1 text-xs text-green-500 flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {success}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
