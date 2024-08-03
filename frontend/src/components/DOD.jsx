import { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import CreateLobby from './CreateLobby';
import LobbyDetails from './LobbyDetails';
import '../styles/GameHome.css'

const GET_LOBBIES = gql`
  query GetDodLobbies {
    getDodLobbies {
      id
      name
      level
      category
    }
  }
`;

const GET_USERNAME = gql`
  query GetUsername {
    getUsername {
      username
    }
  }
`;

const DODHome = () => {


  const location = useLocation();
  const [isCreateLobbyOpen, setCreateLobbyOpen] = useState(false);
  const [isLobbyDetailsOpen, setLobbyDetailsOpen] = useState(false);
  const [selectedLobbyId, setSelectedLobbyId] = useState(null);
  const [selectedGame, setSelectedGame] = useState('');

  const { loading: usernameLoading, error: usernameError, data: usernameData } = useQuery(GET_USERNAME, {
    fetchPolicy: 'network-only'
  });
  const { loading, error, data, refetch } = useQuery(GET_LOBBIES, {
    fetchPolicy: 'network-only'
  });

  const handleCreateNew = () => {
    setCreateLobbyOpen(true);
  };

  const closeCreateLobby = () => {
    setCreateLobbyOpen(false);
  };

  const handleLobbyClick = (lobbyId) => {
    setSelectedLobbyId(parseInt(lobbyId));
    setLobbyDetailsOpen(true);
  };

  const closeLobbyDetails = () => {
    setLobbyDetailsOpen(false);
    setSelectedLobbyId(null);
  };

  const handleLobbyCreated = (lobbyId) => {
    setSelectedLobbyId(lobbyId);
    setLobbyDetailsOpen(true);
  };

  useEffect(() => {
    refetch();
    if (location.state && location.state.selectedGame) {
      setSelectedGame(location.state.selectedGame);
    }
  }, [location.key, refetch, location.state]);

  if (loading || usernameLoading) return <p>Loading...</p>;
  if (error || usernameError) return <p>{error ? error.message : usernameError.message}</p>;

  const lobbies = data.getDodLobbies;
  const username = usernameData?.getUsername?.username;


  return (
    <div className="home">
      <div className="area">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>

      <div className="username">
        <h2><span className="scribble-underline">Hi, {username}</span></h2>
      </div>
      <div className="lobbies">
        <h2>Your Lobbies</h2>
        <div className="lobbylist">
        <ul>
          {lobbies.map((lobby) => (
            <ul key={lobby.id} onClick={() => handleLobbyClick(lobby.id)} style={{ cursor: 'pointer' }}>
              <h3>{lobby.name}</h3>
            </ul>
          ))}
        </ul>
        </div>
        <div className="createnew">
         <button onClick={handleCreateNew}>Create New</button>
        </div>
      </div>
      <CreateLobby
        isOpen={isCreateLobbyOpen}
        onClose={closeCreateLobby}
        onLobbyCreated={handleLobbyCreated}
        selectedGame={selectedGame}
      />
      {selectedLobbyId && (
        <LobbyDetails
          isOpen={isLobbyDetailsOpen}
          onClose={closeLobbyDetails}
          lobbyId={selectedLobbyId ? parseInt(selectedLobbyId) : null}
        />
      )}
    </div>
  );
};

export default DODHome;
