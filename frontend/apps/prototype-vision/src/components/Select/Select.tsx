import { useState, useRef, useEffect } from 'react';
import { SelectProps, SelectOption } from './Select.types';
import { ChevronDown, X, Search } from 'lucide-react';

/**
 * Select Component - Dropdown menu for selecting one or multiple options
 * Supports 2 modes (single, multiple)
 * 3 sizes (sm, md, lg)
 * Built-in search/filter functionality
 * Grouped options support
 * Full keyboard navigation
 *
 * Accessibility:
 * - ARIA attributes for listbox role
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Screen reader friendly
 * - Focus management
 */
export function Select({
  mode = 'single',
  options,
  value,
  size = 'md',
  label,
  placeholder = 'Select option...',
  helperText,
  error,
  searchable = true,
  clearable = false,
  disabled = false,
  loading = false,
  fullWidth = false,
  required = false,
  maxSelected,
  onChange,
  onOpenChange,
  noResultsMessage = 'No results found',
  className = '',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalize value to array
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

  // Filter options based on search
  const filteredOptions = searchValue
    ? options.filter(opt =>
        opt.label.toLowerCase().includes(searchValue.toLowerCase()) ||
        opt.description?.toLowerCase().includes(searchValue.toLowerCase())
      )
    : options;

  // Get selected option labels
  const selectedLabels = options
    .filter(opt => selectedValues.includes(opt.value))
    .map(opt => opt.label);

  // Size styles
  const sizeStyles = {
    sm: 'text-sm px-2.5 py-1.5',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3',
  };

  // Handle open/close
  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
    if (newOpen && searchable) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  };

  // Handle selection
  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;

    let newValue: string | string[];

    if (mode === 'single') {
      newValue = option.value;
      handleOpenChange(false);
    } else {
      newValue = selectedValues.includes(option.value)
        ? selectedValues.filter(v => v !== option.value)
        : [...selectedValues, option.value];

      if (maxSelected && newValue.length >= maxSelected) {
        handleOpenChange(false);
      }
    }

    onChange?.(newValue);
  };

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(mode === 'single' ? '' : []);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOpenChange(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        handleOpenChange(false);
        break;
      default:
        break;
    }
  };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        handleOpenChange(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const displayValue =
    mode === 'single'
      ? selectedLabels[0] || placeholder
      : selectedLabels.length > 0
        ? `${selectedLabels.length} selected`
        : placeholder;

  const fullWidthClass = fullWidth ? 'w-full' : '';

  return (
    <div ref={containerRef} className={`${fullWidthClass}`}>
      {label && (
        <label className="block text-sm font-medium text-ds-gray-900 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Select Button */}
        <button
          type="button"
          onClick={() => handleOpenChange(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled || loading}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-disabled={disabled}
          aria-label={label}
          className={`
            w-full flex items-center justify-between
            bg-white border rounded-md transition-colors duration-200
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ds-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            ${sizeStyles[size]}
            ${error ? 'border-red-500' : 'border-ds-gray-300 hover:border-ds-gray-400'}
            ${isOpen ? 'border-ds-primary bg-blue-50' : ''}
            ${className}
          `}
        >
          <span className="text-ds-gray-700 truncate">{displayValue}</span>

          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
            {clearable && selectedLabels.length > 0 && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-ds-gray-200 rounded"
                aria-label="Clear selection"
              >
                <X size={16} />
              </button>
            )}

            {loading && (
              <svg
                className="animate-spin h-4 w-4 text-ds-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
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

            <ChevronDown
              size={18}
              className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-white border border-ds-gray-300 rounded-md shadow-lg"
            role="listbox"
            aria-multiselectable={mode === 'multiple'}
          >
            {/* Search Input */}
            {searchable && (
              <div className="border-b border-ds-gray-200 p-2">
                <div className="flex items-center gap-2 px-2 py-1 bg-ds-gray-50 rounded">
                  <Search size={16} className="text-ds-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={e => {
                      setSearchValue(e.target.value);
                      setHighlightedIndex(0);
                    }}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                </div>
              </div>
            )}

            {/* Options */}
            <div className="max-h-64 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-ds-gray-500">
                  {noResultsMessage}
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    role="option"
                    aria-selected={selectedValues.includes(option.value)}
                    disabled={option.disabled}
                    className={`
                      w-full text-left px-4 py-2 transition-colors
                      flex items-start gap-3 disabled:opacity-50 disabled:cursor-not-allowed
                      ${
                        index === highlightedIndex
                          ? 'bg-blue-100 text-ds-primary'
                          : selectedValues.includes(option.value)
                            ? 'bg-blue-50 text-ds-primary font-medium'
                            : 'hover:bg-ds-gray-100'
                      }
                    `}
                  >
                    {option.icon && (
                      <span className="flex-shrink-0 mt-0.5">{option.icon}</span>
                    )}
                    <div className="flex-1">
                      <div>{option.label}</div>
                      {option.description && (
                        <div className="text-xs text-ds-gray-500">
                          {option.description}
                        </div>
                      )}
                    </div>
                    {mode === 'multiple' && (
                      <input
                        type="checkbox"
                        checked={selectedValues.includes(option.value)}
                        onChange={() => {}}
                        className="mt-0.5"
                        disabled={option.disabled}
                      />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Helper Text / Error */}
      {error && (
        <p className="mt-1 text-xs text-red-500 flex items-center">
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
        <p className="mt-1 text-xs text-ds-gray-600">{helperText}</p>
      )}
    </div>
  );
}

Select.displayName = 'Select';
