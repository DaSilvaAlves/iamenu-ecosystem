import React, { ReactNode } from 'react';
import { CommonProps } from '../types/common';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends CommonProps {
  /**
   * Button visual variant
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Button size
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Button content
   */
  children: ReactNode;

  /**
   * Click event handler
   */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;

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
   * Button type attribute
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * Full width button
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Custom CSS class
   */
  className?: string;

  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;

  /**
   * ARIA disabled for accessibility
   */
  'aria-disabled'?: boolean;
}
