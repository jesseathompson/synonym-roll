import React, { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faCog, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../../hooks/useTheme';
import { SettingsModal } from '../../SettingsModal';
import { InfoModal } from '../../InfoModal';
import styles from './Navigation.module.css';

interface NavigationProps {
  className?: string;
}

const NavigationComponent: React.FC<NavigationProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleInfoClick = () => {
    setShowInfo(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const handleCloseInfo = () => {
    setShowInfo(false);
  };

  return (
    <nav className={`${styles.navigation} ${className}`}>
      <Link 
        to="/" 
        className={styles.navigation__brand}
        aria-label="Synonym Roll Home"
      >
        Synonym Roll
      </Link>
      
      <div className={styles.navigation__links}>
        <button
          type="button"
          onClick={toggleTheme}
          className={styles.navigation__button}
          aria-label={`Toggle ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
        </button>
        
        <button
          type="button"
          onClick={handleInfoClick}
          className={styles.navigation__button}
          aria-label="Game information"
        >
          <FontAwesomeIcon icon={faInfoCircle} />
        </button>
        
        <button
          type="button"
          onClick={handleSettingsClick}
          className={styles.navigation__button}
          aria-label="Game settings"
        >
          <FontAwesomeIcon icon={faCog} />
        </button>
      </div>
      
      <SettingsModal show={showSettings} onHide={handleCloseSettings} />
      <InfoModal show={showInfo} onHide={handleCloseInfo} />
    </nav>
  );
};

// Use React.memo for performance optimization
export const Navigation = memo(NavigationComponent);
