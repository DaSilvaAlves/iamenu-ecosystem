/**
 * Card Component Types
 */

import React, { ReactNode } from 'react';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'interactive';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual style variant */
  variant?: CardVariant;
  /** Padding around card content */
  padding?: CardPadding;
  /** Card content */
  children?: ReactNode;
  /** Enable entrance animation */
  animate?: boolean;
  /** Click handler for interactive cards */
  onClick?: () => void;
}

export interface CardSubComponentProps {
  /** Component content */
  children?: ReactNode;
  /** Additional CSS classes */
  className?: string;
}
