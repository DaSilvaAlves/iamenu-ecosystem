import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';
import { Mail, Lock, Phone, Check, AlertCircle } from 'lucide-react';

const meta: Meta<typeof Input> = {
  component: Input,
  title: 'Components/Input',
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'tel', 'url', 'search'],
      description: 'Input type',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Input size',
    },
    state: {
      control: 'select',
      options: ['default', 'error', 'success', 'warning'],
      description: 'Input state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state with spinner',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Full width input',
    },
    required: {
      control: 'boolean',
      description: 'Required field',
    },
    showCharCount: {
      control: 'boolean',
      description: 'Show character count',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic Input Stories
 */
export const Basic: Story = {
  args: {
    placeholder: 'Enter text',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'John Doe',
  },
};

export const Required: Story = {
  args: {
    label: 'Email',
    placeholder: 'your@email.com',
    required: true,
  },
};

/**
 * Input Type Stories
 */
export const EmailType: Story = {
  args: {
    type: 'email',
    label: 'Email Address',
    placeholder: 'your@email.com',
    startIcon: <Mail size={18} />,
  },
};

export const PasswordType: Story = {
  args: {
    type: 'password',
    label: 'Password',
    placeholder: 'Enter password',
    startIcon: <Lock size={18} />,
  },
};

export const NumberType: Story = {
  args: {
    type: 'number',
    label: 'Age',
    placeholder: 'Enter age',
  },
};

export const PhoneType: Story = {
  args: {
    type: 'tel',
    label: 'Phone Number',
    placeholder: '+1 (555) 123-4567',
    startIcon: <Phone size={18} />,
  },
};

export const UrlType: Story = {
  args: {
    type: 'url',
    label: 'Website',
    placeholder: 'https://example.com',
  },
};

export const SearchType: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
  },
};

/**
 * Size Stories
 */
export const SmallSize: Story = {
  args: {
    size: 'sm',
    label: 'Small Input',
    placeholder: 'Small size',
  },
};

export const MediumSize: Story = {
  args: {
    size: 'md',
    label: 'Medium Input',
    placeholder: 'Medium size',
  },
};

export const LargeSize: Story = {
  args: {
    size: 'lg',
    label: 'Large Input',
    placeholder: 'Large size',
  },
};

/**
 * State Stories
 */
export const DefaultState: Story = {
  args: {
    label: 'Default State',
    placeholder: 'Enter text',
    state: 'default',
  },
};

export const ErrorState: Story = {
  args: {
    label: 'Email',
    placeholder: 'your@email.com',
    state: 'error',
    error: 'This email is already registered',
  },
};

export const SuccessState: Story = {
  args: {
    label: 'Email',
    placeholder: 'your@email.com',
    state: 'success',
    success: 'Email verified successfully',
    endIcon: <Check size={18} className="text-green-500" />,
  },
};

export const WarningState: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    state: 'warning',
    helperText: 'Password is weak, use at least 12 characters',
  },
};

/**
 * Icon Stories
 */
export const WithStartIcon: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter email',
    startIcon: <Mail size={18} />,
  },
};

export const WithEndIcon: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    type: 'password',
    endIcon: <AlertCircle size={18} />,
  },
};

export const WithBothIcons: Story = {
  args: {
    label: 'Email',
    placeholder: 'your@email.com',
    startIcon: <Mail size={18} />,
    endIcon: <Check size={18} className="text-green-500" />,
  },
};

/**
 * Helper Text Stories
 */
export const WithHelperText: Story = {
  args: {
    label: 'Email',
    placeholder: 'your@email.com',
    helperText: 'We will only use this for login purposes',
  },
};

export const WithErrorMessage: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    error: 'Username must be at least 3 characters',
    startIcon: <AlertCircle size={18} className="text-red-500" />,
  },
};

export const WithSuccessMessage: Story = {
  args: {
    label: 'Username',
    placeholder: 'john_doe',
    success: 'Username is available',
    endIcon: <Check size={18} className="text-green-500" />,
  },
};

/**
 * State Interaction Stories
 */
export const Disabled: Story = {
  args: {
    label: 'Disabled Field',
    placeholder: 'Cannot edit',
    disabled: true,
    value: 'Disabled value',
  },
};

export const Loading: Story = {
  args: {
    label: 'Email',
    placeholder: 'your@email.com',
    loading: true,
    helperText: 'Validating...',
  },
};

/**
 * Character Count Stories
 */
export const CharacterCount: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself',
    showCharCount: true,
    maxCharCount: 160,
  },
};

/**
 * Full Width Stories
 */
export const FullWidth: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'Enter full name',
    fullWidth: true,
  },
};

/**
 * Form-like Stories
 */
export const LoginForm: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4 max-w-md">
      <Input
        type="email"
        label="Email"
        placeholder="your@email.com"
        startIcon={<Mail size={18} />}
        fullWidth
        required
      />
      <Input
        type="password"
        label="Password"
        placeholder="Enter password"
        startIcon={<Lock size={18} />}
        fullWidth
        required
      />
    </div>
  ),
};

export const SignupForm: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4 max-w-md">
      <Input
        type="text"
        label="Full Name"
        placeholder="John Doe"
        fullWidth
        required
      />
      <Input
        type="email"
        label="Email"
        placeholder="your@email.com"
        startIcon={<Mail size={18} />}
        fullWidth
        required
      />
      <Input
        type="password"
        label="Password"
        placeholder="Enter password"
        startIcon={<Lock size={18} />}
        helperText="At least 8 characters"
        fullWidth
        required
      />
      <Input
        type="password"
        label="Confirm Password"
        placeholder="Confirm password"
        startIcon={<Lock size={18} />}
        fullWidth
        required
      />
    </div>
  ),
};

/**
 * All Sizes Showcase
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <Input size="sm" label="Small" placeholder="Small input" />
      <Input size="md" label="Medium" placeholder="Medium input" />
      <Input size="lg" label="Large" placeholder="Large input" />
    </div>
  ),
};

/**
 * All States Showcase
 */
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4 max-w-md">
      <Input label="Default" placeholder="Default state" state="default" />
      <Input
        label="Error"
        placeholder="Error state"
        error="Something went wrong"
      />
      <Input
        label="Success"
        placeholder="Success state"
        success="All good!"
        endIcon={<Check size={18} className="text-green-500" />}
      />
      <Input
        label="Warning"
        placeholder="Warning state"
        state="warning"
        helperText="Please check this"
      />
      <Input label="Disabled" placeholder="Disabled" disabled />
      <Input label="Loading" placeholder="Loading..." loading />
    </div>
  ),
};
