/**
 * Design System Tokens
 * Centralized token definitions for consistency across components
 */

export const colors = {
  primary: '#007AFF',
  primaryLight: '#5AC8FA',
  secondary: '#5AC8FA',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',

  // Grayscale
  gray: {
    50: '#F9F9F9',
    100: '#F3F3F3',
    200: '#E8E8E8',
    300: '#D8D8D8',
    400: '#A9A9A9',
    500: '#808080',
    600: '#555555',
    700: '#333333',
    800: '#1A1A1A',
  },
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
} as const;

export const borderRadius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  full: '9999px',
} as const;

export const fontSize = {
  xs: '12px',
  sm: '14px',
  base: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.15)',
  elevation1: '0 1px 3px 0 rgba(0, 0, 0, 0.12)',
  elevation2: '0 3px 6px 0 rgba(0, 0, 0, 0.15)',
} as const;

// Accessibility
export const a11y = {
  focus: 'outline-2 outline-offset-2 outline-ds-primary',
  focusVisible: 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ds-primary',
} as const;
