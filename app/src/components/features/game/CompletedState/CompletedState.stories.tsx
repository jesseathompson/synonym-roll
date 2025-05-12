import type { Meta, StoryObj } from '@storybook/react';
import { CompletedState } from './CompletedState';
import { action } from '@storybook/addon-actions';

const meta = {
  title: 'Game/CompletedState',
  component: CompletedState,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'synonym-roll-light',
      values: [
        { name: 'synonym-roll-light', value: '#fefdf8' }, // bg-light
        { name: 'synonym-roll-dark', value: '#411f07' }, // bg-dark
      ],
    },
    docs: {
      description: {
        component: 'CompletedState component displays the completed game state, including the path from start to end word and game statistics.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    startWord: { control: 'text' },
    endWord: { control: 'text' },
    steps: { control: 'object' },
    elapsedTime: { control: 'number' },
    onShare: { action: 'shared' },
    stats: { control: 'object' },
  },
} satisfies Meta<typeof CompletedState>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic story with short path
export const ShortPath: Story = {
  args: {
    startWord: 'Happy',
    endWord: 'Glad',
    steps: ['Happy', 'Glad'],
    elapsedTime: 45,
    onShare: action('share button clicked'),
  },
};

// Medium path length
export const MediumPath: Story = {
  args: {
    startWord: 'Happy',
    endWord: 'Sad',
    steps: ['Happy', 'Joyful', 'Cheerful', 'Content', 'Sad'],
    elapsedTime: 120,
    onShare: action('share button clicked'),
  },
};

// Long path
export const LongPath: Story = {
  args: {
    startWord: 'Strong',
    endWord: 'Weak',
    steps: [
      'Strong', 'Powerful', 'Mighty', 'Forceful', 
      'Heavy', 'Solid', 'Firm', 'Soft', 'Delicate', 'Weak'
    ],
    elapsedTime: 240,
    onShare: action('share button clicked'),
  },
};

// Without share button
export const WithoutSharing: Story = {
  args: {
    startWord: 'Happy',
    endWord: 'Sad',
    steps: ['Happy', 'Joyful', 'Cheerful', 'Content', 'Sad'],
    elapsedTime: 120,
  },
};

// With full stats
export const WithDetailedStats: Story = {
  args: {
    startWord: 'Happy',
    endWord: 'Glad',
    steps: ['Happy', 'Joyful', 'Glad'],
    elapsedTime: 87,
    onShare: action('share button clicked'),
    stats: {
      winRate: 0.75,
      gamesPlayed: 12,
      streak: 3,
      maxStreak: 8,
    },
  },
};

// Different viewport sizes demonstration
export const Responsive: Story = {
  args: {
    startWord: 'Happy',
    endWord: 'Sad',
    steps: ['Happy', 'Joyful', 'Cheerful', 'Content', 'Sad'],
    elapsedTime: 180,
    onShare: action('share button clicked'),
    stats: {
      winRate: 0.8,
      gamesPlayed: 25,
      streak: 4,
      maxStreak: 10,
    },
  },
  parameters: {
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1440px',
            height: '900px',
          },
        },
      },
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story: 'This example demonstrates the responsive behavior of the CompletedState component at different viewport sizes.',
      },
    },
  },
};

// With GameBoard-like context
export const InGameContext: Story = {
  args: {
    startWord: 'Happy',
    endWord: 'Glad',
    steps: ['Happy', 'Joyful', 'Cheerful', 'Glad'],
    elapsedTime: 130,
    onShare: action('share button clicked'),
    stats: {
      winRate: 0.67,
      gamesPlayed: 15,
      streak: 2,
      maxStreak: 7,
    },
  },
  decorators: [
    (Story) => (
      <div style={{ 
        padding: '2rem',
        backgroundColor: '#fefdf8',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        maxWidth: '800px',
      }}>
        <div style={{
          marginBottom: '1rem',
          fontWeight: 'bold',
          color: '#411f07',
          textAlign: 'center',
        }}>
          Daily Puzzle #123
        </div>
        <Story />
      </div>
    ),
  ],
};
