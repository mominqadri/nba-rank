import React from "react";
import "./App.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { players: [], isLoading: false };
  }

  fetchPlayers() {
    this.setState({ isLoading: true }, () => {
      fetch("https://nba-rank.herokuapp.com/players")
        .then(res => res.json())
        .then(res => {
          console.log("hello");
          console.log(res);
          this.setState({ players: res.players });
        });
    });
  }

  componentDidMount() {
    this.fetchPlayers();
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
