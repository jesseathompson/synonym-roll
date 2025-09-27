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
					{Array.from({ length: maxWords - 2 }, (_, index) => {
						const word = steps[index]
						const isEmpty = !word
						
						return (
							<div 
								key={index} 
								className={`${styles['game-path__step']} ${
									isEmpty ? styles['game-path__step--empty'] : ''
								}`}
							>
								{word ? (
									<WordTile
										word={word}
										variant="step"
										size="md"
									/>
								) : (
									<div className={styles['game-path__placeholder']}>
										?
									</div>
								)}
							</div>
						)
					})}
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
