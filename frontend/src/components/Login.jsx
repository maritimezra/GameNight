import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Signup from './Signup';
import '../styles/Modals.css';

const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      token
    }
  }
`;

const Login = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false); 

  const navigate = useNavigate();
  const [loginUser] = useMutation(LOGIN_USER);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { data } = await loginUser({ variables: { email, password } });
      if (data && data.login && data.login.success) {
        console.log('Login successful');
        console.log('Token:', data.login.token);
        localStorage.setItem('token', data.login.token);
        navigate('/');
        onClose(); 
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleShowSignup = () => {
    setShowSignupModal(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal">
        <div className="modal-content">
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin} disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <p>
            Don&apos;t have an account?{' '}
            <span onClick={handleShowSignup} style={{ color: 'blue', cursor: 'pointer' }}>
              Create account
            </span>
          </p>
        </div>
      </div>
      {showSignupModal && <Signup isOpen={true} onClose={() => setShowSignupModal(false)} />}
    </>
  );
};

Login.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Login;
