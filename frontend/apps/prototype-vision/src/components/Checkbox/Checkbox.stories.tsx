import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
  title: 'Components/Checkbox',
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Checkbox size',
    },
    state: {
      control: 'select',
      options: ['default', 'error', 'success'],
      description: 'Checkbox state',
    },
    labelPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Label position',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    required: {
      control: 'boolean',
      description: 'Required field',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Indeterminate state',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic Checkbox Stories
 */
export const Basic: Story = {
  args: {
    label: 'Accept terms and conditions',
  },
};

export const Checked: Story = {
  args: {
    label: 'Option is checked',
    checked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    label: 'Indeterminate state',
    indeterminate: true,
  },
};

/**
 * Size Stories
 */
export const SmallSize: Story = {
  args: {
    size: 'sm',
    label: 'Small checkbox',
  },
};

export const MediumSize: Story = {
  args: {
    size: 'md',
    label: 'Medium checkbox',
  },
};

export const LargeSize: Story = {
  args: {
    size: 'lg',
    label: 'Large checkbox',
  },
};

/**
 * State Stories
 */
export const DefaultState: Story = {
  args: {
    label: 'Default state',
    state: 'default',
  },
};

export const ErrorState: Story = {
  args: {
    label: 'With error',
    state: 'error',
    error: 'This field is required',
  },
};

export const SuccessState: Story = {
  args: {
    label: 'Successfully validated',
    state: 'success',
    checked: true,
  },
};

/**
 * Label Position Stories
 */
export const LabelRight: Story = {
  args: {
    label: 'Label on right',
    labelPosition: 'right',
  },
};

export const LabelLeft: Story = {
  args: {
    label: 'Label on left',
    labelPosition: 'left',
  },
};

/**
 * Feature Stories
 */
export const WithHelper: Story = {
  args: {
    label: 'I agree to the terms',
    helperText: 'Please read our terms and conditions carefully',
  },
};

export const WithError: Story = {
  args: {
    label: 'Accept updates',
    error: 'You must accept to continue',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled checkbox',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled but checked',
    disabled: true,
    checked: true,
  },
};

export const Required: Story = {
  args: {
    label: 'Required field',
    required: true,
  },
};

/**
 * Form Examples
 */
export const TermsCheckbox: Story = {
  render: () => (
    <div className="space-y-4 p-4">
      <Checkbox
        id="terms"
        label="I agree to the Terms of Service"
        helperText="You must accept to create an account"
        required
      />
      <Checkbox
        id="privacy"
        label="I agree to the Privacy Policy"
        helperText="We take your privacy seriously"
        required
      />
      <Checkbox
        id="newsletter"
        label="Subscribe to our newsletter"
        helperText="Get updates about new features and releases"
      />
    </div>
  ),
};

/**
 * Preferences Form
 */
export const PreferencesForm: Story = {
  render: () => (
    <div className="space-y-3 p-4 max-w-sm">
      <div className="mb-4">
        <h3 className="font-semibold mb-3">Notification Preferences</h3>
      </div>
      <Checkbox label="Email notifications" checked={true} />
      <Checkbox label="SMS notifications" />
      <Checkbox label="Push notifications" checked={true} />
      <Checkbox label="Weekly digest" />
    </div>
  ),
};

/**
 * Permissions Checkboxes
 */
export const PermissionsCheckboxes: Story = {
  render: () => (
    <div className="space-y-3 p-4 max-w-sm">
      <div className="mb-4">
        <h3 className="font-semibold mb-3">User Permissions</h3>
      </div>
      <Checkbox label="Read" />
      <Checkbox label="Write" />
      <Checkbox label="Delete" />
      <Checkbox label="Admin" />
    </div>
  ),
};

/**
 * Group Select All Pattern
 */
export const GroupSelectAll: Story = {
  render: () => (
    <div className="space-y-3 p-4 max-w-sm border rounded-lg">
      <Checkbox
        id="select-all"
        label="Select All"
        size="md"
        indeterminate={true}
      />
      <div className="ml-6 space-y-2">
        <Checkbox label="Option 1" />
        <Checkbox label="Option 2" />
        <Checkbox label="Option 3" />
        <Checkbox label="Option 4" />
      </div>
    </div>
  ),
};

/**
 * All Sizes Showcase
 */
export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4 p-4">
      <Checkbox size="sm" label="Small checkbox" />
      <Checkbox size="md" label="Medium checkbox" />
      <Checkbox size="lg" label="Large checkbox" />
    </div>
  ),
};

/**
 * All States Showcase
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-4 p-4">
      <Checkbox label="Default" />
      <Checkbox label="Checked" checked={true} />
      <Checkbox label="Indeterminate" indeterminate={true} />
      <Checkbox label="Disabled" disabled={true} />
      <Checkbox label="Error" error="This is required" />
      <Checkbox label="Success" state="success" checked={true} />
    </div>
  ),
};

/**
 * Checkbox Sizes
 */
export const SizeComparison: Story = {
  render: () => (
    <div className="flex items-center gap-8 p-4">
      <Checkbox size="sm" label="Small" checked={true} />
      <Checkbox size="md" label="Medium" checked={true} />
      <Checkbox size="lg" label="Large" checked={true} />
    </div>
  ),
};

/**
 * Interactive Example
 */
export const Interactive: Story = {
  args: {
    label: 'Click me to toggle',
    size: 'md',
  },
};
