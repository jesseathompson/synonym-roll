import { useState } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faCog, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../hooks/useTheme';
import { SettingsModal } from './SettingsModal';
import { InfoModal } from './InfoModal';
import { trackThemeToggle, trackModal } from '../utils/analytics';

export const Navigation = () => {
  const { theme, toggleTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Track theme toggle
  const handleThemeToggle = () => {
    const previousTheme = theme;
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    
    trackThemeToggle({
      new_theme: newTheme,
      previous_theme: previousTheme,
    });
    
    toggleTheme();
  };

  // Track modal opens
  const handleInfoClick = () => {
    trackModal({ modal_type: 'info', action: 'open' });
    setShowInfo(true);
  };

  const handleSettingsClick = () => {
    trackModal({ modal_type: 'settings', action: 'open' });
    setShowSettings(true);
  };

  // Track modal closes
  const handleInfoClose = () => {
    trackModal({ modal_type: 'info', action: 'close' });
    setShowInfo(false);
  };

  const handleSettingsClose = () => {
    trackModal({ modal_type: 'settings', action: 'close' });
    setShowSettings(false);
  };

  return (
    <>
      <Navbar className="px-3">
        <Navbar.Brand as={Link} to="/" className="game-title me-auto">Synonym Roll</Navbar.Brand>
        <Nav className="nav-icons">
          <Button
            variant="link"
            onClick={handleThemeToggle}
            className="nav-link"
            aria-label="Toggle theme"
          >
            <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
          </Button>
          <Button
            variant="link"
            className="nav-link"
            onClick={handleInfoClick}
            aria-label="Information"
          >
            <FontAwesomeIcon icon={faInfoCircle} />
          </Button>
          <Button
            variant="link"
            className="nav-link"
            onClick={handleSettingsClick}
            aria-label="Settings"
          >
            <FontAwesomeIcon icon={faCog} />
          </Button>
        </Nav>
      </Navbar>

      <SettingsModal show={showSettings} onHide={handleSettingsClose} />
      <InfoModal show={showInfo} onHide={handleInfoClose} />
    </>
  );
}; 