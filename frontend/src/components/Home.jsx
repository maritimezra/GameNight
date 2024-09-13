import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

import TruthOrDareFront from '../images/TOD_Home_Front.png';
import TruthOrDareBack from '../images/TOD_Home_Back.png';
import SuperlativeFront from '../images/Superlative_Home_Front.png';
import SuperlativeBack from '../images/Superlative_Home_Back.png';
import NeverHaveIEverFront from '../images/NHIE_Home_Front.png';
import NeverHaveIEverBack from '../images/NHIE_Home_Back.png';
import DoOrDrinkFront from '../images/DOD_Home_Front.png';
import DoOrDrinkBack from '../images/DOD_Home_Back.png';

const games = [
  { name: 'Truth or Dare', front: TruthOrDareFront, back: TruthOrDareBack },
  { name: 'Superlative', front: SuperlativeFront, back: SuperlativeBack },
  { name: 'Never Have I Ever', front: NeverHaveIEverFront, back: NeverHaveIEverBack },
  { name: 'Do or Drink', front: DoOrDrinkFront, back: DoOrDrinkBack },
];

const Home = () => {
  const navigate = useNavigate();
  const [clickedItem, setClickedItem] = useState(null);

  const handleGameSelect = (game) => {
    const formattedGame = game.toLowerCase().replace(/\s+/g, '-');
    navigate(`/${formattedGame}`, { state: { selectedGame: game } });
  };

  const handleImageClick = (gameName, index) => {
    setClickedItem(index);
    setTimeout(() => {
      setClickedItem(null);
      handleGameSelect(gameName);
    }, 700);
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
          {games.map((game, index) => (
            <div
              key={game.name}
              className={`item ${clickedItem === index ? 'animate' : ''}`}
              onClick={() => handleImageClick(game.name, index)}
              role="button"
              tabIndex="0"
              aria-label={`Select ${game.name}`}
            >
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
