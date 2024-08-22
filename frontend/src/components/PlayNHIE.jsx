import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import '../styles/Game.css'

import couplesMildQuestions from '../questions/nhie/couples/mild.json';
import couplesModQuestions from '../questions/nhie/couples/mod.json';
import couplesWildQuestions from '../questions/nhie/couples/wild.json';
import partyMildQuestions from '../questions/nhie/party/mild.json';
import partyModQuestions from '../questions/nhie/party/mod.json';
import partyWildQuestions from '../questions/nhie/party/wild.json';
import teensMildQuestions from '../questions/nhie/teens/mild.json';
import teensModQuestions from '../questions/nhie/teens/mod.json';
import teensWildQuestions from '../questions/nhie/teens/wild.json';
import workMildQuestions from '../questions/nhie/work/mild.json';
import workModQuestions from '../questions/nhie/work/mod.json';
import workWildQuestions from '../questions/nhie/work/wild.json';


const GET_LOBBY = gql`
  query GetLobby($lobbyId: Int!) {
    getLobby(lobbyId: $lobbyId) {
      id
      level
      category
    }
  }
`;


const NHIEGame = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const lobbyId = searchParams.get('id');

  const { loading: loadingLobby, error: errorLobby, data: dataLobby } = useQuery(GET_LOBBY, {
    variables: { lobbyId: parseInt(lobbyId) },
  });

  const [question, setQuestion] = useState('');


  useEffect(() => {
    if (dataLobby) {
      const { level, category } = dataLobby.getLobby;
      fetchQuestion( category, level);
    }
  }, [dataLobby]);



  const fetchQuestion = ( category, level) => {
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



  const handleNextQuestion = () => {
    if (dataLobby) {
      const { level, category } = dataLobby.getLobby;
      fetchQuestion( category, level);
    }
  };


  const handleEndGame = () => {
    navigate('/')
  }

  if (loadingLobby ) return <p>Loading...</p>;
  if (errorLobby ) return <p>Error: { errorLobby.message }</p>;

  return (
    <div className="main-container">
      <div className="container">
        <h2 className="current-turn">Current Question: </h2>
        <div>
          <p>{question}</p>
        </div>
        <div className="top-right-button">
          <button className="button" onClick={handleNextQuestion}>Next Question</button>
        </div>
        <div className="bottom-right-button">
          <button className="button-end-game" onClick={handleEndGame}>End Game</button>
        </div>
      </div>
    </div>
  );
};

export default NHIEGame;
