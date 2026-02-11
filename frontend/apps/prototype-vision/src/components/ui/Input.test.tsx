import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './Input';

describe('Input Component', () => {
  describe('Rendering', () => {
    it('should render text input by default', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should render with placeholder', () => {
      render(<Input placeholder="Enter text..." />);
      expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<Input label="Email" />);
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('should render required indicator', () => {
      render(<Input label="Password" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('Input Types', () => {
    it('should render text input', () => {
      render(<Input type="text" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    });

    it('should render email input', () => {
      render(<Input type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });

    it('should render password input', () => {
      render(<Input type="password" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'password');
    });

    it('should render number input', () => {
      render(<Input type="number" />);
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('should render search input', () => {
      render(<Input type="search" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'search');
    });

    it('should render textarea', () => {
      render(<Input type="textarea" />);
      expect(screen.getByRole('textbox')).toHaveTagName('TEXTAREA');
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should show error message when error is provided', () => {
      render(<Input error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should show hint text when hint is provided', () => {
      render(<Input hint="Enter at least 8 characters" />);
      expect(screen.getByText('Enter at least 8 characters')).toBeInTheDocument();
    });

    it('should not show hint when error is present', () => {
      render(<Input hint="Hint text" error="Error text" />);
      expect(screen.queryByText('Hint text')).not.toBeInTheDocument();
      expect(screen.getByText('Error text')).toBeInTheDocument();
    });
  });

  describe('Value Handling', () => {
    it('should display provided value', () => {
      render(<Input value="test value" onChange={() => {}} />);
      expect(screen.getByRole('textbox')).toHaveValue('test value');
    });

    it('should call onChange when input changes', async () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await userEvent.type(input, 'hello');

      expect(handleChange).toHaveBeenCalled();
    });

    it('should handle empty value', () => {
      render(<Input value="" onChange={() => {}} />);
      expect(screen.getByRole('textbox')).toHaveValue('');
    });
  });

  describe('Clear Functionality', () => {
    it('should show clear button when clearable and has value', () => {
      const { container } = render(<Input clearable value="test" onChange={() => {}} />);
      const clearButton = container.querySelector('button[type="button"]');
      expect(clearButton).toBeInTheDocument();
    });

    it('should not show clear button when empty', () => {
      const { container } = render(<Input clearable value="" onChange={() => {}} />);
      const clearButton = container.querySelector('button[type="button"]');
      expect(clearButton).not.toBeInTheDocument();
    });

    it('should call onClear when clear button is clicked', async () => {
      const handleClear = vi.fn();
      const handleChange = vi.fn();
      const { container } = render(
        <Input
          clearable
          value="test"
          onChange={handleChange}
          onClear={handleClear}
        />
      );

      const clearButton = container.querySelector('button[type="button"]');
      if (clearButton) {
        await userEvent.click(clearButton);
      }

      expect(handleClear).toHaveBeenCalled();
    });

    it('should not show clear button for password input', () => {
      const { container } = render(<Input type="password" clearable value="test" onChange={() => {}} />);
      const clearButton = container.querySelector('button[type="button"]');
      expect(clearButton).not.toBeInTheDocument();
    });
  });

  describe('Password Toggle', () => {
    it('should toggle password visibility', async () => {
      const { container } = render(<Input type="password" value="secret" onChange={() => {}} />);

      let input = screen.getByDisplayValue('secret') as HTMLInputElement;
      expect(input.type).toBe('password');

      const toggleButton = container.querySelector('button[type="button"]');
      if (toggleButton) {
        await userEvent.click(toggleButton);
      }

      input = screen.getByDisplayValue('secret') as HTMLInputElement;
      expect(input.type).toBe('text');
    });

    it('should show eye icon for password input', () => {
      const { container } = render(<Input type="password" />);
      const button = container.querySelector('button[type="button"]');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Icon Support', () => {
    it('should render icon when provided', () => {
      const MockIcon = ({ className }: { className?: string }) => (
        <svg className={className} data-testid="mock-icon" />
      );

      render(<Input icon={MockIcon} />);
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('should show search icon for search input type', () => {
      const { container } = render(<Input type="search" />);
      // Search input should have a search icon in the left position
      const iconContainer = container.querySelector('.absolute.left-3');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible focus indicator', () => {
      const { container } = render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input.className).toMatch('focus:outline-none');
      expect(input.className).toMatch('focus:ring');
    });

    it('should support keyboard navigation', async () => {
      render(<Input placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');

      input.focus();
      expect(input).toHaveFocus();

      await userEvent.keyboard('hello');
      expect(input).toHaveValue('hello');
    });

    it('should be associated with label', () => {
      const { container } = render(<Input label="Test Label" />);
      const label = screen.getByText('Test Label');
      expect(label.tagName).toBe('LABEL');
    });

    it('should have error styling when error is present', () => {
      const { container } = render(<Input error="Error message" />);
      const input = screen.getByRole('textbox');
      expect(input.className).toMatch('border-red-500');
    });
  });

  describe('HTML Attributes', () => {
    it('should accept HTML attributes', () => {
      render(
        <Input
          data-testid="custom-input"
          aria-label="Custom input"
          maxLength={10}
        />
      );
      const input = screen.getByTestId('custom-input');
      expect(input).toHaveAttribute('aria-label', 'Custom input');
      expect(input).toHaveAttribute('maxLength', '10');
    });

    it('should forward ref correctly', () => {
      const ref = { current: null };
      render(<Input ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('should set required attribute', () => {
      render(<Input required />);
      expect(screen.getByRole('textbox')).toHaveAttribute('required');
    });

    it('should set min/max attributes for number input', () => {
      render(<Input type="number" min={0} max={100} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '100');
    });
  });

  describe('Textarea Specific', () => {
    it('should render textarea with correct attributes', () => {
      render(<Input type="textarea" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('should handle textarea value changes', async () => {
      const handleChange = vi.fn();
      render(<Input type="textarea" onChange={handleChange} />);

      const textarea = screen.getByRole('textbox');
      await userEvent.type(textarea, 'multiline\ntext');

      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('Custom Classes', () => {
    it('should merge custom className', () => {
      const { container } = render(<Input className="custom-class" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('custom-class');
    });

    it('should merge custom inputClassName', () => {
      render(<Input inputClassName="custom-input-class" />);
      const input = screen.getByRole('textbox');
      expect(input.className).toMatch('custom-input-class');
    });
  });
});
