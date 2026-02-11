/**
 * Input Component Types
 */

import React from 'react';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'textarea';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Input type (text, email, password, number, search, textarea) */
  type?: InputType;
  /** Label text displayed above input */
  label?: string;
  /** Error message displayed below input */
  error?: string;
  /** Helper text displayed below input (when no error) */
  hint?: string;
  /** Icon component to display on the left */
  icon?: React.FC<{ className?: string }>;
  /** Show clear button when input has value */
  clearable?: boolean;
  /** Callback when clear button is clicked */
  onClear?: () => void;
  /** Additional classes for input element */
  inputClassName?: string;
  /** Current input value */
  value?: string;
}
