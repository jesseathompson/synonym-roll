import type { Meta, StoryObj } from '@storybook/react';
import { WordTile } from './WordTile';
import { expect, userEvent, within } from '@storybook/test';
import React, { useState } from 'react';

const meta = {
  title: 'Common/WordTile',
  component: WordTile,
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
        component: 'WordTile component displays words with different visual styling based on their status in the Synonym Roll game.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    word: { control: 'text' },
    variant: {
      control: { type: 'select' },
      options: ['start', 'step', 'end', 'neutral'],
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof WordTile>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base story variations
export const Start: Story = {
  args: {
    word: 'Happy',
    variant: 'start',
  },
};

export const Step: Story = {
  args: {
    word: 'Joyful',
    variant: 'step',
  },
};

export const End: Story = {
  args: {
    word: 'Glad',
    variant: 'end',
  },
};

export const Neutral: Story = {
  args: {
    word: 'Cheerful',
    variant: 'neutral',
  },
};

// Interactive story with click handler
export const Interactive: Story = {
  args: {
    word: 'Cheerful',
    variant: 'neutral',
    onClick: () => {},
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const wordTile = canvas.getByText('Cheerful');
    
    // Click the word tile
    await userEvent.click(wordTile);
    
    // Verify click handler was called
    await expect(args.onClick).toHaveBeenCalled();
    
    // Test keyboard interaction
    await userEvent.tab();
    await expect(wordTile).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

// Responsive behavior demonstration
export const ResponsiveExample: Story = {
  args: {
    word: 'Joyful', 
    variant: 'step',
  },
  parameters: {
    viewport: {
      defaultViewport: 'responsive',
      viewports: {
        small: {
          name: 'Small Screen',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        medium: {
          name: 'Medium Screen',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        large: {
          name: 'Large Screen',
          styles: {
            width: '1440px',
            height: '900px',
          },
        },
      },
    },
    docs: {
      description: {
        story: 'This example demonstrates the responsive behavior of the WordTile component at different viewport sizes.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <WordTile word="Happy" variant="start" />
        </div>
        <div>
          <WordTile word="Joyful" variant="step" />
        </div>
        <div>
          <WordTile word="Content" variant="step" />
        </div>
        <div>
          <WordTile word="Glad" variant="end" />
        </div>
      </div>
    ),
  ],
};

// Showcase a sample game path
export const GamePathExample: Story = {
  args: {
    word: 'Happy',
    variant: 'start',
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', maxWidth: '600px' }}>
        <h3 style={{ fontFamily: 'var(--word-tile-font-family, "Outfit", sans-serif)', color: '#411f07' }}>Synonym Roll Game Path</h3>
        <div style={{ marginBottom: '1rem' }}>
          <WordTile word="Happy" variant="start" />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' }}>
          <WordTile word="Joyful" variant="step" />
          <WordTile word="Cheerful" variant="step" onClick={() => {}} />
          <WordTile word="Merry" variant="step" onClick={() => {}} />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <WordTile word="Glad" variant="end" />
        </div>
      </div>
    ),
  ],
};

// Interactive game demo
const InteractiveGameDemo = () => {
  const [steps, setSteps] = useState<string[]>(['Happy']);
  const [currentSynonyms, setCurrentSynonyms] = useState(['Joyful', 'Cheerful', 'Merry', 'Pleased']);
  const endWord = 'Glad';
  
  const handleAddStep = (word: string) => {
    setSteps([...steps, word]);
    
    // Simulate new synonyms based on selected word
    if (word === 'Joyful') {
      setCurrentSynonyms(['Merry', 'Glad', 'Delighted']);
    } else if (word === 'Cheerful') {
      setCurrentSynonyms(['Content', 'Glad', 'Bright']);
    } else if (word === 'Merry') {
      setCurrentSynonyms(['Jolly', 'Glad', 'Festive']);
    } else if (word === 'Pleased') {
      setCurrentSynonyms(['Satisfied', 'Glad', 'Content']);
    } else {
      setCurrentSynonyms(['Game', 'Complete!']);
    }
  };
  
  const handleReset = () => {
    setSteps(['Happy']);
    setCurrentSynonyms(['Joyful', 'Cheerful', 'Merry', 'Pleased']);
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', maxWidth: '800px' }}>
      <h3 style={{ fontFamily: 'var(--word-tile-font-family, "Outfit", sans-serif)', color: '#411f07' }}>
        Synonym Roll Interactive Demo
      </h3>
      
      {/* Path container */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {steps.map((word, index) => {
          const isFirst = index === 0;
          const isLast = index === steps.length - 1;
          const variant = isFirst ? 'start' : isLast && word === endWord ? 'end' : 'step';
          
          return (
            <React.Fragment key={`${word}-${index}`}>
              <WordTile word={word} variant={variant} />
              {!isLast && <span style={{ color: '#411f07' }}>→</span>}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Current synonyms to choose from */}
      {steps[steps.length - 1] !== endWord ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
          {currentSynonyms.map((word) => (
            <WordTile 
              key={word} 
              word={word} 
              variant="neutral"
              onClick={() => handleAddStep(word)} 
            />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <h4 style={{ fontFamily: 'var(--word-tile-font-family, "Outfit", sans-serif)', color: '#411f07' }}>
            You completed the puzzle in {steps.length - 1} steps!
          </h4>
          <button 
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#fefdf8', 
              color: '#411f07',
              border: '1px solid #411f07',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'var(--word-tile-font-family, "Outfit", sans-serif)',
            }}
            onClick={handleReset}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export const InteractiveGame: Story = {
  args: {
    word: 'Happy',
    variant: 'start',
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'This interactive demo shows how WordTile components work together in a game flow.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
        <InteractiveGameDemo />
      </div>
    ),
  ],
};
