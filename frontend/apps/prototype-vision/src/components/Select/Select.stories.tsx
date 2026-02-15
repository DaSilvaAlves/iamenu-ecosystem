import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';
import { Users, Globe, Settings } from 'lucide-react';

const meta: Meta<typeof Select> = {
  component: Select,
  title: 'Components/Select',
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'multiple'],
      description: 'Select mode',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Select size',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
    searchable: {
      control: 'boolean',
      description: 'Show search input',
    },
    clearable: {
      control: 'boolean',
      description: 'Show clear button',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const fruitOptions = [
  { value: 'apple', label: 'Apple', description: 'Red and crispy' },
  { value: 'banana', label: 'Banana', description: 'Yellow and sweet' },
  { value: 'cherry', label: 'Cherry', description: 'Small and juicy' },
  { value: 'date', label: 'Date', description: 'Brown and chewy' },
  { value: 'elderberry', label: 'Elderberry', description: 'Dark and tart' },
];

const countryOptions = [
  { value: 'us', label: 'United States', icon: <Globe size={16} /> },
  { value: 'uk', label: 'United Kingdom', icon: <Globe size={16} /> },
  { value: 'ca', label: 'Canada', icon: <Globe size={16} /> },
  { value: 'au', label: 'Australia', icon: <Globe size={16} /> },
  { value: 'de', label: 'Germany', icon: <Globe size={16} /> },
];

/**
 * Basic Single Select Stories
 */
export const SingleSelect: Story = {
  args: {
    options: fruitOptions,
    placeholder: 'Select a fruit...',
  },
};

export const WithLabel: Story = {
  args: {
    options: fruitOptions,
    label: 'Favorite Fruit',
    placeholder: 'Choose your favorite...',
  },
};

export const WithHelperText: Story = {
  args: {
    options: fruitOptions,
    label: 'Fruit Selection',
    helperText: 'Choose your favorite fruit from the list',
  },
};

export const WithValue: Story = {
  args: {
    options: fruitOptions,
    label: 'Selected Fruit',
    value: 'apple',
  },
};

/**
 * Multiple Select Stories
 */
export const MultipleSelect: Story = {
  args: {
    options: fruitOptions,
    mode: 'multiple',
    placeholder: 'Select multiple fruits...',
  },
};

export const MultipleWithLabel: Story = {
  args: {
    options: fruitOptions,
    mode: 'multiple',
    label: 'Fruits',
    placeholder: 'Select multiple...',
  },
};

export const MultipleWithValues: Story = {
  args: {
    options: fruitOptions,
    mode: 'multiple',
    label: 'Fruits',
    value: ['apple', 'banana'],
  },
};

export const MultipleWithMax: Story = {
  args: {
    options: fruitOptions,
    mode: 'multiple',
    label: 'Select up to 3 fruits',
    maxSelected: 3,
  },
};

/**
 * Size Stories
 */
export const SmallSize: Story = {
  args: {
    options: fruitOptions,
    size: 'sm',
    label: 'Small Select',
  },
};

export const MediumSize: Story = {
  args: {
    options: fruitOptions,
    size: 'md',
    label: 'Medium Select',
  },
};

export const LargeSize: Story = {
  args: {
    options: fruitOptions,
    size: 'lg',
    label: 'Large Select',
  },
};

/**
 * Feature Stories
 */
export const Searchable: Story = {
  args: {
    options: fruitOptions,
    label: 'Searchable Select',
    searchable: true,
    placeholder: 'Type to search...',
  },
};

export const Clearable: Story = {
  args: {
    options: fruitOptions,
    label: 'Clearable Select',
    value: 'apple',
    clearable: true,
  },
};

export const Disabled: Story = {
  args: {
    options: fruitOptions,
    label: 'Disabled Select',
    disabled: true,
    value: 'apple',
  },
};

export const Loading: Story = {
  args: {
    options: fruitOptions,
    label: 'Loading Select',
    loading: true,
  },
};

export const WithError: Story = {
  args: {
    options: fruitOptions,
    label: 'Fruit Selection',
    error: 'Please select a valid fruit',
  },
};

export const Required: Story = {
  args: {
    options: fruitOptions,
    label: 'Required Field',
    required: true,
  },
};

/**
 * With Icons Stories
 */
export const WithIcons: Story = {
  args: {
    options: countryOptions,
    label: 'Select Country',
    placeholder: 'Choose a country...',
  },
};

export const CustomNoResults: Story = {
  args: {
    options: fruitOptions,
    label: 'Fruits',
    searchable: true,
    noResultsMessage: 'No matching fruits found 🍎',
  },
};

/**
 * Full Width Stories
 */
export const FullWidth: Story = {
  args: {
    options: fruitOptions,
    label: 'Full Width Select',
    fullWidth: true,
  },
};

/**
 * With Descriptions Stories
 */
export const WithDescriptions: Story = {
  args: {
    options: fruitOptions,
    label: 'Select with Descriptions',
    placeholder: 'Choose an option...',
  },
};

/**
 * Form-like Examples
 */
export const ProfileForm: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-6 max-w-sm">
      <Select
        options={countryOptions}
        label="Country"
        placeholder="Select your country..."
        required
      />
      <Select
        options={[
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
          { value: 'other', label: 'Other' },
        ]}
        label="Gender"
        placeholder="Select gender..."
      />
      <Select
        options={[
          { value: 'developer', label: 'Developer' },
          { value: 'designer', label: 'Designer' },
          { value: 'manager', label: 'Manager' },
          { value: 'other', label: 'Other' },
        ]}
        label="Occupation"
        placeholder="Select occupation..."
      />
    </div>
  ),
};

/**
 * Skills Selection
 */
export const SkillsSelection: Story = {
  render: () => (
    <Select
      options={[
        {
          value: 'react',
          label: 'React',
          icon: <Settings size={16} />,
          description: 'JavaScript framework',
        },
        {
          value: 'vue',
          label: 'Vue',
          icon: <Settings size={16} />,
          description: 'JavaScript framework',
        },
        {
          value: 'angular',
          label: 'Angular',
          icon: <Settings size={16} />,
          description: 'TypeScript framework',
        },
        {
          value: 'svelte',
          label: 'Svelte',
          icon: <Settings size={16} />,
          description: 'Compiler framework',
        },
      ]}
      mode="multiple"
      label="Select Your Skills"
      placeholder="Choose skills..."
      helperText="Select all that apply"
      searchable
    />
  ),
};

/**
 * Team Members Selection
 */
export const TeamMembersSelection: Story = {
  render: () => (
    <Select
      options={[
        { value: 'alice', label: 'Alice Johnson', icon: <Users size={16} /> },
        { value: 'bob', label: 'Bob Smith', icon: <Users size={16} /> },
        { value: 'carol', label: 'Carol Davis', icon: <Users size={16} /> },
        { value: 'david', label: 'David Wilson', icon: <Users size={16} /> },
        { value: 'emma', label: 'Emma Brown', icon: <Users size={16} /> },
      ]}
      mode="multiple"
      label="Assign Team Members"
      placeholder="Select members..."
      helperText="Select team members to assign to this task"
      searchable
      maxSelected={5}
    />
  ),
};

/**
 * All States Showcase
 */
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-6">
      <Select options={fruitOptions} label="Default" />
      <Select
        options={fruitOptions}
        label="With Value"
        value="apple"
      />
      <Select
        options={fruitOptions}
        label="Disabled"
        disabled
        value="banana"
      />
      <Select
        options={fruitOptions}
        label="Loading"
        loading
      />
      <Select
        options={fruitOptions}
        label="With Error"
        error="This field is required"
      />
      <Select
        options={fruitOptions}
        label="Clearable"
        value="cherry"
        clearable
      />
    </div>
  ),
};

/**
 * Size Comparison
 */
export const SizeComparison: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-6">
      <Select options={fruitOptions} size="sm" label="Small" />
      <Select options={fruitOptions} size="md" label="Medium" />
      <Select options={fruitOptions} size="lg" label="Large" />
    </div>
  ),
};

/**
 * Mode Comparison
 */
export const ModeComparison: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <Select
        options={fruitOptions}
        mode="single"
        label="Single Select"
        placeholder="Choose one..."
      />
      <Select
        options={fruitOptions}
        mode="multiple"
        label="Multiple Select"
        placeholder="Choose many..."
      />
    </div>
  ),
};
