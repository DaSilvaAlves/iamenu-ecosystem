import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta = {
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger', 'ghost', 'link'],
      description: 'Visual style of the button',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the button',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the button',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Show loading spinner and disable interaction',
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: 'Make button full width',
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Primary Variant Stories
export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Primary Button',
  },
};

export const PrimarySmall: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
    children: 'Small',
  },
};

export const PrimaryLarge: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    children: 'Large',
  },
};

export const PrimaryLoading: Story = {
  args: {
    variant: 'primary',
    loading: true,
    children: 'Loading',
  },
};

export const PrimaryDisabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled',
  },
};

// Secondary Variant Stories
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'md',
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

export const SecondaryLoading: Story = {
  args: {
    variant: 'secondary',
    loading: true,
    children: 'Loading',
  },
};

export const SecondaryDisabled: Story = {
  args: {
    variant: 'secondary',
    disabled: true,
    children: 'Disabled',
  },
};

// Danger Variant Stories
export const Danger: Story = {
  args: {
    variant: 'danger',
    size: 'md',
    children: 'Delete',
  },
};

export const DangerSmall: Story = {
  args: {
    variant: 'danger',
    size: 'sm',
    children: 'Small',
  },
};

export const DangerLarge: Story = {
  args: {
    variant: 'danger',
    size: 'lg',
    children: 'Large',
  },
};

export const DangerLoading: Story = {
  args: {
    variant: 'danger',
    loading: true,
    children: 'Deleting',
  },
};

export const DangerDisabled: Story = {
  args: {
    variant: 'danger',
    disabled: true,
    children: 'Disabled',
  },
};

// Ghost Variant Stories
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    size: 'md',
    children: 'Ghost Button',
  },
};

export const GhostSmall: Story = {
  args: {
    variant: 'ghost',
    size: 'sm',
    children: 'Small',
  },
};

export const GhostLarge: Story = {
  args: {
    variant: 'ghost',
    size: 'lg',
    children: 'Large',
  },
};

export const GhostLoading: Story = {
  args: {
    variant: 'ghost',
    loading: true,
    children: 'Loading',
  },
};

export const GhostDisabled: Story = {
  args: {
    variant: 'ghost',
    disabled: true,
    children: 'Disabled',
  },
};

// Link Variant Stories
export const Link: Story = {
  args: {
    variant: 'link',
    size: 'md',
    children: 'Link Button',
  },
};

export const LinkSmall: Story = {
  args: {
    variant: 'link',
    size: 'sm',
    children: 'Small',
  },
};

export const LinkLarge: Story = {
  args: {
    variant: 'link',
    size: 'lg',
    children: 'Large',
  },
};

export const LinkDisabled: Story = {
  args: {
    variant: 'link',
    disabled: true,
    children: 'Disabled',
  },
};

// Full Width Story
export const FullWidth: Story = {
  args: {
    variant: 'primary',
    fullWidth: true,
    children: 'Full Width Button',
  },
};

// Interaction Demo
export const InteractiveDemo: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Click me!',
  },
};
