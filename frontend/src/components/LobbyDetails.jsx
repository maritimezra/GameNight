import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, gql, useApolloClient } from '@apollo/client';
import PropTypes from 'prop-types';
import '../styles/LobbyDetails.css';

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
    variables: { lobbyId: parseInt(lobbyId) },
  });

  const { loading: loadingPlayers, error: errorPlayers, data: dataPlayers } = useQuery(GET_PLAYERS, {
    variables: { lobbyId: parseInt(lobbyId) },
  });

  const { loading: loadingCreator, error: errorCreator, data: dataCreator } = useQuery(GET_CREATOR, {
    variables: { lobbyId: parseInt(lobbyId) },
  });

  const [players, setPlayers] = useState([]);
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerToAdd, setNewPlayerToAdd] = useState('');
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);

  const [editPlayer] = useMutation(EDIT_PLAYER, {
    refetchQueries: [{ query: GET_PLAYERS, variables: { lobbyId: parseInt(lobbyId) } }],
  });

  const [removePlayer] = useMutation(REMOVE_PLAYER, {
    refetchQueries: [{ query: GET_PLAYERS, variables: { lobbyId: parseInt(lobbyId) } }],
  });

  const [addPlayer] = useMutation(ADD_PLAYER, {
    refetchQueries: [{ query: GET_PLAYERS, variables: { lobbyId: parseInt(lobbyId) } }],
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
      variables: { playerId: parseInt(editingPlayerId), newName: newPlayerName },
    }).then(() => {
      setEditingPlayerId(null);
      setNewPlayerName('');
    });
  };

  const handleRemovePlayer = async () => {
    if (!selectedPlayerId) return;

    try {
      const { data } = await client.query({
        query: GET_LOBBYID,
        variables: { playerId: parseInt(selectedPlayerId) },
      });

      if (data.getLobbyid === parseInt(lobbyId)) {
        removePlayer({
          variables: { lobbyId: parseInt(lobbyId), playerId: parseInt(selectedPlayerId) },
        }).then(() => {
          setSelectedPlayerId(null);
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
      variables: { lobbyId: parseInt(lobbyId), playerName: newPlayerToAdd },
    }).then(() => {
      setNewPlayerToAdd('');
      setIsAddingPlayer(false);
    });
  };

  const handleActionChange = (event) => {
    const action = event.target.value;
    if (action === 'edit') {
      const player = players.find(player => player.id === selectedPlayerId);
      if (player) {
        setEditingPlayerId(player.id);
        setNewPlayerName(player.name);
      }
    } else if (action === 'remove') {
      handleRemovePlayer();
    }
  }

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
    <div className="modal">
      <div className="modal-content">
      <span className="close" onClick={onClose}>&times;</span>
        <h2>{lobby.name}</h2>
        <h3>{lobby.game}</h3>
        <p>Level: {lobby.level}</p>
        <p>Category: {lobby.category}</p>
        <h3>Players</h3>
        <div style={{ marginBottom: '10px' }}>
          <select value="" onChange={handleActionChange}>
            <option value="">Action...</option>
            <option value="edit">Edit</option>
            <option value="remove">Remove</option>
          </select>
        </div>
        <ul>
          {players.map((player) => (
            <div key={player.id} style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={selectedPlayerId === player.id}
                onChange={() => setSelectedPlayerId(player.id)}
              />
              {editingPlayerId === player.id ? (
                <>
                  <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                  />
                  <button onClick={handleEditPlayer}>Save</button>
                  <button onClick={() => setEditingPlayerId(null)}>Cancel</button>
                </>
              ) : (
                <span>{player.name}</span>
              )}
            </div>
          ))}
        </ul>
        {isAddingPlayer ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="New player name"
              value={newPlayerToAdd}
              onChange={(e) => setNewPlayerToAdd(e.target.value)}
            />
            <button onClick={handleAddPlayer}>Done</button>
          </div>
        ) : (
          <button onClick={() => setIsAddingPlayer(true)}>Add Players</button>
        )}
        <button onClick={handleStartGame}>Start Game</button>
      </div>
    </div>
  );
};

LobbyDetails.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  lobbyId: PropTypes.number.isRequired,
};

export default LobbyDetails;
