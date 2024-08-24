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

  useEffect(() => {
    // Automatically show the form list with a zoom effect
    const formList = document.getElementById('formList');
    formList.classList.add('show');
  }, []);

  return (
    <div className="home-container">
      <div id="formList" className="hidden">
        <fieldset id="list">
          <legend>Game Night</legend>
          <div className="item" onClick={() => handleGameSelect('Truth or Dare')}>
            <div className="avatar">
              <img src={TruthOrDareFront} className="front" alt="Truth or Dare Front" />
              <img src={TruthOrDareBack} className="back" alt="Truth or Dare Back" />
            </div>
          </div>
          <div className="item" onClick={() => handleGameSelect('Superlative')}>
            <div className="avatar">
              <img src={SuperlativeFront} className="front" alt="The Superlative Front" />
              <img src={SuperlativeBack} className="back" alt="The Superlative Back" />
            </div>
          </div>
          <div className="item" onClick={() => handleGameSelect('Never Have I Ever')}>
            <div className="avatar">
              <img src={NeverHaveIEverFront} className="front" alt="Never Have I Ever Front" />
              <img src={NeverHaveIEverBack} className="back" alt="Never Have I Ever Back" />
            </div>
          </div>
          <div className="item" onClick={() => handleGameSelect('Do or Drink')}>
            <div className="avatar">
              <img src={DoOrDrinkFront} className="front" alt="Do or Drink Front" />
              <img src={DoOrDrinkBack} className="back" alt="Do or Drink Back" />
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  );
};

export default Home;