import React, { useState } from 'react'
import { WordTile } from '../../../common/WordTile'
import styles from './SynonymList.module.css'

export interface SynonymListProps {
	synonyms: string[]
	onSelect: (word: string) => void
	isLoading?: boolean
	selectedWord?: string
	disabled?: boolean
	/** Words the player has already stepped on this game — shown faded */
	visitedWords?: string[]
	/** Looks up the definition of a candidate word (in the sense shared with the current word) */
	getDefinition?: (word: string) => string | undefined
}

export const SynonymList: React.FC<SynonymListProps> = ({
	synonyms,
	onSelect,
	isLoading = false,
	selectedWord,
	disabled = false,
	visitedWords = [],
	getDefinition
}) => {
	const [showDefinitions, setShowDefinitions] = useState(false)

	// Sort synonyms alphabetically
	const sortedSynonyms = [...synonyms].sort()

	if (isLoading) {
		return (
			<div className={styles['synonym-list__container']}>
				<div className={styles['synonym-list__loading']}>
					<div className={styles['synonym-list__loading-spinner']}></div>
					<span className={styles['synonym-list__loading-text']}>
						Loading synonyms...
					</span>
				</div>
			</div>
		)
	}

	if (sortedSynonyms.length === 0) {
		return (
			<div className={styles['synonym-list__container']}>
				<div className={styles['synonym-list__empty']}>
					No synonyms available
				</div>
			</div>
		)
	}

	return (
		<div
			className={styles['synonym-list__container']}
			role="list"
			aria-label="Available synonyms"
		>
			{getDefinition && (
				<div className={styles['synonym-list__toolbar']}>
					<button
						type="button"
						className={`${styles['synonym-list__definitions-toggle']} ${
							showDefinitions ? styles['synonym-list__definitions-toggle--active'] : ''
						}`}
						onClick={() => setShowDefinitions(prev => !prev)}
						aria-pressed={showDefinitions}
					>
						📖 Definitions
					</button>
				</div>
			)}
			<div
				className={`${styles['synonym-list__grid']} ${
					showDefinitions ? styles['synonym-list__grid--definitions'] : ''
				}`}
			>
				{sortedSynonyms.map((synonym, index) => {
					const isVisited = visitedWords.includes(synonym)
					const definition = getDefinition?.(synonym)

					return (
						<div
							key={`${synonym}-${index}`}
							className={`${styles['synonym-list__item']} ${
								isVisited ? styles['synonym-list__item--visited'] : ''
							}`}
							role="listitem"
							title={isVisited ? 'Already explored' : undefined}
						>
							<div className={styles['synonym-list__tile-wrap']}>
								<WordTile
									word={synonym}
									variant={selectedWord === synonym ? 'selected' : 'neutral'}
									onClick={() => onSelect(synonym)}
									size="md"
									disabled={disabled}
								/>
								{isVisited && (
									<span
										className={styles['synonym-list__visited-mark']}
										aria-label="Already explored"
									>
										✓
									</span>
								)}
							</div>
							{showDefinitions && definition && (
								<span className={styles['synonym-list__definition']}>
									{definition}
								</span>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default SynonymList
