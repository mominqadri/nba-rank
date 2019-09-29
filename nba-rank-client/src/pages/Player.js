import React from "react";
import { debounce } from "lodash";
import { Col, Row } from "react-bootstrap";
import { Player as PlayerComponent } from "../components/Player";

export class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      player: {},
      error: false,
      isLoading: true
    };
  }

  fetchPlayer() {
    this.setState({ isLoading: true }, () => {
      const { id } = this.props.match.params;
      fetch(`https://nba-rank.herokuapp.com/players/${id}`)
        .then(res => res.json())
        .then(res => {
          this.setState({
            player: res,
            isLoading: false
          });
        });
    });
  }

  componentDidMount() {
    this.fetchPlayer();
  }

  render() {
    let {
      id,
      first_name,
      last_name,
      headshot,
      num_mentions,
      sentiment_score,
      polarity_score,
      mentions
    } = this.state.player;
    console.log(mentions);
    if (this.state.isLoading) {
      return <h1>Loading...</h1>;
    }
    return (
      <div>
        <PlayerComponent
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
        <h1>Top Mentions</h1>
        <Row>
          <Col md={12}>
            {mentions
              .sort(
                (a, b) =>
                  Math.abs(b.sentiment) * (1.01 ^ Math.abs(b.upvotes)) -
                  Math.abs(a.sentiment) * (1.01 ^ Math.abs(a.upvotes))
              )
              .slice(0, 5)
              .map(({ sentence, sentiment, upvotes }, index) => {
                return (
                  <div className="mention" key={index}>
                    <span className="mention-scores">
                      <span> {upvotes} upvotes</span>
                      <span
                        style={{
                          color: sentiment < 0 ? "red" : "green",
                          marginLeft: "20px"
                        }}
                      >
                        {(sentiment * 100).toFixed(1)}
                        <span style={{ fontSize: "1.2rem" }}>ss</span>
                      </span>
                    </span>
                    <br></br>
                    <span className="mention-quote">
                      "...{sentence.substr(0, 200)}..."
                    </span>
                  </div>
                );
              })}
          </Col>
        </Row>
        <Col md={12}>
          <hr></hr>
        </Col>
        <h1>Most Negative Mentions</h1>
        <Row>
          <Col md={12}>
            {mentions
              .sort((a, b) => a.sentiment - b.sentiment)
              .slice(0, 5)
              .map(({ sentence, sentiment, upvotes }, index) => {
                return (
                  <div className="mention" key={index}>
                    <span className="mention-scores">
                      <span> {upvotes} upvotes</span>
                      <span
                        style={{
                          color: sentiment < 0 ? "red" : "green",
                          marginLeft: "20px"
                        }}
                      >
                        {(sentiment * 100).toFixed(1)}
                        <span style={{ fontSize: "1.2rem" }}>ss</span>
                      </span>
                    </span>
                    <br></br>
                    <span className="mention-quote">
                      "...{sentence.substr(0, 200)}..."
                    </span>
                  </div>
                );
              })}
          </Col>
        </Row>
      </div>
    );
  }
}
