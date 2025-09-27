import React from 'react';
import styles from './Thermometer.module.css';

export interface ThermometerProps {
  temperature: number; // Value between 0 and 1
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}

/**
 * Thermometer component displays a horizontal thermometer
 * showing temperature from cold (0) to hot (1)
 */
export const Thermometer: React.FC<ThermometerProps> = ({
  temperature,
  size = 'md',
  showLabels = true,
  className = ''
}) => {
  // Clamp temperature between 0 and 1
  const clampedTemperature = Math.max(0, Math.min(1, temperature));
  
  // Calculate percentage for the fill
  const fillPercentage = clampedTemperature * 100;
  
  // Get temperature category for styling
  const getTemperatureCategory = (temp: number): 'cold' | 'cool' | 'warm' | 'hot' => {
    if (temp >= 0.7) return 'hot';
    if (temp >= 0.4) return 'warm';
    if (temp >= 0.1) return 'cool';
    return 'cold';
  };
  
  const temperatureCategory = getTemperatureCategory(clampedTemperature);
  
  return (
    <div className={`${styles['thermometer']} ${styles[`thermometer--${size}`]} ${className}`}>
      {showLabels && (
        <div className={styles['thermometer__labels']}>
          <span className={styles['thermometer__label']}>Cold</span>
          <span className={styles['thermometer__label']}>Hot</span>
        </div>
      )}
      
      <div className={styles['thermometer__track']}>
        <div className={styles['thermometer__arrow-container']}>
          <div 
            className={`${styles['thermometer__arrow']} ${styles[`thermometer__arrow--${temperatureCategory}`]}`}
            style={{ left: `${fillPercentage}%` }}
          />
        </div>
      </div>
      
      {showLabels && (
        <div className={styles['thermometer__current-temp']}>
          {temperatureCategory.toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default Thermometer;
