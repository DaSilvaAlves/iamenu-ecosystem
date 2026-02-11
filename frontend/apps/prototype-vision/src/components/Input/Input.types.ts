import React, { InputHTMLAttributes, ReactNode } from 'react';
import { CommonProps } from '../types/common';

export type InputType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputState = 'default' | 'error' | 'success' | 'warning';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>,
    CommonProps {
  /**
   * Input type
   * @default 'text'
   */
  type?: InputType;

  /**
   * Input size
   * @default 'md'
   */
  size?: InputSize;

  /**
   * Input state (visual feedback)
   * @default 'default'
   */
  state?: InputState;

  /**
   * Label text (optional)
   */
  label?: string;

  /**
   * Helper text below input
   */
  helperText?: string;

  /**
   * Error message (sets state to 'error' if provided)
   */
  error?: string;

  /**
   * Success message (sets state to 'success' if provided)
   */
  success?: string;

  /**
   * Icon/element to display on the left
   */
  startIcon?: ReactNode;

  /**
   * Icon/element to display on the right
   */
  endIcon?: ReactNode;

  /**
   * Makes input required
   */
  required?: boolean;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Loading state (shows spinner, disables interaction)
   * @default false
   */
  loading?: boolean;

  /**
   * Full width input
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Character count display
   */
  showCharCount?: boolean;

  /**
   * Maximum character count (for display)
   */
  maxCharCount?: number;

  /**
   * Callback when input value changes
   */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Callback on focus
   */
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;

  /**
   * Callback on blur
   */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}
