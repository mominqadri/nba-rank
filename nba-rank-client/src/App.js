import React from "react";
import logo from "./logo.svg";
import "./App.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { players: [] };
  }

  componentDidMount() {
    fetch("https://nba-rank.herokuapp.com/players")
      .then(res => res.json())
      .then(res => {
        this.setState({ players: this.state.players.append(res.players) });
      });
  }

  render() {
    const { players } = this.state;
    return (
      <ol>
        {players.map(({ id, first_name, last_name }) => {
          return (
            <ul key={id}>
              <h1>{{ first_name }}</h1>
            </ul>
          );
        })}
      </ol>
    );
  }
}
