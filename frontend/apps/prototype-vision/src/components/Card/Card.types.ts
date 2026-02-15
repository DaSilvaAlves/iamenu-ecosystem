import { ReactNode } from 'react';
import { CommonProps } from '../types/common';

export type CardVariant = 'elevated' | 'outlined' | 'filled';
export type CardSize = 'sm' | 'md' | 'lg';

export interface CardProps extends Omit<CommonProps, 'variant'> {
  /**
   * Card visual variant
   * @default 'elevated'
   */
  variant?: CardVariant;

  /**
   * Card size (padding)
   * @default 'md'
   */
  size?: CardSize;

  /**
   * Card content
   */
  children: ReactNode;

  /**
   * Optional header element
   */
  header?: ReactNode;

  /**
   * Optional footer element
   */
  footer?: ReactNode;

  /**
   * Optional image/banner at the top
   */
  image?: {
    src: string;
    alt: string;
    height?: number;
  };

  /**
   * Whether card is clickable
   * @default false
   */
  clickable?: boolean;

  /**
   * Hover effect on clickable cards
   * @default true
   */
  hoverable?: boolean;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Loading state (shows overlay)
   * @default false
   */
  loading?: boolean;

  /**
   * Callback when card is clicked (if clickable)
   */
  onClick?: () => void;

  /**
   * Border radius size
   * @default 'md'
   */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';

  /**
   * Custom CSS class
   */
  className?: string;
}
