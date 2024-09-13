import { useEffect } from 'react';
import { useQuery, gql, useApolloClient, useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import '../styles/Modals.css';

const ME = gql`
  query Me {
    me {
      username
      email
      gender
    }
  }
`;

const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

const genderMapping = {
  M: 'Male',
  F: 'Female',
  N: 'Nonbinary'
};

const Profile = ({ isOpen, onClose, refetch }) => {
  const { loading, error, data, refetch: refetchUser } = useQuery(ME, { fetchPolicy: 'network-only' });
  const [logout] = useMutation(LOGOUT);
  const navigate = useNavigate();
  const client = useApolloClient();

  const handleLogout = async () => {
    try {
      await logout();
      await client.resetStore();
      localStorage.removeItem('token');
      onClose();
      navigate('/');
      refetch(); // Update authentication state
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refetchUser(); // Refetch user data when the modal opens
    }
  }, [isOpen, refetchUser]);

  if (!isOpen) return null;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { username, email, gender } = data.me;

  return (
    <div className="profile-modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Profile Details</h2>
        <div className="profile-details">
        <p><strong>Username:</strong> <span className="profile-username">{username}</span></p>
        <p><strong>Email:</strong> <span className="profile-email">{email}</span></p>
        <p><strong>Gender:</strong> <span className="profile-gender">{genderMapping[gender] || gender}</span></p>
      </div>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

Profile.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default Profile;
