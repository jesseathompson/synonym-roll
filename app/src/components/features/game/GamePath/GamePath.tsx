import React from 'react'
import { WordTile } from '../../../common/WordTile'
import styles from './GamePath.module.css'

export interface GamePathProps {
	startWord: string
	endWord: string
	steps: string[]
	minSteps: number
	/** Definition of the player's current word, in the sense it was reached through */
	currentWordDefinition?: string
	/** Primary definition of the target word */
	targetWordDefinition?: string
	className?: string
}

const MAX_VISIBLE_PLAYED_WORDS = 5

export const GamePath: React.FC<GamePathProps> = ({
	startWord,
	endWord,
	steps,
	minSteps,
	currentWordDefinition,
	targetWordDefinition,
	className = ''
}) => {
	// Words played after the start word
	const playedWords = steps.slice(1)
	const movesTaken = playedWords.length
	const currentWord = steps[steps.length - 1]

	// Par counts moves and the final move lands on the target, so the row has
	// par - 1 intermediate slots between the start and target anchors.
	const parSlots = Math.max(minSteps - 1, 0)
	const slotCount = Math.max(parSlots, movesTaken)
	const placeholderCount = Math.max(slotCount - movesTaken, 0)

	// Once every par slot is filled the next move must beat par to tie it,
	// so the guaranteed overage is movesTaken + 1 - par.
	const movesOverPar = movesTaken > parSlots ? movesTaken + 1 - minSteps : 0

	const renderPlayedTile = (word: string, index: number) => (
		<div
			key={`step-${index}-${word}`}
			className={styles['game-path__step']}
		>
			<div className={index === movesTaken - 1 ? styles['game-path__step--current'] : ''}>
				<WordTile word={word} variant="step" size="sm" />
			</div>
		</div>
	)

	// Condense long runs of played words: first word, +n chip, last two words
	const playedTiles =
		movesTaken <= MAX_VISIBLE_PLAYED_WORDS
			? playedWords.map((word, index) => renderPlayedTile(word, index))
			: [
				renderPlayedTile(playedWords[0], 0),
				<div key="hidden" className={styles['game-path__step']}>
					<div className={styles['game-path__hidden-count']}>
						+{movesTaken - 3}
					</div>
				</div>,
				...playedWords
					.slice(-2)
					.map((word, i) => renderPlayedTile(word, movesTaken - 2 + i))
			]

	const rowItems: React.ReactNode[] = [
		<div key="start" className={styles['game-path__anchor']}>
			<WordTile word={startWord} variant="start" size="md" />
			<span className={styles['game-path__anchor-label']}>Start</span>
		</div>,
		...playedTiles,
		...Array.from({ length: placeholderCount }, (_, i) => (
			<div key={`placeholder-${i}`} className={styles['game-path__step']}>
				<div className={styles['game-path__placeholder']} aria-label="Unsolved step">
					?
				</div>
			</div>
		)),
		<div key="end" className={styles['game-path__anchor']}>
			<WordTile word={endWord} variant="end" size="md" />
			<span className={styles['game-path__anchor-label']}>Target</span>
		</div>
	]

	return (
		<div className={`${styles['game-path']} ${className}`}>
			<div className={styles['game-path__header']}>
				<span className={styles['game-path__chip']}>⛳ Par {minSteps}</span>
				<span
					className={`${styles['game-path__chip']} ${
						movesOverPar > 0 ? styles['game-path__chip--over'] : ''
					}`}
				>
					{movesOverPar > 0
						? `${movesTaken} moves · +${movesOverPar} over par`
						: `Moves ${movesTaken} / ${minSteps}`}
				</span>
			</div>
			<div className={styles['game-path__path']}>
				{/* Arrow + tile form one non-wrapping unit so line breaks land between steps */}
				{rowItems.map((item, index) => (
					<div key={`unit-${index}`} className={styles['game-path__unit']}>
						{index > 0 && (
							<span className={styles['game-path__arrow']} aria-hidden="true">
								→
							</span>
						)}
						{item}
					</div>
				))}
			</div>
			{(currentWordDefinition || targetWordDefinition) && (
				<dl className={styles['game-path__definitions']}>
					{currentWordDefinition && (
						<div className={styles['game-path__definition']}>
							<dt>📍 {currentWord}</dt>
							<dd>{currentWordDefinition}</dd>
						</div>
					)}
					{targetWordDefinition && (
						<div className={styles['game-path__definition']}>
							<dt>🎯 {endWord}</dt>
							<dd>{targetWordDefinition}</dd>
						</div>
					)}
				</dl>
			)}
		</div>
	)
}

export default GamePath
