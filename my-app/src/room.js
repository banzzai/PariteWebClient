//React
import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider, useQuery, useMutation } from '@apollo/react-hooks';

//Constants
import {GET_GAME} from './queries.js';
import * as CONSTANTS from './constants.js';

//Css
import './index.css';
import './table.css';

//Init
const client = new ApolloClient({
    uri: 'http://10.0.1.34:3000/graphql',
  });
//uri: 'http://10.0.1.37:3000/graphql',

export function GameRoom(props) {
  
  return (
  <html lang="en" >
    <head>
      <meta charset="UTF-8"></meta>
    </head>

    <body>
      <div className="game-lobby">
        <GameData gameId={props.gameId} userId={props.userId}/>
      </div>
    </body>
  </html>
  );
}

//<LobbyUsers users={data.lobby.users}/>
//<Games lobbyUsers={data.lobby.users} games={data.lobby.pariteGames}/>
function Table(props) {
  
  const { loading, error, data } = useQuery(GET_GAME, {variables: {pariteGameId: props.gameId}});
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (data.pariteGame &&
          <div className="game_table">
          <h1 className="white">🚀 {data.pariteGame.title} 🚀</h1>
            <div class="vue-container">
              <div class="table">
                <div class="card-place">
                  <div class="card figures-C values-V">
                    <h1>V</h1>
                    <div class="figures C"></div>
                    <h1>V</h1>
                  </div>
                  <div class="card figures-D values-5">
                    <h1>5</h1>
                    <div class="figures D"></div>
                    <h1>5</h1>
                  </div>
                  <div class="card figures-H values-D">
                    <h1>D</h1>
                    <div class="figures H"></div>
                    <h1>D</h1>
                  </div>
                  <div class="card figures-H values-K">
                    <h1>K</h1>
                    <div class="figures H"></div>
                    <h1>K</h1>
                  </div>
                  <div class="card figures-C values-5">
                    <h1>5</h1>
                    <div class="figures C"></div>
                    <h1>5</h1>
                  </div>
                </div>
              <div class="players">
                <TablePlayers players={data.pariteGame.players}/>
              </div>
            </div>
          </div>
        </div>
  );
}

export const TablePlayers = (props) => {
  return props.players.map((player, index) => (
    <div key={player.id} className="user">
      <TablePlayer position={index} player={player} gameSize={props.players.length}/>
    </div>
  ));
}

export const TableHand = (props) => {
  return props.cards.map((card, index) => (
    <TableCard key={index} card={card} />
  ));
}

//Replacing a card suit with its matching Css class letter (see table.css)
function CardSuitToCss(suit) {
  switch(suit) {
    case CONSTANTS.CLUBS_SUIT:
      return "C";
    case CONSTANTS.SPADES_SUIT:
        return "P";
    case CONSTANTS.DIAMONDS_SUIT:
        return "D";
    case CONSTANTS.HEARTS_SUIT:
        return "H";
  }
  return null;
}

export const TableCard = (props) => {
  return (
    <div class="card-hand figures-C values-V">
      <h1>{props.card.value}</h1>
      <div class={"figures " + CardSuitToCss(props.card.color)}></div>
    </div>
  );
}

function calculateLeftPercentPosition(position, count) {
  //alert("position="+position+", count="+count+", result="+position * (100 / (count + 1)));
  return position * (100 / (count + 1));
}

function TablePlayer(props) {
  let left = -1;
  let MaxGameSize = 16;
  let position = props.position + 1;
  let gameSize = props.gameSize <= MaxGameSize ? props.gameSize : MaxGameSize;
  let styleString = {};
  let colorString = [ '#FF7070', '#623F00', '#1E4993', '#004E00',
                      '#DE9A1B', '#620000', '#16B216', '#6991D5',
                      '#041B41', '#65E665', '#DE1B1B', '#FFCC70',
                      '#009400', '#06317B', '#BA7600', '#BA0000'];

  //Too many players, we stop at MaxGameSize
  if (position > gameSize) {
    return null;
  }
  //Left (last)
  else if (position == gameSize) {
    styleString = {left: '0px', top: '50%', transform: 'translatex(-50%) translatey(-50%)'};
  }
  //Right (middle)
  else if (position == Math.floor(gameSize/2)) {
    styleString = {right: '0px', top: '50%', transform: 'translatex(50%) translatey(-50%)'};
  }
  //Top
  else if (position <= Math.floor(gameSize/2)) {
    let countOnTop = Math.floor((gameSize - 2)/2);
    left = calculateLeftPercentPosition(position, countOnTop);
    styleString = {top: '0px', left: left+'%', transform: 'translatex(-50%) translatey(-50%)'};
  }
  //Bottom
  else {
    let countOnTop = Math.ceil((gameSize - 2)/2);
    left = calculateLeftPercentPosition(gameSize - position, countOnTop);
    styleString = {bottom: '0px', left: left+'%', transform: 'translatex(-50%) translatey(50%)'};
  }

  return (
    <div class="player " style={styleString}>
      <div class="bank">
        <div class="bank-value">70</div>
        <div class="jetons v-10"></div>
        <div class="jetons v-5"></div>
        <div class="jetons v-1"></div>
      </div>
      <div class="avatar" style={{backgroundColor: colorString[position-1]}}></div>
      <div class="card-place-hand">
        <TableHand cards={props.player.cards} />
      </div>
      <div class="name">{props.player.user.name}</div>
      <div class="mise">
        <div class="mise-value">
            20
        </div>
        <div class="jeton-10">
            <div class="jetons v-10" style={{top: -2 + 'px'}}></div>
            <div class="jetons v-10" style={{top: 3 + 'px'}}></div>
        </div>
        <div class="jeton-5"></div>
        <div class="jeton-1"></div>
      </div>
    </div>
  );
}

const Room = () => (
  <div className="game_table">
   <div class="vue-container">
      <div class="table">
         <div class="card-place">
            <div class="card figures-C values-V">
               <h1>V</h1>
               <div class="figures C"></div>
               <h1>V</h1>
            </div>
            <div class="card figures-D values-5">
               <h1>5</h1>
               <div class="figures D"></div>
               <h1>5</h1>
            </div>
            <div class="card figures-H values-D">
               <h1>D</h1>
               <div class="figures H"></div>
               <h1>D</h1>
            </div>
            <div class="card figures-H values-K">
               <h1>K</h1>
               <div class="figures H"></div>
               <h1>K</h1>
            </div>
            <div class="card figures-C values-5">
               <h1>5</h1>
               <div class="figures C"></div>
               <h1>5</h1>
            </div>
         </div>
         <div class="players">
            <div class="player player-1 playing">
               <div class="bank">
                  <div class="bank-value">23</div>
                  <div class="jetons v-10"></div>
                  <div class="jetons v-5"></div>
                  <div class="jetons v-1"></div>
               </div>
               <div class="avatar" style={{backgroundColor: 'dodgerblue'}}></div>
               <div class="name">rivy33</div>
               <div class="mise">
                  <div class="mise-value">
                     77
                  </div>
                  <div class="jeton-10">
                     <div class="jetons v-10" style={{top: -2 + 'px'}}></div>
                     <div class="jetons v-10" style={{top: 3 + 'px'}}></div>
                     <div class="jetons v-10" style={{top: 8 + 'px'}}></div>
                     <div class="jetons v-10" style={{top: 13 + 'px'}}></div>
                     <div class="jetons v-10" style={{top: 18 + 'px'}}></div>
                     <div class="jetons v-10" style={{top: 23 + 'px'}}></div>
                     <div class="jetons v-10" style={{top: 28 + 'px'}}></div>
                  </div>
                  <div class="jeton-5">
                     <div class="jetons v-5" style={{top: -2 + 'px'}}></div>
                     <div class="jetons v-5" style={{top: 3 + 'px'}}></div>
                     <div class="jetons v-5" style={{top: 8 + 'px'}}></div>
                  </div>
                  <div class="jeton-1">
                     <div class="jetons v-1"></div>
                  </div>
               </div>
            </div>
            <div class="player player-2">
               <div class="bank">
                  <div class="bank-value">80</div>
                  <div class="jetons v-10"></div>
                  <div class="jetons v-5"></div>
                  <div class="jetons v-1"></div>
               </div>
               <div class="avatar" style={{backgroundColor: 'cyan'}}></div>
               <div class="name">kattar</div>
               <div class="mise">
                  <div class="mise-value">
                     20
                  </div>
                  <div class="jeton-10">
                     <div class="jetons v-10" style={{top: -2 + 'px'}}></div>
                     <div class="jetons v-10" style={{top: 3 + 'px'}}></div>
                  </div>
                  <div class="jeton-5"></div>
                  <div class="jeton-1"></div>
               </div>
            </div>
            <div class="player player-3">
               <div class="bank">
                  <div class="bank-value">80</div>
                  <div class="jetons v-10"></div>
                  <div class="jetons v-5"></div>
                  <div class="jetons v-1"></div>
               </div>
               <div class="avatar" style={{backgroundColor: 'lightcoral'}}></div>
               <div class="name">mikelaire</div>
               <div class="mise">
                  <div class="mise-value">
                     20
                  </div>
                  <div class="jeton-10">
                     <div class="jetons v-10" style={{top: -2 + 'px'}}></div>
                     <div class="jetons v-10" style={{top: 3 + 'px'}}></div>
                  </div>
                  <div class="jeton-5"></div>
                  <div class="jeton-1"></div>
               </div>
            </div>
            <div class="player player-4">
               <div class="bank">
                  <div class="bank-value">80</div>
                  <div class="jetons v-10"></div>
                  <div class="jetons v-5"></div>
                  <div class="jetons v-1"></div>
               </div>
               <div class="avatar" style={{backgroundColor: 'crimson'}}></div>
               <div class="name">tomtom</div>
               <div class="mise">
                  <div class="mise-value">
                     20
                  </div>
                  <div class="jeton-10">
                     <div class="jetons v-10" style={{top: -2 + 'px'}}></div>
                     <div class="jetons v-10" style={{top: 3 + 'px'}}></div>
                  </div>
                  <div class="jeton-5"></div>
                  <div class="jeton-1"></div>
               </div>
            </div>
            <div class="player player-5">
               <div class="bank">
                  <div class="bank-value">80</div>
                  <div class="jetons v-10"></div>
                  <div class="jetons v-5"></div>
                  <div class="jetons v-1"></div>
               </div>
               <div class="avatar" style={{backgroundColor: 'rgb(68, 68, 68)'}}></div>
               <div class="name">nana</div>
               <div class="mise">
                  <div class="mise-value">
                     20
                  </div>
                  <div class="jeton-10">
                     <div class="jetons v-10" style={{top: -2 + 'px'}}></div>
                     <div class="jetons v-10" style={{top: 3 + 'px'}}></div>
                  </div>
                  <div class="jeton-5"></div>
                  <div class="jeton-1"></div>
               </div>
            </div>
            <div class="player player-6">
               <div class="bank">
                  <div class="bank-value">80</div>
                  <div class="jetons v-10"></div>
                  <div class="jetons v-5"></div>
                  <div class="jetons v-1"></div>
               </div>
               <div class="avatar" style={{backgroundColor: 'forestgreen'}}></div>
               <div class="name">ionion</div>
               <div class="mise">
                  <div class="mise-value">
                     20
                  </div>
                  <div class="jeton-10">
                     <div class="jetons v-10" style={{top: -2 + 'px'}}></div>
                     <div class="jetons v-10" style={{top: 3 + 'px'}}></div>
                  </div>
                  <div class="jeton-5"></div>
                  <div class="jeton-1"></div>
               </div>
            </div>
            <div class="player player-7">
               <div class="bank">
                  <div class="bank-value">80</div>
                  <div class="jetons v-10"></div>
                  <div class="jetons v-5"></div>
                  <div class="jetons v-1"></div>
               </div>
               <div class="avatar" style={{backgroundColor: 'goldenrod'}}></div>
               <div class="name">link6996</div>
               <div class="mise">
                  <div class="mise-value">
                     20
                  </div>
                  <div class="jeton-10">
                     <div class="jetons v-10" style={{top: -2 + 'px'}}></div>
                     <div class="jetons v-10" style={{top: 3 + 'px'}}></div>
                  </div>
                  <div class="jeton-5"></div>
                  <div class="jeton-1"></div>
               </div>
            </div>
            <div class="player player-8">
               <div class="bank">
                  <div class="bank-value">80</div>
                  <div class="jetons v-10"></div>
                  <div class="jetons v-5"></div>
                  <div class="jetons v-1"></div>
               </div>
               <div class="avatar" style={{backgroundColor: 'gold'}}></div>
               <div class="name">gossboganon</div>
               <div class="mise">
                  <div class="mise-value">
                     20
                  </div>
                  <div class="jeton-10">
                     <div class="jetons v-10" style={{top: -2 + 'px'}}></div>
                     <div class="jetons v-10" style={{top: 3 + 'px'}}></div>
                  </div>
                  <div class="jeton-5"></div>
                  <div class="jeton-1"></div>
               </div>
            </div>
         </div>
      </div>
      <button class="bouton">Refresh!</button>
   </div>
</div>
);

// ========================================
const GameData = (props) => (
  <ApolloProvider client={client}>
    <div>
      <Table gameId={props.gameId}/>
      <div className="game-info">
        <div>{/* status */}</div>
        <ol>Copyright 2020 - Tagoole</ol>
      </div>
    </div>
  </ApolloProvider>
);

//render(<App />, document.getElementById('root'));