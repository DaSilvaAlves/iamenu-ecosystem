import type { Meta, StoryObj } from '@storybook/react';
import Card from './Card';
import Button from './Button';

const meta = {
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated', 'outlined', 'interactive'],
      description: 'Card visual style',
    },
    padding: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Padding around content',
    },
    animate: {
      control: { type: 'boolean' },
      description: 'Enable entrance animation',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default Variant Stories
export const Default: Story = {
  args: {
    variant: 'default',
    padding: 'md',
    children: (
      <div>
        <h3 className="text-lg font-bold text-white">Default Card</h3>
        <p className="text-sm text-text-muted mt-2">
          This is a default card with standard styling
        </p>
      </div>
    ),
  },
};

export const DefaultWithStructure: Story = {
  args: {
    variant: 'default',
    children: (
      <>
        <Card.Header>
          <Card.Title>Card Title</Card.Title>
          <Card.Description>Card description goes here</Card.Description>
        </Card.Header>
        <Card.Content>
          <p className="text-white">This is the main content area of the card.</p>
        </Card.Content>
        <Card.Footer>
          <Button size="sm">Action</Button>
        </Card.Footer>
      </>
    ),
  },
};

export const DefaultSmallPadding: Story = {
  args: {
    variant: 'default',
    padding: 'sm',
    children: (
      <div>
        <h3 className="text-lg font-bold text-white">Small Padding</h3>
        <p className="text-sm text-text-muted mt-2">Compact card layout</p>
      </div>
    ),
  },
};

export const DefaultLargePadding: Story = {
  args: {
    variant: 'default',
    padding: 'lg',
    children: (
      <div>
        <h3 className="text-lg font-bold text-white">Large Padding</h3>
        <p className="text-sm text-text-muted mt-2">Spacious card layout</p>
      </div>
    ),
  },
};

// Elevated Variant Stories
export const Elevated: Story = {
  args: {
    variant: 'elevated',
    padding: 'md',
    children: (
      <div>
        <h3 className="text-lg font-bold text-white">Elevated Card</h3>
        <p className="text-sm text-text-muted mt-2">
          This card has an elevated shadow effect
        </p>
      </div>
    ),
  },
};

export const ElevatedWithStructure: Story = {
  args: {
    variant: 'elevated',
    children: (
      <>
        <Card.Header>
          <Card.Title>Feature Card</Card.Title>
          <Card.Description>Premium elevated design</Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="bg-primary/10 rounded-lg p-4 my-4">
            <p className="text-white text-sm">Featured content area</p>
          </div>
        </Card.Content>
        <Card.Footer>
          <Button variant="primary" size="sm">Learn More</Button>
        </Card.Footer>
      </>
    ),
  },
};

// Outlined Variant Stories
export const Outlined: Story = {
  args: {
    variant: 'outlined',
    padding: 'md',
    children: (
      <div>
        <h3 className="text-lg font-bold text-white">Outlined Card</h3>
        <p className="text-sm text-text-muted mt-2">
          Transparent background with border only
        </p>
      </div>
    ),
  },
};

export const OutlinedWithStructure: Story = {
  args: {
    variant: 'outlined',
    children: (
      <>
        <Card.Header>
          <Card.Title>Outline Style</Card.Title>
          <Card.Description>Minimal bordered design</Card.Description>
        </Card.Header>
        <Card.Content>
          <p className="text-white text-sm">Outlined cards work great for secondary content.</p>
        </Card.Content>
        <Card.Footer>
          <Button variant="secondary" size="sm">Secondary Action</Button>
        </Card.Footer>
      </>
    ),
  },
};

// Interactive Variant Stories
export const Interactive: Story = {
  args: {
    variant: 'interactive',
    padding: 'md',
    children: (
      <div>
        <h3 className="text-lg font-bold text-white">Interactive Card</h3>
        <p className="text-sm text-text-muted mt-2">
          Hover to see the interactive effect
        </p>
      </div>
    ),
  },
};

export const InteractiveWithStructure: Story = {
  args: {
    variant: 'interactive',
    children: (
      <>
        <Card.Header>
          <Card.Title>Clickable Card</Card.Title>
          <Card.Description>Interactive hover effects</Card.Description>
        </Card.Header>
        <Card.Content>
          <p className="text-white text-sm">This card has hover and click animations.</p>
        </Card.Content>
      </>
    ),
  },
};

// Animation Stories
export const WithAnimation: Story = {
  args: {
    variant: 'elevated',
    animate: true,
    children: (
      <div>
        <h3 className="text-lg font-bold text-white">Animated Card</h3>
        <p className="text-sm text-text-muted mt-2">
          This card fades in and slides up on load
        </p>
      </div>
    ),
  },
};

// Complex Layout Story
export const ComplexLayout: Story = {
  args: {
    variant: 'elevated',
    children: (
      <>
        <Card.Header>
          <Card.Title>User Profile Card</Card.Title>
          <Card.Description>Premium member</Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20"></div>
              <div>
                <p className="text-white font-semibold">John Doe</p>
                <p className="text-sm text-text-muted">john@example.com</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-border">
              <div className="text-center">
                <p className="text-white font-bold">1,234</p>
                <p className="text-xs text-text-muted">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold">567</p>
                <p className="text-xs text-text-muted">Following</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold">89</p>
                <p className="text-xs text-text-muted">Posts</p>
              </div>
            </div>
          </div>
        </Card.Content>
        <Card.Footer>
          <div className="flex gap-2 w-full">
            <Button variant="primary" size="sm" fullWidth>
              Follow
            </Button>
            <Button variant="secondary" size="sm" fullWidth>
              Message
            </Button>
          </div>
        </Card.Footer>
      </>
    ),
  },
};

// Comparison Story
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
      <Card variant="default" padding="md">
        <Card.Header>
          <Card.Title>Default</Card.Title>
        </Card.Header>
        <Card.Content>
          <p className="text-sm text-text-muted">Default styling</p>
        </Card.Content>
      </Card>

      <Card variant="elevated" padding="md">
        <Card.Header>
          <Card.Title>Elevated</Card.Title>
        </Card.Header>
        <Card.Content>
          <p className="text-sm text-text-muted">With shadow</p>
        </Card.Content>
      </Card>

      <Card variant="outlined" padding="md">
        <Card.Header>
          <Card.Title>Outlined</Card.Title>
        </Card.Header>
        <Card.Content>
          <p className="text-sm text-text-muted">Border only</p>
        </Card.Content>
      </Card>

      <Card variant="interactive" padding="md">
        <Card.Header>
          <Card.Title>Interactive</Card.Title>
        </Card.Header>
        <Card.Content>
          <p className="text-sm text-text-muted">Hover effects</p>
        </Card.Content>
      </Card>
    </div>
  ),
};

// Responsive Grid Story
export const GridLayout: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Card key={item} variant="elevated" animate>
          <Card.Header>
            <Card.Title>Card {item}</Card.Title>
          </Card.Header>
          <Card.Content>
            <p className="text-sm text-text-muted">
              This is card number {item} in a responsive grid
            </p>
          </Card.Content>
        </Card>
      ))}
    </div>
  ),
};

// Empty State Story
export const EmptyState: Story = {
  args: {
    variant: 'outlined',
    padding: 'lg',
    children: (
      <div className="text-center py-8">
        <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4"></div>
        <h3 className="text-lg font-bold text-white mb-2">Empty State</h3>
        <p className="text-sm text-text-muted mb-6">
          No data available at the moment
        </p>
        <Button variant="primary" size="sm">Create New</Button>
      </div>
    ),
  },
};
