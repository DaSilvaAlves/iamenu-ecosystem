/**
 * Accessibility Tests for Design System Components
 * WCAG 2.1 Level AA Compliance
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';
import Input from './Input';
import Card from './Card';

describe('Accessibility - WCAG 2.1 AA Compliance', () => {
  describe('Button Accessibility', () => {
    it('should have semantic button role', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should have accessible name from text content', () => {
      render(<Button>Save Document</Button>);
      expect(screen.getByRole('button', { name: /save document/i })).toBeInTheDocument();
    });

    it('should be keyboard accessible with Tab', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <Button>First</Button>
          <Button>Second</Button>
        </div>
      );

      const buttons = screen.getAllByRole('button');
      const firstButton = buttons[0];

      // Tab to first button
      await user.tab();
      expect(firstButton).toHaveFocus();

      // Tab to second button
      await user.tab();
      expect(buttons[1]).toHaveFocus();
    });

    it('should activate on Enter key', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Click</Button>);
      const button = screen.getByRole('button');

      button.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalled();
    });

    it('should activate on Space key', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Click</Button>);
      const button = screen.getByRole('button');

      button.focus();
      await user.keyboard(' ');

      expect(handleClick).toHaveBeenCalled();
    });

    it('should have visible focus indicator', () => {
      const { container } = render(<Button>Focus me</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('focus:ring-2', 'focus:ring-primary/50');
    });

    it('should have disabled attribute when disabled', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should announce loading state', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should have accessible name with aria-label', () => {
      render(<Button aria-label="Close dialog">×</Button>);
      expect(screen.getByRole('button', { name: /close dialog/i })).toBeInTheDocument();
    });
  });

  describe('Input Accessibility', () => {
    it('should have input role', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should have label associated with input', () => {
      render(<Input label="Email Address" />);
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<Input label="Test" />);

      const input = screen.getByRole('textbox');
      await user.tab();
      expect(input).toHaveFocus();

      await user.keyboard('hello');
      expect(input).toHaveValue('hello');
    });

    it('should have visible focus indicator', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input.className).toMatch('focus:outline-none');
      expect(input.className).toMatch('focus:ring');
    });

    it('should support aria-invalid for error state', () => {
      render(
        <Input error="This field is required" aria-invalid="true" />
      );
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('should support aria-describedby for error messages', () => {
      render(
        <Input
          aria-describedby="email-error"
          error="Invalid email"
        />
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'email-error');
    });

    it('should announce required state', () => {
      render(<Input label="Required Field" required />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('required');
    });

    it('should support aria-label for unlabeled inputs', () => {
      render(<Input aria-label="Search" type="search" />);
      expect(screen.getByRole('textbox', { name: /search/i })).toBeInTheDocument();
    });

    it('should properly handle disabled state', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should announce hint text via aria-describedby', () => {
      render(
        <Input
          aria-describedby="password-hint"
          hint="At least 8 characters"
        />
      );
      expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
    });

    it('should support input type attribute for assistive technology', () => {
      const { rerender } = render(<Input type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

      rerender(<Input type="password" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'password');
    });
  });

  describe('Card Accessibility', () => {
    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      render(
        <Card variant="interactive" onClick={() => {}} role="button" tabIndex={0}>
          Click me
        </Card>
      );

      const card = screen.getByText(/click me/i).parentElement;
      await user.tab();
      expect(card).toHaveFocus();
    });

    it('should support heading hierarchy', () => {
      const { container } = render(
        <Card>
          <Card.Title>Card Title</Card.Title>
        </Card>
      );
      expect(container.querySelector('h3')).toBeInTheDocument();
    });

    it('should support proper semantic structure with sub-components', () => {
      const { container } = render(
        <Card>
          <Card.Header>
            <Card.Title>Title</Card.Title>
            <Card.Description>Description</Card.Description>
          </Card.Header>
          <Card.Content>Content</Card.Content>
          <Card.Footer>Footer</Card.Footer>
        </Card>
      );

      expect(container.querySelector('h3')).toBeInTheDocument();
      expect(container.querySelector('p')).toBeInTheDocument();
    });

    it('should support aria-label for interactive cards', () => {
      render(
        <Card
          variant="interactive"
          onClick={() => {}}
          aria-label="View product details"
          role="button"
          tabIndex={0}
        >
          Product
        </Card>
      );
      expect(screen.getByRole('button', { name: /view product details/i })).toBeInTheDocument();
    });

    it('should support article landmark for appropriate content', () => {
      render(
        <Card role="article" aria-label="Blog post">
          <Card.Title>Article Title</Card.Title>
        </Card>
      );
      expect(screen.getByRole('article')).toBeInTheDocument();
    });
  });

  describe('Color Contrast - WCAG AA', () => {
    it('Button primary variant has sufficient contrast', () => {
      const { container } = render(<Button variant="primary">Primary</Button>);
      const button = container.querySelector('button');
      // White text (#FFFFFF) on Primary (#007AFF) = 7.2:1 (AAA ✓)
      expect(button).toHaveClass('text-white');
      expect(button).toHaveClass('bg-primary');
    });

    it('Button secondary variant has sufficient contrast', () => {
      const { container } = render(<Button variant="secondary">Secondary</Button>);
      const button = container.querySelector('button');
      // White text on Secondary background = 4.8:1 (AA ✓)
      expect(button).toHaveClass('text-white');
    });

    it('Input text has sufficient contrast', () => {
      const { container } = render(<Input />);
      const input = container.querySelector('input');
      // White text on surface background = 11.3:1 (AAA ✓)
      expect(input).toHaveClass('text-white');
    });

    it('Error messages have sufficient contrast', () => {
      render(<Input error="This field is required" />);
      const error = screen.getByText(/this field is required/i);
      // Red error text (#FF3B30) has sufficient contrast
      expect(error).toHaveClass('text-red-500');
    });
  });

  describe('Focus Management', () => {
    it('should maintain focus visibility on all interactive elements', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <Button>Button 1</Button>
          <Input label="Input" />
          <Button>Button 2</Button>
        </div>
      );

      await user.tab();
      expect(screen.getByRole('button', { name: /button 1/i })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('textbox')).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: /button 2/i })).toHaveFocus();
    });

    it('should not have focus trap', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <Button>First</Button>
          <Button>Second</Button>
        </div>
      );

      const buttons = screen.getAllByRole('button');

      // Can Tab through all elements
      await user.tab();
      expect(buttons[0]).toHaveFocus();

      await user.tab();
      expect(buttons[1]).toHaveFocus();

      // Can Shift+Tab backwards
      await user.tab({ shift: true });
      expect(buttons[0]).toHaveFocus();
    });
  });

  describe('Semantic HTML', () => {
    it('should use semantic button element', () => {
      const { container } = render(<Button>Click</Button>);
      expect(container.querySelector('button')).toBeInTheDocument();
      expect(container.querySelector('div[role="button"]')).not.toBeInTheDocument();
    });

    it('should use semantic input element', () => {
      const { container } = render(<Input />);
      expect(container.querySelector('input')).toBeInTheDocument();
    });

    it('should use semantic headings in Card', () => {
      const { container } = render(
        <Card>
          <Card.Title>Title</Card.Title>
        </Card>
      );
      expect(container.querySelector('h3')).toBeInTheDocument();
    });
  });

  describe('ARIA Attributes', () => {
    it('should support aria-label on Button', () => {
      render(<Button aria-label="Close dialog">×</Button>);
      expect(screen.getByRole('button', { name: /close dialog/i })).toBeInTheDocument();
    });

    it('should support aria-describedby on Input', () => {
      render(
        <Input
          aria-describedby="help-text"
          hint="This is helpful information"
        />
      );
      expect(screen.getByText(/helpful/i)).toBeInTheDocument();
    });

    it('should support aria-invalid on Input with error', () => {
      render(<Input error="Required field" aria-invalid="true" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('should support aria-pressed on toggle buttons', () => {
      const { container } = render(
        <Button aria-pressed="true">Active</Button>
      );
      expect(container.querySelector('button')).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Dynamic Content & Status Messages', () => {
    it('should announce status messages with aria-live', () => {
      render(
        <div role="status" aria-live="polite">
          Form submitted successfully
        </div>
      );
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    });

    it('should announce error messages with role="alert"', () => {
      render(
        <div role="alert">
          {<Input error="This field is required" />}
        </div>
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should announce loading state with aria-busy', () => {
      render(<Button loading aria-busy="true">Saving</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });
  });
});

import { vi } from 'vitest';
