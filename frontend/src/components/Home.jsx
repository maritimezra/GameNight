import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();


  const handleGameSelect = (game) => {
    const formattedGame = game.toLowerCase().replace(/\s+/g, '-');
    navigate(`/${formattedGame}`, { state: { selectedGame: game } });
  };

  return (
    <div className="home-container">
      <div className="option" onClick={() => handleGameSelect('Truth or Dare')}>
        Truth or Dare
      </div>
      <div className="option" onClick={() => handleGameSelect('Superlative')}>
        Superlative
      </div>
      <div className="option" onClick={() => handleGameSelect('Do or Drink')}>
        Do or Drink
      </div>
    </div>
  );
};

export default Home;
