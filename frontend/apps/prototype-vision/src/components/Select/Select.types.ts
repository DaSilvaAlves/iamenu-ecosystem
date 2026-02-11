import { ReactNode } from 'react';
import { CommonProps } from '../types/common';

export type SelectSize = 'sm' | 'md' | 'lg';
export type SelectMode = 'single' | 'multiple';

export interface SelectOption {
  /**
   * Unique identifier for the option
   */
  value: string;

  /**
   * Display label for the option
   */
  label: string;

  /**
   * Optional description/helper text
   */
  description?: string;

  /**
   * Whether option is disabled
   */
  disabled?: boolean;

  /**
   * Optional group name for option grouping
   */
  group?: string;

  /**
   * Optional icon/element to display before label
   */
  icon?: ReactNode;
}

export interface SelectProps extends Omit<CommonProps, 'variant'> {
  /**
   * Select mode
   * @default 'single'
   */
  mode?: SelectMode;

  /**
   * Available options
   */
  options: SelectOption[];

  /**
   * Selected value(s)
   * - single mode: string
   * - multiple mode: string[]
   */
  value?: string | string[];

  /**
   * Select size
   * @default 'md'
   */
  size?: SelectSize;

  /**
   * Label text
   */
  label?: string;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Helper text below select
   */
  helperText?: string;

  /**
   * Error message
   */
  error?: string;

  /**
   * Show search input in dropdown
   * @default true
   */
  searchable?: boolean;

  /**
   * Clear button to reset selection
   * @default false
   */
  clearable?: boolean;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Full width select
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Required field
   * @default false
   */
  required?: boolean;

  /**
   * Maximum number of selected items (multiple mode)
   */
  maxSelected?: number;

  /**
   * Callback when value changes
   */
  onChange?: (value: string | string[]) => void;

  /**
   * Callback when dropdown opens/closes
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * No results message
   */
  noResultsMessage?: string;

  /**
   * Custom CSS class
   */
  className?: string;
}
