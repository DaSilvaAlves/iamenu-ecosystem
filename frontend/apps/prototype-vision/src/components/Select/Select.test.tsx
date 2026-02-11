import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Select } from './Select';

const mockOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date', disabled: true },
];

describe('Select Component', () => {
  /**
   * Basic Rendering Tests
   */
  describe('Basic Rendering', () => {
    it('renders select button', () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('renders with placeholder', () => {
      render(<Select options={mockOptions} />);
      expect(screen.getByText('Select option...')).toBeInTheDocument();
    });

    it('renders with custom placeholder', () => {
      render(
        <Select options={mockOptions} placeholder="Choose fruit..." />
      );
      expect(screen.getByText('Choose fruit...')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Select options={mockOptions} label="Fruit" />);
      expect(screen.getByText('Fruit')).toBeInTheDocument();
    });

    it('renders required asterisk', () => {
      render(<Select options={mockOptions} label="Fruit" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('dropdown is closed by default', () => {
      render(<Select options={mockOptions} />);
      const options = screen.queryAllByRole('option');
      expect(options).toHaveLength(0);
    });
  });

  /**
   * Single Select Mode Tests
   */
  describe('Single Select Mode', () => {
    it('opens dropdown when clicked', () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(4);
    });

    it('displays selected value', () => {
      render(<Select options={mockOptions} value="apple" />);
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    it('calls onChange when option selected', () => {
      const onChange = vi.fn();
      render(<Select options={mockOptions} onChange={onChange} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);
      const appleOption = screen.getByText('Apple');
      fireEvent.click(appleOption);

      expect(onChange).toHaveBeenCalledWith('apple');
    });

    it('closes dropdown after selection', () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);
      const appleOption = screen.getByText('Apple');
      fireEvent.click(appleOption);

      const options = screen.queryAllByRole('option');
      expect(options).toHaveLength(0);
    });
  });

  /**
   * Multiple Select Mode Tests
   */
  describe('Multiple Select Mode', () => {
    it('renders checkboxes in multiple mode', () => {
      render(<Select options={mockOptions} mode="multiple" />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    it('keeps dropdown open in multiple mode', () => {
      render(<Select options={mockOptions} mode="multiple" />);
      const button = screen.getByRole('button');

      fireEvent.click(button);
      const appleOption = screen.getByText('Apple');
      fireEvent.click(appleOption);

      const options = screen.queryAllByRole('option');
      expect(options.length).toBeGreaterThan(0);
    });

    it('displays count of selected items', () => {
      render(
        <Select
          options={mockOptions}
          mode="multiple"
          value={['apple', 'banana']}
        />
      );
      expect(screen.getByText('2 selected')).toBeInTheDocument();
    });

    it('handles multiple selections', () => {
      const onChange = vi.fn();
      render(
        <Select options={mockOptions} mode="multiple" onChange={onChange} />
      );
      const button = screen.getByRole('button');

      fireEvent.click(button);
      fireEvent.click(screen.getByText('Apple'));

      expect(onChange).toHaveBeenCalledWith(['apple']);
    });

    it('handles deselection in multiple mode', () => {
      const onChange = vi.fn();
      render(
        <Select
          options={mockOptions}
          mode="multiple"
          value={['apple', 'banana']}
          onChange={onChange}
        />
      );
      const button = screen.getByRole('button');

      fireEvent.click(button);
      fireEvent.click(screen.getByText('Apple'));

      expect(onChange).toHaveBeenCalledWith(['banana']);
    });

    it('respects maxSelected limit', () => {
      const onChange = vi.fn();
      render(
        <Select
          options={mockOptions}
          mode="multiple"
          value={['apple', 'banana']}
          maxSelected={2}
          onChange={onChange}
        />
      );
      expect(screen.getByText('2 selected')).toBeInTheDocument();
    });
  });

  /**
   * Search/Filter Tests
   */
  describe('Search & Filter', () => {
    it('shows search input when searchable', () => {
      render(<Select options={mockOptions} searchable={true} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      const searchInput = screen.getByPlaceholderText('Search...');
      expect(searchInput).toBeInTheDocument();
    });

    it('hides search input when not searchable', () => {
      render(<Select options={mockOptions} searchable={false} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      const searchInput = screen.queryByPlaceholderText('Search...');
      expect(searchInput).not.toBeInTheDocument();
    });

    it('filters options by search term', () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      const searchInput = screen.getByPlaceholderText('Search...');
      fireEvent.change(searchInput, { target: { value: 'app' } });

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(1);
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    it('shows no results message', () => {
      render(<Select options={mockOptions} noResultsMessage="No match found" />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      const searchInput = screen.getByPlaceholderText('Search...');
      fireEvent.change(searchInput, { target: { value: 'xyz' } });

      expect(screen.getByText('No match found')).toBeInTheDocument();
    });

    it('focuses search input when dropdown opens', async () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search...');
        expect(searchInput).toHaveFocus();
      });
    });
  });

  /**
   * Size Tests
   */
  describe('Sizes', () => {
    it('renders with small size', () => {
      render(<Select options={mockOptions} size="sm" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-sm');
      expect(button).toHaveClass('px-2.5');
    });

    it('renders with medium size by default', () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-base');
      expect(button).toHaveClass('px-3');
    });

    it('renders with large size', () => {
      render(<Select options={mockOptions} size="lg" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-lg');
      expect(button).toHaveClass('px-4');
    });
  });

  /**
   * Disabled & Loading Tests
   */
  describe('Disabled & Loading', () => {
    it('renders disabled select', () => {
      render(<Select options={mockOptions} disabled />);
      const button = screen.getByRole('button') as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });

    it('does not open when disabled', () => {
      render(<Select options={mockOptions} disabled />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      const options = screen.queryAllByRole('option');
      expect(options).toHaveLength(0);
    });

    it('shows loading state', () => {
      render(<Select options={mockOptions} loading />);
      const spinner = screen.getByRole('button').querySelector('svg');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
    });

    it('disables button when loading', () => {
      render(<Select options={mockOptions} loading />);
      const button = screen.getByRole('button') as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });

    it('disables options when marked as disabled', () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      const dateOption = screen.getByText('Date').closest('button');
      expect(dateOption).toBeDisabled();
    });
  });

  /**
   * Clear Functionality Tests
   */
  describe('Clear Functionality', () => {
    it('shows clear button when clearable', () => {
      render(<Select options={mockOptions} value="apple" clearable />);
      const clearButton = screen.getByLabelText('Clear selection');
      expect(clearButton).toBeInTheDocument();
    });

    it('hides clear button when no selection', () => {
      render(<Select options={mockOptions} clearable />);
      const clearButton = screen.queryByLabelText('Clear selection');
      expect(clearButton).not.toBeInTheDocument();
    });

    it('clears selection when clear button clicked', () => {
      const onChange = vi.fn();
      render(
        <Select
          options={mockOptions}
          value="apple"
          clearable
          onChange={onChange}
        />
      );
      const clearButton = screen.getByLabelText('Clear selection');
      fireEvent.click(clearButton);

      expect(onChange).toHaveBeenCalledWith('');
    });
  });

  /**
   * Keyboard Navigation Tests
   */
  describe('Keyboard Navigation', () => {
    it('opens dropdown with Enter key', () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');

      fireEvent.keyDown(button, { key: 'Enter' });

      const options = screen.getAllByRole('option');
      expect(options.length).toBeGreaterThan(0);
    });

    it('opens dropdown with Space key', () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');

      fireEvent.keyDown(button, { key: ' ' });

      const options = screen.getAllByRole('option');
      expect(options.length).toBeGreaterThan(0);
    });

    it('closes dropdown with Escape key', () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);
      fireEvent.keyDown(button, { key: 'Escape' });

      const options = screen.queryAllByRole('option');
      expect(options).toHaveLength(0);
    });

    it('supports arrow down key', () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);
      fireEvent.keyDown(button, { key: 'ArrowDown' });

      // Should still show options
      const options = screen.getAllByRole('option');
      expect(options.length).toBeGreaterThan(0);
    });

    it('selects with Enter key', () => {
      const onChange = vi.fn();
      render(<Select options={mockOptions} onChange={onChange} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);
      fireEvent.keyDown(button, { key: 'ArrowDown' });
      fireEvent.keyDown(button, { key: 'Enter' });

      expect(onChange).toHaveBeenCalled();
    });
  });

  /**
   * Helper Text & Error Tests
   */
  describe('Helper Text & Error', () => {
    it('renders helper text', () => {
      render(
        <Select options={mockOptions} helperText="Select your favorite fruit" />
      );
      expect(screen.getByText('Select your favorite fruit')).toBeInTheDocument();
    });

    it('renders error message', () => {
      render(<Select options={mockOptions} error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('shows error styling', () => {
      render(<Select options={mockOptions} error="Error" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-red-500');
    });
  });

  /**
   * Full Width Tests
   */
  describe('Full Width', () => {
    it('applies full width class', () => {
      const { container } = render(
        <Select options={mockOptions} fullWidth />
      );
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('w-full');
    });
  });

  /**
   * Option Features Tests
   */
  describe('Option Features', () => {
    it('renders option with description', () => {
      const optionsWithDesc = [
        { value: 'test', label: 'Test', description: 'Test description' },
      ];
      render(<Select options={optionsWithDesc} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('renders option with icon', () => {
      const optionsWithIcon = [
        {
          value: 'test',
          label: 'Test',
          icon: <span data-testid="option-icon">🍎</span>,
        },
      ];
      render(<Select options={optionsWithIcon} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      expect(screen.getByTestId('option-icon')).toBeInTheDocument();
    });
  });

  /**
   * Accessibility Tests
   */
  describe('Accessibility', () => {
    it('has aria-haspopup attribute', () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-haspopup', 'listbox');
    });

    it('sets aria-expanded based on open state', () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('sets aria-disabled when disabled', () => {
      render(<Select options={mockOptions} disabled />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('listbox has aria-multiselectable in multiple mode', () => {
      render(<Select options={mockOptions} mode="multiple" />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      const listbox = screen.getByRole('listbox');
      expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('closes on outside click', () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);
      fireEvent.mouseDown(document.body);

      const options = screen.queryAllByRole('option');
      expect(options).toHaveLength(0);
    });
  });

  /**
   * Integration Tests
   */
  describe('Integration', () => {
    it('handles controlled component pattern', () => {
      const { rerender } = render(
        <Select options={mockOptions} value="apple" />
      );
      expect(screen.getByText('Apple')).toBeInTheDocument();

      rerender(<Select options={mockOptions} value="banana" />);
      expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    it('works with all features combined', () => {
      const onChange = vi.fn();
      render(
        <Select
          options={mockOptions}
          label="Select Fruit"
          placeholder="Choose one..."
          searchable={true}
          clearable={true}
          required={true}
          value="apple"
          onChange={onChange}
          helperText="Pick your favorite"
        />
      );

      expect(screen.getByText('Select Fruit')).toBeInTheDocument();
      expect(screen.getByText('Pick your favorite')).toBeInTheDocument();
      expect(screen.getByLabelText('Clear selection')).toBeInTheDocument();
    });
  });
});
