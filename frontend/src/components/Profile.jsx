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
  const { loading, error, data } = useQuery(ME, { fetchPolicy: 'network-only' });
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

  if (!isOpen) return null;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { username, email, gender } = data.me;

  return (
    <div className="profile-modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Profile Details</h2>
        <p><strong>Username:</strong> {username}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Gender:</strong> {genderMapping[gender] || gender}</p>
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

