import type { Meta, StoryObj } from '@storybook/react'
import { WordTile } from './WordTile'

const meta: Meta<typeof WordTile> = {
	title: 'Common/WordTile',
	component: WordTile,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		word: {
			control: 'text',
			description: 'The word to display in the tile',
		},
		variant: {
			control: 'select',
			options: ['start', 'step', 'end', 'neutral', 'selected', 'correct', 'incorrect'],
			description: 'The visual variant of the tile',
		},
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
			description: 'The size of the tile',
		},
		disabled: {
			control: 'boolean',
			description: 'Whether the tile is disabled',
		},
		onClick: {
			action: 'clicked',
			description: 'Function called when tile is clicked',
		},
	},
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		word: 'WORD',
		variant: 'neutral',
		size: 'md',
		disabled: false,
	},
}

export const Start: Story = {
	args: {
		word: 'START',
		variant: 'start',
		size: 'lg',
	},
}

export const Step: Story = {
	args: {
		word: 'STEP',
		variant: 'step',
		size: 'md',
	},
}

export const End: Story = {
	args: {
		word: 'END',
		variant: 'end',
		size: 'lg',
	},
}

export const Selected: Story = {
	args: {
		word: 'SELECTED',
		variant: 'selected',
		size: 'md',
	},
}

export const Correct: Story = {
	args: {
		word: 'CORRECT',
		variant: 'correct',
		size: 'md',
	},
}

export const Incorrect: Story = {
	args: {
		word: 'WRONG',
		variant: 'incorrect',
		size: 'md',
	},
}

export const Disabled: Story = {
	args: {
		word: 'DISABLED',
		variant: 'neutral',
		size: 'md',
		disabled: true,
	},
}

export const Sizes: Story = {
	render: () => (
		<div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
			<WordTile word="SM" variant="neutral" size="sm" />
			<WordTile word="MD" variant="neutral" size="md" />
			<WordTile word="LG" variant="neutral" size="lg" />
		</div>
	),
}

export const AllVariants: Story = {
	render: () => (
		<div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
			<WordTile word="START" variant="start" size="md" />
			<WordTile word="STEP" variant="step" size="md" />
			<WordTile word="END" variant="end" size="md" />
			<WordTile word="NEUTRAL" variant="neutral" size="md" />
			<WordTile word="SELECTED" variant="selected" size="md" />
			<WordTile word="CORRECT" variant="correct" size="md" />
			<WordTile word="WRONG" variant="incorrect" size="md" />
		</div>
	),
}

export const LongWords: Story = {
	render: () => (
		<div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
			<WordTile word="EXTRAORDINARY" variant="start" size="lg" />
			<WordTile word="PHENOMENAL" variant="step" size="md" />
			<WordTile word="MAGNIFICENT" variant="end" size="lg" />
			<WordTile word="TREMENDOUS" variant="neutral" size="md" />
			<WordTile word="OUTSTANDING" variant="selected" size="md" />
		</div>
	),
}

export const WordLengths: Story = {
	render: () => (
		<div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
			<WordTile word="A" variant="neutral" size="md" />
			<WordTile word="CAT" variant="neutral" size="md" />
			<WordTile word="WORD" variant="neutral" size="md" />
			<WordTile word="LONGER" variant="neutral" size="md" />
			<WordTile word="EXTRAORDINARY" variant="neutral" size="md" />
			<WordTile word="PHENOMENAL" variant="neutral" size="md" />
		</div>
	),
}
