import type { Meta, StoryObj } from '@storybook/react';
import { GameTimer } from './GameTimer';
import React, { useState, useEffect, useRef } from 'react';

const meta = {
  title: 'Game/GameTimer',
  component: GameTimer,
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
        component: 'GameTimer component displays formatted time during gameplay.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    time: { control: 'number' },
    label: { control: 'text' },
    className: { control: 'text' },
  },
} satisfies Meta<typeof GameTimer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Static time examples
export const ZeroTime: Story = {
  args: {
    time: 0,
    label: 'Time Elapsed',
  },
};

export const OneMinute: Story = {
  args: {
    time: 60,
    label: 'Time Elapsed',
  },
};

export const FourMinutesThirtySeconds: Story = {
  args: {
    time: 270,
    label: 'Time Elapsed',
  },
};

// Different label example
export const CustomLabel: Story = {
  args: {
    time: 125,
    label: 'Game Duration',
  },
};

// Custom styling example
export const CustomStyling: Story = {
  args: {
    time: 45,
    label: 'Time',
    className: 'custom-timer',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
        <style>{`
          .custom-timer {
            color: #8287e0 !important;
            font-weight: bold;
            background-color: rgba(92, 98, 214, 0.1);
            padding: 0.5rem 1rem;
            border-radius: 4px;
          }
        `}</style>
        <Story />
      </div>
    ),
  ],
};

// Interactive timer example with local state management
export const InteractiveTimer: Story = {
  args: {
    time: 30,
    label: 'Interactive Timer',
  },
  decorators: [
    (Story) => {
      const [time, setTime] = useState(30);
      const [isRunning, setIsRunning] = useState(false);
      const intervalRef = useRef<number | null>(null);
      
      // Use a local state approach with useRef for timer management
      // This is a more robust approach than using the useTimer hook in Storybook
      const startTimer = () => {
        if (!isRunning) {
          setIsRunning(true);
          intervalRef.current = window.setInterval(() => {
            setTime(prev => prev + 1);
          }, 1000);
        }
      };
      
      const stopTimer = () => {
        if (intervalRef.current !== null) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsRunning(false);
      };
      
      const resetTimer = () => {
        stopTimer();
        setTime(30);
      };
      
      // Clean up on unmount to prevent memory leaks
      useEffect(() => {
        return () => {
          if (intervalRef.current !== null) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        };
      }, []);
      
      return (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: '1rem'
        }}>
          <GameTimer time={time} label="Interactive Timer" />
          
          <div style={{ 
            display: 'flex',
            gap: '0.5rem'
          }}>
            <button
              onClick={startTimer}
              disabled={isRunning}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                background: isRunning ? '#cccccc' : '#5c62d6',
                color: 'white',
                border: 'none',
                cursor: isRunning ? 'default' : 'pointer'
              }}
            >
              Start
            </button>
            
            <button
              onClick={stopTimer}
              disabled={!isRunning}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                background: !isRunning ? '#cccccc' : '#ff6b6b',
                color: 'white',
                border: 'none',
                cursor: !isRunning ? 'default' : 'pointer'
              }}
            >
              Stop
            </button>
            
            <button
              onClick={resetTimer}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                background: '#f8f9fa',
                color: '#333',
                border: '1px solid #ddd',
                cursor: 'pointer'
              }}
            >
              Reset
            </button>
          </div>
        </div>
      );
    },
  ],
};

// GameContext story showing the timer in a game-like interface
export const GameContext: Story = {
  args: {
    time: 42,
    label: 'Time Elapsed',
  },
  decorators: [
    (Story) => (
      <div style={{ 
        padding: '1.5rem', 
        maxWidth: '800px', 
        backgroundColor: '#fefdf8',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <Story />
          
          <div style={{
            fontFamily: 'var(--font-game, "Outfit", sans-serif)',
            color: '#411f07',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            Starting Word:
            <div style={{
              fontWeight: '600',
              textTransform: 'uppercase',
              textShadow: '2px 2px 6px #c19a6b',
              fontSize: '1.5rem',
              color: '#411f07',
              marginTop: '0.5rem'
            }}>
              HAPPY
            </div>
          </div>
          
          <div style={{ 
            marginTop: '1rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            justifyContent: 'center'
          }}>
            {['Joyful', 'Cheerful', 'Merry', 'Pleased', 'Delighted'].map(word => (
              <div key={word} style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#fefdf8',
                color: '#411f07',
                border: '1px solid #411f07',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                fontWeight: '600',
                fontFamily: 'var(--font-game, "Outfit", sans-serif)',
              }}>
                {word}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  ],
};
