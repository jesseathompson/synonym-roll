import type { Meta, StoryObj } from '@storybook/react'
import { GamePath } from './GamePath'

const meta: Meta<typeof GamePath> = {
	title: 'Features/Game/GamePath',
	component: GamePath,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
	argTypes: {
		startWord: {
			control: 'text',
			description: 'The starting word of the game',
		},
		endWord: {
			control: 'text',
			description: 'The target word to reach',
		},
		steps: {
			control: 'object',
			description: 'Array of steps taken so far',
		},
		minSteps: {
			control: 'number',
			description: 'Minimum number of steps needed',
		},
	},
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		startWord: 'CAT',
		endWord: 'DOG',
		steps: [],
		minSteps: 3,
	},
}

export const WithSteps: Story = {
	args: {
		startWord: 'CAT',
		endWord: 'DOG',
		steps: ['FELINE'],
		minSteps: 3,
	},
}

export const MoreSteps: Story = {
	args: {
		startWord: 'CAT',
		endWord: 'DOG',
		steps: ['FELINE', 'ANIMAL'],
		minSteps: 3,
	},
}

export const LongPath: Story = {
	args: {
		startWord: 'HAPPY',
		endWord: 'SAD',
		steps: ['JOYFUL', 'CHEERFUL', 'GLAD', 'MERRY'],
		minSteps: 5,
	},
}

export const ShortWords: Story = {
	args: {
		startWord: 'A',
		endWord: 'B',
		steps: ['ONE'],
		minSteps: 2,
	},
}

export const LongWords: Story = {
	args: {
		startWord: 'EXTRAORDINARY',
		endWord: 'PHENOMENAL',
		steps: ['REMARKABLE', 'OUTSTANDING'],
		minSteps: 4,
	},
}
