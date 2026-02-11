/**
 * Badge Component
 *
 * Variants: default, success, warning, danger, info, outline
 * Sizes: sm, md, lg
 */

import { FC, ReactNode } from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
type BadgeSize = 'sm' | 'md' | 'lg';
type StatusType = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled' | 'draft' | 'published' | 'archived';

const variants: Record<BadgeVariant, string> = {
  default: 'bg-white/10 text-white',
  primary: 'bg-primary/20 text-primary border border-primary/30',
  success: 'bg-green-500/20 text-green-400 border border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
  info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  outline: 'bg-transparent text-white border border-border'
};

const sizes: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm'
};

interface BadgeProps {
  children?: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: FC<{ className?: string }>;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

const Badge: FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon: Icon,
  removable = false,
  onRemove,
  className = ''
}) => {
  const variantClasses = variants[variant] || variants.default;
  const sizeClasses = sizes[size] || sizes.md;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${variantClasses}
        ${sizeClasses}
        ${className}
      `}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 hover:bg-white/10 rounded-full p-0.5 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
};

/**
 * StatusBadge - Pre-configured badges for common statuses
 */
interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

export const StatusBadge: FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const statusConfig: Record<StatusType, { variant: BadgeVariant; label: string }> = {
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'default', label: 'Inactive' },
    pending: { variant: 'warning', label: 'Pending' },
    completed: { variant: 'success', label: 'Completed' },
    cancelled: { variant: 'danger', label: 'Cancelled' },
    draft: { variant: 'outline', label: 'Draft' },
    published: { variant: 'success', label: 'Published' },
    archived: { variant: 'default', label: 'Archived' }
  };

  const config = statusConfig[(status?.toLowerCase() as StatusType)] || { variant: 'default', label: status };

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
};

/**
 * CountBadge - Notification count badge
 */
interface CountBadgeProps {
  count: number;
  max?: number;
  showZero?: boolean;
  className?: string;
}

export const CountBadge: FC<CountBadgeProps> = ({
  count,
  max = 99,
  showZero = false,
  className = ''
}) => {
  if (!showZero && (!count || count === 0)) return null;

  const displayCount = count > max ? `${max}+` : count;

  return (
    <span
      className={`
        inline-flex items-center justify-center
        min-w-[18px] h-[18px] px-1
        bg-red-500 text-white text-xs font-bold rounded-full
        ${className}
      `}
    >
      {displayCount}
    </span>
  );
};

export default Badge;
