import React from 'react'
import { WordTile } from '../../../common/WordTile'
import { Thermometer } from '../../../common/Thermometer'
import { WordGraph } from '../../../../utils/wordGraph'
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
	const wordGraph = new WordGraph()
	
	// Calculate temperature for each word in the path
	const getTemperatureVariant = (word: string): 'hot' | 'warm' | 'cool' | 'cold' => {
		return wordGraph.getTemperatureCategory(word, endWord)
	}
	
	// Get temperature for the current word (last step or start word if no steps)
	const currentWord = steps.length > 0 ? steps[steps.length - 1] : startWord
	const currentTemperatureValue = wordGraph.getTemperature(currentWord, endWord)
	const currentTemperature = getTemperatureVariant(currentWord)
	
	// Get temperature for the target word (should always be 'hot' since it's the target)
	const targetTemperature = getTemperatureVariant(endWord)

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
						variant={getTemperatureVariant(startWord)}
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
									variant={getTemperatureVariant(word)}
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
					Target Word
				</div>
				<div className={styles['game-path__word-container']}>
					<WordTile
						word={endWord}
						variant={targetTemperature}
						size="lg"
					/>
				</div>
				<div className={styles['game-path__thermometer']}>
					<Thermometer
						temperature={currentTemperatureValue}
						size="md"
						showLabels={true}
					/>
				</div>
			</div>
		</div>
	)
}

export default GamePath
