import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input Component', () => {
  /**
   * Basic Rendering Tests
   */
  describe('Basic Rendering', () => {
    it('renders input element', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('renders with default type="text"', () => {
      render(<Input />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.type).toBe('text');
    });

    it('renders with label', () => {
      render(<Input label="Email" />);
      const label = screen.getByText('Email');
      expect(label).toBeInTheDocument();
      expect(label.tagName).toBe('LABEL');
    });

    it('renders required asterisk when required', () => {
      render(<Input label="Email" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('renders with placeholder', () => {
      render(<Input placeholder="Enter text" />);
      const input = screen.getByPlaceholderText('Enter text');
      expect(input).toBeInTheDocument();
    });
  });

  /**
   * Input Type Tests
   */
  describe('Input Types', () => {
    it('renders with type="password"', () => {
      render(<Input type="password" />);
      const input = screen.getByDisplayValue('') as HTMLInputElement;
      expect(input.type).toBe('password');
    });

    it('renders with type="email"', () => {
      render(<Input type="email" />);
      const input = screen.getByDisplayValue('') as HTMLInputElement;
      expect(input.type).toBe('email');
    });

    it('renders with type="number"', () => {
      render(<Input type="number" />);
      const input = screen.getByDisplayValue('') as HTMLInputElement;
      expect(input.type).toBe('number');
    });

    it('renders with type="tel"', () => {
      render(<Input type="tel" />);
      const input = screen.getByDisplayValue('') as HTMLInputElement;
      expect(input.type).toBe('tel');
    });

    it('renders with type="url"', () => {
      render(<Input type="url" />);
      const input = screen.getByDisplayValue('') as HTMLInputElement;
      expect(input.type).toBe('url');
    });

    it('renders with type="search"', () => {
      render(<Input type="search" />);
      const input = screen.getByDisplayValue('') as HTMLInputElement;
      expect(input.type).toBe('search');
    });
  });

  /**
   * Size Tests
   */
  describe('Sizes', () => {
    it('renders with small size', () => {
      render(<Input size="sm" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('text-sm');
      expect(input).toHaveClass('px-2.5');
      expect(input).toHaveClass('py-1.5');
    });

    it('renders with medium size by default', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('text-base');
      expect(input).toHaveClass('px-3');
      expect(input).toHaveClass('py-2');
    });

    it('renders with large size', () => {
      render(<Input size="lg" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('text-lg');
      expect(input).toHaveClass('px-4');
      expect(input).toHaveClass('py-3');
    });
  });

  /**
   * State Tests
   */
  describe('States', () => {
    it('renders with default state', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-ds-gray-300');
    });

    it('renders with error state when error prop provided', () => {
      render(<Input error="Invalid email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-500');
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    it('renders with success state when success prop provided', () => {
      render(<Input success="Email verified" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-green-500');
      expect(screen.getByText('Email verified')).toBeInTheDocument();
    });

    it('renders with warning state', () => {
      render(<Input state="warning" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-yellow-500');
    });

    it('sets aria-invalid="true" when error state', () => {
      render(<Input error="Invalid" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('sets aria-invalid="false" when no error', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });
  });

  /**
   * Disabled & Loading Tests
   */
  describe('Disabled & Loading', () => {
    it('renders disabled input', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.disabled).toBe(true);
      expect(input).toHaveAttribute('aria-disabled', 'true');
    });

    it('input is disabled and not editable', () => {
      render(<Input disabled defaultValue="test" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.disabled).toBe(true);
      expect(input.value).toBe('test');
    });

    it('renders loading state with spinner', () => {
      render(<Input loading />);
      const spinner = screen.getByRole('textbox').parentElement?.querySelector('svg');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
    });

    it('is disabled when loading', () => {
      render(<Input loading />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.disabled).toBe(true);
      expect(input).toHaveAttribute('aria-busy', 'true');
    });
  });

  /**
   * Helper Text & Messages Tests
   */
  describe('Helper Text & Messages', () => {
    it('renders helper text', () => {
      render(<Input helperText="Enter a valid email" />);
      expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
    });

    it('renders error message with icon', () => {
      render(<Input error="Email already exists" />);
      const errorMsg = screen.getByText('Email already exists');
      expect(errorMsg).toBeInTheDocument();
      expect(errorMsg.parentElement?.querySelector('svg')).toBeInTheDocument();
    });

    it('renders success message with icon', () => {
      render(<Input success="Email verified successfully" />);
      const successMsg = screen.getByText('Email verified successfully');
      expect(successMsg).toBeInTheDocument();
      expect(successMsg.parentElement?.querySelector('svg')).toBeInTheDocument();
    });
  });

  /**
   * Icon Tests
   */
  describe('Icons', () => {
    it('renders start icon', () => {
      render(<Input startIcon={<svg data-testid="start-icon" />} />);
      expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    });

    it('renders end icon', () => {
      render(<Input endIcon={<svg data-testid="end-icon" />} />);
      expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    });

    it('renders both icons', () => {
      render(
        <Input
          startIcon={<svg data-testid="start" />}
          endIcon={<svg data-testid="end" />}
        />
      );
      expect(screen.getByTestId('start')).toBeInTheDocument();
      expect(screen.getByTestId('end')).toBeInTheDocument();
    });

    it('adjusts padding when start icon present', () => {
      render(<Input startIcon={<span>🔍</span>} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pl-10');
    });

    it('adjusts padding when end icon present', () => {
      render(<Input endIcon={<span>✓</span>} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pr-10');
    });
  });

  /**
   * Character Count Tests
   */
  describe('Character Count', () => {
    it('shows character count when enabled', () => {
      render(<Input showCharCount />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('updates character count on input', async () => {
      const user = userEvent.setup();
      render(<Input showCharCount defaultValue="" />);
      const input = screen.getByRole('textbox');

      await user.clear(input);
      await user.type(input, 'hello');

      await waitFor(() => {
        expect(screen.getByText(/5/)).toBeInTheDocument();
      });
    });

    it('shows max character count', () => {
      render(<Input showCharCount maxCharCount={100} />);
      expect(screen.getByText('0/100')).toBeInTheDocument();
    });

    it('displays correct count with max limit', async () => {
      const user = userEvent.setup();
      render(<Input showCharCount maxCharCount={10} defaultValue="" />);
      const input = screen.getByRole('textbox');

      await user.clear(input);
      await user.type(input, 'hello');

      await waitFor(() => {
        expect(screen.getByText(/5\/10/)).toBeInTheDocument();
      });
    });
  });

  /**
   * Full Width Tests
   */
  describe('Full Width', () => {
    it('applies full width class', () => {
      const { container } = render(<Input fullWidth />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('w-full');
    });
  });

  /**
   * Event Handlers Tests
   */
  describe('Event Handlers', () => {
    it('calls onChange when value changes', async () => {
      const onChange = vi.fn();
      render(<Input onChange={onChange} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'test' } });
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('calls onFocus when input focused', () => {
      const onFocus = vi.fn();
      render(<Input onFocus={onFocus} />);
      const input = screen.getByRole('textbox');

      fireEvent.focus(input);
      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when input blurred', () => {
      const onBlur = vi.fn();
      render(<Input onBlur={onBlur} />);
      const input = screen.getByRole('textbox');

      fireEvent.blur(input);
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('changes focus state on focus/blur', async () => {
      render(<Input state="default" />);
      const input = screen.getByRole('textbox');

      fireEvent.focus(input);
      expect(input).toHaveClass('bg-blue-50');

      fireEvent.blur(input);
      expect(input).not.toHaveClass('bg-blue-50');
    });
  });

  /**
   * Accessibility Tests
   */
  describe('Accessibility', () => {
    it('has proper aria-label', () => {
      render(<Input aria-label="Email address" />);
      const input = screen.getByLabelText('Email address');
      expect(input).toBeInTheDocument();
    });

    it('associates label with input using htmlFor', () => {
      render(<Input id="email" label="Email" />);
      const label = screen.getByText('Email');
      expect(label).toHaveAttribute('for', 'email');
    });

    it('links error message with aria-describedby', () => {
      render(<Input id="email" error="Invalid email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'email-error');
    });

    it('links helper text with aria-describedby', () => {
      render(<Input id="email" helperText="Use your work email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'email-helper');
    });

    it('has role="textbox"', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('supports keyboard input', async () => {
      const user = userEvent.setup();
      const { container } = render(<Input />);
      const input = container.querySelector('input') as HTMLInputElement;

      await user.type(input, 'hello');
      expect(input.value).toBe('hello');
    });

    it('supports Enter key in text inputs', async () => {
      const user = userEvent.setup();
      render(<Input />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'test{Enter}');
      expect(input).toHaveValue('test');
    });
  });

  /**
   * CSS Classes Tests
   */
  describe('CSS Classes', () => {
    it('accepts custom className', () => {
      render(<Input className="custom-class" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
    });

    it('combines all required classes', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('w-full');
      expect(input).toHaveClass('border');
      expect(input).toHaveClass('rounded-md');
      expect(input).toHaveClass('transition-colors');
    });

    it('applies focus-visible styles', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('focus-visible:outline-2');
      expect(input).toHaveClass('focus-visible:outline-offset-2');
      expect(input).toHaveClass('focus-visible:outline-ds-primary');
    });
  });

  /**
   * Integration Tests
   */
  describe('Integration', () => {
    it('works with multiple states combined', () => {
      render(
        <Input
          type="email"
          size="lg"
          label="Email Address"
          placeholder="your@email.com"
          helperText="We'll never share your email"
          required
        />
      );

      expect(screen.getByText('Email Address')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
      expect(screen.getByText("We'll never share your email")).toBeInTheDocument();
    });

    it('handles error state change', () => {
      const { rerender } = render(<Input state="default" />);
      let input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-ds-gray-300');

      rerender(<Input error="Invalid" state="default" />);
      input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-500');
    });

    it('handles disabled -> enabled transition', () => {
      const { rerender } = render(<Input disabled />);
      let input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.disabled).toBe(true);

      rerender(<Input disabled={false} />);
      input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.disabled).toBe(false);
    });

    it('works as controlled component', () => {
      const { rerender } = render(
        <Input defaultValue="initial" />
      );

      let input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('initial');

      rerender(
        <Input defaultValue="updated" />
      );
      input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('initial'); // defaultValue doesn't change, so value stays the same
    });
  });
});
