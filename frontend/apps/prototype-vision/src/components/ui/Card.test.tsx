import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Card from './Card';

describe('Card Component', () => {
  describe('Rendering', () => {
    it('should render card element', () => {
      const { container } = render(<Card>Card content</Card>);
      expect(container.querySelector('div')).toBeInTheDocument();
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('should render with children', () => {
      render(
        <Card>
          <p>Test content</p>
        </Card>
      );
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should have default variant classes', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toMatch('bg-surface');
      expect(card.className).toMatch('border');
    });
  });

  describe('Variants', () => {
    it('should render default variant', () => {
      const { container } = render(<Card variant="default">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toMatch('bg-surface');
      expect(card.className).toMatch('border-border');
    });

    it('should render elevated variant', () => {
      const { container } = render(<Card variant="elevated">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toMatch('bg-surface-card');
      expect(card.className).toMatch('shadow-lg');
    });

    it('should render outlined variant', () => {
      const { container } = render(<Card variant="outlined">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toMatch('bg-transparent');
      expect(card.className).toMatch('border-border');
    });

    it('should render interactive variant', () => {
      const { container } = render(<Card variant="interactive">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toMatch('bg-surface');
      expect(card.className).toMatch('cursor-pointer');
    });

    it('should handle invalid variant gracefully', () => {
      const { container } = render(
        <Card variant={'invalid' as any}>Content</Card>
      );
      const card = container.firstChild as HTMLElement;
      expect(card.className).toMatch('bg-surface');
    });
  });

  describe('Padding', () => {
    it('should render with no padding', () => {
      const { container } = render(<Card padding="none">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).not.toMatch('p-3');
      expect(card.className).not.toMatch('p-5');
      expect(card.className).not.toMatch('p-6');
    });

    it('should render with small padding', () => {
      const { container } = render(<Card padding="sm">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toMatch('p-3');
    });

    it('should render with medium padding (default)', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toMatch('p-5');
    });

    it('should render with large padding', () => {
      const { container } = render(<Card padding="lg">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toMatch('p-6');
    });

    it('should handle invalid padding gracefully', () => {
      const { container } = render(
        <Card padding={'invalid' as any}>Content</Card>
      );
      const card = container.firstChild as HTMLElement;
      expect(card.className).toMatch('p-5');
    });
  });

  describe('Animation', () => {
    it('should render motion.div when animate is true', () => {
      const { container } = render(<Card animate={true}>Content</Card>);
      expect(container.querySelector('div')).toBeInTheDocument();
    });

    it('should render motion.div for interactive variant', () => {
      const { container } = render(<Card variant="interactive">Content</Card>);
      expect(container.querySelector('div')).toBeInTheDocument();
    });

    it('should render regular div without animation', () => {
      const { container } = render(<Card variant="default">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.tagName).toBe('DIV');
    });
  });

  describe('Click Handling', () => {
    it('should call onClick when clicked', async () => {
      const handleClick = vi.fn();
      render(
        <Card variant="interactive" onClick={handleClick}>
          Click me
        </Card>
      );

      const card = screen.getByText('Click me').parentElement;
      if (card) {
        await userEvent.click(card);
      }

      expect(handleClick).toHaveBeenCalled();
    });

    it('should not crash without onClick', async () => {
      render(<Card>Content</Card>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('CSS Classes', () => {
    it('should have rounded corners', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toMatch('rounded-xl');
    });

    it('should have transition classes', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toMatch('transition-all');
      expect(card.className).toMatch('duration-200');
    });

    it('should merge custom className', () => {
      const { container } = render(
        <Card className="custom-class">Content</Card>
      );
      const card = container.firstChild as HTMLElement;
      expect(card.className).toMatch('custom-class');
      expect(card.className).toMatch('rounded-xl');
    });
  });

  describe('HTML Attributes', () => {
    it('should accept HTML attributes', () => {
      render(
        <Card data-testid="custom-card" aria-label="Custom card">
          Content
        </Card>
      );
      const card = screen.getByTestId('custom-card');
      expect(card).toHaveAttribute('aria-label', 'Custom card');
    });

    it('should forward ref correctly', () => {
      const ref = { current: null };
      render(<Card ref={ref}>Content</Card>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should accept id attribute', () => {
      const { container } = render(<Card id="my-card">Content</Card>);
      expect(container.querySelector('#my-card')).toBeInTheDocument();
    });
  });

  describe('Sub-components', () => {
    describe('CardHeader', () => {
      it('should render CardHeader', () => {
        render(
          <Card>
            <Card.Header>Header content</Card.Header>
          </Card>
        );
        expect(screen.getByText('Header content')).toBeInTheDocument();
      });

      it('should have margin bottom', () => {
        const { container } = render(
          <Card>
            <Card.Header>Header</Card.Header>
          </Card>
        );
        const header = container.querySelector('.mb-4');
        expect(header).toBeInTheDocument();
      });

      it('should merge custom className', () => {
        const { container } = render(
          <Card>
            <Card.Header className="custom">Header</Card.Header>
          </Card>
        );
        const header = container.querySelector('.custom');
        expect(header).toBeInTheDocument();
      });
    });

    describe('CardTitle', () => {
      it('should render CardTitle as h3', () => {
        const { container } = render(
          <Card>
            <Card.Title>Card Title</Card.Title>
          </Card>
        );
        expect(container.querySelector('h3')).toBeInTheDocument();
        expect(screen.getByText('Card Title')).toBeInTheDocument();
      });

      it('should have correct styling classes', () => {
        const { container } = render(
          <Card>
            <Card.Title>Title</Card.Title>
          </Card>
        );
        const title = container.querySelector('h3') as HTMLElement;
        expect(title.className).toMatch('text-lg');
        expect(title.className).toMatch('font-bold');
        expect(title.className).toMatch('text-white');
      });
    });

    describe('CardDescription', () => {
      it('should render CardDescription as paragraph', () => {
        const { container } = render(
          <Card>
            <Card.Description>Card description</Card.Description>
          </Card>
        );
        const description = container.querySelector('p');
        expect(description).toBeInTheDocument();
        expect(screen.getByText('Card description')).toBeInTheDocument();
      });

      it('should have text-muted styling', () => {
        const { container } = render(
          <Card>
            <Card.Description>Description</Card.Description>
          </Card>
        );
        const description = container.querySelector('p') as HTMLElement;
        expect(description.className).toMatch('text-text-muted');
      });
    });

    describe('CardContent', () => {
      it('should render CardContent', () => {
        render(
          <Card>
            <Card.Content>Content area</Card.Content>
          </Card>
        );
        expect(screen.getByText('Content area')).toBeInTheDocument();
      });

      it('should accept custom className', () => {
        const { container } = render(
          <Card>
            <Card.Content className="custom-content">Content</Card.Content>
          </Card>
        );
        expect(container.querySelector('.custom-content')).toBeInTheDocument();
      });
    });

    describe('CardFooter', () => {
      it('should render CardFooter', () => {
        render(
          <Card>
            <Card.Footer>Footer content</Card.Footer>
          </Card>
        );
        expect(screen.getByText('Footer content')).toBeInTheDocument();
      });

      it('should have border-top styling', () => {
        const { container } = render(
          <Card>
            <Card.Footer>Footer</Card.Footer>
          </Card>
        );
        const footer = container.querySelector('.border-t');
        expect(footer).toBeInTheDocument();
      });

      it('should have margin-top padding-top', () => {
        const { container } = render(
          <Card>
            <Card.Footer>Footer</Card.Footer>
          </Card>
        );
        const footer = container.querySelector('.mt-4');
        expect(footer).toBeInTheDocument();
      });
    });

    describe('Sub-component Composition', () => {
      it('should render complete card structure', () => {
        const { container } = render(
          <Card>
            <Card.Header>
              <Card.Title>Title</Card.Title>
              <Card.Description>Description</Card.Description>
            </Card.Header>
            <Card.Content>Main content</Card.Content>
            <Card.Footer>Footer</Card.Footer>
          </Card>
        );

        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByText('Main content')).toBeInTheDocument();
        expect(screen.getByText('Footer')).toBeInTheDocument();
        expect(container.querySelector('h3')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have semantic structure with sub-components', () => {
      const { container } = render(
        <Card>
          <Card.Header>
            <Card.Title>Accessible Card</Card.Title>
          </Card.Header>
          <Card.Content>Content</Card.Content>
        </Card>
      );

      expect(container.querySelector('h3')).toBeInTheDocument();
    });

    it('should support keyboard interaction for interactive variant', async () => {
      const handleClick = vi.fn();
      const { container } = render(
        <Card variant="interactive" onClick={handleClick}>
          Clickable
        </Card>
      );

      const card = container.firstChild as HTMLElement;
      card.focus();
      expect(card).toHaveFocus();
    });

    it('should have proper ARIA attributes when provided', () => {
      render(
        <Card aria-label="Important information" role="article">
          Content
        </Card>
      );
      const card = screen.getByRole('article');
      expect(card).toHaveAttribute('aria-label', 'Important information');
    });
  });
});
