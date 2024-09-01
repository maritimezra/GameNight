import { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import PropTypes from 'prop-types';
import '../styles/Modals.css';

const CREATE_LOBBY = gql`
  mutation CreateLobby($name: String!, $level: String!, $category: String!, $game: String!) {
    createLobby(name: $name, level: $level, category: $category, game: $game) {
      createdAt
      name
      id
      level
      category
      game
      creator {
        id
        email
        username
      }
    }
  }
`;

const EDIT_LOBBY = gql`
  mutation EditLobby($lobbyId: Int!, $newName: String!, $newCategory: String!, $newLevel: String!) {
    editLobby(lobbyId: $lobbyId, newName: $newName, newCategory: $newCategory, newLevel: $newLevel)
  }
`;

const levels = ["Mild", "Moderate", "Wild"];
const categories = ["Party", "Couples", "Teens", "Work"];

const CreateLobby = ({ isOpen, onClose, onLobbyCreated, selectedGame, lobbyData, refetchLobbies }) => {
  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [category, setCategory] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [createLobby] = useMutation(CREATE_LOBBY);
  const [editLobby] = useMutation(EDIT_LOBBY);

  useEffect(() => {
    if (lobbyData) {
      setName(lobbyData.name);
      setLevel(lobbyData.level);
      setCategory(lobbyData.category);
      setIsEditMode(true);
    } else {
      setName('');
      setLevel('');
      setCategory('');
      setIsEditMode(false);
    }
  }, [lobbyData]);

  const handleSave = async () => {
    setErrorMessage(''); // Reset the error message

    if (!name || !level || !category) {
      setErrorMessage('All fields are required.');
      return;
    }

    try {
      const variables = { name, level, category, game: selectedGame };
      let lobbyId;

      if (isEditMode) {
        await editLobby({
          variables: {
            lobbyId: parseInt(lobbyData.id, 10),
            newName: name,
            newCategory: category,
            newLevel: level
          }
        });
        lobbyId = parseInt(lobbyData.id, 10);
      } else {
        const { data } = await createLobby({ variables });
        lobbyId = data.createLobby.id;
      }

      onClose();
      refetchLobbies();
      onLobbyCreated(lobbyId);
    } catch (error) {
      console.error('Error saving lobby:', error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{isEditMode ? 'Edit Lobby' : 'Create Lobby'}</h2>
        
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">Select Level</option>
          {levels.map((lvl, index) => (
            <option key={index} value={lvl}>{lvl}</option>
          ))}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button className="create-lobby" onClick={handleSave}>
          {isEditMode ? 'Save Changes' : 'Create Lobby'}
        </button>
        <h4>{selectedGame}</h4>
      </div>
    </div>
  );
};

CreateLobby.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onLobbyCreated: PropTypes.func.isRequired,
  selectedGame: PropTypes.string.isRequired,
  lobbyData: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    level: PropTypes.string,
    category: PropTypes.string
  }),
  refetchLobbies: PropTypes.func.isRequired
};

export default CreateLobby;
