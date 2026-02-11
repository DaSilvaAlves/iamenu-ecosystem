import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Components/Button',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: 'Button visual variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
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
      description: 'Full width button',
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary Variant Stories
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Click me',
  },
};

export const PrimarySmall: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
    children: 'Small Button',
  },
};

export const PrimaryMedium: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Medium Button',
  },
};

export const PrimaryLarge: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    children: 'Large Button',
  },
};

export const PrimaryLoading: Story = {
  args: {
    variant: 'primary',
    loading: true,
    children: 'Loading...',
  },
};

export const PrimaryDisabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled Button',
  },
};

/**
 * Secondary Variant Stories
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const SecondarySmall: Story = {
  args: {
    variant: 'secondary',
    size: 'sm',
    children: 'Small',
  },
};

export const SecondaryLarge: Story = {
  args: {
    variant: 'secondary',
    size: 'lg',
    children: 'Large',
  },
};

/**
 * Tertiary Variant Stories
 */
export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    children: 'Tertiary Button',
  },
};

export const TertiarySmall: Story = {
  args: {
    variant: 'tertiary',
    size: 'sm',
    children: 'Small',
  },
};

export const TertiaryLarge: Story = {
  args: {
    variant: 'tertiary',
    size: 'lg',
    children: 'Large',
  },
};

/**
 * Full Width Stories
 */
export const FullWidth: Story = {
  args: {
    variant: 'primary',
    fullWidth: true,
    children: 'Full Width Button',
  },
};

/**
 * All States Showcase
 */
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-2">
        <Button variant="primary">Default</Button>
        <Button variant="primary" disabled>
          Disabled
        </Button>
        <Button variant="primary" loading>
          Loading
        </Button>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary">Default</Button>
        <Button variant="secondary" disabled>
          Disabled
        </Button>
        <Button variant="secondary" loading>
          Loading
        </Button>
      </div>
      <div className="flex gap-2">
        <Button variant="tertiary">Default</Button>
        <Button variant="tertiary" disabled>
          Disabled
        </Button>
        <Button variant="tertiary" loading>
          Loading
        </Button>
      </div>
    </div>
  ),
};

/**
 * All Sizes Showcase
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <Button size="sm">Small Button</Button>
      <Button size="md">Medium Button</Button>
      <Button size="lg">Large Button</Button>
    </div>
  ),
};
