import type { Meta, StoryObj } from '@storybook/react'
import { SynonymList } from './SynonymList'

const meta: Meta<typeof SynonymList> = {
	title: 'Features/Game/SynonymList',
	component: SynonymList,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
	argTypes: {
		synonyms: {
			control: 'object',
			description: 'Array of synonym words to display',
		},
		onSelect: {
			action: 'synonym-selected',
			description: 'Function called when a synonym is selected',
		},
		isLoading: {
			control: 'boolean',
			description: 'Whether the component is in loading state',
		},
		selectedWord: {
			control: 'text',
			description: 'Currently selected word',
		},
		disabled: {
			control: 'boolean',
			description: 'Whether the component is disabled',
		},
	},
}

export default meta
type Story = StoryObj<typeof meta>

const sampleSynonyms = [
	'word', 'term', 'phrase', 'expression', 'vocabulary',
	'language', 'speech', 'communication', 'dialect', 'tongue'
]

const manySynonyms = [
	'word', 'term', 'phrase', 'expression', 'vocabulary', 'language', 'speech',
	'communication', 'dialect', 'tongue', 'jargon', 'slang', 'vernacular',
	'terminology', 'lexicon', 'dictionary', 'thesaurus', 'glossary'
]

const longWordSynonyms = [
	'extraordinary', 'phenomenal', 'magnificent', 'tremendous', 'outstanding',
	'remarkable', 'exceptional', 'incredible', 'fantastic', 'wonderful',
	'brilliant', 'spectacular', 'marvelous', 'amazing', 'fabulous'
]

export const Default: Story = {
	args: {
		synonyms: sampleSynonyms,
		onSelect: (word: string) => console.log('Selected:', word),
	},
}

export const WithSelectedWord: Story = {
	args: {
		synonyms: sampleSynonyms,
		selectedWord: 'word',
		onSelect: (word: string) => console.log('Selected:', word),
	},
}

export const ManySynonyms: Story = {
	args: {
		synonyms: manySynonyms,
		onSelect: (word: string) => console.log('Selected:', word),
	},
}

export const Loading: Story = {
	args: {
		synonyms: [],
		isLoading: true,
	},
}

export const Empty: Story = {
	args: {
		synonyms: [],
		isLoading: false,
	},
}

export const Disabled: Story = {
	args: {
		synonyms: sampleSynonyms,
		disabled: true,
		onSelect: (word: string) => console.log('Selected:', word),
	},
}

export const Interactive: Story = {
	args: {
		synonyms: sampleSynonyms,
		onSelect: (word: string) => {
			alert(`You selected: ${word}`)
		},
	},
}

export const LongWords: Story = {
	args: {
		synonyms: longWordSynonyms,
		onSelect: (word: string) => console.log('Selected:', word),
	},
}
