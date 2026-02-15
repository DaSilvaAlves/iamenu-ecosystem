import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render with default variant (primary)', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Click me');
    });

    it('should render with custom variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('bg-surface');
    });

    it('should render all variant types', () => {
      const variants = ['primary', 'secondary', 'danger', 'ghost', 'link'] as const;

      variants.forEach(variant => {
        const { unmount } = render(<Button variant={variant}>{variant}</Button>);
        expect(screen.getByText(variant)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Sizes', () => {
    it('should render small size', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
    });

    it('should render medium size (default)', () => {
      render(<Button>Medium</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-4', 'py-2', 'text-sm');
    });

    it('should render large size', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-6', 'py-3', 'text-base');
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should show loading spinner when loading is true', () => {
      render(<Button loading>Loading</Button>);
      const spinner = screen.getByRole('button').querySelector('svg');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
    });

    it('should be disabled when loading is true', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should show "Loading..." text when loading', () => {
      render(<Button loading>Original text</Button>);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('Original text')).not.toBeInTheDocument();
    });

    it('should have disabled styling when disabled', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
    });
  });

  describe('Click Handling', () => {
    it('should call onClick handler when clicked', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button');
      await userEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const handleClick = vi.fn();
      render(<Button disabled onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button');
      await userEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when loading', async () => {
      const handleClick = vi.fn();
      render(<Button loading onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Full Width', () => {
    it('should have full width when fullWidth prop is true', () => {
      render(<Button fullWidth>Full Width</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full');
    });

    it('should not have full width by default', () => {
      render(<Button>Normal</Button>);
      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('w-full');
    });
  });

  describe('Button Type', () => {
    it('should render as button type by default', () => {
      render(<Button>Click</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should accept custom button type', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible focus indicator', () => {
      render(<Button>Focus me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-primary/50');
    });

    it('should be keyboard accessible', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();

      // Press Enter
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
    });

    it('should announce loading state to screen readers', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should have proper button role', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Icon Support', () => {
    it('should render icon component', () => {
      const MockIcon = ({ className }: { className?: string }) => (
        <svg className={className} data-testid="mock-icon" />
      );

      render(<Button icon={MockIcon}>With Icon</Button>);
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('should position icon on the left by default', () => {
      const MockIcon = ({ className }: { className?: string }) => (
        <svg className={className} data-testid="mock-icon" />
      );

      render(<Button icon={MockIcon}>With Icon</Button>);
      const icon = screen.getByTestId('mock-icon');
      const button = screen.getByRole('button');

      // Icon should be the first child (before text)
      expect(button.firstChild).toBe(icon.closest('svg'));
    });

    it('should position icon on the right when specified', () => {
      const MockIcon = ({ className }: { className?: string }) => (
        <svg className={className} data-testid="mock-icon" />
      );

      render(<Button icon={MockIcon} iconPosition="right">With Icon</Button>);
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('should hide icon when loading', () => {
      const MockIcon = ({ className }: { className?: string }) => (
        <svg className={className} data-testid="mock-icon" />
      );

      render(<Button icon={MockIcon} loading>Loading</Button>);
      expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
    });
  });

  describe('Custom Classes', () => {
    it('should merge custom className with base classes', () => {
      render(<Button className="custom-class">Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class', 'inline-flex', 'font-medium');
    });
  });

  describe('HTML Attributes', () => {
    it('should accept HTML attributes', () => {
      render(
        <Button data-testid="custom-button" aria-label="Custom label">
          Click
        </Button>
      );
      const button = screen.getByTestId('custom-button');
      expect(button).toHaveAttribute('aria-label', 'Custom label');
    });

    it('should forward ref correctly', () => {
      const ref = { current: null };
      render(<Button ref={ref}>Click</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });
});
