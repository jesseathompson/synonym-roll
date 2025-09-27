import React from 'react'
import { WordTile } from '../../../common/WordTile'
import styles from './SynonymList.module.css'

export interface SynonymListProps {
	synonyms: string[]
	onSelect: (word: string) => void
	isLoading?: boolean
	selectedWord?: string
	disabled?: boolean
}

export const SynonymList: React.FC<SynonymListProps> = ({ 
	synonyms, 
	onSelect, 
	isLoading = false,
	selectedWord,
	disabled = false
}) => {
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
			<div className={styles['synonym-list__grid']}>
				{sortedSynonyms.map((synonym, index) => (
					<div 
						key={`${synonym}-${index}`} 
						className={styles['synonym-list__item']} 
						role="listitem"
					>
						<WordTile
							word={synonym}
							variant={selectedWord === synonym ? 'selected' : 'neutral'}
							onClick={() => onSelect(synonym)}
							size="md"
							disabled={disabled}
						/>
					</div>
				))}
			</div>
		</div>
	)
}

export default SynonymList
