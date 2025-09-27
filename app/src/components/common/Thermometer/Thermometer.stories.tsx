import type { Meta, StoryObj } from '@storybook/react';
import { Thermometer } from './Thermometer';

const meta: Meta<typeof Thermometer> = {
  title: 'Common/Thermometer',
  component: Thermometer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A horizontal thermometer component with an arrow indicator that shows temperature from cold (0) to hot (1). The arrow points down between the Cold and Hot labels to indicate the current temperature level.',
      },
    },
  },
  argTypes: {
    temperature: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Temperature value between 0 (cold) and 1 (hot)',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the thermometer',
    },
    showLabels: {
      control: { type: 'boolean' },
      description: 'Whether to show temperature labels',
    },
  },
} satisfies Meta<typeof Thermometer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic thermometer
export const Default: Story = {
  args: {
    temperature: 0.5,
    size: 'md',
    showLabels: true,
  },
};

// Cold temperature
export const Cold: Story = {
  args: {
    temperature: 0.05,
    size: 'md',
    showLabels: true,
  },
};

// Cool temperature
export const Cool: Story = {
  args: {
    temperature: 0.25,
    size: 'md',
    showLabels: true,
  },
};

// Warm temperature
export const Warm: Story = {
  args: {
    temperature: 0.6,
    size: 'md',
    showLabels: true,
  },
};

// Hot temperature
export const Hot: Story = {
  args: {
    temperature: 0.9,
    size: 'md',
    showLabels: true,
  },
};

// Size variants
export const Small: Story = {
  args: {
    temperature: 0.7,
    size: 'sm',
    showLabels: true,
  },
};

export const Large: Story = {
  args: {
    temperature: 0.7,
    size: 'lg',
    showLabels: true,
  },
};

// Without labels
export const NoLabels: Story = {
  args: {
    temperature: 0.5,
    size: 'md',
    showLabels: false,
  },
};

// Interactive temperature range
export const Interactive: Story = {
  args: {
    temperature: 0.5,
    size: 'md',
    showLabels: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the temperature slider to see how the thermometer changes with different values.',
      },
    },
  },
};

// Temperature progression
export const TemperatureProgression: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <div>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Cold (0.05)</h4>
        <Thermometer temperature={0.05} size="md" showLabels={true} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Cool (0.25)</h4>
        <Thermometer temperature={0.25} size="md" showLabels={true} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Warm (0.6)</h4>
        <Thermometer temperature={0.6} size="md" showLabels={true} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Hot (0.9)</h4>
        <Thermometer temperature={0.9} size="md" showLabels={true} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows the thermometer at different temperature levels to demonstrate the visual progression.',
      },
    },
  },
};

// Responsive behavior
export const Responsive: Story = {
  args: {
    temperature: 0.7,
    size: 'lg',
    showLabels: true,
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
            width: '1024px',
            height: '768px',
          },
        },
      },
    },
    docs: {
      description: {
        story: 'This example demonstrates the responsive behavior of the thermometer at different viewport sizes.',
      },
    },
  },
};
