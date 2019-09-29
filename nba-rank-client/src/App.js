import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./App.css";
import { Container, Row } from "react-bootstrap";
import { Home } from "./pages/Home";
import { Player } from "./pages/Player";

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <Container>
          <Row>
            <h1 className="header">
              <img
                className="logo"
                alt="logo"
                src="https://styles.redditmedia.com/t5_2qo4s/styles/communityIcon_1podsfdai4301.png"
              ></img>
              <Link to="/">nba-rank</Link>
            </h1>
          </Row>
          <Route path="/" exact component={Home}></Route>
          <Route path="/players/:id" component={Player}></Route>
        </Container>
      </Router>
    );
  }
}
