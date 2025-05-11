import type { Meta, StoryObj } from '@storybook/react';
import { SynonymList } from './SynonymList';
import { expect, userEvent, within } from '@storybook/test';

const meta = {
  title: 'Game/SynonymList',
  component: SynonymList,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'synonym-roll-light',
      values: [
        { name: 'synonym-roll-light', value: '#fefdf8' }, // bg-light
        { name: 'synonym-roll-dark', value: '#411f07' }, // bg-dark
      ],
    },
    docs: {
      description: {
        component: 'SynonymList component displays a grid of synonym words that users can select during gameplay.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    synonyms: { control: 'array' },
    onSelect: { action: 'selected' },
    isLoading: { control: 'boolean' },
  },
} satisfies Meta<typeof SynonymList>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample synonym lists for different scenarios
const fewSynonyms = ['happy', 'joyful', 'cheerful', 'merry', 'glad'];
const manySynonyms = [
  'happy', 'joyful', 'cheerful', 'merry', 'glad', 'delighted', 'pleased', 
  'content', 'thrilled', 'ecstatic', 'blissful', 'upbeat', 'elated', 
  'jubilant', 'gleeful', 'sunny', 'chipper', 'jolly'
];

// Base story - Few synonyms
export const FewSynonyms: Story = {
  args: {
    synonyms: fewSynonyms,
    onSelect: (word) => console.log(`Selected: ${word}`),
    isLoading: false,
  },
  decorators: [
    (Story) => (
      <div style={{ 
        padding: '1.5rem', 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: '#fefdf8',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}>
        <Story />
      </div>
    ),
  ],
};

// Story with many synonyms
export const ManySynonyms: Story = {
  args: {
    synonyms: manySynonyms,
    onSelect: (word) => console.log(`Selected: ${word}`),
    isLoading: false,
  },
  decorators: [
    (Story) => (
      <div style={{ 
        padding: '1.5rem', 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: '#fefdf8',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}>
        <Story />
      </div>
    ),
  ],
};

// Interactive story
export const Interactive: Story = {
  args: {
    synonyms: fewSynonyms,
    onSelect: (word) => {},
    isLoading: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Wait for component to render
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Find and click on the second synonym
    const secondSynonym = canvas.getByText('joyful'); // 'joyful' should be the second after sorting
    await userEvent.click(secondSynonym);
    
    // Verify the selection handler was called
    await expect(args.onSelect).toHaveBeenCalledWith('joyful');
  },
};

// Empty state story
export const EmptyState: Story = {
  args: {
    synonyms: [],
    onSelect: (word) => console.log(`Selected: ${word}`),
    isLoading: false,
  },
};

// Loading state story
export const Loading: Story = {
  args: {
    synonyms: fewSynonyms,
    onSelect: (word) => console.log(`Selected: ${word}`),
    isLoading: true,
  },
};

// Responsive behavior demonstration
export const ResponsiveExample: Story = {
  args: {
    synonyms: manySynonyms,
    onSelect: (word) => console.log(`Selected: ${word}`),
    isLoading: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'responsive',
      viewports: {
        small: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        medium: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        large: {
          name: 'Desktop',
          styles: {
            width: '1440px',
            height: '900px',
          },
        },
      },
    },
    docs: {
      description: {
        story: 'This example demonstrates the responsive behavior of the SynonymList component at different viewport sizes.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ 
        padding: '1.5rem', 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: '#fefdf8',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}>
        <Story />
      </div>
    ),
  ],
};

// Game-like context story
export const GameContext: Story = {
  args: {
    synonyms: ['joyful', 'cheerful', 'merry', 'pleased', 'delighted', 'content'],
    onSelect: (word) => console.log(`Selected: ${word}`),
    isLoading: false,
  },
  decorators: [
    (Story) => (
      <div style={{ 
        padding: '1.5rem', 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: '#fefdf8',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '1.5rem',
        }}>
          <h4 style={{
            fontFamily: 'var(--font-game, "Outfit", sans-serif)',
            color: '#411f07',
            marginBottom: '0.5rem'
          }}>
            Time Elapsed: 0:42
          </h4>
          
          <div style={{
            fontFamily: 'var(--font-game, "Outfit", sans-serif)',
            color: '#411f07',
            marginBottom: '1rem'
          }}>
            Starting Word:
          </div>
          
          <div style={{
            fontWeight: '600',
            textTransform: 'uppercase',
            textShadow: '2px 2px 6px #c19a6b',
            fontSize: 'larger',
            color: '#411f07',
            marginBottom: '1rem'
          }}>
            HAPPY
          </div>
          
          <div style={{
            marginBottom: '1rem', 
            textShadow: '1px 1px 3px #c19a6b',
            color: '#411f07',
          }}>
            3 steps to Ending Word:
          </div>
          
          <div style={{
            fontWeight: '600',
            textTransform: 'uppercase',
            textShadow: '2px 2px 6px #c19a6b',
            fontSize: 'larger',
            color: '#411f07',
            marginBottom: '1.5rem'
          }}>
            GLAD
          </div>
        </div>
        
        <div style={{ marginBottom: '0.5rem', color: '#411f07' }}>
          Choose a synonym:
        </div>
        
        <Story />
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '1.5rem',
        }}>
          <button style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#fefdf8',
            border: '1px solid #411f07',
            color: '#411f07',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            fontWeight: '600',
            fontFamily: 'var(--font-game, "Outfit", sans-serif)',
          }}>
            Go Back
          </button>
        </div>
      </div>
    ),
  ],
};
