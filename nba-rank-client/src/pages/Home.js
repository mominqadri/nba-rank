import React from "react";
import { debounce } from "lodash";
import { Col } from "react-bootstrap";
import { Player } from "../components/Player";

export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      error: false,
      isLoading: false,
      max: false,
      limit: 20,
      offset: 0
    };
    window.onscroll = debounce(() => {
      const {
        state: { error, isLoading, max }
      } = this;
      if (error || isLoading || max) return;
      else if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        this.incrementPage();
      }
    }, 100);
  }

  incrementPage() {
    this.setState({
      offset: this.state.offset + 1
    });
    this.fetchPlayers();
  }

  fetchPlayers() {
    this.setState({ isLoading: true }, () => {
      fetch(
        `https://nba-rank.herokuapp.com/players?offset=${this.state.offset}`
      )
        .then(res => res.json())
        .then(res => {
          console.log("hello");
          console.log(res);
          this.setState({
            players: [...this.state.players, ...res.players],
            isLoading: false
          });
        });
    });
  }

  componentDidMount() {
    this.fetchPlayers();
  }

  render() {
    const { players } = this.state;
    return players.map(
      ({
        id,
        first_name,
        last_name,
        headshot,
        num_mentions,
        sentiment_score,
        polarity_score
      }) => {
        return (
          <div>
            <Player
              id={id}
              firstName={first_name}
              lastName={last_name}
              headshot={headshot}
              numMentions={num_mentions}
              sentimentScore={sentiment_score}
              polarityScore={polarity_score}
            />
            <Col md={12}>
              <hr />
            </Col>
          </div>
        );
      }
    );
  }
}
