import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Login from './Login';

const Header = ({ openProfileModal, isAuthenticated, onAuthChange }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [initialForm, setInitialForm] = useState('login');

  useEffect(() => {
    onAuthChange();
  }, [onAuthChange]);

  const handleProfileClick = () => {
    if (isAuthenticated) {
      openProfileModal();
    } else {
      setInitialForm('login');
      setShowModal(true);
    }
  };

  const handleTitleClick = () => {
    navigate('/');
  };

  const handleModalClose = () => {
    setShowModal(false);
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
      {showModal && (
        <Login
          isOpen={showModal}
          onClose={handleModalClose}
          initialForm={initialForm}
        />
      )}
    </header>
  );
};

Header.propTypes = {
  openProfileModal: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  onAuthChange: PropTypes.func.isRequired,
};

export default Header;
