import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Login from './Login';

const Header = ({ openProfileModal }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [showLoginModal, setShowLoginModal] = useState(false);

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
    setIsAuthenticated(!!localStorage.getItem('token'));
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
};

export default Header;
