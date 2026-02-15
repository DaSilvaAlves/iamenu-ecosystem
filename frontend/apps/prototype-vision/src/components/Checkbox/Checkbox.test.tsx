import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from './Checkbox';

describe('Checkbox Component', () => {
  /**
   * Basic Rendering Tests
   */
  describe('Basic Rendering', () => {
    it('renders checkbox input', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Checkbox label="Accept terms" />);
      expect(screen.getByText('Accept terms')).toBeInTheDocument();
    });

    it('renders required asterisk', () => {
      render(<Checkbox label="Accept" required />);
      expect(screen.getByText(/\*/)).toBeInTheDocument();
    });

    it('associates label with checkbox', () => {
      render(<Checkbox id="terms" label="Accept terms" />);
      const label = screen.getByText('Accept terms');
      expect(label).toHaveAttribute('for', 'terms');
    });

    it('renders unchecked by default', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(false);
    });
  });

  /**
   * Checked State Tests
   */
  describe('Checked State', () => {
    it('renders checked when checked prop is true', () => {
      render(<Checkbox checked={true} />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });

    it('calls onChange when toggled', () => {
      const onChange = vi.fn();
      render(<Checkbox onChange={onChange} />);
      const checkbox = screen.getByRole('checkbox');

      fireEvent.click(checkbox);
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('toggles checked state', () => {
      const onChange = vi.fn();
      const { rerender } = render(
        <Checkbox checked={false} onChange={onChange} />
      );
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;

      fireEvent.click(checkbox);
      expect(onChange).toHaveBeenCalledWith(true);

      rerender(<Checkbox checked={true} onChange={onChange} />);
      expect(checkbox.checked).toBe(true);
    });
  });

  /**
   * Indeterminate State Tests
   */
  describe('Indeterminate State', () => {
    it('renders indeterminate checkbox', () => {
      render(<Checkbox indeterminate={true} />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(true);
    });

    it('changes indeterminate state', () => {
      const { rerender } = render(<Checkbox indeterminate={true} />);
      let checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(true);

      rerender(<Checkbox indeterminate={false} />);
      checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(false);
    });
  });

  /**
   * Size Tests
   */
  describe('Sizes', () => {
    it('renders with small size', () => {
      render(<Checkbox size="sm" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('w-4');
      expect(checkbox).toHaveClass('h-4');
    });

    it('renders with medium size by default', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('w-5');
      expect(checkbox).toHaveClass('h-5');
    });

    it('renders with large size', () => {
      render(<Checkbox size="lg" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('w-6');
      expect(checkbox).toHaveClass('h-6');
    });
  });

  /**
   * State Tests
   */
  describe('States', () => {
    it('renders with default state', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('border-ds-gray-300');
    });

    it('renders with error state when error provided', () => {
      render(<Checkbox error="This is required" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('border-red-500');
      expect(screen.getByText('This is required')).toBeInTheDocument();
    });

    it('renders with success state', () => {
      render(<Checkbox state="success" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('border-green-500');
    });

    it('sets aria-invalid when error', () => {
      render(<Checkbox error="Invalid" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    });
  });

  /**
   * Label Position Tests
   */
  describe('Label Position', () => {
    it('renders label on right by default', () => {
      const { container } = render(<Checkbox label="Accept" />);
      const flexDiv = container.querySelector('.flex');
      const children = flexDiv?.children;
      // Input should be before label
      expect(children?.[1]).toHaveTextContent('Accept');
    });

    it('renders label on left', () => {
      const { container } = render(
        <Checkbox label="Accept" labelPosition="left" />
      );
      const flexDiv = container.querySelector('.flex');
      const children = flexDiv?.children;
      // Label should be before input
      expect(children?.[0]).toHaveTextContent('Accept');
    });
  });

  /**
   * Disabled Tests
   */
  describe('Disabled', () => {
    it('renders disabled checkbox', () => {
      render(<Checkbox disabled />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.disabled).toBe(true);
    });

    it('checkbox is disabled and not editable', () => {
      render(<Checkbox disabled checked={true} />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.disabled).toBe(true);
    });

    it('has opacity-50 when disabled', () => {
      render(<Checkbox disabled />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('disabled:opacity-50');
    });
  });

  /**
   * Helper Text & Error Tests
   */
  describe('Helper Text & Error', () => {
    it('renders helper text', () => {
      render(<Checkbox helperText="By checking this you agree" />);
      expect(screen.getByText('By checking this you agree')).toBeInTheDocument();
    });

    it('renders error message with icon', () => {
      render(<Checkbox error="This is required" />);
      const errorMsg = screen.getByText('This is required');
      expect(errorMsg).toBeInTheDocument();
      expect(errorMsg.querySelector('svg')).toBeInTheDocument();
    });

    it('does not show helper text when error present', () => {
      render(
        <Checkbox
          error="Error message"
          helperText="Helper text"
        />
      );
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });
  });

  /**
   * Callback Tests
   */
  describe('Callbacks', () => {
    it('calls onFocus when focused', () => {
      const onFocus = vi.fn();
      render(<Checkbox onFocus={onFocus} />);
      const checkbox = screen.getByRole('checkbox');

      fireEvent.focus(checkbox);
      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when blurred', () => {
      const onBlur = vi.fn();
      render(<Checkbox onBlur={onBlur} />);
      const checkbox = screen.getByRole('checkbox');

      fireEvent.blur(checkbox);
      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });

  /**
   * CSS Classes Tests
   */
  describe('CSS Classes', () => {
    it('accepts custom className', () => {
      render(<Checkbox className="custom-class" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('custom-class');
    });

    it('has focus-visible styles', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('focus-visible:outline-2');
      expect(checkbox).toHaveClass('focus-visible:outline-ds-primary');
    });
  });

  /**
   * HTML Attributes Tests
   */
  describe('HTML Attributes', () => {
    it('sets name attribute', () => {
      render(<Checkbox name="terms" />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.name).toBe('terms');
    });

    it('sets value attribute', () => {
      render(<Checkbox value="agree" />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.value).toBe('agree');
    });

    it('sets id attribute', () => {
      render(<Checkbox id="my-checkbox" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('id', 'my-checkbox');
    });
  });

  /**
   * Accessibility Tests
   */
  describe('Accessibility', () => {
    it('has checkbox role', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('has aria-label', () => {
      render(<Checkbox label="Accept terms" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-label', 'Accept terms');
    });

    it('has aria-describedby when error present', () => {
      render(<Checkbox id="check" error="Error" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-describedby', 'check-error');
    });

    it('is keyboard accessible', () => {
      const onChange = vi.fn();
      render(<Checkbox onChange={onChange} />);
      const checkbox = screen.getByRole('checkbox');

      checkbox.focus();
      fireEvent.keyDown(checkbox, { key: ' ' });

      expect(checkbox).toHaveFocus();
    });
  });

  /**
   * Integration Tests
   */
  describe('Integration', () => {
    it('works as controlled component', () => {
      const onChange = vi.fn();
      const { rerender } = render(
        <Checkbox checked={false} onChange={onChange} />
      );
      let checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(false);

      fireEvent.click(checkbox);
      expect(onChange).toHaveBeenCalledWith(true);

      rerender(<Checkbox checked={true} onChange={onChange} />);
      checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });

    it('works with all features combined', () => {
      render(
        <Checkbox
          id="terms"
          label="I agree to terms and conditions"
          size="lg"
          required
          helperText="Please read before accepting"
          onChange={() => {}}
        />
      );

      expect(screen.getByText(/I agree to terms and conditions \*/)).toBeInTheDocument();
      expect(screen.getByText('Please read before accepting')).toBeInTheDocument();
    });

    it('handles error state change', () => {
      const { rerender } = render(<Checkbox state="default" />);
      let checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('border-ds-gray-300');

      rerender(<Checkbox error="Invalid" />);
      checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('border-red-500');
    });

    it('handles disabled state change', () => {
      const { rerender } = render(<Checkbox disabled={false} />);
      let checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.disabled).toBe(false);

      rerender(<Checkbox disabled={true} />);
      checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.disabled).toBe(true);
    });
  });
});
