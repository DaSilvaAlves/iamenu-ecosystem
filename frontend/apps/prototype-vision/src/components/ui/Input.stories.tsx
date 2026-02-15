import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Mail, Lock, Search as SearchIcon } from 'lucide-react';
import Input from './Input';

const meta = {
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'search', 'textarea'],
      description: 'Input type',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the input',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Mark as required',
    },
    clearable: {
      control: { type: 'boolean' },
      description: 'Show clear button when has value',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message',
    },
    hint: {
      control: { type: 'text' },
      description: 'Helper text',
    },
    label: {
      control: { type: 'text' },
      description: 'Label text',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Text Input Stories
export const Text: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
    label: 'Text Input',
  },
};

export const TextWithIcon: Story = {
  args: {
    type: 'text',
    placeholder: 'Search...',
    label: 'Text with Icon',
    icon: Search,
  },
};

export const TextClearable: Story = {
  args: {
    type: 'text',
    placeholder: 'Type something to clear...',
    label: 'Clearable Text',
    clearable: true,
    value: 'Sample text',
  },
};

export const TextWithHint: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter username',
    label: 'Username',
    hint: 'Use letters, numbers, and underscore only',
  },
};

export const TextDisabled: Story = {
  args: {
    type: 'text',
    placeholder: 'Disabled input',
    label: 'Disabled Input',
    disabled: true,
    value: 'Cannot edit',
  },
};

export const TextRequired: Story = {
  args: {
    type: 'text',
    placeholder: 'This field is required',
    label: 'Required Field',
    required: true,
  },
};

export const TextWithError: Story = {
  args: {
    type: 'text',
    placeholder: 'Invalid input',
    label: 'With Error',
    error: 'This field is required',
    value: '',
  },
};

// Email Input Stories
export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'example@email.com',
    label: 'Email Address',
    icon: Mail,
  },
};

export const EmailWithError: Story = {
  args: {
    type: 'email',
    placeholder: 'example@email.com',
    label: 'Email Address',
    value: 'invalid-email',
    error: 'Please enter a valid email address',
  },
};

export const EmailDisabled: Story = {
  args: {
    type: 'email',
    placeholder: 'example@email.com',
    label: 'Email Address',
    disabled: true,
    value: 'user@example.com',
  },
};

// Password Input Stories
export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
    label: 'Password',
    icon: Lock,
  },
};

export const PasswordWithHint: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
    label: 'Password',
    hint: 'At least 8 characters with uppercase, lowercase, and numbers',
  },
};

export const PasswordWithError: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
    label: 'Password',
    value: 'weak',
    error: 'Password must be at least 8 characters',
  },
};

// Number Input Stories
export const Number: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter a number',
    label: 'Age',
    min: 0,
    max: 120,
  },
};

export const NumberWithHint: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter amount',
    label: 'Amount (€)',
    hint: 'Enter amount in euros',
  },
};

// Search Input Stories
export const SearchInput: Story = {
  args: {
    type: 'search',
    placeholder: 'Search products...',
    label: 'Search',
    clearable: true,
  },
};

export const SearchInputDisabled: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
    label: 'Search',
    disabled: true,
  },
};

// Textarea Stories
export const Textarea: Story = {
  args: {
    type: 'textarea',
    placeholder: 'Enter your message...',
    label: 'Message',
  },
};

export const TextareaWithError: Story = {
  args: {
    type: 'textarea',
    placeholder: 'Enter your message...',
    label: 'Message',
    error: 'Message must be at least 10 characters',
    value: 'Too short',
  },
};

export const TextareaWithHint: Story = {
  args: {
    type: 'textarea',
    placeholder: 'Enter your feedback...',
    label: 'Feedback',
    hint: 'Please be as detailed as possible',
  },
};

export const TextareaDisabled: Story = {
  args: {
    type: 'textarea',
    placeholder: 'Cannot edit',
    label: 'Disabled Textarea',
    disabled: true,
    value: 'This textarea is disabled and cannot be edited.',
  },
};

// Interactive Stories
export const InteractiveText: Story = {
  render: function Component() {
    const [value, setValue] = useState('');
    return (
      <Input
        type="text"
        placeholder="Type something..."
        label="Interactive Input"
        clearable
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue('')}
      />
    );
  },
};

export const InteractivePassword: Story = {
  render: function Component() {
    const [value, setValue] = useState('');
    return (
      <Input
        type="password"
        placeholder="Enter password"
        label="Interactive Password"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};

export const InteractiveTextarea: Story = {
  render: function Component() {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      setError(newValue.length < 10 ? 'Minimum 10 characters' : '');
    };

    return (
      <Input
        type="textarea"
        placeholder="Enter at least 10 characters..."
        label="Interactive Textarea"
        value={value}
        onChange={handleChange}
        error={error}
        hint={`${value.length}/10 characters`}
      />
    );
  },
};
