import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Login from './Login';

const Header = ({ openProfileModal, isAuthenticated, onAuthChange }) => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    onAuthChange(); // Update authentication state
  }, [onAuthChange]);

  const handleProfileClick = () => {
    if (isAuthenticated) {
      openProfileModal();
    } else {
      setShowLoginModal(true);
    }
  };

  const handleTitleClick = () => {
    navigate('/');
  };

  const handleLoginClose = () => {
    setShowLoginModal(false);
    onAuthChange();
  };

  return (
    <header className="header">
      <h1 onClick={handleTitleClick}>GameNight</h1>
      <div className="user-info">
        <span onClick={handleProfileClick} className="profile-icon">
          <FontAwesomeIcon icon={faUser} />
        </span>
      </div>
      {showLoginModal && <Login isOpen={true} onClose={handleLoginClose} />}
    </header>
  );
};

Header.propTypes = {
  openProfileModal: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  onAuthChange: PropTypes.func.isRequired,
};

export default Header;
