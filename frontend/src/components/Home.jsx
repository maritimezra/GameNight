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
  const [flipped, setFlipped] = useState(null); // State to track flipped avatar
  const timerRef = useRef(null); // Timer reference for the delay

  const handleGameSelect = (game) => {
    const formattedGame = game.toLowerCase().replace(/\s+/g, '-');
    navigate(`/${formattedGame}`, { state: { selectedGame: game } });
  };

  const handleMouseEnter = (index) => {
    // Clear any existing timer
    if (timerRef.current) clearTimeout(timerRef.current);

    setFlipped(index);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setFlipped(null);
    }, 5000); // 5 seconds delay
  };

  return (
    <div className="home-container">
      <div id="formList" className="show"> {/* Ensure the 'show' class is applied */}
        <fieldset id="list">
          <legend>Game Night</legend>
          {[ 
            { front: TruthOrDareFront, back: TruthOrDareBack, game: 'Truth or Dare' },
            { front: SuperlativeFront, back: SuperlativeBack, game: 'Superlative' },
            { front: NeverHaveIEverFront, back: NeverHaveIEverBack, game: 'Never Have I Ever' },
            { front: DoOrDrinkFront, back: DoOrDrinkBack, game: 'Do or Drink' }
          ].map((item, index) => (
            <div 
              key={index}
              className="item"
              onClick={() => handleGameSelect(item.game)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div className={`avatar ${flipped === index ? 'flipped' : ''}`}>
                <img src={item.front} className="front" alt={`${item.game} Front`} />
                <img src={item.back} className="back" alt={`${item.game} Back`} />
              </div>
            </div>
          ))}
        </fieldset>
      </div>
    </div>
  );
};

export default Home;
