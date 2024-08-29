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

const games = [
  { name: 'Truth or Dare', front: TruthOrDareFront, back: TruthOrDareBack },
  { name: 'Superlative', front: SuperlativeFront, back: SuperlativeBack },
  { name: 'Never Have I Ever', front: NeverHaveIEverFront, back: NeverHaveIEverBack },
  { name: 'Do or Drink', front: DoOrDrinkFront, back: DoOrDrinkBack },
];

const Home = () => {
  const navigate = useNavigate();

  const handleGameSelect = (game) => {
    const formattedGame = game.toLowerCase().replace(/\s+/g, '-');
    navigate(`/${formattedGame}`, { state: { selectedGame: game } });
  };

  useEffect(() => {
    const formList = document.getElementById('formList');
    formList.classList.add('show');
  }, []);

  return (
    <div className="home-container">
      <div id="formList" className="hidden">
        <fieldset id="list">
          <legend>Game Night</legend>
          {games.map((game) => (
            <div key={game.name} className="item" onClick={() => handleGameSelect(game.name)} role="button" tabIndex="0" aria-label={`Select ${game.name}`}>
              <div className="avatar">
                <img src={game.front} className="front" alt={`${game.name} Front`} />
                <img src={game.back} className="back" alt={`${game.name} Back`} />
              </div>
            </div>
          ))}
        </fieldset>
      </div>
    </div>
  );
};

export default Home;
