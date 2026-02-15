import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { Heart, Share2, MoreVertical } from 'lucide-react';
import { Button } from '../Button/Button';

const meta: Meta<typeof Card> = {
  component: Card,
  title: 'Components/Card',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'outlined', 'filled'],
      description: 'Card visual variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Card padding size',
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
      description: 'Border radius',
    },
    clickable: {
      control: 'boolean',
      description: 'Make card clickable',
    },
    hoverable: {
      control: 'boolean',
      description: 'Show hover effect',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic Card Stories
 */
export const Basic: Story = {
  args: {
    children: 'This is a basic card with content.',
  },
};

export const WithHeader: Story = {
  args: {
    header: <h3 className="text-lg font-semibold">Card Title</h3>,
    children: 'Card description and content goes here.',
  },
};

export const WithFooter: Story = {
  args: {
    header: <h3 className="text-lg font-semibold">Card Title</h3>,
    children: 'Card content and description.',
    footer: <Button size="sm">Action</Button>,
  },
};

export const WithImage: Story = {
  args: {
    image: {
      src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=200&fit=crop',
      alt: 'Beautiful landscape',
      height: 200,
    },
    header: <h3 className="text-lg font-semibold">Card with Image</h3>,
    children: 'This card features a banner image at the top.',
    footer: <div className="flex gap-2"><Button size="sm">Learn More</Button></div>,
  },
};

/**
 * Variant Stories
 */
export const ElevatedVariant: Story = {
  args: {
    variant: 'elevated',
    header: <h3 className="text-lg font-semibold">Elevated Card</h3>,
    children: 'This card has a shadow elevation effect.',
  },
};

export const OutlinedVariant: Story = {
  args: {
    variant: 'outlined',
    header: <h3 className="text-lg font-semibold">Outlined Card</h3>,
    children: 'This card has a border outline.',
  },
};

export const FilledVariant: Story = {
  args: {
    variant: 'filled',
    header: <h3 className="text-lg font-semibold">Filled Card</h3>,
    children: 'This card has a filled background.',
  },
};

/**
 * Size Stories
 */
export const SmallSize: Story = {
  args: {
    size: 'sm',
    header: <h3 className="text-sm font-semibold">Small Card</h3>,
    children: 'Compact card with small padding.',
  },
};

export const MediumSize: Story = {
  args: {
    size: 'md',
    header: <h3 className="text-lg font-semibold">Medium Card</h3>,
    children: 'Default card size with standard padding.',
  },
};

export const LargeSize: Story = {
  args: {
    size: 'lg',
    header: <h3 className="text-xl font-semibold">Large Card</h3>,
    children: 'Large card with generous padding for prominent content.',
  },
};

/**
 * Rounded Stories
 */
export const RoundedNone: Story = {
  args: {
    rounded: 'none',
    header: <h3 className="font-semibold">Square Card</h3>,
    children: 'Card with no rounding.',
  },
};

export const RoundedSmall: Story = {
  args: {
    rounded: 'sm',
    header: <h3 className="font-semibold">Slightly Rounded</h3>,
    children: 'Card with small rounding.',
  },
};

export const RoundedLarge: Story = {
  args: {
    rounded: 'lg',
    header: <h3 className="font-semibold">Highly Rounded</h3>,
    children: 'Card with large rounding.',
  },
};

/**
 * Interactive Stories
 */
export const Clickable: Story = {
  args: {
    clickable: true,
    header: <h3 className="text-lg font-semibold">Click Me</h3>,
    children: 'This card is clickable. Try clicking it!',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    header: <h3 className="text-lg font-semibold">Disabled Card</h3>,
    children: 'This card is disabled and not interactive.',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    header: <h3 className="text-lg font-semibold">Loading...</h3>,
    children: 'Card content is loading.',
  },
};

/**
 * Product Card Example
 */
export const ProductCard: Story = {
  render: () => (
    <Card
      variant="elevated"
      size="md"
      image={{
        src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
        alt: 'Laptop product',
        height: 250,
      }}
      clickable
      onClick={() => alert('Product clicked!')}
    >
      <div>
        <h3 className="text-lg font-semibold mb-2">Premium Laptop</h3>
        <p className="text-ds-gray-600 mb-4">
          High-performance laptop with latest technology. Perfect for professionals.
        </p>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-ds-primary">$1,299</span>
          <span className="text-sm text-ds-gray-500 line-through">$1,599</span>
        </div>
      </div>
    </Card>
  ),
};

/**
 * User Profile Card
 */
export const UserProfileCard: Story = {
  render: () => (
    <Card variant="outlined" size="md" className="max-w-sm">
      <div className="text-center">
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
          alt="User avatar"
          className="w-20 h-20 rounded-full mx-auto mb-4"
        />
        <h3 className="text-lg font-semibold mb-1">Sarah Johnson</h3>
        <p className="text-ds-gray-600 mb-4">Product Designer</p>
        <p className="text-sm text-ds-gray-600 mb-6">
          Creating beautiful and functional user experiences. Coffee enthusiast.
        </p>
        <div className="flex gap-2 justify-center">
          <Button size="sm" variant="secondary">Follow</Button>
          <Button size="sm" variant="secondary">Message</Button>
        </div>
      </div>
    </Card>
  ),
};

/**
 * Article Card
 */
export const ArticleCard: Story = {
  render: () => (
    <Card
      variant="elevated"
      size="md"
      header={
        <div className="mb-2">
          <span className="inline-block bg-blue-100 text-ds-primary text-xs font-semibold px-3 py-1 rounded-full">
            Technology
          </span>
        </div>
      }
      image={{
        src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop',
        alt: 'Tech article',
        height: 200,
      }}
      footer={
        <div className="flex items-center justify-between text-sm text-ds-gray-600">
          <span>5 min read</span>
          <span>Mar 15, 2024</span>
        </div>
      }
    >
      <h3 className="text-xl font-bold mb-2">The Future of Web Development</h3>
      <p className="text-ds-gray-700">
        Exploring the latest trends and technologies shaping the future of web development...
      </p>
    </Card>
  ),
};

/**
 * Stats Card
 */
export const StatsCard: Story = {
  render: () => (
    <Card variant="filled" size="md" className="text-center">
      <div className="mb-4">
        <span className="text-4xl font-bold text-ds-primary">2.4K</span>
      </div>
      <p className="text-ds-gray-600">Total Users</p>
      <p className="text-sm text-green-600 mt-2">↑ 12% from last month</p>
    </Card>
  ),
};

/**
 * Interactive Actions Card
 */
export const ActionsCard: Story = {
  render: () => (
    <Card variant="elevated" size="md">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Post Title</h3>
          <p className="text-sm text-ds-gray-600">by John Doe • 2 hours ago</p>
        </div>
        <button className="text-ds-gray-400 hover:text-ds-gray-600">
          <MoreVertical size={20} />
        </button>
      </div>
      <p className="text-ds-gray-700 mb-4">
        This is an interesting post about web development and design patterns.
      </p>
      <div className="flex gap-4 pt-4 border-t border-ds-gray-200">
        <button className="flex items-center gap-2 text-ds-gray-600 hover:text-red-500 transition-colors">
          <Heart size={18} />
          <span>124</span>
        </button>
        <button className="flex items-center gap-2 text-ds-gray-600 hover:text-ds-primary transition-colors">
          <Share2 size={18} />
          <span>Share</span>
        </button>
      </div>
    </Card>
  ),
};

/**
 * All Variants Showcase
 */
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card variant="elevated">
        <h3 className="font-semibold mb-2">Elevated</h3>
        <p className="text-sm text-ds-gray-600">Shadow effect card</p>
      </Card>
      <Card variant="outlined">
        <h3 className="font-semibold mb-2">Outlined</h3>
        <p className="text-sm text-ds-gray-600">Border outline card</p>
      </Card>
      <Card variant="filled">
        <h3 className="font-semibold mb-2">Filled</h3>
        <p className="text-sm text-ds-gray-600">Filled background card</p>
      </Card>
    </div>
  ),
};

/**
 * All Sizes Showcase
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Card size="sm">
        <h3 className="font-semibold">Small Card</h3>
        <p className="text-sm">Compact padding</p>
      </Card>
      <Card size="md">
        <h3 className="font-semibold">Medium Card</h3>
        <p className="text-sm">Default padding</p>
      </Card>
      <Card size="lg">
        <h3 className="font-semibold">Large Card</h3>
        <p className="text-sm">Generous padding</p>
      </Card>
    </div>
  ),
};
