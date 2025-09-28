import type { Meta, StoryObj } from '@storybook/react';
import SocialPreview from './SocialPreview';

const meta: Meta<typeof SocialPreview> = {
  title: 'Components/SocialPreview',
  component: SocialPreview,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Social media preview component for sharing game results. Uses the app\'s design system and styling.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS class name',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SocialPreview>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default social media preview with game branding and stats.',
      },
    },
  },
};

export const SocialMediaSize: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Social media preview optimized for 1200x630 dimensions (Open Graph/Twitter).',
      },
    },
    viewport: {
      defaultViewport: 'social',
    },
  },
};

export const WithCustomStyling: Story = {
  args: {
    className: 'custom-social-preview',
  },
  parameters: {
    docs: {
      description: {
        story: 'Social media preview with custom styling applied.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '1200px', height: '630px', margin: '0 auto' }}>
        <style>{`
          .custom-social-preview {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          }
        `}</style>
        <Story />
      </div>
    ),
  ],
};
