import React from 'react'
import styles from './WordTile.module.css'

export interface WordTileProps {
	word: string
	variant: 'start' | 'step' | 'end' | 'neutral' | 'selected' | 'correct' | 'incorrect' | 'hot' | 'warm' | 'cool' | 'cold'
	onClick?: () => void
	size?: 'sm' | 'md' | 'lg'
	disabled?: boolean
}

export const WordTile: React.FC<WordTileProps> = ({ 
	word, 
	variant, 
	onClick,
	size = 'md',
	disabled = false
}) => {
	const baseClassName = styles['word-tile']
	const variantClassName = styles[`word-tile--${variant}`]
	const sizeClassName = styles[`word-tile--${size}`]
	const disabledClassName = disabled ? styles['word-tile--disabled'] : ''

	return (
		<div 
			className={`${baseClassName} ${variantClassName} ${sizeClassName} ${disabledClassName}`}
			onClick={disabled ? undefined : onClick}
			role={onClick && !disabled ? "button" : undefined}
			tabIndex={onClick && !disabled ? 0 : undefined}
			aria-label={onClick && !disabled ? `Select word: ${word}` : undefined}
			onKeyDown={(e) => {
				if (onClick && !disabled && (e.key === 'Enter' || e.key === ' ')) {
					e.preventDefault()
					onClick()
				}
			}}
		>
			<span className={styles['word-tile__text']}>
				{word}
			</span>
		</div>
	)
}

export default WordTile
