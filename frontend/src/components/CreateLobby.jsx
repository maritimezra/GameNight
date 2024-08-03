import { useState } from 'react';
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

const levels = ["Mild", "Moderate", "Wild"];
const categories = ["Party", "Couples", "Teens", "Work"];

const CreateLobby = ({ isOpen, onClose, onLobbyCreated, selectedGame }) => {
  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [category, setCategory] = useState('');
  const [createLobby] = useMutation(CREATE_LOBBY);

  const handleCreateLobby = async () => {
    try {
      const { data } = await createLobby({
        variables: { name, level, category, game: selectedGame }
      });
      console.log('Lobby created:', data.createLobby);
      const lobbyId = data.createLobby.id;
      onLobbyCreated(lobbyId);
      onClose();
    } catch (error) {
      console.error('Error creating lobby:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Create Lobby</h2>
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
        <button onClick={handleCreateLobby}>Create Lobby</button>
      </div>
    </div>
  );
};

CreateLobby.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onLobbyCreated: PropTypes.func.isRequired,
  selectedGame: PropTypes.string.isRequired,
};

export default CreateLobby;
