//React
import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { render } from 'react-dom';
import { ApolloProvider, useQuery, useMutation } from '@apollo/react-hooks';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
} from "react-router-dom";

//Constants
import {GET_LOBBY, DRAW_FOR_USER, JOIN_PARITE_GAME} from './queries.js';
import * as CONSTANTS from './constants.js';

//Components
import {LobbyUsers, UserTypeBox, User} from './admin_components.js';

//Game Room
import {GameRoom} from './room.js';

//Css
import './index.css';

//Init
const client = new ApolloClient({
    uri: 'http://10.0.1.34:3000/graphql',
  });
//uri: 'http://10.0.1.37:3000/graphql',

const LobbyUsersSelect = React.forwardRef((props, ref) => {
  return (
    <select ref={ref} className="user_select">
      {props.users.map(({ id, name }) => (
        <option key={id} value={id}>{name}</option>
      ))}
    </select>
  );
})

function Games(props) {
  return props.games.map((game) => (
    <div key={game.id} className="all_games">
      <Game lobbyUsers={props.lobbyUsers} game={game} />
    </div>
  ));
}

function Players(props) {
  return props.players.map((player) => (
    <div key={player.name} className="all_players">
      <Player player={player}/>
    </div>
  ));
}

function Deck(props) {
  return (
    <div className="parite_deck">
      <div className="parite_card_down">🎴</div><div className="parite_card">{props.cards.length}</div>
    </div>
  )
}

function Hand(props) {
  return (
    <div className="parite_hand">
    {props.cards.map((card) => (
      <Card card={card} />
    ))}
    </div>
  )
}

function Card(props) {
  function getValue(value) {
    switch (value) {
      case 1:
        return "A";
      case 11:
        return "J";
      case 12:
        return "Q";
      case 13:
        return "K";
      case 0:
        return "?";
    }

    return value;
  }
  
  function getDescription(suitName, value, faceUp) {
    if (!faceUp) return (
      <div className="parite_card_down">🎴</div>
    )

    switch (suitName) {
      case CONSTANTS.CLUBS_SUIT:
        return (
          <div className="parite_card">
            {getValue(value)+"♣️"}
          </div>
        );
      case CONSTANTS.SPADES_SUIT:
        return (
          <div className="parite_card">
            {getValue(value)+"♠️"}
          </div>
        );
      case CONSTANTS.DIAMONDS_SUIT:       
        return (
          <div className="parite_card red">
            {getValue(value)+"♦️"}
          </div>
        );
      case CONSTANTS.HEARTS_SUIT: 
        return (
          <div className="parite_card red">
            {getValue(value)+"♥️"}
          </div>
        );      
      case CONSTANTS.JOKER:
        return (
          <div className="parite_card">
            {"?🃏"}
          </div>
        );    
    }

    //default
    return (
      <div className="parite_card">
        {"🥺("+suitName+":"+value+")"}
      </div>
    );
  }
  
  return getDescription(props.card.color, props.card.value, props.card.faceUp);
}

function LobbyData() {
  const { loading, error, data } = useQuery(GET_LOBBY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (data.lobby && <div>
            <h1>🚀Lobby: {data.lobby.title}</h1>
            <h2>Players: </h2>
            <div className="player-list">
              <LobbyUsers users={data.lobby.users}/>
            </div>
            <h2>Games: </h2>
            <div className="game-list">
              <Games lobbyUsers={data.lobby.users} games={data.lobby.pariteGames}/>
            </div>
          </div>
  );
}

class Lobby extends React.Component {
  
	componentDidMount() {
		/*fetch("http://10.0.1.37:3000/welcome/show.json")
		.then(res => 
			alert('Lobby ' + res.json())
			);*/
	}

	render() {
		return (
			<div className="game-lobby">
				<LobbyData />
			</div>
		);
	}
}

class Game extends React.Component {

  render() {
	    return (
	      <div>
		      <div className="game">
            <fieldset>
              <legend>{this.props.game.id} 🃏 {this.props.game.title}<DisplayGame gameId={this.props.game.id} /></legend>
              <JoinGameComponent lobbyUsers={this.props.lobbyUsers} gameId={this.props.game.id}/>
              <Players players={this.props.game.players} />
              <Deck cards={this.props.game.cards}/>
            </fieldset>
		      </div>
		    </div>
	    );
	  }
}

class DisplayGame extends React.Component {
  render() {
    return (
      <div className="block pad_left">
        <form action={"/room/" + this.props.gameId +"/13"}>
          <input type="submit" value="Display" />
        </form>
      </div>
    );
  }
}

class Player extends React.Component {

    getAvatar() {
      switch (Math.floor(Math.random() * 11)) {
        case 0:       
          return "💖";
        case 1:       
          return "👽";
        case 2:       
          return "🐱";
        case 3:       
          return "🐶";
        case 4:       
          return "💩";
        case 5:       
          return "💀";
        case 6:       
          return "🙉";
        case 7:       
          return "💣";
        case 8:       
          return "🐷";
        case 9:       
          return "🎅";
        case 10:       
          return "💔";
      }
    }

    render() {
      return (
	      <div className="player">
		      {this.props.player.ready?"✅":"❌"} {this.props.player.user.name} {this.getAvatar()}
          <Hand cards={this.props.player.cards} />
          <div className="draw_button">
            <DrawButton playerId={this.props.player.id} gameId={this.props.player.pariteGame.id}/>
          </div>
        </div>
	    );
	  }
}

class Cardo extends React.Component {

  render() {
    return (
      <div className="Square">
      {this.props.num}
      </div>
    );
  }
}

class ResetButton extends React.Component {
  
  render() {
    return (
      <div className="refresh_button">
        <button onClick={e => window.location.reload(false)}>Refresh</button>
      </div>
    );
  }
}

class Square extends React.Component {
  
  render() {
    return (
      <div className="Square">
      </div>
    );
  }
}

class Board extends React.Component {
  renderPlayer(name) {
    return (
    	<User name={name} cards={[]}>
    	</User>
    );
  }

  renderSquare(i) {
    return <Square />;
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        {this.renderPlayer('Ominous', 3)}
        {this.renderPlayer('Bazoo', 3)}
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

function DrawButton(props) {
  let input;
  const [playerDraw, { loading, error, data }] = useMutation(DRAW_FOR_USER);
  
  const onButtonClick = (e) => {
    playerDraw({ variables: { playerId: props.playerId, pariteGameId: props.gameId} });
    window.location.reload(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  
  return (
    <button onClick={onButtonClick}>Draw</button>
  );
}

function JoinGameComponent(props) {
  let input;
  const [joinGame, { loading, error, data }] = useMutation(JOIN_PARITE_GAME);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className="join_game">
      <form
        onSubmit={e => {
          e.preventDefault();
          joinGame({ variables: { userId: input.value, pariteGameId: props.gameId} });
          input.value = '';
          window.location.reload(false);
        }}
      >
        Join with user: 
        <LobbyUsersSelect 
          ref={node => {
            input = node;
          }}
          users={props.lobbyUsers}/>

        <button type="submit">Join</button>
      </form>
    </div>
  );
}

// ========================================
const App = () => (
  <ApolloProvider client={client}>
    <div>
    <Router>
      <Switch>
          <Route exact path="/">
            <AdminLobby />
          </Route>
          <Route path="/room/:gameid/:userid" children={<GameRoomWithParams />}>
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
        </Switch>
    </Router>
    </div>
  </ApolloProvider>
);

function AdminLobby() {
  return (
    <div>
      <Lobby />
      <UserTypeBox />
      <ResetButton />
      
      <div className="game-info">
        <div>{/* status */}</div>
        <ol>Copyright 2020 - Tagoole</ol>
      </div>
    </div>
  );
}

function GameRoomWithParams() {
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.
  let { gameid, userid } = useParams();

  return (
    <GameRoom gameId={gameid} userId={userid} />
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}

render(<App />, document.getElementById('root'));