import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import '../styles/TOD.css';

import couplesMildTruthQuestions from '../questions/tod/couples/mild/truth.json';
import couplesMildDareQuestions from '../questions/tod/couples/mild/dare.json';
import couplesModTruthQuestions from '../questions/tod/couples/moderate/truth.json';
import couplesModDareQuestions from '../questions/tod/couples/moderate/dare.json';
import couplesWildTruthQuestions from '../questions/tod/couples/wild/truth.json';
import couplesWildDareQuestions from '../questions/tod/couples/wild/dare.json';
import partyMildTruthQuestions from '../questions/tod/party/mild/truth.json';
import partyMildDareQuestions from '../questions/tod/party/mild/dare.json';
import partyModTruthQuestions from '../questions/tod/party/moderate/truth.json';
import partyModDareQuestions from '../questions/tod/party/moderate/dare.json';
import partyWildTruthQuestions from '../questions/tod/party/wild/truth.json';
import partyWildDareQuestions from '../questions/tod/party/wild/dare.json';
import teensMildTruthQuestions from '../questions/tod/teens/mild/truth.json';
import teensMildDareQuestions from '../questions/tod/teens/mild/dare.json';
import teensModTruthQuestions from '../questions/tod/teens/moderate/truth.json';
import teensModDareQuestions from '../questions/tod/teens/moderate/dare.json';
import teensWildTruthQuestions from '../questions/tod/teens/wild/truth.json';
import teensWildDareQuestions from '../questions/tod/teens/wild/dare.json';



const GET_LOBBY = gql`
  query GetLobby($lobbyId: Int!) {
    getLobby(lobbyId: $lobbyId) {
      id
      level
      category
    }
  }
`;

const GET_LINEUP = gql`
  query GetLineup($lobbyId: Int!) {
    getLineup(lobbyId: $lobbyId)
  }
`;

const TodGame = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const lobbyId = searchParams.get('id');

  const { loading: loadingLobby, error: errorLobby, data: dataLobby } = useQuery(GET_LOBBY, {
    variables: { lobbyId: parseInt(lobbyId) },
  });

  const { loading: loadingLineup, error: errorLineup, data: dataLineup } = useQuery(GET_LINEUP, {
    variables: { lobbyId: parseInt(lobbyId) },
  });

  const [currentTurn, setCurrentTurn] = useState(0);
  const [players, setPlayers] = useState([]);
  const [question, setQuestion] = useState('To play, choose either Truth or Dare');

  const navigate = useNavigate();

  useEffect(() => {
    if (dataLineup && dataLineup.getLineup) {
      setPlayers(dataLineup.getLineup);
    }
  }, [dataLineup]);

  if (loadingLobby || loadingLineup) return <p>Loading...</p>;
  if (errorLobby || errorLineup) return <p>Error: {errorLobby ? errorLobby.message : errorLineup.message}</p>;

  const fetchQuestion = (type, category, level) => {
    let questions;

    switch (category) {
      case 'Couples':
        switch (level) {
          case 'Mild':
            questions = type === 'truth' ? couplesMildTruthQuestions.Questions : couplesMildDareQuestions.Questions;
            break;
          case 'Moderate':
            questions = type === 'truth' ? couplesModTruthQuestions.Questions : couplesModDareQuestions.Questions;
            break;
          case 'Wild':
            questions = type === 'truth' ? couplesWildTruthQuestions.Questions : couplesWildDareQuestions.Questions;
            break;
          default:
            throw new Error('Invalid level');
        }
        break;
      case 'Party':
        switch (level) {
          case 'Mild':
            questions = type === 'truth' ? partyMildTruthQuestions.Questions : partyMildDareQuestions.Questions;
            break;
          case 'Moderate':
            questions = type === 'truth' ? partyModTruthQuestions.Questions : partyModDareQuestions.Questions;
            break;
          case 'Wild':
            questions = type === 'truth' ? partyWildTruthQuestions.Questions : partyWildDareQuestions.Questions;
            break;
          default:
            throw new Error('Invalid level');
        }
        break;
      case 'Teens':
        switch (level) {
          case 'Mild':
            questions = type === 'truth' ? teensMildTruthQuestions.Questions : teensMildDareQuestions.Questions;
            break;
          case 'Moderate':
            questions = type === 'truth' ? teensModTruthQuestions.Questions : teensModDareQuestions.Questions;
            break;
          case 'Wild':
            questions = type === 'truth' ? teensWildTruthQuestions.Questions : teensWildDareQuestions.Questions;
            break;
          default:
            throw new Error('Invalid level');
        }
        break;
      default:
        throw new Error('Invalid category');
    }

    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setQuestion(randomQuestion);
  };

  const handleNextTurn = () => {
    setCurrentTurn((prevTurn) => (prevTurn + 1) % players.length);
    setQuestion('To play, choose either Truth or Dare');
  };

  const handleTruth = () => {
    if (!dataLobby || !dataLobby.getLobby) return;
    const { level, category } = dataLobby.getLobby;
    fetchQuestion('truth', category, level);
  };

  const handleDare = () => {
    if (!dataLobby || !dataLobby.getLobby) return;
    const { level, category } = dataLobby.getLobby;
    fetchQuestion('dare', category, level);
  };

  const handleEndGame = () => {
    navigate('/');
  };


  

  return (
    <div className="main-container">
      <div className="container">
      <h2 className="current-turn">Current Turn: <span className="animate-character">{players[currentTurn]}</span></h2>
      <div className="question">
        <p>{question}</p>
      </div>
      <div className="group-button">
        <button className="button" onClick={handleTruth}>Truth</button>
        <button className="button" onClick={handleDare}>Dare</button>
      </div>
      <div className="top-right-button">
        <button className="button" onClick={handleNextTurn}>Next Turn</button>
      </div>
      <div className="bottom-right-button">
        <button className="button-end-game" onClick={handleEndGame}>End Game</button>
      </div>
      </div>
    </div>
  );
  
};

export default TodGame;
