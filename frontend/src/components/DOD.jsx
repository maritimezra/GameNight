import { useEffect, useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import CreateLobby from './CreateLobby';
import LobbyDetails from './LobbyDetails';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import Lottie from 'react-lottie';
import loaderData from '../animations/Loader.json';
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

const DELETE_LOBBY = gql`
  mutation DeleteLobby($lobbyId: Int!) {
    deleteLobby(lobbyId: $lobbyId)
  }
`;

const DODHome = () => {
  const location = useLocation();
  const [isCreateLobbyOpen, setCreateLobbyOpen] = useState(false);
  const [isLobbyDetailsOpen, setLobbyDetailsOpen] = useState(false);
  const [selectedLobbyId, setSelectedLobbyId] = useState(null);
  const [selectedGame, setSelectedGame] = useState('');
  const [editLobbyData, setEditLobbyData] = useState(null);

  const { loading, error, data, refetch } = useQuery(GET_LOBBIES, {
    fetchPolicy: 'network-only'
  });

  const [deleteLobby] = useMutation(DELETE_LOBBY, {
    onCompleted: () => refetch(),
    onError: (err) => console.error(err)
  });

  const handleCreateNew = () => {
    setCreateLobbyOpen(true);
    setEditLobbyData(null);
  };

  const handleEditLobby = (lobby) => {
    setEditLobbyData({
      ...lobby,
      id: parseInt(lobby.id, 10)
    });
    setCreateLobbyOpen(true);
  };

  const closeCreateLobby = () => {
    setCreateLobbyOpen(false);
    setEditLobbyData(null);
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

  const handleDeleteLobby = (lobbyId) => {
    const id = parseInt(lobbyId, 10);  
    deleteLobby({ variables: { lobbyId: id } })
      .catch((error) => console.error("Deletion error:", error));
  };

  useEffect(() => {
    refetch();
    if (location.state && location.state.selectedGame) {
      setSelectedGame(location.state.selectedGame);
    }
  }, [location.key, refetch, location.state]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loaderData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  if (loading) {
    return (
      <div className="loader">
        <Lottie options={defaultOptions} height={100} width={100} />
      </div>
    );
  }
  
  if (error) return <p>{error.message}</p>;

  const lobbies = data.getDodLobbies;

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
        <h2><span className="scribble-underline">Do or Drink</span></h2>
      </div>
      <div className="lobbies">
        <h2>Your Lobbies</h2>
        <div className="lobbylist">
        <ul>
            {lobbies.map((lobby) => (
              <ul key={lobby.id} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="lobby-name" onClick={() => handleLobbyClick(lobby.id)}>{lobby.name}</span>
              <div>
                <FontAwesomeIcon className="iconC"
                  icon={faEdit}
                  onClick={() => handleEditLobby(lobby)}
                  style={{ cursor: 'pointer', color: 'blue', marginRight: '10px' }}
                />
                <FontAwesomeIcon className="iconX"
                  icon={faTrash}
                  onClick={() => handleDeleteLobby(lobby.id)}
                  style={{ cursor: 'pointer', color: 'red' }}
                />   
              </div>
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
        lobbyData={editLobbyData}
        refetchLobbies={refetch} 
      />
      {selectedLobbyId && (
        <LobbyDetails
          isOpen={isLobbyDetailsOpen}
          onClose={closeLobbyDetails}
          lobbyId={selectedLobbyId ? selectedLobbyId.toString() : null}
        />
      )}
    </div>
  );
};

export default DODHome;
