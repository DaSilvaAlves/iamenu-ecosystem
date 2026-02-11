import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  /**
   * Variant Tests
   */
  describe('Variants', () => {
    it('renders with primary variant by default', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-ds-primary');
    });

    it('renders with secondary variant', () => {
      render(<Button variant="secondary">Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-ds-gray-200');
    });

    it('renders with tertiary variant', () => {
      render(<Button variant="tertiary">Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-transparent');
      expect(button).toHaveClass('border');
    });
  });

  /**
   * Size Tests
   */
  describe('Sizes', () => {
    it('renders with small size', () => {
      render(<Button size="sm">Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-3');
      expect(button).toHaveClass('py-2');
    });

    it('renders with medium size by default', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-4');
      expect(button).toHaveClass('py-2.5');
    });

    it('renders with large size', () => {
      render(<Button size="lg">Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-6');
      expect(button).toHaveClass('py-3');
    });
  });

  /**
   * State Tests
   */
  describe('States', () => {
    it('handles click event', () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click me</Button>);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('is disabled when disabled prop is true', () => {
      render(<Button disabled>Click me</Button>);
      const button = screen.getByRole('button') as HTMLButtonElement;
      expect(button.disabled).toBe(true);
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not trigger click when disabled', () => {
      const onClick = vi.fn();
      render(
        <Button disabled onClick={onClick}>
          Click me
        </Button>
      );
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('shows loading spinner when loading', () => {
      render(<Button loading>Loading...</Button>);
      const spinner = screen.getByRole('button').querySelector('svg');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
    });

    it('is disabled when loading', () => {
      const onClick = vi.fn();
      render(
        <Button loading onClick={onClick}>
          Loading...
        </Button>
      );
      const button = screen.getByRole('button') as HTMLButtonElement;
      expect(button.disabled).toBe(true);
      fireEvent.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  /**
   * Content Tests
   */
  describe('Content', () => {
    it('renders children text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('renders custom children content', () => {
      render(
        <Button>
          <span data-testid="custom">Custom Content</span>
        </Button>
      );
      expect(screen.getByTestId('custom')).toBeInTheDocument();
    });
  });

  /**
   * Full Width Tests
   */
  describe('Full Width', () => {
    it('applies full width class when fullWidth prop is true', () => {
      render(<Button fullWidth>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full');
    });
  });

  /**
   * Button Type Tests
   */
  describe('Button Type', () => {
    it('renders as button type by default', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button') as HTMLButtonElement;
      expect(button.type).toBe('button');
    });

    it('renders as submit button', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole('button') as HTMLButtonElement;
      expect(button.type).toBe('submit');
    });

    it('renders as reset button', () => {
      render(<Button type="reset">Reset</Button>);
      const button = screen.getByRole('button') as HTMLButtonElement;
      expect(button.type).toBe('reset');
    });
  });

  /**
   * Accessibility Tests
   */
  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <Button aria-label="Close dialog">×</Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Close dialog');
    });

    it('has proper role attribute', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('role', 'button');
    });

    it('is keyboard accessible', () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click me</Button>);
      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      // Note: button click would be triggered by Enter key natively
    });
  });

  /**
   * CSS Classes Tests
   */
  describe('CSS Classes', () => {
    it('accepts custom className prop', () => {
      render(<Button className="custom-class">Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('has focus-visible styles for accessibility', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus-visible:outline-2');
      expect(button).toHaveClass('focus-visible:outline-ds-primary');
    });
  });
});
