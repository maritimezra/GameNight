import { useState, useCallback } from 'react';
import Header from './Header';
import Footer from './Footer';
import PropTypes from 'prop-types';
import Profile from './Profile';

const Layout = ({ children }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const openProfileModal = () => {
    setIsProfileOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileOpen(false);
  };

  // Callback to update authentication state
  const handleAuthChange = useCallback(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, []);

  return (
    <div className="layout">
      <Header
        openProfileModal={openProfileModal}
        isAuthenticated={isAuthenticated}
        onAuthChange={handleAuthChange}
      />
      <main>{children}</main>
      <Footer />
      <Profile
        isOpen={isProfileOpen}
        onClose={closeProfileModal}
        refetch={handleAuthChange} // Make sure this prop is handled correctly in Profile component
      />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;

