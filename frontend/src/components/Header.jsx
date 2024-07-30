import PropTypes from 'prop-types';
import { useNavigate} from 'react-router-dom';
import '../styles/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';


const Header = ({ openProfileModal }) => {
  const navigate = useNavigate();
  

  const handleProfileClick = () => {
    openProfileModal();
  };

  const handleTitleClick = () => {
    navigate('/');
  }

  return (
    <header className="header">
      <h1 onClick={handleTitleClick}>GameNight</h1>
      <div className="user-info">
        <span onClick={handleProfileClick} className="profile-icon">
          <FontAwesomeIcon icon={faUser} />
        </span>
      </div>
    </header>
  );
};

Header.propTypes = {
    openProfileModal: PropTypes.func.isRequired,
  };

export default Header;
