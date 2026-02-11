import { useRef, useEffect } from 'react';
import { CheckboxProps } from './Checkbox.types';

/**
 * Checkbox Component - Selectable input for multiple options
 * Supports 3 sizes (sm, md, lg)
 * 3 states (default, error, success)
 * Indeterminate state for partial selections
 * Full keyboard navigation and accessibility
 *
 * Accessibility:
 * - Semantic input element with checkbox role
 * - Associated label for screen readers
 * - ARIA attributes for state
 * - Full keyboard support (Space to toggle)
 * - Focus indicators
 */
export function Checkbox({
  checked = false,
  indeterminate = false,
  size = 'md',
  state = 'default',
  label,
  labelPosition = 'right',
  helperText,
  error,
  disabled = false,
  required = false,
  onChange,
  onFocus,
  onBlur,
  className = '',
  name,
  value,
  id,
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Set indeterminate state on input element
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  // Determine state based on error
  const displayState = error ? 'error' : state;

  // Size styles
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  // State styles
  const stateStyles = {
    default: 'border-ds-gray-300 accent-ds-primary',
    error: 'border-red-500 accent-red-500',
    success: 'border-green-500 accent-green-500',
  };

  // Label size styles
  const labelSizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  // Handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  const displayLabel = label && (required ? `${label} *` : label);

  const checkbox = (
    <input
      ref={inputRef}
      type="checkbox"
      checked={checked}
      onChange={handleChange}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
      name={name}
      value={value}
      id={id}
      aria-label={label}
      aria-invalid={displayState === 'error'}
      aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
      className={`
        ${sizeStyles[size]}
        border rounded transition-colors
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ds-primary
        disabled:opacity-50 disabled:cursor-not-allowed
        ${stateStyles[displayState]}
        ${className}
      `}
    />
  );

  const labelElement = displayLabel && (
    <label
      htmlFor={id}
      className={`
        select-none cursor-pointer
        ${labelSizeStyles[size]}
        ${disabled ? 'cursor-not-allowed opacity-50' : ''}
      `}
    >
      {displayLabel}
    </label>
  );

  return (
    <div>
      <div className="flex items-center gap-2">
        {labelPosition === 'left' && labelElement}
        {checkbox}
        {labelPosition === 'right' && labelElement}
      </div>

      {/* Helper Text / Error */}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-500 flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
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

      {helperText && !error && (
        <p id={`${id}-helper`} className="mt-1 text-xs text-ds-gray-600">
          {helperText}
        </p>
      )}
    </div>
  );
}

Checkbox.displayName = 'Checkbox';
