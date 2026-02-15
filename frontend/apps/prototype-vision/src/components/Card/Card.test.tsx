import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card } from './Card';

describe('Card Component', () => {
  /**
   * Basic Rendering Tests
   */
  describe('Basic Rendering', () => {
    it('renders card with children', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('renders as div by default', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.tagName).toBe('DIV');
    });

    it('renders as button when clickable', () => {
      const { container } = render(<Card clickable>Clickable Card</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.tagName).toBe('BUTTON');
    });
  });

  /**
   * Variant Tests
   */
  describe('Variants', () => {
    it('renders with elevated variant by default', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.querySelector('div[class*="shadow"]');
      expect(card).toHaveClass('shadow-md');
      expect(card).toHaveClass('bg-white');
    });

    it('renders with outlined variant', () => {
      const { container } = render(<Card variant="outlined">Content</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass('border-ds-gray-300');
    });

    it('renders with filled variant', () => {
      const { container } = render(<Card variant="filled">Content</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass('bg-ds-gray-100');
    });
  });

  /**
   * Size Tests
   */
  describe('Sizes', () => {
    it('renders with small size', () => {
      const { container } = render(<Card size="sm">Content</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass('p-3');
    });

    it('renders with medium size by default', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass('p-4');
    });

    it('renders with large size', () => {
      const { container } = render(<Card size="lg">Content</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass('p-6');
    });
  });

  /**
   * Rounded Tests
   */
  describe('Rounded Corners', () => {
    it('renders with medium rounded by default', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass('rounded-md');
    });

    it('renders with no rounding', () => {
      const { container } = render(<Card rounded="none">Content</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass('rounded-none');
    });

    it('renders with small rounding', () => {
      const { container } = render(<Card rounded="sm">Content</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass('rounded-sm');
    });

    it('renders with large rounding', () => {
      const { container } = render(<Card rounded="lg">Content</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass('rounded-lg');
    });

    it('renders with full rounding', () => {
      const { container } = render(<Card rounded="full">Content</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass('rounded-full');
    });
  });

  /**
   * Header & Footer Tests
   */
  describe('Header & Footer', () => {
    it('renders header when provided', () => {
      render(
        <Card header={<h2>Card Title</h2>}>
          Content
        </Card>
      );
      expect(screen.getByText('Card Title')).toBeInTheDocument();
    });

    it('renders footer when provided', () => {
      render(
        <Card footer={<p>Footer text</p>}>
          Content
        </Card>
      );
      expect(screen.getByText('Footer text')).toBeInTheDocument();
    });

    it('renders both header and footer', () => {
      render(
        <Card
          header={<h2>Header</h2>}
          footer={<p>Footer</p>}
        >
          Content
        </Card>
      );
      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('footer has border separator', () => {
      render(
        <Card footer={<p>Footer</p>}>
          Content
        </Card>
      );
      const footer = screen.getByText('Footer').parentElement;
      expect(footer).toHaveClass('border-t');
      expect(footer).toHaveClass('border-ds-gray-200');
    });
  });

  /**
   * Image Tests
   */
  describe('Image', () => {
    it('renders image when provided', () => {
      render(
        <Card image={{ src: '/image.jpg', alt: 'Test image' }}>
          Content
        </Card>
      );
      const img = screen.getByAltText('Test image') as HTMLImageElement;
      expect(img).toBeInTheDocument();
      expect(img.src).toContain('/image.jpg');
    });

    it('renders image with default height', () => {
      render(
        <Card image={{ src: '/image.jpg', alt: 'Test' }}>
          Content
        </Card>
      );
      const img = screen.getByAltText('Test') as HTMLImageElement;
      expect(img.height).toBe(200);
    });

    it('renders image with custom height', () => {
      render(
        <Card image={{ src: '/image.jpg', alt: 'Test', height: 300 }}>
          Content
        </Card>
      );
      const img = screen.getByAltText('Test') as HTMLImageElement;
      expect(img.height).toBe(300);
    });
  });

  /**
   * Clickable Tests
   */
  describe('Clickable', () => {
    it('renders as button when clickable', () => {
      const { container } = render(<Card clickable>Card</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.tagName).toBe('BUTTON');
    });

    it('calls onClick when clicked', () => {
      const onClick = vi.fn();
      render(<Card clickable onClick={onClick}>Card</Card>);
      const card = screen.getByRole('button');
      fireEvent.click(card);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('has cursor-pointer when clickable', () => {
      render(<Card clickable>Card</Card>);
      const card = screen.getByRole('button');
      expect(card).toHaveClass('cursor-pointer');
    });

    it('handles Enter key when clickable', () => {
      const onClick = vi.fn();
      render(<Card clickable onClick={onClick}>Card</Card>);
      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: 'Enter' });
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('handles Space key when clickable', () => {
      const onClick = vi.fn();
      render(<Card clickable onClick={onClick}>Card</Card>);
      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: ' ' });
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled and clicked', () => {
      const onClick = vi.fn();
      render(
        <Card clickable disabled onClick={onClick}>
          Card
        </Card>
      );
      const card = screen.getByRole('button');
      fireEvent.click(card);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when loading and clicked', () => {
      const onClick = vi.fn();
      render(
        <Card clickable loading onClick={onClick}>
          Card
        </Card>
      );
      const card = screen.getByRole('button');
      fireEvent.click(card);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('removes hover effect when not hoverable', () => {
      render(
        <Card clickable hoverable={false}>
          Card
        </Card>
      );
      const card = screen.getByRole('button');
      expect(card).not.toHaveClass('cursor-pointer');
    });
  });

  /**
   * Disabled State Tests
   */
  describe('Disabled State', () => {
    it('renders with disabled opacity', () => {
      const { container } = render(<Card disabled>Content</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass('opacity-50');
    });

    it('sets aria-disabled when disabled', () => {
      const { container } = render(<Card disabled>Content</Card>);
      const card = container.firstChild;
      expect(card).toHaveAttribute('aria-disabled', 'true');
    });

    it('button is disabled when clickable and disabled', () => {
      render(
        <Card clickable disabled>
          Card
        </Card>
      );
      const card = screen.getByRole('button') as HTMLButtonElement;
      expect(card.disabled).toBe(true);
    });
  });

  /**
   * Loading State Tests
   */
  describe('Loading State', () => {
    it('renders loading spinner', () => {
      const { container } = render(<Card loading>Content</Card>);
      const spinner = container.querySelector('svg');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
    });

    it('sets aria-busy when loading', () => {
      const { container } = render(<Card loading>Content</Card>);
      const card = container.firstChild;
      expect(card).toHaveAttribute('aria-busy', 'true');
    });

    it('button is disabled when loading', () => {
      render(
        <Card clickable loading>
          Card
        </Card>
      );
      const card = screen.getByRole('button') as HTMLButtonElement;
      expect(card.disabled).toBe(true);
    });
  });

  /**
   * CSS Classes Tests
   */
  describe('CSS Classes', () => {
    it('accepts custom className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass('custom-class');
    });

    it('combines all required classes', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass('transition-all');
      expect(card).toHaveClass('duration-200');
      expect(card).toHaveClass('rounded-md');
    });
  });

  /**
   * Integration Tests
   */
  describe('Integration', () => {
    it('works with all features combined', () => {
      const onClick = vi.fn();
      render(
        <Card
          variant="elevated"
          size="lg"
          rounded="lg"
          clickable
          hoverable
          header={<h2>Title</h2>}
          image={{ src: '/img.jpg', alt: 'Image' }}
          footer={<p>Footer</p>}
          onClick={onClick}
        >
          Content
        </Card>
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByAltText('Image')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();

      const card = screen.getByRole('button');
      fireEvent.click(card);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('handles variant change', () => {
      const { rerender, container } = render(<Card variant="elevated">Content</Card>);
      let card = container.firstChild;
      expect(card).toHaveClass('shadow-md');

      rerender(<Card variant="outlined">Content</Card>);
      card = container.firstChild;
      expect(card).toHaveClass('border-ds-gray-300');
    });

    it('handles clickable state change', () => {
      const { rerender, container } = render(<Card>Content</Card>);
      let card = container.firstChild as HTMLElement;
      expect(card.tagName).toBe('DIV');

      rerender(<Card clickable>Content</Card>);
      card = screen.getByRole('button');
      expect(card.tagName).toBe('BUTTON');
    });

    it('handles disabled state change', () => {
      const { rerender } = render(<Card clickable>Content</Card>);
      let card = screen.getByRole('button') as HTMLButtonElement;
      expect(card.disabled).toBe(false);

      rerender(<Card clickable disabled>Content</Card>);
      card = screen.getByRole('button') as HTMLButtonElement;
      expect(card.disabled).toBe(true);
    });
  });

  /**
   * Accessibility Tests
   */
  describe('Accessibility', () => {
    it('has role="button" when clickable', () => {
      render(<Card clickable>Card</Card>);
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('role', 'button');
    });

    it('is keyboard accessible when clickable', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Card clickable onClick={onClick}>Card</Card>);
      const card = screen.getByRole('button');

      card.focus();
      await user.keyboard('{Enter}');
      expect(onClick).toHaveBeenCalled();
    });

    it('has tabIndex="0" when clickable', () => {
      render(<Card clickable>Card</Card>);
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('has tabIndex="-1" when clickable and disabled', () => {
      render(
        <Card clickable disabled>
          Card
        </Card>
      );
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('tabIndex', '-1');
    });
  });
});
