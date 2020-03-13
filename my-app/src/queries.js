import gql from 'graphql-tag';

//https://codepen.io/Rovak/pen/ExYeQar

export const GET_GAME = gql`
  query PariteGame($pariteGameId: ID!) {
    pariteGame(pariteGameId: $pariteGameId) {
      id
      title
      players {
        id,
        user {
          name
        },
        ready,
        cards {
          color,
          value
        }
      }
    }
  }
`;

export const GET_LOBBY = gql`
  {
    lobby {
      title
      users {
        id
        name
      }
      pariteGames {
        id
        title
        cards {
            id
            color
            value
          }
        players {
          id
          pariteGame {
            id
          }
          ready
          user {
            name
          }
          cards {
            id
            color
            value
            faceUp
          }
        }
      }
    }
  }
`;

export const DRAW_FOR_USER = gql`
  mutation playerDraw($playerId: ID!, $pariteGameId: ID!) {
    playerDraw(input: {
                        playerId: $playerId
                        pariteGameId: $pariteGameId
                        }) {
    pariteGame {
        id
        title
        cards {
            id
            color
            value
          }
        players {
          id
          ready
          user {
            name
          }
          cards {
            id
            color
            value
          }
        }
      }
    }
  }
`;  

export const CREATE_USER = gql`
  mutation CreateUser($name: String!) {
    createUser(input: { name: $name }) {
      user { 
        id
        name
      }
    }
  }
`;

//LOBBY ID IS HARD CODED HERE
export const CREATE_PARITE_GAME = gql`
  mutation CreatePariteGame($title: String!) {
    createPariteGame(input: {
                        title: $title
                        lobbyId: 1
                        }) {
    pariteGame {
      id
      title
      lobby {
        id
        title
      }
    }
  }
 }
 `;

export const JOIN_PARITE_GAME = gql`
  mutation JoinPariteGame($userId: ID!, $pariteGameId: ID!) {
    joinPariteGame(input: {
                        userId: $userId
                        pariteGameId: $pariteGameId
                        }) {
    pariteGame {
      id
      title
      lobby {
        id
        title
      }
    }
  }
 }
 `;