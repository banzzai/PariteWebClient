import React, { Component } from 'react';
import { ApolloProvider, useQuery, useMutation } from '@apollo/react-hooks';

import {CREATE_USER, CREATE_PARITE_GAME} from './queries.js';

export const LobbyUsers = (props) => {
    return props.users.map(({ id, name }) => (
      <div key={id} className="user">
        <User id={id} name={name}/>
      </div>
    ));
  }

export class User extends React.Component {

    render() {
	    return (
	      <div>
		      <div className="user">
		      {this.props.id} : {this.props.name}
		      </div>
		    </div>
	    );
	  }
}
  
export class UserTypeBox extends React.Component {
    constructor(props) {
      super(props);
      this.createStuffBox = React.createRef();
    }
  
    render() {
      
      const onRadioChange = (e) => {
        this.createStuffBox.current.style.display = e.currentTarget.value == "User" ? "block" : "none";
      };
  
      return (
        <div className="user_type_box">
          <fieldset>
            <legend>Admin</legend>
            <input type="radio" name="user_type" value="Admin" onChange={onRadioChange} />Admin
            <input type="radio" name="user_type" value="Host" onChange={onRadioChange} />Host
            <input type="radio" name="user_type" value="User" defaultChecked onChange={onRadioChange} />User<br/>
            <div ref={this.createStuffBox} id="create_box">
              <CreateUserComponent />
              <CreateGameComponent />
            </div>
          </fieldset>
        </div>
      );
    }
}


function CreateUserComponent() {
    let input;
    const [createUser, { loading, error, data }] = useMutation(CREATE_USER);
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
  
    return (
      <div className="create_user">
        <form
          onSubmit={e => {
            e.preventDefault();
            createUser({ variables: { name: input.value } });
            input.value = '';
            window.location.reload(false);
          }}
        >
          Create a user: <br/>
          <input placeholder="Type a username"
            ref={node => {
              input = node;
            }}
          />
          <button type="submit">Yass</button>
        </form>
      </div>
    );
  }
  
  function CreateGameComponent() {
    let input;
    const [createUser, { loading, error, data }] = useMutation(CREATE_PARITE_GAME);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
  
    return (
      <div className="create_game">
        <form
          onSubmit={e => {
            e.preventDefault();
            createUser({ variables: { title: input.value } });
            input.value = '';
            window.location.reload(false);
          }}
        >
          Create a game room title: <br/>
          <input placeholder="Type a title"
            ref={node => {
              input = node;
            }}
          />
          <button type="submit">Create</button>
        </form>
      </div>
    );
  }