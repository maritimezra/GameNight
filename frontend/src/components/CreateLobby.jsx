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
  const [createLobby] = useMutation(CREATE_LOBBY);
  const [editLobby] = useMutation(EDIT_LOBBY);

  // Initialize fields if editing
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
    try {
      if (isEditMode) {
        await editLobby({
          variables: { 
            lobbyId: parseInt(lobbyData.id, 10), // Ensure id is an integer
            newName: name, 
            newCategory: category, 
            newLevel: level 
          }
        });
      } else {
        const { data } = await createLobby({
          variables: { name, level, category, game: selectedGame }
        });
        console.log('Lobby created:', data.createLobby);
        const lobbyId = data.createLobby.id;
        onLobbyCreated(lobbyId);
      }
      onClose();
      refetchLobbies(); // Call refetch function to update the lobby list
    } catch (error) {
      console.error('Error saving lobby:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>{isEditMode ? 'Edit Lobby' : 'Create Lobby'}</h2>
        <h3>{selectedGame}</h3>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">Select Level</option>
          {levels.map((level, index) => (
            <option key={index} value={level}>{level}</option>
          ))}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
        <button onClick={handleSave}>
          {isEditMode ? 'Save Changes' : 'Create Lobby'}
        </button>
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
    id: PropTypes.number, // Ensure id is a number
    name: PropTypes.string,
    level: PropTypes.string,
    category: PropTypes.string
  }),
  refetchLobbies: PropTypes.func.isRequired // Add prop type for refetch function
};

export default CreateLobby;
