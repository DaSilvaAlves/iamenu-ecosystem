/**
 * Input Component
 *
 * Types: text, email, password, number, search, textarea
 */

import React, { useState } from 'react';
import { Eye, EyeOff, Search, X } from 'lucide-react';

const Input = React.forwardRef(({
  type = 'text',
  label,
  error,
  hint,
  icon: Icon,
  clearable = false,
  onClear,
  className = '',
  inputClassName = '',
  disabled = false,
  required = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isTextarea = type === 'textarea';
  const isPassword = type === 'password';
  const isSearch = type === 'search';
  const hasValue = props.value && props.value.length > 0;

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const baseInputClasses = `
    w-full bg-surface-card border rounded-lg px-4 py-2.5
    text-white placeholder-text-muted
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-200
    ${Icon || isSearch ? 'pl-10' : ''}
    ${isPassword || (clearable && hasValue) ? 'pr-10' : ''}
    ${error ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : 'border-border'}
  `;

  const InputComponent = isTextarea ? 'textarea' : 'input';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-white">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Left icon */}
        {(Icon || isSearch) && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            {Icon ? <Icon className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </div>
        )}

        <InputComponent
          ref={ref}
          type={inputType}
          disabled={disabled}
          required={required}
          className={`${baseInputClasses} ${inputClassName}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Right icons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {/* Clear button */}
          {clearable && hasValue && !isPassword && (
            <button
              type="button"
              onClick={() => {
                onClear?.();
                props.onChange?.({ target: { value: '' } });
              }}
              className="text-text-muted hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Password toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-text-muted hover:text-white transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Hint text */}
      {hint && !error && (
        <p className="text-sm text-text-muted">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
