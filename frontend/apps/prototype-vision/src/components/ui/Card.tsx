/**
 * Card Component
 *
 * Variants: default, elevated, outlined, interactive
 */

import React, { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'interactive';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

const variants: Record<CardVariant, string> = {
  default: 'bg-surface border border-border',
  elevated: 'bg-surface-card shadow-lg',
  outlined: 'bg-transparent border border-border',
  interactive: 'bg-surface border border-border hover:border-primary/50 cursor-pointer'
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  children?: ReactNode;
  animate?: boolean;
  onClick?: () => void;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
  animate = false,
  ...props
}, ref) => {
  const variantClasses = variants[variant] || variants.default;

  const paddingClasses: Record<CardPadding, string> = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6'
  };

  const baseClasses = `rounded-xl transition-all duration-200 ${variantClasses} ${paddingClasses[padding] || paddingClasses.md}`;

  if (animate || variant === 'interactive') {
    return (
      <motion.div
        ref={ref}
        className={`${baseClasses} ${className}`}
        onClick={onClick}
        whileHover={variant === 'interactive' ? { y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.3)' } : {}}
        whileTap={variant === 'interactive' ? { scale: 0.98 } : {}}
        initial={animate ? { opacity: 0, y: 20 } : false}
        animate={animate ? { opacity: 1, y: 0 } : false}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

// Sub-components
interface CardSubComponentProps {
  children?: ReactNode;
  className?: string;
}

const CardHeader: FC<CardSubComponentProps> = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

const CardTitle: FC<CardSubComponentProps> = ({ children, className = '' }) => (
  <h3 className={`text-lg font-bold text-white ${className}`}>
    {children}
  </h3>
);

const CardDescription: FC<CardSubComponentProps> = ({ children, className = '' }) => (
  <p className={`text-sm text-text-muted mt-1 ${className}`}>
    {children}
  </p>
);

const CardContent: FC<CardSubComponentProps> = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

const CardFooter: FC<CardSubComponentProps> = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-border ${className}`}>
    {children}
  </div>
);

// Attach sub-components to Card
Object.assign(Card, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter
});

export default Card;
