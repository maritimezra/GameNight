import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, gql, useApolloClient } from '@apollo/client';
import PropTypes from 'prop-types';
import '../styles/Modals.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const GET_LOBBY = gql`
  query GetLobby($lobbyId: Int!) {
    getLobby(lobbyId: $lobbyId) {
      id
      level
      category
      name
      game
    }
  }
`;

const GET_PLAYERS = gql`
  query GetPlayers($lobbyId: Int!) {
    getPlayers(lobbyId: $lobbyId) {
      id
      name
    }
  }
`;

const GET_CREATOR = gql`
  query GetCreator($lobbyId: Int!) {
    getCreator(lobbyId: $lobbyId) {
      username
    }
  }
`;

const EDIT_PLAYER = gql`
  mutation EditPlayer($playerId: Int!, $newName: String!) {
    editPlayer(playerId: $playerId, newName: $newName) {
      id
      name
    }
  }
`;

const REMOVE_PLAYER = gql`
  mutation RemovePlayer($lobbyId: Int!, $playerId: Int!) {
    removePlayer(lobbyId: $lobbyId, playerId: $playerId)
  }
`;

const ADD_PLAYER = gql`
  mutation AddPlayer($lobbyId: Int!, $playerName: String!) {
    addPlayer(lobbyId: $lobbyId, playerName: $playerName) {
      id
      name
    }
  }
`;

const GET_LOBBYID = gql`
  query GetLobbyId($playerId: Int!) {
    getLobbyid(playerId: $playerId)
  }
`;

const LobbyDetails = ({ isOpen, onClose, lobbyId }) => {
  const navigate = useNavigate();
  const client = useApolloClient();

  const [players, setPlayers] = useState([]);
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerToAdd, setNewPlayerToAdd] = useState('');
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [playerToRemoveId, setPlayerToRemoveId] = useState(null);

  const { loading: loadingLobby, error: errorLobby, data: dataLobby } = useQuery(GET_LOBBY, {
    variables: { lobbyId: parseInt(lobbyId, 10) },
  });

  const { loading: loadingPlayers, error: errorPlayers, data: dataPlayers } = useQuery(GET_PLAYERS, {
    variables: { lobbyId: parseInt(lobbyId, 10) },
  });

  const { loading: loadingCreator, error: errorCreator, data: dataCreator } = useQuery(GET_CREATOR, {
    variables: { lobbyId: parseInt(lobbyId, 10) },
  });

  const [editPlayer] = useMutation(EDIT_PLAYER, {
    refetchQueries: [{ query: GET_PLAYERS, variables: { lobbyId: parseInt(lobbyId, 10) } }],
  });

  const [removePlayer] = useMutation(REMOVE_PLAYER, {
    refetchQueries: [{ query: GET_PLAYERS, variables: { lobbyId: parseInt(lobbyId, 10) } }],
  });

  const [addPlayer] = useMutation(ADD_PLAYER, {
    refetchQueries: [{ query: GET_PLAYERS, variables: { lobbyId: parseInt(lobbyId, 10) } }],
  });

  useEffect(() => {
    if (dataPlayers && dataCreator) {
      const creatorName = dataCreator.getCreator.username;
      const updatedPlayers = [...dataPlayers.getPlayers];
      if (!updatedPlayers.some(player => player.name === creatorName)) {
        updatedPlayers.push({ id: 'creator', name: creatorName });
      }
      setPlayers(updatedPlayers);
    }
  }, [dataPlayers, dataCreator]);

  const handleEditPlayer = async () => {
    if (editingPlayerId && newPlayerName.trim()) {
      try {
        await editPlayer({ variables: { playerId: parseInt(editingPlayerId, 10), newName: newPlayerName } });
        setEditingPlayerId(null);
        setNewPlayerName('');
      } catch (error) {
        console.error(`Error editing player: ${error.message}`);
      }
    }
  };

  const handleRemovePlayer = async () => {
    if (playerToRemoveId) {
        try {
          const { data } = await client.query({
            query: GET_LOBBYID,
            variables: { playerId: parseInt(playerToRemoveId, 10) },
          });

          if (data.getLobbyid === parseInt(lobbyId, 10)) {
            await removePlayer({ variables: { lobbyId: parseInt(lobbyId, 10), playerId: parseInt(playerToRemoveId, 10) } });
            setPlayerToRemoveId(null);
          } else {
            alert('Player does not belong to this lobby.');
          }
        } catch (error) {
          console.error('Error removing player:', error);
        }
      
    }
  };

  const handleAddPlayer = async () => {
    if (newPlayerToAdd.trim()) {
      try {
        await addPlayer({ variables: { lobbyId: parseInt(lobbyId, 10), playerName: newPlayerToAdd } });
        setNewPlayerToAdd('');
        setIsAddingPlayer(false);
      } catch (error) {
        console.error(`Error adding player: ${error.message}`);
      }
    }
  };

  const handleStartGame = () => {
    if (dataLobby?.getLobby) {
      const routes = {
        'Truth or Dare': `/play-tod?id=${lobbyId}`,
        'Superlative': `/play-superlative?id=${lobbyId}`,
        'Do or Drink': `/play-dod?id=${lobbyId}`,
        'Never Have I Ever': `/play-nhie?id=${lobbyId}`,
      };

      const route = routes[dataLobby.getLobby.game];
      if (route) {
        navigate(route);
      } else {
        console.error('Unknown game type');
      }
    } else {
      console.error('Lobby data is not available');
    }
  };

  if (loadingLobby || loadingPlayers || loadingCreator) return <p>Loading...</p>;
  if (errorLobby) return <p>Error: {errorLobby.message}</p>;
  if (errorPlayers) return <p>Error: {errorPlayers.message}</p>;
  if (errorCreator) return <p>Error: {errorCreator.message}</p>;

  if (!isOpen) return null;

  const lobby = dataLobby.getLobby;
  const requiresPlayers = !['Superlative', 'Never Have I Ever'].includes(lobby.game);

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{lobby.name}</h2>
        <div className="game-classification">
          <p>Category: {lobby.category}</p>
          <p>Level: {lobby.level}</p>
        </div>
        {requiresPlayers && (
          <>
            <h5>Players</h5>
            <ul className="player-list">
              {players.map(player => (
                <li key={player.id} className="player-item">
                  <span className="player-name">{player.name}</span>
                  {player.id !== 'creator' && (
                    <div className="player-icons">
                        <FontAwesomeIcon className="iconD"
                        icon={faEdit}
                        onClick={() => {
                          setEditingPlayerId(player.id);
                          setNewPlayerName(player.name);
                        }}
                        style={{ cursor: 'pointer', marginRight: '10px' }}
                        />
                        <FontAwesomeIcon className="iconE"
                        icon={faTrash} 
                        onClick={() => {
                          setPlayerToRemoveId(player.id);
                          handleRemovePlayer();
                        }}
                        style={{ cursor: 'pointer', marginRight: '10px' }}
                        />
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {editingPlayerId && (
              <div className="edit-player" style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  className="edit-input"
                  value={newPlayerName}
                  onChange={e => setNewPlayerName(e.target.value)}
                />
                <FontAwesomeIcon className="iconC"
                icon={faCheck} 
                onClick={handleEditPlayer}
                />
                <FontAwesomeIcon className="iconX"
                icon={faTimes} 
                onClick={() => setEditingPlayerId(null)}
                />
              </div>
            )}

            {isAddingPlayer ? (
              <div className="add-player" style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="New player name"
                  value={newPlayerToAdd}
                  onChange={e => setNewPlayerToAdd(e.target.value)}
                />
                <FontAwesomeIcon className="iconC"
                icon={faCheck} 
                onClick={handleAddPlayer}
                style={{ cursor: 'pointer', marginRight: '10px' }}
                />
                <FontAwesomeIcon 
                icon={faTimes} 
                className="iconX"
                onClick={() => setIsAddingPlayer(false)}
                style={{ cursor: 'pointer', marginRight: '10px' }}
                />
              </div>
            ) : (
              <button className="add-button" onClick={() => setIsAddingPlayer(true)}>Add Player</button>
            )}
          </>
        )}
        <button className="start-game-button" onClick={handleStartGame}>Start Game</button>
        <h4>{lobby.game}</h4>
      </div>
    </div>
  );
};

LobbyDetails.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  lobbyId: PropTypes.string.isRequired,
};

export default LobbyDetails;
