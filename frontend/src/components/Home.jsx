import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

import TruthOrDareFront from '../images/Truth_Or_Dare.png';
import TruthOrDareBack from '../images/Truth_Or_Dare_Back.png';
import SuperlativeFront from '../images/The_Superlative.png';
import SuperlativeBack from '../images/The_Superlative_Back.png';
import NeverHaveIEverFront from '../images/Never_Have_I_Ever.png';
import NeverHaveIEverBack from '../images/Never_Have_I_Ever_Back.png';
import DoOrDrinkFront from '../images/Do_Or_Drink.png';
import DoOrDrinkBack from '../images/Do_Or_Drink_Back.png';

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
