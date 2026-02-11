/**
 * Loading Components
 *
 * Spinner, Skeleton, LoadingOverlay
 */

import { FC, CSSProperties } from 'react';
import { motion } from 'framer-motion';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
type SpinnerColor = 'primary' | 'white' | 'muted';
type SkeletonVariant = 'text' | 'title' | 'avatar' | 'thumbnail' | 'card';
type SkeletonRounded = 'none' | 'sm' | 'md' | 'lg' | 'full';

/**
 * Spinner - Simple loading spinner
 */
interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  color?: SpinnerColor;
}

export const Spinner: FC<SpinnerProps> = ({
  size = 'md',
  className = '',
  color = 'primary'
}) => {
  const sizes: Record<SpinnerSize, string> = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colors: Record<SpinnerColor, string> = {
    primary: 'text-primary',
    white: 'text-white',
    muted: 'text-text-muted'
  };

  return (
    <svg
      className={`animate-spin ${sizes[size]} ${colors[color]} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

/**
 * Skeleton - Placeholder for loading content
 */
interface SkeletonProps {
  className?: string;
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  rounded?: SkeletonRounded;
}

export const Skeleton: FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  rounded = 'md'
}) => {
  const roundedClasses: Record<SkeletonRounded, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };

  const variantDefaults: Record<SkeletonVariant, string> = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'h-10 w-10 rounded-full',
    thumbnail: 'h-20 w-20',
    card: 'h-32 w-full'
  };

  const style: CSSProperties = {
    width: width || undefined,
    height: height || undefined
  };

  return (
    <div
      className={`
        animate-pulse bg-white/10
        ${variantDefaults[variant] || variantDefaults.text}
        ${roundedClasses[rounded]}
        ${className}
      `}
      style={style}
    />
  );
};

/**
 * SkeletonCard - Pre-built skeleton for card layouts
 */
interface SkeletonCardProps {
  className?: string;
}

export const SkeletonCard: FC<SkeletonCardProps> = ({ className = '' }) => (
  <div className={`bg-surface border border-border rounded-xl p-5 space-y-4 ${className}`}>
    <div className="flex items-center gap-3">
      <Skeleton variant="avatar" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="title" width="60%" />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
    <Skeleton variant="text" />
    <Skeleton variant="text" />
    <Skeleton variant="text" width="80%" />
  </div>
);

/**
 * LoadingOverlay - Full-screen or container overlay
 */
interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export const LoadingOverlay: FC<LoadingOverlayProps> = ({
  isLoading,
  message = 'Loading...',
  fullScreen = false,
  className = ''
}) => {
  if (!isLoading) return null;

  const overlayClasses = fullScreen
    ? 'fixed inset-0 z-50'
    : 'absolute inset-0';

  return (
    <motion.div
      className={`${overlayClasses} flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Spinner size="xl" />
      {message && (
        <p className="mt-4 text-white font-medium">{message}</p>
      )}
    </motion.div>
  );
};

/**
 * LoadingDots - Animated dots
 */
interface LoadingDotsProps {
  className?: string;
}

export const LoadingDots: FC<LoadingDotsProps> = ({ className = '' }) => (
  <div className={`flex items-center gap-1 ${className}`}>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-2 h-2 bg-primary rounded-full"
        animate={{
          y: [0, -8, 0]
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: i * 0.1
        }}
      />
    ))}
  </div>
);

// Default export as namespace
const Loading = {
  Spinner,
  Skeleton,
  SkeletonCard,
  LoadingOverlay,
  LoadingDots
};

export default Loading;
