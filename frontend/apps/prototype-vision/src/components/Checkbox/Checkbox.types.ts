import { CommonProps } from '../types/common';

export type CheckboxSize = 'sm' | 'md' | 'lg';
export type CheckboxState = 'default' | 'error' | 'success';

export interface CheckboxProps extends Omit<CommonProps, 'variant'> {
  /**
   * Whether checkbox is checked
   */
  checked?: boolean;

  /**
   * Indeterminate state (partial selection)
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Checkbox size
   * @default 'md'
   */
  size?: CheckboxSize;

  /**
   * Checkbox state
   * @default 'default'
   */
  state?: CheckboxState;

  /**
   * Label text
   */
  label?: string;

  /**
   * Label position
   * @default 'right'
   */
  labelPosition?: 'left' | 'right';

  /**
   * Helper text below checkbox
   */
  helperText?: string;

  /**
   * Error message
   */
  error?: string;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Required field
   * @default false
   */
  required?: boolean;

  /**
   * Callback when checked state changes
   */
  onChange?: (checked: boolean) => void;

  /**
   * Callback on focus
   */
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;

  /**
   * Callback on blur
   */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;

  /**
   * Custom CSS class
   */
  className?: string;

  /**
   * Input name attribute
   */
  name?: string;

  /**
   * Input value attribute
   */
  value?: string;

  /**
   * Input id attribute
   */
  id?: string;
}
