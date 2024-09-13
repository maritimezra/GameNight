import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import Lottie from 'react-lottie';
import loaderData from '../animations/Loader.json';
import '../styles/Game.css';

import couplesMildQuestions from '../questions/dod/couples/mild.json';
import couplesModQuestions from '../questions/dod/couples/mod.json';
import couplesWildQuestions from '../questions/dod/couples/wild.json';
import partyMildQuestions from '../questions/dod/party/mild.json';
import partyModQuestions from '../questions/dod/party/mod.json';
import partyWildQuestions from '../questions/dod/party/wild.json';
import teensMildQuestions from '../questions/dod/teens/mild.json';
import teensModQuestions from '../questions/dod/teens/mod.json';
import teensWildQuestions from '../questions/dod/teens/wild.json';
import workMildQuestions from '../questions/dod/work/mild.json';
import workModQuestions from '../questions/dod/work/mod.json';
import workWildQuestions from '../questions/dod/work/wild.json';

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

const DodGame = () => {
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
  const [question, setQuestion] = useState('');

  const navigate = useNavigate();

  const fetchQuestion = (category, level) => {
    let questions;

    switch (category) {
      case 'Couples':
        switch (level) {
          case 'Mild':
            questions = couplesMildQuestions.Questions;
            break;
          case 'Moderate':
            questions = couplesModQuestions.Questions;
            break;
          case 'Wild':
            questions = couplesWildQuestions.Questions;
            break;
          default:
            throw new Error('Invalid level');
        }
        break;
      case 'Party':
        switch (level) {
          case 'Mild':
            questions = partyMildQuestions.Questions;
            break;
          case 'Moderate':
            questions = partyModQuestions.Questions;
            break;
          case 'Wild':
            questions = partyWildQuestions.Questions;
            break;
          default:
            throw new Error('Invalid level');
        }
        break;
      case 'Teens':
        switch (level) {
          case 'Mild':
            questions = teensMildQuestions.Questions;
            break;
          case 'Moderate':
            questions = teensModQuestions.Questions;
            break;
          case 'Wild':
            questions = teensWildQuestions.Questions;
            break;
          default:
            throw new Error('Invalid level');
        }
        break;
      case 'Work':
        switch (level) {
          case 'Mild':
            questions = workMildQuestions.Questions;
            break;
          case 'Moderate':
            questions = workModQuestions.Questions;
            break;
          case 'Wild':
            questions = workWildQuestions.Questions;
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

  useEffect(() => {
    if (dataLineup && dataLineup.getLineup) {
      setPlayers(dataLineup.getLineup);
    }
  }, [dataLineup]);

  useEffect(() => {
    if (dataLobby) {
      const { level, category } = dataLobby.getLobby;
      fetchQuestion(category, level);
    }
  }, [dataLobby]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loaderData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  if (loadingLobby || loadingLineup) {
    return (
      <div className="loader">
        <Lottie options={defaultOptions} height={100} width={100} />
      </div>
    );
  }
  if (errorLobby || errorLineup) return <p>Error: {errorLobby ? errorLobby.message : errorLineup.message}</p>;

  const handleNextTurn = () => {
    setCurrentTurn((prevTurn) => (prevTurn + 1) % players.length);
    if (dataLobby) {
        const { level, category } = dataLobby.getLobby;
        fetchQuestion(category, level);
      }
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

export default DodGame;
