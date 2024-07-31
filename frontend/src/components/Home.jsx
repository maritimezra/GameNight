import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="home-container">
      <div className="option" onClick={() => handleNavigation('/truth-or-dare')}>
        Truth or Dare
      </div>
      <div className="option" onClick={() => handleNavigation('/superlative')}>
        Superlative
      </div>
    </div>
  );
};

export default Home;
