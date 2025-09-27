import React from 'react'
import { WordTile } from '../../../common/WordTile'
import styles from './GamePath.module.css'

export interface GamePathProps {
	startWord: string
	endWord: string
	steps: string[]
	minSteps: number
	className?: string
}

export const GamePath: React.FC<GamePathProps> = ({
	startWord,
	endWord,
	steps,
	minSteps,
	className = ''
}) => {
	const allWords = [startWord, ...steps, endWord]
	const maxWords = Math.max(allWords.length, minSteps + 2) // Ensure we show at least minSteps + start + end

	return (
		<div className={`${styles['game-path']} ${className}`}>
			{/* Start Word */}
			<div className={styles['game-path__section']}>
				<div className={styles['game-path__label']}>
					Starting Word
				</div>
				<div className={styles['game-path__word-container']}>
					<WordTile
						word={startWord}
						variant="start"
						size="lg"
					/>
				</div>
			</div>

			{/* Path Steps */}
			<div className={styles['game-path__section']}>
				<div className={styles['game-path__label']}>
					Your Path ({steps.length} steps)
				</div>
				<div className={styles['game-path__path']}>
					{steps.map((word, index) => (
						<React.Fragment key={index}>
							<div className={styles['game-path__step']}>
								<WordTile
									word={word}
									variant="step"
									size="md"
								/>
							</div>
							{index < steps.length - 1 && (
								<span className={styles['game-path__arrow']}>
									→
								</span>
							)}
						</React.Fragment>
					))}
					{/* Show placeholder steps for remaining slots */}
					{Array.from({ length: Math.max(0, minSteps - steps.length) }, (_, index) => (
						<React.Fragment key={`placeholder-${index}`}>
							{steps.length > 0 && index === 0 && (
								<span className={styles['game-path__arrow']}>
									→
								</span>
							)}
							<div className={styles['game-path__step']}>
								<div className={styles['game-path__placeholder']}>
									?
								</div>
							</div>
							{index < Math.max(0, minSteps - steps.length) - 1 && (
								<span className={styles['game-path__arrow']}>
									→
								</span>
							)}
						</React.Fragment>
					))}
				</div>
			</div>

			{/* End Word */}
			<div className={styles['game-path__section']}>
				<div className={styles['game-path__label']}>
					Target Word ({minSteps} steps needed)
				</div>
				<div className={styles['game-path__word-container']}>
					<WordTile
						word={endWord}
						variant="end"
						size="lg"
					/>
				</div>
			</div>
		</div>
	)
}

export default GamePath
