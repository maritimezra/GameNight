import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import PropTypes from 'prop-types';
import Profile from './Profile';

const Layout = ({ children }) => {

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const openProfileModal = () => {
    setIsProfileOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileOpen(false);
  };
  return (
    <div className="layout">
      <Header openProfileModal={openProfileModal} />
      <main>{children}</main>
      <Footer />
      <Profile isOpen={isProfileOpen} onClose={closeProfileModal} />
    </div>
  );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
  };

export default Layout;
