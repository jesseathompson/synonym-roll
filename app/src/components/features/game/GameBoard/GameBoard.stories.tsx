import type { Meta, StoryObj } from '@storybook/react';
import { GameBoard } from './GameBoard';
import React from 'react';

const meta = {
  title: 'Game/GameBoard',
  component: GameBoard,
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
        component: 'GameBoard component that serves as the main container for game-related UI elements.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    isCompleted: { control: 'boolean' },
    className: { control: 'text' },
    children: { control: false },
  },
} satisfies Meta<typeof GameBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic example with a simple content
export const Default: Story = {
  args: {
    title: 'Daily Puzzle #123',
    children: (
      <div style={{ padding: '2rem' }}>
        <h4>Game Content Goes Here</h4>
        <p>This is where your game components would be rendered.</p>
      </div>
    ),
  },
};

// Example with no title
export const NoTitle: Story = {
  args: {
    children: (
      <div style={{ padding: '2rem' }}>
        <h4>Game Without Title</h4>
        <p>This game board doesn't display a title.</p>
      </div>
    ),
  },
};

// Example showing completed state
export const Completed: Story = {
  args: {
    title: 'Daily Puzzle #123',
    isCompleted: true,
    children: (
      <div style={{ padding: '2rem' }}>
        <h4>Game Completed!</h4>
        <p>This shows the completed state of the game board.</p>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '1rem'
        }}>
          <div style={{
            padding: '0.5rem 2rem',
            backgroundColor: '#5c62d6',
            color: 'white',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500'
          }}>
            Share Results
          </div>
        </div>
      </div>
    ),
  },
};

// Example with nested components
export const WithNestedComponents: Story = {
  args: {
    title: 'Daily Puzzle #123',
    children: (
      <div style={{ width: '100%' }}>
        <div style={{ 
          marginBottom: '1rem',
          fontWeight: 'bold',
          color: '#411f07'
        }}>
          Starting Word: <span style={{ color: '#5c62d6' }}>HAPPY</span>
        </div>
        
        <div style={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          justifyContent: 'center',
          marginBottom: '2rem'
        }}>
          {['Joyful', 'Cheerful', 'Merry', 'Pleased', 'Delighted'].map((word) => (
            <div key={word} style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#fefdf8',
              color: '#411f07',
              border: '1px solid #411f07',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              {word}
            </div>
          ))}
        </div>
        
        <div style={{ 
          marginTop: '1rem',
          fontWeight: 'bold',
          color: '#411f07'
        }}>
          Target Word: <span style={{ color: '#5c62d6' }}>GLAD</span>
        </div>
      </div>
    ),
  },
};

// Example showing responsive behavior
export const Responsive: Story = {
  args: {
    title: 'Daily Puzzle #123',
    children: (
      <div style={{ width: '100%', padding: '1rem' }}>
        <div style={{ 
          fontWeight: 'bold',
          color: '#411f07',
          marginBottom: '1.5rem'
        }}>
          This component is responsive and adapts to different screen sizes
        </div>
        
        <div style={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          justifyContent: 'center'
        }}>
          {['One', 'Two', 'Three', 'Four', 'Five', 'Six'].map((item) => (
            <div key={item} style={{
              padding: '1rem',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '4px',
              minWidth: '80px',
              textAlign: 'center'
            }}>
              Item {item}
            </div>
          ))}
        </div>
      </div>
    ),
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
        story: 'This example demonstrates the responsive behavior of the GameBoard component at different viewport sizes.',
      },
    },
  },
};
