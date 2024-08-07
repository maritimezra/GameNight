# GameNight

his is a web-based application designed for playing various party games games such as "Truth or Dare," "Superlative," and "Do or Drink." Users can create lobbies, add players, and enjoy a dynamic game experience. The application utilizes Django for the backend, GraphQL for the API, and React with Apollo Client for the frontend.

## Features

- **User Authentication and Authorization**
  - **JWT-based Authentication**: Secure login and signup functionality using JSON Web Tokens (JWT).

- **Lobby Management**
  - **Create Lobby**: Users can create a new lobby, specifying the category (Couples, Gamenight, Teens) and the level (Mild, Moderate, Wild) of the game.
  - **Rejoin Lobby**: Users can rejoin a lobby they previously created.
  - **Add Players**: Users can add players to the lobby by specifying their names or selecting a list of previously added players.
  - **Edit/Remove Players**: Users can edit players' names or remove players from the lobby.
  - **Edit/Remove Lobby**: Users can edit lobby details or delete the lobby.

- **Game Play**
  - **Game Selection**: On the homepage, users select a game from the options provided. The selected game determines the category and level options available when creating a new lobby.
  - **Lobby Creation**: The user creates a lobby defining the theme of the game in order to determine the qustions to be generated for the game.
  - **Player Lineup**: The creator adds players to the lobby and a random player lineup is generated to define the order in which players will take turns.
  - **Game Questions**: Players take turns and are prompted with questions or tasks from a large pool based on the game chosen.
  - **End Game**: The creator of the game has the option to end the game at any time.

## Technology Stack

- **Backend**
  - **Python (Django)**: Provides the core backend functionality, including user authentication, lobby management, and game logic.

- **API**
  - **GraphQL (Strawberry)**: Handles all data querying and mutations, offering a flexible and efficient API for the frontend to interact with.

- **Frontend**
  - **React**: Powers the user interface, ensuring a responsive and interactive user experience.
  - **Apollo Client**: Manages GraphQL queries and mutations, making it easy to interact with the backend API.
