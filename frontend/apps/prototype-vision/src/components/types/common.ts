/**
 * Common Types for Design System Components
 */

export type Size = 'sm' | 'md' | 'lg';
export type Variant = 'primary' | 'secondary' | 'tertiary';
export type State = 'default' | 'hover' | 'active' | 'disabled' | 'loading';

/**
 * Common component props
 */
export interface CommonProps {
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  size?: Size;
  variant?: Variant;
}

/**
 * Accessibility props
 */
export interface A11yProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-disabled'?: boolean;
  role?: string;
}
