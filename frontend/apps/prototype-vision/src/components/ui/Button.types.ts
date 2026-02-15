/**
 * Button Component Types
 */

import React, { ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type IconPosition = 'left' | 'right';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state - shows spinner and disables interaction */
  loading?: boolean;
  /** Icon component to display */
  icon?: React.FC<{ className?: string }>;
  /** Position of icon relative to text */
  iconPosition?: IconPosition;
  /** Full width button */
  fullWidth?: boolean;
  /** Button content */
  children?: ReactNode;
}
