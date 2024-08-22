import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import PropTypes from 'prop-types';
import '../styles/Modals.css';

const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      token
    }
  }
`;

const CREATE_USER = gql`
  mutation ($email: String!, $password: String!, $username: String!, $gender: String!) {
    createUser(email: $email, password: $password, username: $username, gender: $gender) {
      email
      username
      gender
      id
      dateJoined
    }
  }
`;

const genderOptions = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
  { value: 'N', label: 'Nonbinary' },
];

const Login = ({ isOpen, onClose, showLoginAfterSignup }) => {
  const [isLogin, setIsLogin] = useState(!showLoginAfterSignup);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [loginUser] = useMutation(LOGIN_USER);
  const [createUser] = useMutation(CREATE_USER);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { data } = await loginUser({ variables: { email, password } });
      if (data && data.login && data.login.success) {
        localStorage.setItem('token', data.login.token);
        onClose();
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    try {
      await createUser({ variables: { email, password, username, gender } });
      setIsLogin(true); // Switch to login form after successful signup
    } catch (error) {
      setError('An error occurred during signup');
    }
  };

  const switchToSignup = () => {
    setIsLogin(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        {isLogin ? (
          <>
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
              <span onClick={switchToSignup} style={{ color: 'blue', cursor: 'pointer' }}>
                Create account
              </span>
            </p>
          </>
        ) : (
          <>
            <h2>Create Account</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              {genderOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSignup}>Sign Up</button>
            <p>
              Already have an account?{' '}
              <span onClick={switchToLogin} style={{ color: 'blue', cursor: 'pointer' }}>
                Log In
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

Login.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  showLoginAfterSignup: PropTypes.bool,
};

export default Login;
