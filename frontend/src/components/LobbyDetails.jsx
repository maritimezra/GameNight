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

  const { loading: loadingLobby, error: errorLobby, data: dataLobby } = useQuery(GET_LOBBY, {
    variables: { lobbyId: parseInt(lobbyId, 10) },
  });

  const { loading: loadingPlayers, error: errorPlayers, data: dataPlayers } = useQuery(GET_PLAYERS, {
    variables: { lobbyId: parseInt(lobbyId, 10) },
  });

  const { loading: loadingCreator, error: errorCreator, data: dataCreator } = useQuery(GET_CREATOR, {
    variables: { lobbyId: parseInt(lobbyId, 10) },
  });

  const [players, setPlayers] = useState([]);
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerToAdd, setNewPlayerToAdd] = useState('');
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [actionPlayerId, setActionPlayerId] = useState(null);

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

  const handleEditPlayer = () => {
    if (!editingPlayerId || !newPlayerName.trim()) return;

    editPlayer({
      variables: { playerId: parseInt(editingPlayerId, 10), newName: newPlayerName },
    }).then(() => {
      setEditingPlayerId(null);
      setNewPlayerName('');
    });
  };

  const handleRemovePlayer = async () => {
    if (!actionPlayerId) return;

    try {
      const { data } = await client.query({
        query: GET_LOBBYID,
        variables: { playerId: parseInt(actionPlayerId, 10) },
      });

      if (data.getLobbyid === parseInt(lobbyId, 10)) {
        removePlayer({
          variables: { lobbyId: parseInt(lobbyId, 10), playerId: parseInt(actionPlayerId, 10) },
        }).then(() => {
          setActionPlayerId(null);
        });
      } else {
        alert('Player does not belong to this lobby.');
      }
    } catch (error) {
      console.error('Error removing player:', error);
    }
  };

  const handleAddPlayer = () => {
    if (!newPlayerToAdd.trim()) return;

    addPlayer({
      variables: { lobbyId: parseInt(lobbyId, 10), playerName: newPlayerToAdd },
    }).then(() => {
      setNewPlayerToAdd('');
      setIsAddingPlayer(false);
    });
  };

  const handleStartGame = async () => {
    if (!dataLobby || !dataLobby.getLobby) {
      console.error('Lobby data is not available');
      return;
    }
    const lobby = dataLobby.getLobby;

    let route;
    switch (lobby.game) {
      case 'Truth or Dare':
        route = `/play-tod?id=${lobbyId}`;
        break;
      case 'Superlative':
        route = `/play-superlative?id=${lobbyId}`;
        break;
      case 'Do or Drink':
        route = `/play-dod?id=${lobbyId}`;
        break;
      case 'Never Have I Ever':
        route = `/play-nhie?id=${lobbyId}`;
        break;
      default:
        console.error('Unknown game type');
        return;
    }

    navigate(route);
  };

  if (loadingLobby || loadingPlayers || loadingCreator) return <p>Loading...</p>;
  if (errorLobby) return <p>Error: {errorLobby.message}</p>;
  if (errorPlayers) return <p>Error: {errorPlayers.message}</p>;
  if (errorCreator) return <p>Error: {errorCreator.message}</p>;

  const lobby = dataLobby.getLobby;

  if (!isOpen) return null;

  return (
    isOpen && (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>
            &times;
          </span>
          <h2>{lobby.name}</h2>
          <h3>{lobby.game}</h3>
          <p>Category: {lobby.category}</p>
          <p>Level: {lobby.level}</p>
          <h3>Players</h3>
          <ul className="player-list">
            {players.map(player => (
              <li key={player.id} className="player-item">
                <span className="player-name">{player.name}</span>
                {player.id !== 'creator' && (
                  <div className="player-icons">
                    <span
                      className="icon"
                      onClick={() => {
                        setEditingPlayerId(player.id);
                        setNewPlayerName(player.name);
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </span>
                    <span
                      className="icon"
                      onClick={() => {
                        setActionPlayerId(player.id);
                        handleRemovePlayer();
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>
  
          {editingPlayerId && (
            <div className="edit-player"style={{ display: 'flex', alignItems: 'center'}}>
              <input
                type="text"
                className="edit-input"
                value={newPlayerName}
                onChange={e => setNewPlayerName(e.target.value)}
              />
              <span className="icon" onClick={handleEditPlayer}><FontAwesomeIcon icon={faCheck} /></span>
              <span className="icon" onClick={() => setEditingPlayerId(null)}><FontAwesomeIcon icon={faTimes} /></span>
            </div>
          )}
  
          {isAddingPlayer ? (
            <div className="add-player" style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="New player name"
                value={newPlayerToAdd}
                onChange={(e) => setNewPlayerToAdd(e.target.value)}
              />
              <span className="icon" onClick={handleAddPlayer}><FontAwesomeIcon icon={faCheck} /></span>
              <span className="icon" onClick={() => setIsAddingPlayer(false)}><FontAwesomeIcon icon={faTimes} /></span>
            </div>
          ) : (
            <button onClick={() => setIsAddingPlayer(true)}>Add Player(s)</button>
          )}
  
          <button className="start-game-button" onClick={handleStartGame}>Start Game</button>
        </div>
      </div>
    )
  );
};

LobbyDetails.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  lobbyId: PropTypes.number.isRequired,
};

export default LobbyDetails;
